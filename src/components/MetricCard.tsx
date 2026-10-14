import type { LucideIcon } from 'lucide-react'
import { ArrowUpRight } from 'lucide-react'

export default function MetricCard({ label, value, hint, icon: Icon, tone, footnote }: {
  label: string; value: string | number; hint: string; icon: LucideIcon; tone: string; footnote: string
}) {
  return <div className="metric-card">
    <div className="metric-top"><span className={`metric-icon ${tone}`}><Icon size={19} /></span><span className="metric-hint"><ArrowUpRight size={13} />{hint}</span></div>
    <div className="metric-value">{value}</div>
    <div className="metric-label">{label}</div>
    <div className="metric-footnote">{footnote}</div>
  </div>
}
