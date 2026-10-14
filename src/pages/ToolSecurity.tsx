import { ShieldCheck, ShieldOff, CircleHelp, Wrench, LockKeyhole, FileSearch, Terminal, ListChecks, Eye } from 'lucide-react'
import type { PolicyRule } from '../types/security'

const ruleIcons: Record<string, typeof ShieldCheck> = {
  path: FileSearch, command: Terminal, allowlist: ListChecks, redaction: Eye,
}
export default function ToolSecurity({ policies }: { policies: PolicyRule[] }) {
  return <div className="page-content">
    <div className="demo-banner"><span className="demo-banner-icon"><LockKeyhole size={16} /></span><div><strong>Policy status is illustrative</strong><p>Statuses below are demo examples, not evidence that controls are enabled in the running gateway.</p></div><span className="demo-banner-label">DEMO POLICIES</span></div>
    <div className="section-title-row"><div><h2>Security controls</h2><p>Example policy categories for runtime MCP protection.</p></div><span className="result-count">{policies.length} categories</span></div>
    <div className="policy-grid">{policies.map(policy => {
      const Icon = ruleIcons[policy.id] || ShieldCheck
      const StatusIcon = policy.status === 'Active' ? ShieldCheck : policy.status === 'Inactive' ? ShieldOff : CircleHelp
      return <article className="policy-card" key={policy.id}><div className="policy-card-top"><div className="policy-icon"><Icon size={20} /></div><span className={`policy-status ${policy.status.toLowerCase()}`}><StatusIcon size={13} />{policy.status}</span></div><h3>{policy.name}</h3><p>{policy.description}</p><div className="policy-card-footer"><span>Source</span><span className={`source-tag ${policy.source}`}>{policy.source === 'demo' ? 'Demo config' : 'Backend config'}</span></div></article>
    })}</div>
    <section className="panel tool-inventory"><div className="panel-heading"><div><h2>Known tool inventory</h2><p>Example tools shown for interface preview only.</p></div><span className="demo-small-label">NOT LIVE</span></div>
      <div className="inventory-list">{[
        ['read_project_file', 'File system', 'Example allowlisted tool'],
        ['search_docs', 'Knowledge retrieval', 'Example allowlisted tool'],
        ['execute_command', 'Command execution', 'Example tool · policy unavailable'],
        ['get_customer_record', 'Data retrieval', 'Example tool · response inspection'],
      ].map(([name, category, note], i) => <div className="inventory-row" key={name}><div className="inventory-tool-icon"><Wrench size={16} /></div><div className="inventory-name"><strong>{name}</strong><small>{category}</small></div><div className="inventory-note">{note}</div><span className={`inventory-state ${i === 2 ? 'warning' : 'demo'}`}>{i === 2 ? 'Needs verification' : 'Example only'}</span></div>)}</div>
    </section>
  </div>
}
