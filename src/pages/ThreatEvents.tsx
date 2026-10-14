import { AlertTriangle, ShieldAlert, Eye, FileWarning } from 'lucide-react'
import type { SecurityEvent } from '../types/security'
import { DecisionBadge, RiskBadge } from '../components/StatusBadge'
import { formatTime } from '../components/EventsTable'

const iconByCategory = (category: string) => category.toLowerCase().includes('path') ? FileWarning : category.toLowerCase().includes('secret') ? Eye : ShieldAlert
export default function ThreatEvents({ events, onSelect }: { events: SecurityEvent[]; onSelect: (e: SecurityEvent) => void }) {
  const threats = events.filter(e => e.risk === 'High' || e.risk === 'Critical' || e.decision === 'BLOCKED' || e.decision === 'SANITIZED')
  return <div className="page-content">
    <div className="demo-banner"><span className="demo-banner-icon"><AlertTriangle size={16} /></span><div><strong>Threat examples · demo mode</strong><p>These are illustrative patterns only. Detection coverage depends on the rules actually implemented by the backend.</p></div><span className="demo-banner-label">SIMULATED</span></div>
    <div className="section-title-row"><div><h2>Threat events</h2><p>Potentially risky requests and responses from the demo event list.</p></div><span className="result-count">{threats.length} examples</span></div>
    {threats.length ? <div className="threat-list">{threats.map(event => { const Icon = iconByCategory(event.riskCategory); return <button className="threat-card" key={event.id} onClick={() => onSelect(event)}><div className={`threat-icon ${event.decision === 'BLOCKED' ? 'red' : 'amber'}`}><Icon size={20} /></div><div className="threat-main"><div className="threat-heading"><h3>{event.riskCategory}</h3><RiskBadge risk={event.risk} /></div><p>{event.requestSummary}</p><div className="threat-meta"><span>{event.toolName}</span><span>·</span><span>{formatTime(event.timestamp)}</span></div><div className="threat-reason">{event.reason}</div></div><div className="threat-end"><DecisionBadge decision={event.decision} /><span>Inspect event ↗</span></div></button> })}</div> : <div className="panel empty-state"><p>No threat examples in the current dataset.</p></div>}
    <div className="scope-note"><ShieldAlert size={17} /><div><strong>Detection scope matters</strong><p>MCP Shield should report only threat categories that the connected gateway actually detects. This interface does not imply universal prompt-injection detection or complete threat coverage.</p></div></div>
  </div>
}
