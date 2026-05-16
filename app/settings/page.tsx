'use client'
import { Sidebar } from '@/components/layout/Sidebar'

export default function Settings() {
  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content fade-up">
        <div className="page-header">
          <div className="page-title serif">App <strong>Settings</strong></div>
          <div className="page-subtitle">Configure your AI stack, voice, and care team.</div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, maxWidth: 580 }}>
          <div className="card">
            <div className="card-title">🤖 AI & LLM stack</div>
            <div className="form-group"><label className="form-label">Local LLM Provider</label>
              <select className="form-control"><option>Ollama (Local — recommended)</option><option>OpenAI API</option></select></div>
            <div className="form-group"><label className="form-label">Model</label>
              <select className="form-control"><option>llama3:8b</option><option>mistral:7b</option><option>gemma:7b</option></select></div>
            <div className="form-group"><label className="form-label">Ollama Endpoint</label>
              <input className="form-control" defaultValue="http://localhost:11434" /></div>
            <button className="btn btn-primary">Save AI settings</button>
          </div>
          <div className="card">
            <div className="card-title">🎙 Voice settings</div>
            <div className="form-group"><label className="form-label">Speech-to-text</label>
              <select className="form-control"><option>Browser Web Speech API (default)</option><option>Whisper.cpp (local)</option></select></div>
            <div className="form-group"><label className="form-label">Default language</label>
              <select className="form-control"><option>English (Singapore)</option><option>普通话 Mandarin</option><option>廣東話 Cantonese</option></select></div>
            <button className="btn btn-primary">Save voice settings</button>
          </div>
          <div className="card">
            <div className="card-title">⚙️ Setup commands</div>
            <div style={{ background: '#0d1f2d', borderRadius: 12, padding: '14px 16px', fontFamily: 'monospace', fontSize: 12, color: '#52C9B5', lineHeight: 1.9 }}>
              curl -fsSL https://ollama.ai/install.sh | sh<br />
              ollama pull llama3<br />
              ollama serve<br />
              npm run dev
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
