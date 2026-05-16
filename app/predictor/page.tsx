'use client'
import { useState } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'
import { calculateRiskScore, riskColors } from '@/lib/riskEngine'
import type { ElderProfile, RiskAssessment, MobilityLevel, LivingSituation, SocialFrequency } from '@/lib/types'

export default function Predictor() {
  const [result, setResult] = useState<RiskAssessment | null>(null)
  const [form, setForm] = useState({ name: 'Mdm Tan Ah Kow', age: 78, mobility: 'limited' as MobilityLevel, conditions: ['Diabetes', 'Hypertension'], livingSituation: 'alone' as LivingSituation, socialFrequency: 'monthly' as SocialFrequency, clinicDistanceKm: 4.2 })

  const predict = () => {
    const profile: ElderProfile = { id: 'preview', caregiverId: 'cg-1', createdAt: new Date(), updatedAt: new Date(), ...form }
    setResult(calculateRiskScore(profile))
  }

  const priorityColor = { immediate: 'var(--red)', short_term: 'var(--amber)', long_term: 'var(--green)' }
  const priorityLabel = { immediate: '🔴 Immediate', short_term: '🟡 Short-term', long_term: '🟢 Long-term' }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content fade-up">
        <div className="page-header">
          <div className="page-title serif">Risk <strong>Predictor</strong></div>
          <div className="page-subtitle">AI-powered multi-factor assessment across 6 health dimensions.</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '340px 1fr', gap: 16 }}>
          <div className="card">
            <div className="card-title">Elder profile</div>
            <div className="form-group">
              <label className="form-label">Full name</label>
              <input className="form-control" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Age</label>
              <input className="form-control" type="number" value={form.age} onChange={e => setForm(f => ({ ...f, age: +e.target.value }))} />
            </div>
            <div className="form-group">
              <label className="form-label">Mobility</label>
              <select className="form-control" value={form.mobility} onChange={e => setForm(f => ({ ...f, mobility: e.target.value as MobilityLevel }))}>
                <option value="full">Full mobility</option>
                <option value="limited">Limited — walking aid</option>
                <option value="wheelchair">Wheelchair</option>
                <option value="bedridden">Bedridden</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Living situation</label>
              <select className="form-control" value={form.livingSituation} onChange={e => setForm(f => ({ ...f, livingSituation: e.target.value as LivingSituation }))}>
                <option value="family">With family</option>
                <option value="alone">Lives alone</option>
                <option value="nursing_home">Nursing home</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Social activity</label>
              <select className="form-control" value={form.socialFrequency} onChange={e => setForm(f => ({ ...f, socialFrequency: e.target.value as SocialFrequency }))}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="rarely">Rarely / Never</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Clinic distance (km)</label>
              <input className="form-control" type="number" step="0.1" value={form.clinicDistanceKm} onChange={e => setForm(f => ({ ...f, clinicDistanceKm: +e.target.value }))} />
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={predict}>Generate risk report</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {result ? (
              <>
                <div className="card card-sm">
                  <div className="card-title">Assessment — {form.name}</div>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12, marginBottom: 16 }}>
                    {[
                      { label: 'Overall risk', score: result.overallScore, color: riskColors[result.riskLevel] },
                      { label: 'Loneliness', score: result.lonelinessScore, color: result.lonelinessScore > 60 ? 'var(--red)' : 'var(--amber)' },
                      { label: 'Fall risk', score: result.fallRiskScore, color: result.fallRiskScore > 60 ? 'var(--red)' : 'var(--amber)' },
                      { label: 'Medical risk', score: result.medicalRiskScore, color: result.medicalRiskScore > 50 ? 'var(--amber)' : 'var(--green)' },
                    ].map(({ label, score, color }) => (
                      <div key={label} style={{ background: 'var(--stone)', borderRadius: 12, padding: '16px', textAlign: 'center' }}>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: 8 }}>{label}</div>
                        <div style={{ fontSize: 36, fontWeight: 300, color, letterSpacing: -1, lineHeight: 1 }}>{score}</div>
                        <div style={{ fontSize: 11, color: 'var(--text-3)', marginTop: 4 }}>/ 100</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="card card-sm" style={{ flex: 1 }}>
                  <div className="card-title">Suggested interventions</div>
                  <div style={{ overflow: 'auto', maxHeight: 280 }}>
                    {result.interventions.map(iv => (
                      <div key={iv.id} className="intervention-item">
                        <div style={{ fontSize: 11, fontWeight: 600, color: (priorityColor as Record<string, string>)[iv.priority], marginBottom: 4 }}>
                          {(priorityLabel as Record<string, string>)[iv.priority]}
                        </div>
                        <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.6 }}>{iv.description}</div>
                        {iv.referralOrg && <div style={{ fontSize: 11.5, color: 'var(--sage)', marginTop: 4, fontWeight: 500 }}>📞 {iv.referralOrg}</div>}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, minHeight: 320, color: 'var(--text-3)' }}>
                <div style={{ fontSize: 48 }}>◎</div>
                <div style={{ fontSize: 14 }}>Fill in the profile and generate a report</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
