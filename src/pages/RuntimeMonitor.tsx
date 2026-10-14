import { Search, SlidersHorizontal, X } from 'lucide-react'
import { useMemo, useState } from 'react'
import type { SecurityEvent } from '../types/security'
import EventsTable from '../components/EventsTable'

export default function RuntimeMonitor({ events, onSelect }: { events: SecurityEvent[]; onSelect: (e: SecurityEvent) => void }) {
  const [search, setSearch] = useState('')
  const [decision, setDecision] = useState('All decisions')
  const [risk, setRisk] = useState('All risks')
  const [tool, setTool] = useState('All tools')
  const tools = [...new Set(events.map(e => e.toolName))]
  const filtered = useMemo(() => events.filter(e =>
    (decision === 'All decisions' || e.decision === decision) &&
    (risk === 'All risks' || e.risk === risk) &&
    (tool === 'All tools' || e.toolName === tool) &&
    `${e.requestId} ${e.toolName} ${e.requestSummary} ${e.reason} ${e.riskCategory}`.toLowerCase().includes(search.toLowerCase())
  ), [events, decision, risk, tool, search])
  const reset = () => { setSearch(''); setDecision('All decisions'); setRisk('All risks'); setTool('All tools') }
  return <div className="page-content">
    <div className="demo-banner"><span className="demo-banner-icon"><SlidersHorizontal size={16} /></span><div><strong>Runtime monitor · demo dataset</strong><p>These rows are simulated examples. Live events will be sourced from the backend when the API contract is connected.</p></div><span className="demo-banner-label">NOT LIVE</span></div>
    <div className="section-title-row"><div><h2>Tool-call activity</h2><p>Search and filter recorded demo events. Select a row to inspect its details.</p></div><span className="result-count">{filtered.length} results</span></div>
    <div className="filter-bar">
      <div className="search-box"><Search size={16} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tool, request ID, reason…" />{search && <button onClick={() => setSearch('')}><X size={14} /></button>}</div>
      <select value={tool} onChange={e => setTool(e.target.value)}><option>All tools</option>{tools.map(t => <option key={t}>{t}</option>)}</select>
      <select value={decision} onChange={e => setDecision(e.target.value)}><option>All decisions</option><option>ALLOWED</option><option>BLOCKED</option><option>SANITIZED</option><option>FLAGGED</option></select>
      <select value={risk} onChange={e => setRisk(e.target.value)}><option>All risks</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option><option>Unknown</option></select>
      <button className="secondary-button" onClick={reset}>Reset filters</button>
    </div>
    <section className="panel table-panel"><div className="panel-heading"><div><h2>Request event stream</h2><p>Newest events first · demo records only</p></div><span className="demo-small-label">SIMULATED</span></div><EventsTable events={filtered} onSelect={onSelect} emptyText="Try changing the filters or search term." /></section>
    <div className="privacy-note"><ShieldAlertIcon /><span>Request summaries are illustrative and intentionally avoid displaying raw tool arguments, secrets, or file contents.</span></div>
  </div>
}
function ShieldAlertIcon() { return <span className="privacy-icon">i</span> }
