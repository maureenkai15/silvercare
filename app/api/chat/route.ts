import { NextRequest, NextResponse } from 'next/server'

const SYSTEM_PROMPT = `You are SilverCare, a warm and caring AI companion for elderly seniors in Singapore. Speak naturally using Singlish when in English mode — use lah, lor, hor, aiyo, wah naturally. Be warm, patient, and encouraging. Keep replies short — 2 to 3 sentences maximum. Ask one simple follow-up question at a time. If they mention pain, sadness, or loneliness, respond with extra warmth. Gently suggest seeing a doctor if health concerns come up.`

export async function POST(req: NextRequest) {
  try {
    const { messages, language } = await req.json()

    const langInstruction = language?.startsWith('zh')
      ? 'Please respond in simple Mandarin Chinese, warm and caring tone.'
      : 'Please respond in English with natural Singlish.'

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY!,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 300,
        system: SYSTEM_PROMPT + '\n\n' + langInstruction,
        messages: messages.map((m: { role: string; content: string }) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    })

    const data = await response.json()
    const reply = data.content?.[0]?.text ?? 'Sorry ah, give me a moment and try again lah!'

    return NextResponse.json({ reply })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
