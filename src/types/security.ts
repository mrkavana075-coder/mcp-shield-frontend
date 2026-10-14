import type {
  GatewayStatus,
  SecurityEvent,
  SecurityMetrics,
  PolicyRule,
} from '../types/security'

const baseUrl = (
  import.meta.env.VITE_API_BASE_URL || ''
).replace(/\/$/, '')

const liveEnabled =
  import.meta.env.VITE_ENABLE_LIVE_API === 'true'

export const apiConfig = {
  baseUrl,
  liveEnabled,
}

async function apiGet<T>(path: string): Promise<T> {
  if (!liveEnabled || !baseUrl) {
    throw new Error('Live API is not enabled. Check your .env file.')
  }

  const response = await fetch(`${baseUrl}${path}`)

  if (!response.ok) {
    throw new Error(`API request failed: ${path} (${response.status})`)
  }

  return response.json() as Promise<T>
}

export async function checkConnection(): Promise<GatewayStatus> {
  try {
    await apiGet<{ status: string }>('/health')

    return {
      connected: true,
      label: 'Connected to MCP Shield API',
      apiBaseUrl: baseUrl,
      checkedAt: new Date().toISOString(),
    }
  } catch {
    return {
      connected: false,
      label: 'Unable to connect to MCP Shield API',
      apiBaseUrl: baseUrl || 'Not configured',
      checkedAt: new Date().toISOString(),
    }
  }
}

export async function fetchMetrics(): Promise<SecurityMetrics> {
  const result = await apiGet<{
    total_events: number
    allowed_count: number
    blocked_count: number
    redacted_count: number
  }>('/metrics')

  return {
    mcpTools: 2,
    totalCalls: result.total_events,
    allowed: result.allowed_count,
    blocked: result.blocked_count,
    flaggedResponses: result.redacted_count,
  }
}

export async function fetchSecurityEvents(): Promise<SecurityEvent[]> {
  const result = await apiGet<
    { events: Array<Record<string, unknown>> } |
    Array<Record<string, unknown>>
  >('/security-events')

  const records = Array.isArray(result) ? result : result.events

  return records.map((item, index) => {
    const status = String(item.status ?? 'allowed').toLowerCase()
    const decision =
      status === 'blocked'
        ? 'BLOCKED'
        : status === 'redacted' || Number(item.redaction_count ?? 0) > 0
          ? 'SANITIZED'
          : 'ALLOWED'

    const risk =
      decision === 'BLOCKED'
        ? 'High'
        : decision === 'SANITIZED'
          ? 'Medium'
          : 'Low'

    return {
      id: String(item.id ?? `live-${index}`),
      requestId: String(item.id ?? `live-${index}`),
      timestamp: String(item.timestamp ?? new Date().toISOString()),
      toolName: String(item.tool ?? 'Unknown tool'),
      requestSummary: String(
        item.sanitized_message ?? item.filename ?? item.tool ?? 'Backend event'
      ),
      riskCategory: decision === 'BLOCKED'
        ? 'Blocked request'
        : decision === 'SANITIZED'
          ? 'Response redaction'
          : 'Tool access',
      risk,
      decision,
      reason: String(
        item.blocked_reason ??
        (decision === 'SANITIZED'
          ? 'Sensitive content was redacted.'
          : decision === 'BLOCKED'
            ? 'The backend blocked this request.'
            : 'The backend allowed this request.')
      ),
      processingStatus: status,
      source: 'live',
    }
  })
}

export async function fetchPolicyRules(): Promise<PolicyRule[]> {
  const result = await apiGet<{
    tools: Array<{ name: string; description: string }>
  }>('/tools')

  return result.tools.map((tool, index) => ({
    id: `backend-${index}`,
    name: tool.name,
    description: tool.description,
    status: 'Active',
    source: 'backend',
  }))
}
