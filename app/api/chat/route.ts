import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are SilverCare, a warm and caring AI companion for elderly seniors in Singapore. Speak naturally using Singlish when in English mode — use lah, lor, hor, aiyo, wah naturally. Be warm, patient, and encouraging. Keep replies short — 2 to 3 sentences maximum. Ask one simple follow-up question at a time. If they mention pain, sadness, or loneliness, respond with extra warmth. Gently suggest seeing a doctor if health concerns come up.`

export async function POST(req: NextRequest) {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) {
    return NextResponse.json({ reply: 'API key not configured lah!', error: 'NO_KEY' })
  }

  try {
    const { messages, language } = await req.json()
    const langInstruction = language?.startsWith('zh')
      ? 'Please respond in simple Mandarin Chinese, warm and caring tone.'
      : 'Please respond in English with natural Singlish.'

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        max_tokens: 300,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT + '\n\n' + langInstruction },
          ...messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          })),
        ],
      }),
    })

    const data = await response.json()
    if (!response.ok) {
      return NextResponse.json({ reply: `Error: ${data.error?.message}`, error: data.error })
    }

    const reply = data.choices?.[0]?.message?.content ?? 'Sorry ah, try again lah!'
    return NextResponse.json({ reply })
  } catch (err: any) {
    return NextResponse.json({ reply: `Error: ${err.message}` }, { status: 500 })
  }
}
