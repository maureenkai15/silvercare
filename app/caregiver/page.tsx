'use client'
import { Sidebar } from '@/components/layout/Sidebar'

const elders = [
  { name: 'Mdm Tan Ah Kow', age: 78, emoji: '👵', risk: 88, riskColor: '#DC2626', badge: 'Critical', badgeClass: 'badge-red', status: 'Missed check-in 48h', last: '2 days ago' },
  { name: 'Mr Lim Bak Cheng', age: 72, emoji: '👴', risk: 71, riskColor: '#D97706', badge: 'High', badgeClass: 'badge-amber', status: 'Emotional distress flagged', last: '6h ago' },
  { name: 'Mdm Wong Geok Hua', age: 69, emoji: '👵', risk: 45, riskColor: '#D97706', badge: 'Medium', badgeClass: 'badge-amber', status: 'Active — chatting with AI', last: '2h ago' },
  { name: 'Mr Rajan Pillai', age: 81, emoji: '👴', risk: 28, riskColor: '#16A34A', badge: 'Low', badgeClass: 'badge-green', status: 'All good, took medicine', last: '1h ago' },
  { name: 'Mdm Fatimah Bte Ali', age: 75, emoji: '👵', risk: 62, riskColor: '#D97706', badge: 'Medium', badgeClass: 'badge-amber', status: 'Mobility exercises done', last: '4h ago' },
  { name: 'Mr Chen Ah Teck', age: 84, emoji: '👴', risk: 91, riskColor: '#DC2626', badge: 'Critical', badgeClass: 'badge-red', status: 'Dementia care — nursing home', last: '3h ago' },
]

export default function Caregiver() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content fade-up">
        <div className="page-header">
          <div className="page-title serif">Caregiver <strong>Dashboard</strong></div>
          <div className="page-subtitle">Monitor all seniors under your care in one place.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
          <div className="metric-card-blue"><div className="metric-label">Total Seniors</div><div className="metric-value metric-value-blue">12</div><div className="metric-sub">Under your care</div></div>
          <div className="metric-card-red"><div className="metric-label">Need Attention</div><div className="metric-value metric-value-red">3</div><div className="metric-sub">Critical or high risk</div></div>
          <div className="metric-card-green"><div className="metric-label">Checked In Today</div><div className="metric-value metric-value-green">8</div><div className="metric-sub">4 still pending</div></div>
        </div>
        <div className="card">
          <div className="card-title">All seniors</div>
          {elders.map((e, i) => (
            <div key={i} className="elder-card">
              <div className="elder-avatar">{e.emoji}</div>
              <div style={{ flex: 1 }}>
                <div className="elder-name">{e.name} <span style={{ fontWeight: 400, color: 'var(--text-3)', fontSize: 12 }}>· Age {e.age}</span></div>
                <div className="elder-status">{e.status}</div>
                <div className="risk-bar-track"><div className="risk-bar-fill" style={{ width: `${e.risk}%`, background: e.riskColor }} /></div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <span className={`alert-badge ${e.badgeClass}`}>{e.badge}</span>
                <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 6 }}>{e.last}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
