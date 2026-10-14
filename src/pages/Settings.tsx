import { useState } from 'react'
import { Check, Copy, ExternalLink, RefreshCw, Save, Server, ShieldCheck, Timer } from 'lucide-react'
import { apiConfig } from '../services/api'

export default function Settings({ connected, onRefresh }: { connected: boolean; onRefresh: () => void }) {
  const [interval, setIntervalValue] = useState('Manual')
  const [copied, setCopied] = useState(false)
  const copyUrl = async () => { await navigator.clipboard?.writeText(apiConfig.baseUrl || 'Not configured'); setCopied(true); setTimeout(() => setCopied(false), 1500) }
  return <div className="page-content">
    <div className="demo-banner"><span className="demo-banner-icon"><Server size={16} /></span><div><strong>Connection configuration</strong><p>Live API calls are intentionally disabled until the backend endpoints and response schemas are confirmed.</p></div><span className="demo-banner-label">NOT CONNECTED</span></div>
    <div className="section-title-row"><div><h2>Environment settings</h2><p>Review the current API configuration and demo behaviour.</p></div></div>
    <div className="settings-grid">
      <section className="panel settings-panel"><div className="settings-panel-heading"><div className="settings-heading-icon"><Server size={18} /></div><div><h2>Backend connection</h2><p>API base URL and connection state</p></div></div>
        <label className="field-label">API base URL <span>FROM ENVIRONMENT</span></label><div className="readonly-field"><code>{apiConfig.baseUrl || 'Not configured'}</code><button className="icon-button" onClick={copyUrl} title="Copy API URL">{copied ? <Check size={15} /> : <Copy size={15} />}</button></div>
        <div className="connection-detail"><span className={`status-indicator ${connected ? 'good' : 'warn'}`} /><div><strong>{connected ? 'Connected' : 'Not connected'}</strong><p>{connected ? 'The configured health check succeeded.' : 'No confirmed health endpoint is configured. Demo data remains isolated from live data.'}</p></div></div>
        <div className="settings-actions"><button className="secondary-button" onClick={onRefresh}><RefreshCw size={14} /> Recheck status</button></div>
        <div className="env-help"><strong>How to configure</strong><ol><li>Copy <code>.env.example</code> to <code>.env</code>.</li><li>Set <code>VITE_API_BASE_URL</code> to the URL supplied by your backend teammate.</li><li>Only enable live API mode after routes and schemas are confirmed.</li><li>Restart the Vite dev server after changing environment variables.</li></ol></div>
      </section>
      <section className="panel settings-panel"><div className="settings-panel-heading"><div className="settings-heading-icon cyan"><ShieldCheck size={18} /></div><div><h2>Security policy status</h2><p>Policy updates must be confirmed by backend</p></div></div>
        <div className="policy-notice"><ShieldCheck size={18} /><div><strong>Read-only in this build</strong><p>This interface does not change gateway policy. Policy controls will be enabled only when the backend exposes authenticated endpoints and confirms changes.</p></div></div>
        <div className="settings-divider" />
        <div className="settings-panel-heading small"><div className="settings-heading-icon"><Timer size={17} /></div><div><h2>Refresh behaviour</h2><p>Applies to dashboard refresh UI only until polling is integrated.</p></div></div>
        <label className="field-label">Refresh interval</label><select className="settings-select" value={interval} onChange={e => setIntervalValue(e.target.value)}><option>Manual</option><option>15 seconds</option><option>30 seconds</option><option>60 seconds</option></select>
        <div className="settings-inline-note">Selected: <strong>{interval}</strong>. Automatic polling is not active yet.</div>
      </section>
    </div>
  </div>
}
