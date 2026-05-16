'use client'
import { Sidebar } from '@/components/layout/Sidebar'
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const trend = [
  { day: 'Mon', score: 62 }, { day: 'Tue', score: 58 }, { day: 'Wed', score: 65 },
  { day: 'Thu', score: 70 }, { day: 'Fri', score: 68 }, { day: 'Sat', score: 72 }, { day: 'Sun', score: 74 },
]
const risk = [
  { label: 'Low', count: 5, color: '#16A34A' },
  { label: 'Medium', count: 4, color: '#D97706' },
  { label: 'High', count: 2, color: '#EA580C' },
  { label: 'Critical', count: 1, color: '#DC2626' },
]

export default function Dashboard() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content fade-up">
        <div className="page-header">
          <div className="page-title serif">Good morning, <strong>Chan Gek Lian</strong> 👋</div>
          <div className="page-subtitle">Here's your daily overview — 3 seniors need your attention today.</div>
        </div>

        <div className="metric-grid">
          <div className="metric-card-blue">
            <div className="metric-label">Seniors Monitored</div>
            <div className="metric-value metric-value-blue">12</div>
            <div className="metric-sub">↑ 2 this month</div>
          </div>
          <div className="metric-card-red">
            <div className="metric-label">High Risk Alerts</div>
            <div className="metric-value metric-value-red">3</div>
            <div className="metric-sub">Requires follow-up</div>
          </div>
          <div className="metric-card-green">
            <div className="metric-label">Check-ins Today</div>
            <div className="metric-value metric-value-green">8/12</div>
            <div className="metric-sub">4 pending</div>
          </div>
        </div>

        <div className="charts-grid">
          <div className="card card-sm">
            <div className="card-title">Risk distribution</div>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={risk} margin={{ top: 0, right: 0, left: -24, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} cursor={{ fill: 'rgba(0,0,0,0.02)' }} />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {risk.map((d, i) => <Cell key={i} fill={d.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="card card-sm">
            <div className="card-title">Wellbeing trend — 7 days</div>
            <ResponsiveContainer width="100%" height={160}>
              <AreaChart data={trend} margin={{ top: 5, right: 0, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3D8B7A" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#3D8B7A" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.04)" />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <YAxis domain={[50, 85]} tick={{ fontSize: 10, fill: '#9CA3AF' }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: 'white', border: '1px solid rgba(0,0,0,0.08)', borderRadius: 10, fontSize: 12, boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} />
                <Area type="monotone" dataKey="score" stroke="#3D8B7A" strokeWidth={2.5} fill="url(#g)" dot={{ r: 4, fill: '#3D8B7A', strokeWidth: 0 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Active alerts</div>
          <div className="alert-item">
            <div className="alert-dot" />
            <div style={{ flex: 1 }}>
              <div className="alert-name">Mdm Tan Ah Kow</div>
              <div className="alert-msg">Missed check-in for 48+ hours · Lives alone · Last seen Tue 9:12 AM</div>
            </div>
            <span className="alert-badge badge-red">Critical</span>
          </div>
          <div className="alert-item-amber">
            <div className="alert-dot-amber" />
            <div style={{ flex: 1 }}>
              <div className="alert-name">Mr Lim Bak Cheng</div>
              <div className="alert-msg">AI companion flagged sadness in 3 consecutive sessions this week</div>
            </div>
            <span className="alert-badge badge-amber">High</span>
          </div>
        </div>
      </main>
    </div>
  )
}
