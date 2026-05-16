'use client'
import { Sidebar } from '@/components/layout/Sidebar'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const emotionData = [
  { month: 'Dec', positive: 55, neutral: 30, distress: 15 },
  { month: 'Jan', positive: 58, neutral: 28, distress: 14 },
  { month: 'Feb', positive: 62, neutral: 25, distress: 13 },
  { month: 'Mar', positive: 65, neutral: 22, distress: 13 },
  { month: 'Apr', positive: 70, neutral: 20, distress: 10 },
  { month: 'May', positive: 74, neutral: 18, distress: 8 },
]

export default function Reports() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content fade-up">
        <div className="page-header">
          <div className="page-title serif">Wellbeing <strong>Reports</strong></div>
          <div className="page-subtitle">AI-generated insights and weekly summaries.</div>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12, marginBottom: 24 }}>
          <div className="metric-card-green"><div className="metric-label">Avg Wellbeing</div><div className="metric-value metric-value-green">74.2</div><div className="metric-sub">↑ 6 pts from last week</div></div>
          <div className="metric-card-blue"><div className="metric-label">Sessions This Week</div><div className="metric-value metric-value-blue">47</div><div className="metric-sub">AI companion chats</div></div>
          <div className="metric-card-red"><div className="metric-label">Distress Alerts</div><div className="metric-value metric-value-red">3</div><div className="metric-sub">Flagged this week</div></div>
        </div>
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="card-title">Emotion trends — 6 months</div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={emotionData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, fontSize: 12 }} />
              <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
              <Line type="monotone" dataKey="positive" stroke="#16A34A" strokeWidth={2.5} dot={{ r: 4, fill: '#16A34A', strokeWidth: 0 }} name="Positive" />
              <Line type="monotone" dataKey="neutral" stroke="#D97706" strokeWidth={2.5} dot={{ r: 4, fill: '#D97706', strokeWidth: 0 }} name="Neutral" strokeDasharray="5 3" />
              <Line type="monotone" dataKey="distress" stroke="#DC2626" strokeWidth={2.5} dot={{ r: 4, fill: '#DC2626', strokeWidth: 0 }} name="Distress" strokeDasharray="2 2" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div className="card card-sm">
            <div className="card-title">🤖 Agent actions this week</div>
            {[
              { label: 'Conversations summarised', value: '47', cls: 'badge-blue' },
              { label: 'Distress alerts raised', value: '3', cls: 'badge-red' },
              { label: 'GP appointments suggested', value: '5', cls: 'badge-amber' },
              { label: 'Reports auto-generated', value: '12', cls: 'badge-green' },
              { label: 'Family notifications sent', value: '8', cls: 'badge-blue' },
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: i < 4 ? '1px solid var(--border)' : 'none', fontSize: 13 }}>
                <span style={{ color: 'var(--text-2)' }}>{item.label}</span>
                <span className={`alert-badge ${item.cls}`}>{item.value}</span>
              </div>
            ))}
          </div>
          <div className="card card-sm">
            <div className="card-title">📋 Latest AI report</div>
            <div style={{ fontSize: 12, color: 'var(--text-2)', lineHeight: 1.9, borderLeft: '3px solid var(--sage)', paddingLeft: 12 }}>
              <strong style={{ color: 'var(--text-1)' }}>Week of 12–18 May 2025</strong><br />
              Overall wellbeing improved. Distress incidents down 30%. Mr Lim needs counsellor referral. Mdm Tan unreachable — welfare check dispatched.
            </div>
            <button className="btn btn-primary" style={{ marginTop: 14, fontSize: 12, padding: '8px 16px', width: '100%' }}>Generate full report with AI</button>
          </div>
        </div>
      </main>
    </div>
  )
}
