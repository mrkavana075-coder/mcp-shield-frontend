import { Download, RefreshCw, Search, ShieldAlert } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { SecurityEvent } from '../types/security'
import EventsTable from '../components/EventsTable'

export default function AuditLogs({ events, onSelect, onRefresh }: { events: SecurityEvent[]; onSelect: (e: SecurityEvent) => void; onRefresh: () => void }) {
  const [query, setQuery] = useState('')
  const [decision, setDecision] = useState('All decisions')
  const [notice, setNotice] = useState('')
  const filtered = useMemo(() => events.filter(e => (decision === 'All decisions' || e.decision === decision) && `${e.requestId} ${e.toolName} ${e.reason}`.toLowerCase().includes(query.toLowerCase())), [events, decision, query])
  const exportCsv = () => {
    if (!filtered.length) { setNotice('There are no events to export.'); return }
    const headers = ['timestamp', 'request_id', 'tool', 'decision', 'risk_category', 'reason', 'processing_status', 'source']
    const csvCell = (value: string) => `"${String(value).replace(/"/g, '""')}"`
    const rows = filtered.map(e => [e.timestamp, e.requestId, e.toolName, e.decision, e.riskCategory, e.reason, e.processingStatus, e.source].map(csvCell).join(','))
    const blob = new Blob([[headers.join(','), ...rows].join('\r\n')], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a'); a.href = url; a.download = 'mcp-shield-demo-audit.csv'; a.click(); URL.revokeObjectURL(url)
    setNotice('Exported the currently visible demo events to CSV.')
  }
  return <div className="page-content">
    <div className="demo-banner"><span className="demo-banner-icon"><ShieldAlert size={16} /></span><div><strong>Audit log is showing demo records</strong><p>These records are simulated. Live audit entries will only appear after the confirmed backend audit endpoint is connected.</p></div><span className="demo-banner-label">DEMO ONLY</span></div>
    <div className="section-title-row"><div><h2>Audit trail</h2><p>Search decisions, inspect reasons, and export the visible demo records.</p></div><div className="heading-actions"><button className="secondary-button" onClick={onRefresh}><RefreshCw size={14} /> Refresh view</button><button className="primary-button" onClick={exportCsv}><Download size={14} /> Export CSV</button></div></div>
    <div className="filter-bar audit-filter"><div className="search-box"><Search size={16} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search request ID, tool, reason…" /></div><select value={decision} onChange={e => setDecision(e.target.value)}><option>All decisions</option><option>ALLOWED</option><option>BLOCKED</option><option>SANITIZED</option><option>FLAGGED</option></select><span className="result-count">{filtered.length} records</span></div>
    {notice && <div className="inline-notice" role="status">{notice}<button onClick={() => setNotice('')}>Dismiss</button></div>}
    <section className="panel table-panel"><div className="panel-heading"><div><h2>Recorded decisions</h2><p>Newest first · demo records only</p></div><span className="demo-small-label">SIMULATED SOURCE</span></div><EventsTable events={filtered} onSelect={onSelect} emptyText="No audit records match the current filters." /></section>
    <div className="privacy-note"><span className="privacy-icon">i</span><span>CSV export includes only the currently displayed demo event fields. Do not export raw tool arguments or secrets.</span></div>
  </div>
}
