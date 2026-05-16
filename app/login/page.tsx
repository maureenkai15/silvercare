'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [mode, setMode] = useState<'login'|'signup'>('login')
  const router = useRouter()

  const handle = async () => {
    setLoading(true)
    setError('')
    try {
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setError('Check your email to confirm, then sign in.')
        setMode('login')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        router.push('/dashboard')
      }
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #0d1f2d, #1a3a4a)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', borderRadius: 24, padding: 40, width: 380, boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{ width: 56, height: 56, background: 'linear-gradient(135deg, #3D8B7A, #2D6B5E)', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, margin: '0 auto 14px' }}>🤍</div>
          <div style={{ fontSize: 24, fontWeight: 700, color: '#0F1117', letterSpacing: -0.5 }}>SilverCare</div>
          <div style={{ fontSize: 13, color: '#6B7280', marginTop: 4 }}>{mode === 'login' ? 'Sign in to your account' : 'Create your account'}</div>
        </div>

        <div style={{ marginBottom: 16 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 7 }}>Email</label>
          <input value={email} onChange={e => setEmail(e.target.value)}
            style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            placeholder="you@example.com" type="email" />
        </div>

        <div style={{ marginBottom: 24 }}>
          <label style={{ display: 'block', fontSize: 11, fontWeight: 600, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 7 }}>Password</label>
          <input value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handle()}
            style={{ width: '100%', padding: '11px 14px', borderRadius: 12, border: '1.5px solid rgba(0,0,0,0.1)', fontSize: 14, outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            placeholder="••••••••" type="password" />
        </div>

        {error && (
          <div style={{ padding: '10px 14px', borderRadius: 10, background: error.includes('Check') ? '#F0FDF4' : '#FFF5F5', border: `1px solid ${error.includes('Check') ? '#86EFAC' : '#FCA5A5'}`, fontSize: 13, color: error.includes('Check') ? '#16A34A' : '#DC2626', marginBottom: 16 }}>
            {error}
          </div>
        )}

        <button onClick={handle} disabled={loading}
          style={{ width: '100%', padding: 13, borderRadius: 100, background: 'linear-gradient(135deg, #3D8B7A, #2D6B5E)', color: 'white', border: 'none', fontSize: 15, fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit', minHeight: 48 }}>
          {loading ? 'Please wait...' : mode === 'login' ? 'Sign in' : 'Create account'}
        </button>

        <div style={{ textAlign: 'center', marginTop: 20, fontSize: 13, color: '#6B7280' }}>
          {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
          <button onClick={() => { setMode(mode === 'login' ? 'signup' : 'login'); setError('') }}
            style={{ color: '#3D8B7A', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer', fontSize: 13, fontFamily: 'inherit' }}>
            {mode === 'login' ? 'Sign up' : 'Sign in'}
          </button>
        </div>
      </div>
    </div>
  )
}
