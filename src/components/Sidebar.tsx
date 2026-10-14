import { Activity, BookOpenCheck, ChevronLeft, FileClock, LayoutDashboard, Settings, Shield, ShieldAlert, Wrench } from 'lucide-react'

export type PageId = 'Overview' | 'Runtime Monitor' | 'Tool Security' | 'Threat Events' | 'Audit Logs' | 'Settings'
const navItems: { label: PageId; icon: typeof LayoutDashboard; group: string }[] = [
  { label: 'Overview', icon: LayoutDashboard, group: 'Workspace' },
  { label: 'Runtime Monitor', icon: Activity, group: 'Workspace' },
  { label: 'Tool Security', icon: Wrench, group: 'Workspace' },
  { label: 'Threat Events', icon: ShieldAlert, group: 'Workspace' },
  { label: 'Audit Logs', icon: FileClock, group: 'Governance' },
  { label: 'Settings', icon: Settings, group: 'Governance' },
]

export default function Sidebar({ active, onNavigate, collapsed, onToggle }: {
  active: PageId; onNavigate: (page: PageId) => void; collapsed: boolean; onToggle: () => void
}) {
  return <aside className={`sidebar ${collapsed ? 'sidebar-collapsed' : ''}`}>
    <div className="brand">
      <div className="brand-mark"><Shield size={21} strokeWidth={2.3} /></div>
      {!collapsed && <div className="brand-copy"><strong>MCP <span>Shield</span></strong><small>RUNTIME DEFENCE</small></div>}
      <button className="icon-button collapse-button" onClick={onToggle} title="Collapse sidebar"><ChevronLeft size={17} /></button>
    </div>
    <div className="gateway-card">
      <div className="gateway-card-icon"><Shield size={16} /></div>
      {!collapsed && <div><div className="gateway-title">Security gateway</div><div className="gateway-sub"><span className="pulse-dot" /> Demo environment</div></div>}
    </div>
    {['Workspace', 'Governance'].map(group => <div className="nav-group" key={group}>
      {!collapsed && <div className="nav-label">{group}</div>}
      {navItems.filter(item => item.group === group).map(({ label, icon: Icon }) =>
        <button key={label} onClick={() => onNavigate(label)} className={`nav-item ${active === label ? 'active' : ''}`} title={collapsed ? label : undefined}>
          <Icon size={18} /><span>{!collapsed && label}</span>{!collapsed && active === label && <span className="nav-active-marker" />}
        </button>
      )}
    </div>)}
    <div className="sidebar-bottom">
      {!collapsed && <div className="help-card"><BookOpenCheck size={17} /><div><strong>Runtime protection</strong><p>Requests and responses are checked at the gateway.</p></div></div>}
      <div className="sidebar-version">{!collapsed && <><span className="version-dot" />MCP Shield <span className="version-number">v0.1 demo</span></>}</div>
    </div>
  </aside>
}
