import { ShieldAlert, ShieldCheck, Eye, CircleHelp } from 'lucide-react'
import type { Decision, Risk } from '../types/security'

export function DecisionBadge({ decision }: { decision: Decision }) {
  const map = {
    ALLOWED: { cls: 'badge-green', Icon: ShieldCheck },
    BLOCKED: { cls: 'badge-red', Icon: ShieldAlert },
    SANITIZED: { cls: 'badge-cyan', Icon: Eye },
    FLAGGED: { cls: 'badge-amber', Icon: CircleHelp },
  } as const

  const config = map[decision] ?? {
    cls: 'badge-muted',
    Icon: CircleHelp,
  }

  const { cls, Icon } = config
  const label = decision ?? 'UNKNOWN'

  return (
    <span className={`badge ${cls}`}>
      <Icon size={13} />
      {label}
    </span>
  )
}

export function RiskBadge({ risk }: { risk: Risk }) {
  const safeRisk = typeof risk === 'string' ? risk : 'Unknown'

  const cls =
    safeRisk === 'Critical' || safeRisk === 'High'
      ? 'badge-red'
      : safeRisk === 'Medium'
        ? 'badge-amber'
        : safeRisk === 'Low'
          ? 'badge-green'
          : 'badge-muted'

  return <span className={`badge ${cls}`}>{safeRisk.toUpperCase()}</span>
}

export function ConnectionDot({ connected }: { connected: boolean }) {
  return (
    <span className={`connection-dot ${connected ? 'connected' : 'disconnected'}`}>
      <span />
      {connected ? 'Connected' : 'Demo mode'}
    </span>
  )
}