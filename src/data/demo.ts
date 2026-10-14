import type { PolicyRule, SecurityEvent, SecurityMetrics } from '../types/security'

export const demoMetrics: SecurityMetrics = {
  mcpTools: 4,
  totalCalls: 18,
  allowed: 13,
  blocked: 3,
  flaggedResponses: 2,
}

const now = Date.now()
const ago = (minutes: number) => new Date(now - minutes * 60_000).toISOString()

export const initialDemoEvents: SecurityEvent[] = [
  {
    id: 'evt-1048', requestId: 'req-7f3a91', timestamp: ago(2), toolName: 'read_project_file',
    requestSummary: 'Read request for /workspace/roadmap.md',
    riskCategory: 'File access', risk: 'Low', decision: 'ALLOWED',
    reason: 'Demo event: request matched the configured allowlist.', processingStatus: 'Completed', source: 'demo',
  },
  {
    id: 'evt-1047', requestId: 'req-7f3a90', timestamp: ago(7), toolName: 'read_file',
    requestSummary: 'Path contains traversal pattern: ../../private/records.csv',
    riskCategory: 'Path traversal', risk: 'Critical', decision: 'BLOCKED',
    reason: 'Demo event: traversal-like path blocked before tool forwarding.', processingStatus: 'Blocked at gateway', source: 'demo',
  },
  {
    id: 'evt-1046', requestId: 'req-7f3a8e', timestamp: ago(12), toolName: 'search_docs',
    requestSummary: 'Search query for internal deployment documentation',
    riskCategory: 'Data access', risk: 'Medium', decision: 'ALLOWED',
    reason: 'Demo event: request passed the example policy checks.', processingStatus: 'Completed', source: 'demo',
  },
  {
    id: 'evt-1045', requestId: 'req-7f3a8b', timestamp: ago(18), toolName: 'get_customer_record',
    requestSummary: 'Tool response contained a redacted credential-like value',
    riskCategory: 'Potential secret exposure', risk: 'High', decision: 'SANITIZED',
    reason: 'Demo event: response inspection redacted a credential-like pattern before return.', processingStatus: 'Response sanitized', source: 'demo',
  },
]

export const demoPolicies: PolicyRule[] = [
  { id: 'path', name: 'Path traversal protection', description: 'Detect traversal-like file paths before forwarding a tool call.', status: 'Active', source: 'demo' },
  { id: 'command', name: 'Safe command execution', description: 'Review command arguments against configured execution policy.', status: 'Unavailable', source: 'demo' },
  { id: 'allowlist', name: 'Tool allowlisting', description: 'Restrict requests to tools explicitly permitted by gateway policy.', status: 'Active', source: 'demo' },
  { id: 'redaction', name: 'Response inspection & redaction', description: 'Inspect tool responses for configured secret patterns before returning them.', status: 'Active', source: 'demo' },
]
