
import { useCallback, useEffect, useState } from 'react'
import { AlertCircle, Shield } from 'lucide-react'

import Sidebar, { type PageId } from './components/Sidebar'
import Topbar from './components/Topbar'
import EventDrawer from './components/EventDrawer'

import Overview from './pages/Overview'
import RuntimeMonitor from './pages/RuntimeMonitor'
import ToolSecurity from './pages/ToolSecurity'
import ThreatEvents from './pages/ThreatEvents'
import AuditLogs from './pages/AuditLogs'
import Settings from './pages/Settings'

import { initialDemoEvents } from './data/demo'

import {
  checkConnection,
  fetchMetrics,
  fetchSecurityEvents,
  fetchPolicyRules,
} from './services/api'

import type {
  GatewayStatus,
  SecurityEvent,
  SecurityMetrics,
  PolicyRule,
} from './types/security'

const emptyMetrics: SecurityMetrics = {
  mcpTools: 0,
  totalCalls: 0,
  allowed: 0,
  blocked: 0,
  flaggedResponses: 0,
}

export default function App() {
  const [page, setPage] = useState<PageId>('Overview')

  const [events, setEvents] =
    useState<SecurityEvent[]>(initialDemoEvents)

  const [metrics, setMetrics] =
    useState<SecurityMetrics | null>(null)

  const [policies, setPolicies] =
    useState<PolicyRule[]>([])

  const [liveData, setLiveData] = useState(false)
  const [apiError, setApiError] = useState('')

  const [selectedEvent, setSelectedEvent] =
    useState<SecurityEvent | null>(null)

  const [collapsed, setCollapsed] = useState(false)
  const [mobileNav, setMobileNav] = useState(false)
  const [loading, setLoading] = useState(false)

  const [gateway, setGateway] = useState<GatewayStatus>({
    connected: false,
    label: 'Checking connection',
    apiBaseUrl: 'Not configured',
  })

  const [lastUpdated, setLastUpdated] = useState(
    new Date().toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    })
  )

  const refresh = useCallback(async () => {
    setLoading(true)
    setApiError('')

    try {
      const connection = await checkConnection()
      setGateway(connection)

      if (!connection.connected) {
        setLiveData(false)
        setApiError(
          'The backend health endpoint is unreachable. Check the backend server and API URL.'
        )
        return
      }

      const results = await Promise.allSettled([
        fetchMetrics(),
        fetchSecurityEvents(),
        fetchPolicyRules(),
      ])

      const errors: string[] = []

      const [metricsResult, eventsResult, policiesResult] = results

      if (metricsResult.status === 'fulfilled') {
        setMetrics(metricsResult.value)
      } else {
        errors.push(
          `Metrics: ${metricsResult.reason instanceof Error
            ? metricsResult.reason.message
            : 'Request failed'}`
        )
      }

      if (eventsResult.status === 'fulfilled') {
        setEvents(eventsResult.value)
      } else {
        errors.push(
          `Security events: ${eventsResult.reason instanceof Error
            ? eventsResult.reason.message
            : 'Request failed'}`
        )
      }

      if (policiesResult.status === 'fulfilled') {
        setPolicies(policiesResult.value)
      } else {
        errors.push(
          `Tools: ${policiesResult.reason instanceof Error
            ? policiesResult.reason.message
            : 'Request failed'}`
        )
      }

      const allLoaded = errors.length === 0
      setLiveData(allLoaded)
      setApiError(errors.join(' | '))
    } catch (error) {
      setLiveData(false)
      setApiError(
        error instanceof Error
          ? error.message
          : 'Unexpected error while loading backend data.'
      )
    } finally {
      setLastUpdated(
        new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        })
      )
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    void refresh()
  }, [refresh])

  const addDemoEvent = (kind: 'safe' | 'threat') => {
    const time = new Date().toISOString()
    const isSafe = kind === 'safe'

    const event: SecurityEvent = {
      id: `demo-${Date.now()}`,
      requestId: `req-demo-${Math.random().toString(16).slice(2, 8)}`,
      timestamp: time,
      toolName: isSafe ? 'read_project_file' : 'read_file',
      requestSummary: isSafe
        ? 'Simulated request for /workspace/readme.md'
        : 'Simulated traversal-like path: ../../restricted/data.txt',
      riskCategory: isSafe ? 'File access' : 'Path traversal',
      risk: isSafe ? 'Low' : 'Critical',
      decision: isSafe ? 'ALLOWED' : 'BLOCKED',
      reason: isSafe
        ? 'Demo only: illustrative request marked allowed by the frontend.'
        : 'Demo only: illustrative suspicious request marked blocked by the frontend.',
      processingStatus: isSafe ? 'Demo completed' : 'Demo blocked',
      source: 'demo',
    }

    setEvents((previous) => [event, ...previous])
    setSelectedEvent(event)
  }

  const currentPage = () => {
    switch (page) {
      case 'Overview':
        return (
          <Overview
            metrics={metrics ?? emptyMetrics}
            events={events}
            lastEvent={events[0] ?? null}
            onSelect={setSelectedEvent}
          />
        )

      case 'Runtime Monitor':
        return (
          <RuntimeMonitor
            events={events}
            onSelect={setSelectedEvent}
          />
        )

      case 'Tool Security':
        return <ToolSecurity policies={policies} />

      case 'Threat Events':
        return (
          <ThreatEvents
            events={events}
            onSelect={setSelectedEvent}
          />
        )

      case 'Audit Logs':
        return (
          <AuditLogs
            events={events}
            onSelect={setSelectedEvent}
            onRefresh={() => void refresh()}
          />
        )

      case 'Settings':
        return (
          <Settings
            connected={gateway.connected}
            onRefresh={() => void refresh()}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="app-shell">
      {mobileNav && (
        <button
          className="mobile-backdrop"
          aria-label="Close navigation"
          onClick={() => setMobileNav(false)}
        />
      )}

      <div className={`sidebar-mobile-wrap ${mobileNav ? 'open' : ''}`}>
        <Sidebar
          active={page}
          onNavigate={(nextPage) => {
            setPage(nextPage)
            setMobileNav(false)
          }}
          collapsed={collapsed}
          onToggle={() => setCollapsed((previous) => !previous)}
        />
      </div>

      <main className="main-shell">
        <Topbar
          page={page}
          connected={gateway.connected}
          lastUpdated={lastUpdated}
          onRefresh={() => void refresh()}
          onMenu={() => setMobileNav((previous) => !previous)}
        />

        <div className="demo-global-note">
          <AlertCircle size={14} />
          <span>
            {loading
              ? 'LOADING — requesting data from the backend.'
              : liveData
                ? 'LIVE DATA — metrics, events, and tools loaded from the backend.'
                : gateway.connected
                  ? 'PARTIAL DATA — the backend is reachable, but one or more data requests failed.'
                  : 'DEMO MODE — the backend is not connected.'}
          </span>
          <span className="global-note-spacer" />
          <span className="last-updated">
            Refreshed {lastUpdated}
          </span>
        </div>

        {apiError && (
          <div className="demo-global-note">
            <AlertCircle size={14} />
            <span>API Error: {apiError}</span>
          </div>
        )}

        {currentPage()}

        <footer className="app-footer">
          <span>
            <Shield size={14} /> MCP Shield{' '}
            <span className="footer-muted">Runtime Defence</span>
          </span>
          <span>Frontend dashboard · backend status shown above</span>
        </footer>
      </main>

      <EventDrawer
        event={selectedEvent}
        onClose={() => setSelectedEvent(null)}
      />

      <div className="quick-demo-controls">
        <span>Demo controls</span>

        <button onClick={() => addDemoEvent('safe')}>
          <span className="mini-dot green" />
          Simulate safe
        </button>

        <button onClick={() => addDemoEvent('threat')}>
          <span className="mini-dot red" />
          Simulate threat
        </button>

        <button
          onClick={() => {
            setEvents(initialDemoEvents)
            setSelectedEvent(null)
            setLiveData(false)
          }}
        >
          Reset demo
        </button>
      </div>
    </div>
  )
}
