import { X, Copy, Clock3, Fingerprint, ShieldCheck, FileText } from 'lucide-react'
import type { SecurityEvent } from '../types/security'
import { DecisionBadge, RiskBadge } from './StatusBadge'
import { formatTime } from './EventsTable'

export default function EventDrawer({ event, onClose }: { event: SecurityEvent | null; onClose: () => void }) {
  if (!event) return null
  return <div className="drawer-backdrop" onClick={onClose}>
    <aside className="event-drawer" onClick={e => e.stopPropagation()}>
      <div className="drawer-header"><div><div className="eyebrow">EVENT INSPECTOR</div><h2>Request details</h2></div><button className="icon-button" onClick={onClose}><X size={18} /></button></div>
      <div className="drawer-decision"><DecisionBadge decision={event.decision} /><RiskBadge risk={event.risk} /></div>
      <div className="drawer-tool"><div className="tool-large"><ShieldCheck size={22} /></div><div><h3>{event.toolName}</h3><p>{event.riskCategory}</p></div></div>
      <div className="detail-section"><div className="detail-label"><Fingerprint size={14} /> REQUEST IDENTIFIER</div><div className="detail-value mono">{event.requestId}</div></div>
      <div className="detail-section"><div className="detail-label"><Clock3 size={14} /> TIMESTAMP</div><div className="detail-value">{formatTime(event.timestamp)}</div></div>
      <div className="detail-section"><div className="detail-label"><FileText size={14} /> SANITIZED REQUEST SUMMARY</div><div className="request-summary">{event.requestSummary}</div></div>
      <div className="detail-section"><div className="detail-label">DECISION EXPLANATION</div><div className="explanation-box">{event.reason}</div></div>
      <div className="detail-section"><div className="detail-label">PROCESSING STATUS</div><div className="detail-value">{event.processingStatus}</div></div>
      <div className="drawer-footer"><span className={`source-tag ${event.source}`}>{event.source === 'demo' ? 'Demo event · simulated' : 'Backend event · live'}</span><button className="secondary-button" onClick={() => navigator.clipboard?.writeText(event.requestId)}><Copy size={14} /> Copy request ID</button></div>
    </aside>
  </div>
}
