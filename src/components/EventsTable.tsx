import { ArrowUpRight, ChevronRight, FileSearch } from 'lucide-react'
import type { SecurityEvent } from '../types/security'
import { DecisionBadge, RiskBadge } from './StatusBadge'

export function formatTime(value: string) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString([], { month: 'short', day: '2-digit', hour: '2-digit', minute: '2-digit' })
}

export default function EventsTable({ events, onSelect, compact = false, emptyText = 'No events match these filters.' }: {
  events: SecurityEvent[]; onSelect: (event: SecurityEvent) => void; compact?: boolean; emptyText?: string
}) {
  return <div className="table-wrap"><table className="events-table">
    <thead><tr><th>TIME</th><th>TOOL</th><th>RISK CATEGORY</th><th>DECISION</th>{!compact && <th>REASON</th>}<th /></tr></thead>
    <tbody>{events.map(event => <tr key={event.id} onClick={() => onSelect(event)} className="clickable-row">
      <td className="time-cell">{formatTime(event.timestamp)}</td>
      <td><div className="tool-cell"><span className="tool-mini"><FileSearch size={14} /></span><div><strong>{event.toolName}</strong><small>{event.requestId}</small></div></div></td>
      <td><div className="risk-cell"><RiskBadge risk={event.risk} /><span>{event.riskCategory}</span></div></td>
      <td><DecisionBadge decision={event.decision} /></td>
      {!compact && <td className="reason-cell">{event.reason}</td>}
      <td><button className="table-open" aria-label="Open event details"><ChevronRight size={16} /></button></td>
    </tr>)}</tbody>
  </table>
  {events.length === 0 && <div className="empty-state"><div className="empty-icon"><FileSearch size={21} /></div><strong>No security events</strong><p>{emptyText}</p></div>}
  </div>
}
