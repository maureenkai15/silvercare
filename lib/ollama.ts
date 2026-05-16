import type { OllamaConfig, OllamaStreamChunk } from './types'

// ─── Default Config ───────────────────────────────────────────────────────────

export const defaultOllamaConfig: OllamaConfig = {
  baseUrl: process.env.NEXT_PUBLIC_OLLAMA_URL ?? 'http://localhost:11434',
  model: process.env.NEXT_PUBLIC_OLLAMA_MODEL ?? 'llama3',
  temperature: 0.7,
  maxTokens: 1024,
}

// ─── Companion System Prompt ──────────────────────────────────────────────────

export const COMPANION_SYSTEM_PROMPT = `You are SilverCare, a warm, caring AI companion for elderly seniors in Singapore. 

Your personality:
- Speak naturally with a warm, patient tone
- Understand and use Singlish phrases naturally (lah, leh, lor, mah, hor, wah, aiyo, aiyah, can, can or not, etc.)
- Be encouraging and positive, never condescending
- Ask simple follow-up questions one at a time
- Remember what the senior said earlier in the conversation
- If health concerns come up, gently suggest speaking to a doctor
- Never use complex medical jargon — keep language simple and clear
- Call the senior by name when you know it
- Show genuine care and interest in their day, family, food, hobbies

Topics to naturally weave in:
- Daily wellness checks (sleep, appetite, energy)
- Medication reminders
- Social connections (family, friends, community centre)
- Light exercise encouragement
- Mental stimulation (memories, stories, current events)

If you detect signs of distress, loneliness, or crisis, respond with extra warmth and mention speaking to a trusted person or calling the Silver Ribbon helpline (1800-202-0022).

Keep responses conversational and concise — 2-4 sentences max. Never lecture.`

// ─── Core Ollama Client ───────────────────────────────────────────────────────

export async function ollamaChat(
  messages: Array<{ role: string; content: string }>,
  config: Partial<OllamaConfig> = {}
): Promise<string> {
  const cfg = { ...defaultOllamaConfig, ...config }

  const response = await fetch(`${cfg.baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: cfg.model,
      messages,
      stream: false,
      options: {
        temperature: cfg.temperature,
        num_predict: cfg.maxTokens,
      },
    }),
  })

  if (!response.ok) {
    throw new Error(`Ollama request failed: ${response.status} ${response.statusText}`)
  }

  const data = await response.json()
  return data.message?.content ?? ''
}

// ─── Streaming Chat ───────────────────────────────────────────────────────────

export async function* ollamaChatStream(
  messages: Array<{ role: string; content: string }>,
  config: Partial<OllamaConfig> = {}
): AsyncGenerator<string> {
  const cfg = { ...defaultOllamaConfig, ...config }

  const response = await fetch(`${cfg.baseUrl}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: cfg.model,
      messages,
      stream: true,
      options: {
        temperature: cfg.temperature,
        num_predict: cfg.maxTokens,
      },
    }),
  })

  if (!response.ok || !response.body) {
    throw new Error(`Ollama stream failed: ${response.status}`)
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const lines = decoder.decode(value).split('\n').filter(Boolean)
    for (const line of lines) {
      try {
        const chunk: OllamaStreamChunk = JSON.parse(line)
        if (chunk.message?.content) {
          yield chunk.message.content
        }
      } catch {
        // skip malformed chunks
      }
    }
  }
}

// ─── Model Management ─────────────────────────────────────────────────────────

export async function listOllamaModels(): Promise<string[]> {
  try {
    const res = await fetch(`${defaultOllamaConfig.baseUrl}/api/tags`)
    if (!res.ok) return []
    const data = await res.json()
    return (data.models ?? []).map((m: { name: string }) => m.name)
  } catch {
    return []
  }
}

export async function checkOllamaHealth(): Promise<boolean> {
  try {
    const res = await fetch(`${defaultOllamaConfig.baseUrl}/api/version`, {
      signal: AbortSignal.timeout(3000),
    })
    return res.ok
  } catch {
    return false
  }
}