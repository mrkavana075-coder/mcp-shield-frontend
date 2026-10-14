import { Bell, Menu, RefreshCw, Search } from 'lucide-react'
import { ConnectionDot } from './StatusBadge'
import type { PageId } from './Sidebar'

const descriptions: Record<PageId, string> = {
  'Overview': 'A real-time view of MCP gateway activity and enforcement.',
  'Runtime Monitor': 'Inspect tool-call decisions as they move through the gateway.',
  'Tool Security': 'Review known tools and configured security controls.',
  'Threat Events': 'Investigate suspicious request and response patterns.',
  'Audit Logs': 'Search and export recorded security decisions.',
  'Settings': 'Configure the API connection and dashboard behaviour.',
}
export default function Topbar({ page, onRefresh, onMenu, connected, lastUpdated }: {
  page: PageId; onRefresh: () => void; onMenu: () => void; connected: boolean; lastUpdated: string
}) {
  return <header className="topbar">
    <button className="icon-button mobile-menu" onClick={onMenu} aria-label="Open navigation"><Menu size={19} /></button>
    <div className="page-heading"><div className="eyebrow">MCP SHIELD <span>/</span> SECURITY CONSOLE</div><h1>{page}</h1><p>{descriptions[page]}</p></div>
    <div className="topbar-actions">
      <div className="environment-pill"><span className="environment-dot" />DEMO ENVIRONMENT</div>
      <ConnectionDot connected={connected} />
      <button className="icon-button top-action" onClick={onRefresh} title="Refresh dashboard"><RefreshCw size={17} /></button>
      <button className="icon-button top-action" title="Notifications are not connected"><Bell size={17} /></button>
    </div>
  </header>
}
