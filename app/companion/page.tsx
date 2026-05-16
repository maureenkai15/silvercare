'use client'
import { useState, useRef, useEffect } from 'react'
import { Sidebar } from '@/components/layout/Sidebar'

const languages = [
  { code: 'en-SG', label: 'English', flag: '🇸🇬' },
  { code: 'zh-CN', label: '普通话', flag: '🇨🇳' },
  { code: 'zh-TW', label: '廣東話', flag: '🏮' },
]

const enPhrases = [
  { label: 'Sleep check', text: 'How is your sleep last night?' },
  { label: 'Medicine?', text: 'Did you take your medicine already?' },
  { label: 'Social check', text: 'Got anyone visit you today?' },
  { label: 'Mood lift', text: 'Tell me about your favourite food lah!' },
]

const zhPhrases = [
  { label: '睡眠检查', text: '昨晚睡得好吗？' },
  { label: '吃药了吗', text: '今天吃药了吗？' },
  { label: '社交检查', text: '今天有人来看您吗？' },
  { label: '心情问候', text: '今天心情怎么样？' },
]

export default function Companion() {
  const [msgs, setMsgs] = useState([
    { role: 'assistant', content: 'Good morning! How are you feeling today, ah? Sleep well or not? 😊' }
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [listening, setListening] = useState(false)
  const [tts, setTts] = useState(false)
  const [langIdx, setLangIdx] = useState(0)
  const [voiceError, setVoiceError] = useState('')
  const [interimText, setInterimText] = useState('')
  const endRef = useRef<HTMLDivElement>(null)
  const recognitionRef = useRef<any>(null)

  const lang = languages[langIdx]
  const isChinese = lang.code.startsWith('zh')
  const phrases = isChinese ? zhPhrases : enPhrases

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }) }, [msgs])

  const callAI = async (messages: {role: string, content: string}[]) => {
    const res = await fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages, language: lang.code })
    })
    const data = await res.json()
    if (data.error) throw new Error(data.error)
    return data.reply
  }

  const send = async () => {
    if (!input.trim() || loading) return
    const userContent = input.trim()
    setInput('')
    const newMsgs = [...msgs, { role: 'user', content: userContent }]
    setMsgs(newMsgs)
    setLoading(true)
    try {
      const reply = await callAI(newMsgs)
      setMsgs(m => [...m, { role: 'assistant', content: reply }])
      if (tts && window.speechSynthesis) {
        const u = new SpeechSynthesisUtterance(reply)
        u.lang = lang.code
        u.rate = 0.85
        window.speechSynthesis.speak(u)
      }
    } catch {
      setMsgs(m => [...m, { role: 'assistant', content: 'Aiyoh sorry ah, give me a moment and try again lah!' }])
    } finally {
      setLoading(false)
    }
  }

  const startVoice = () => {
    setVoiceError('')
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) { setVoiceError('Please use Chrome for voice input.'); return }
    const recognition = new SR()
    recognition.lang = lang.code
    recognition.continuous = false
    recognition.interimResults = true
    recognition.onstart = () => setListening(true)
    recognition.onresult = (e: any) => {
      let interim = '', final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const t = e.results[i][0].transcript
        if (e.results[i].isFinal) final += t
        else interim += t
      }
      setInterimText(interim)
      if (final) { setInput(final); setInterimText('') }
    }
    recognition.onerror = (e: any) => {
      setListening(false)
      setInterimText('')
      if (e.error === 'not-allowed') setVoiceError('Mic blocked — allow microphone in browser settings.')
      else setVoiceError('Could not hear you. Try again.')
    }
    recognition.onend = () => { setListening(false); setInterimText('') }
    recognitionRef.current = recognition
    recognition.start()
  }

  const stopVoice = () => { recognitionRef.current?.stop(); setListening(false); setInterimText('') }

  return (
    <div className="app-shell">
      <Sidebar />
      <main className="main-content fade-up">
        <div className="page-header">
          <div className="page-title serif">AI <strong>Companion</strong></div>
          <div className="page-subtitle">Powered by Claude AI — multilingual, warm, and caring.</div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
          <div className="card">
            <div className="chat-shell">
              <div className="chat-header">
                <div className="chat-avatar">AI</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>SilverCare Assistant</div>
                  <div className="chat-status">● Powered by Claude AI</div>
                </div>
                <div style={{ display: 'flex', gap: 4 }}>
                  {languages.map((l, i) => (
                    <button key={l.code} onClick={() => setLangIdx(i)}
                      style={{ padding: '5px 10px', borderRadius: 20, border: `1.5px solid ${langIdx === i ? 'var(--sage)' : 'var(--border)'}`, background: langIdx === i ? 'var(--sage-pale)' : 'white', fontSize: 11, fontWeight: 600, color: langIdx === i ? 'var(--sage)' : 'var(--text-2)', cursor: 'pointer', minHeight: 30 }}>
                      {l.flag} {l.label}
                    </button>
                  ))}
                </div>
                <button onClick={() => setTts(t => !t)} style={{ width: 34, height: 34, borderRadius: '50%', border: '1px solid var(--border)', background: tts ? 'var(--sage-pale)' : 'white', fontSize: 16, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 34, marginLeft: 4 }}>
                  {tts ? '🔊' : '🔇'}
                </button>
              </div>

              <div className="chat-messages">
                {msgs.map((m, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                    <div className="bubble-label">{m.role === 'user' ? 'You' : 'SilverCare'}</div>
                    <div className={m.role === 'user' ? 'bubble-user' : 'bubble-ai'}>{m.content}</div>
                  </div>
                ))}
                {loading && (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                    <div className="bubble-label">SilverCare</div>
                    <div className="bubble-ai" style={{ color: '#9CA3AF', fontStyle: 'italic' }}>Thinking...</div>
                  </div>
                )}
                <div ref={endRef} />
              </div>

              {listening && (
                <div style={{ margin: '8px 0', padding: '10px 14px', background: '#FFF5F5', border: '1px solid #FCA5A5', borderRadius: 12, display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: '#DC2626', fontWeight: 600 }}>
                  <div className="voice-wave"><span /><span /><span /><span /><span /></div>
                  Listening in {lang.label}...
                  {interimText && <span style={{ color: 'var(--text-2)', fontWeight: 400, marginLeft: 4 }}>{interimText}</span>}
                </div>
              )}

              {voiceError && (
                <div style={{ margin: '6px 0', padding: '10px 14px', background: '#FFFBEB', border: '1px solid #FCD34D', borderRadius: 12, fontSize: 12, color: '#92400E' }}>
                  ⚠️ {voiceError}
                </div>
              )}

              <div className="chat-input-row">
                <button onClick={listening ? stopVoice : startVoice} className={`voice-btn ${listening ? 'listening' : ''}`}>
                  {listening ? '⏹' : '🎙'}
                </button>
                <input className="chat-input" value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && send()}
                  placeholder={listening ? `Listening in ${lang.label}...` : isChinese ? '用中文输入或说话...' : 'Type or speak...'} />
                <button onClick={send} className="btn btn-primary" disabled={loading} style={{ padding: '10px 18px' }}>
                  {loading ? '...' : 'Send'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className="card card-sm" style={{ background: 'linear-gradient(135deg, #EBF7F4, #E0F2FE)', border: '1px solid #B8DDD8' }}>
              <div className="card-title">🤖 AI Status</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.8 }}>
                <div>Model: <strong>Claude Sonnet</strong></div>
                <div>Running: <strong style={{ color: '#16A34A' }}>● Cloud AI</strong></div>
                <div>Languages: <strong>EN · 中文 · 粤语</strong></div>
              </div>
            </div>

            <div className="card card-sm">
              <div className="card-title">🎙 Voice tips</div>
              <div style={{ fontSize: 12.5, color: 'var(--text-2)', lineHeight: 1.9 }}>
                <div>• Use Chrome for best accuracy</div>
                <div>• Pick language before speaking</div>
                <div>• Short sentences work best</div>
                <div style={{ marginTop: 8, padding: '7px 10px', background: 'var(--sage-pale)', borderRadius: 8, color: 'var(--sage)', fontSize: 12, fontWeight: 600 }}>
                  Now: {lang.flag} {lang.label}
                </div>
              </div>
            </div>

            <div className="card card-sm">
              <div className="card-title">Quick phrases</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {phrases.map(p => (
                  <button key={p.label} className="phrase-btn" onClick={() => setInput(p.text)}>{p.label}</button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
