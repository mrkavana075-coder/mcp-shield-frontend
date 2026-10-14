
import {
  Activity,
  ArrowDown,
  ArrowRight,
  Clock3,
  ShieldAlert,
  ShieldCheck,
  Eye,
  Bot,
  Server,
} from 'lucide-react'

import type { SecurityEvent, SecurityMetrics } from '../types/security'
import MetricCard from '../components/MetricCard'
import EventsTable from '../components/EventsTable'

interface OverviewProps {
  metrics: SecurityMetrics
  events: SecurityEvent[]
  lastEvent: SecurityEvent | null
  onSelect: (event: SecurityEvent) => void
}

export default function Overview({
  metrics,
  events,
  lastEvent,
  onSelect,
}: OverviewProps) {
  // Live data is indicated by receiving real backend events.
  // Metrics can still be displayed even when there are no events.
  const liveEvents = events.filter((event) => event.source === 'live')
  const hasLiveEvents = liveEvents.length > 0

  const hasMetrics =
    metrics.totalCalls > 0 ||
    metrics.allowed > 0 ||
    metrics.blocked > 0 ||
    metrics.flaggedResponses > 0

  const hasBackendData = hasLiveEvents || hasMetrics

  return (
    <div className="page-content">
      <div className="demo-banner">
        <span className="demo-banner-icon">
          <Activity size={16} />
        </span>

        <div>
          <strong>
            {hasLiveEvents
              ? 'Backend connection active'
              : hasBackendData
                ? 'Backend metrics loaded'
                : 'Waiting for backend data'}
          </strong>
          <p>
            {hasLiveEvents
              ? `${liveEvents.length} live security events received from the backend.`
              : hasBackendData
                ? 'Backend metrics are available. No live security events have been loaded.'
                : 'Waiting for metrics and security events from the backend.'}
          </p>
        </div>

        <span className="demo-banner-label">
          {hasLiveEvents ? 'LIVE EVENTS' : hasBackendData ? 'LIVE METRICS' : 'WAITING'}
        </span>
      </div>

      <div className="section-title-row">
        <div>
          <h2>Security overview</h2>
          <p>Runtime enforcement across your MCP tool-call flow.</p>
        </div>

        <span className="updated-label">
          <Clock3 size={13} />
          {hasBackendData ? 'Backend data loaded' : 'Waiting for backend data'}
        </span>
      </div>

      <div className="metrics-grid">
        <MetricCard
          label="Total MCP tool calls"
          value={metrics.totalCalls}
          hint={hasMetrics ? 'Backend' : 'Waiting'}
          icon={Activity}
          tone="cyan"
          footnote="Requests recorded by the backend"
        />

        <MetricCard
          label="Allowed requests"
          value={metrics.allowed}
          hint={hasMetrics ? 'Backend' : 'Waiting'}
          icon={ShieldCheck}
          tone="green"
          footnote="Requests permitted by the backend"
        />

        <MetricCard
          label="Blocked requests"
          value={metrics.blocked}
          hint={hasMetrics ? 'Backend' : 'Waiting'}
          icon={ShieldAlert}
          tone="red"
          footnote="Requests blocked by the backend"
        />

        <MetricCard
          label="Flagged responses"
          value={metrics.flaggedResponses}
          hint={hasMetrics ? 'Backend' : 'Waiting'}
          icon={Eye}
          tone="amber"
          footnote="Responses recorded as redacted"
        />
      </div>

      <div className="section-title-row flow-title">
        <div>
          <h2>MCP request flow</h2>
          <p>
            Security checks occur as requests and responses pass through MCP Shield.
          </p>
        </div>

        <span className="flow-status">
          <span className="pulse-dot" />
          Conceptual flow
        </span>
      </div>

      <div className="flow-card">
        <div className="flow-track">
          <div className="flow-node">
            <div className="flow-node-icon client">
              <Bot size={21} />
            </div>
            <div>
              <strong>AI Client</strong>
              <span>Agent / MCP host</span>
            </div>
          </div>

          <div className="flow-link">
            <span className="flow-link-label">Tool request</span>
            <div className="flow-line">
              <ArrowRight size={17} />
            </div>
            <small>Request</small>
          </div>

          <div className="flow-node gateway-node">
            <div className="flow-node-icon gateway">
              <ShieldCheck size={21} />
            </div>
            <div>
              <strong>MCP Shield</strong>
              <span>Runtime gateway</span>
              <em>Inspect · Decide · Record</em>
            </div>
          </div>

          <div className="flow-link">
            <span className="flow-link-label">Allowed only</span>
            <div className="flow-line">
              <ArrowRight size={17} />
            </div>
            <small>Forward</small>
          </div>

          <div className="flow-node">
            <div className="flow-node-icon server">
              <Server size={21} />
            </div>
            <div>
              <strong>MCP Server</strong>
              <span>Protected tools</span>
            </div>
          </div>
        </div>

        <div className="flow-response">
          <ArrowDown size={15} />
          <span>
            Tool responses may pass through MCP Shield for inspection and
            configured redaction before reaching the AI client.
          </span>
        </div>

        <div className="flow-foot">
          <div>
            <span className="legend-dot green" />
            Allowed
          </div>
          <div>
            <span className="legend-dot red" />
            Blocked before forwarding
          </div>
          <div>
            <span className="legend-dot cyan" />
            Response inspected
          </div>
          <span className="illustration-note">
            Conceptual flow · not a live network trace
          </span>
        </div>
      </div>

      <div className="section-title-row">
        <div>
          <h2>Request activity</h2>
          <p>Activity chart awaiting timestamped backend trend data.</p>
        </div>
        <span className="updated-label">Trend data unavailable</span>
      </div>

      <div className="chart-card">
        <div style={{ padding: '32px 16px', textAlign: 'center' }}>
          <Activity size={28} />
          <p>
            The backend currently provides aggregate metrics, not hourly
            activity data. The chart will be available when trend data is
            provided.
          </p>
        </div>
      </div>

      <div className="section-title-row">
        <div>
          <h2>Recent security events</h2>
          <p>Review security events received from MCP Shield.</p>
        </div>

        <span className="updated-label">
          {events.length} events
        </span>
      </div>

      {lastEvent && (
        <div className="latest-event-note">
          <strong>Latest event:</strong> {lastEvent.toolName} — {lastEvent.decision}
        </div>
      )}

      {events.length > 0 ? (
        <EventsTable events={events} onSelect={onSelect} />
      ) : (
        <p>No security events have been loaded yet.</p>
      )}
    </div>
  )
}