/**
 * SilverCare Agentic AI Workflows
 * 
 * Implements LangChain-style agent pipelines using Ollama as the LLM backend.
 * All agents run locally — no data leaves the device.
 */

import { ollamaChat } from './ollama'
import type { ChatMessage, EmotionalState, AgentAction, WellbeingReport, ElderProfile } from './types'

// ─── 1. Conversation Summariser ───────────────────────────────────────────────

export async function summariseConversation(
  messages: ChatMessage[],
  elderName: string
): Promise<{ summary: string; action: AgentAction }> {
  const transcript = messages
    .filter((m) => m.role !== 'system')
    .map((m) => `${m.role === 'user' ? elderName : 'SilverCare'}: ${m.content}`)
    .join('\n')

  const prompt = `You are a clinical summariser for a geriatric care system.

Summarise this companion chat session with ${elderName} in 3-4 concise clinical sentences suitable for a caregiver's log. Focus on: health concerns raised, emotional state, medication mentions, social context, and any follow-up needed.

TRANSCRIPT:
${transcript}

Respond with ONLY the summary. No preamble.`

  const summary = await ollamaChat([
    { role: 'system', content: 'You are a clinical care summariser. Be concise and factual.' },
    { role: 'user', content: prompt },
  ])

  return {
    summary: summary.trim(),
    action: {
      type: 'summarise',
      description: `Summarised ${messages.length}-message session for ${elderName}`,
      timestamp: new Date(),
      output: summary.trim(),
    },
  }
}

// ─── 2. Emotion Detector ──────────────────────────────────────────────────────

const EMOTION_KEYWORDS = {
  crisis: ['want to die', 'give up', 'no point', 'better off dead', 'end it all', 'cannot take it'],
  distress: ['very sad', 'crying', 'scared', 'very scared', 'aiyoh so tired', 'hopeless', 'no one care'],
  mild_concern: ['tired', 'pain', 'not happy', 'worry', 'headache', 'cannot sleep', 'lonely'],
  positive: ['happy', 'good lah', 'enjoy', 'nice', 'fun', 'shiok', 'okay okay', 'not bad'],
}

export function detectEmotionFromKeywords(text: string): EmotionalState {
  const lower = text.toLowerCase()
  if (EMOTION_KEYWORDS.crisis.some((kw) => lower.includes(kw))) return 'crisis'
  if (EMOTION_KEYWORDS.distress.some((kw) => lower.includes(kw))) return 'distress'
  if (EMOTION_KEYWORDS.positive.some((kw) => lower.includes(kw))) return 'positive'
  if (EMOTION_KEYWORDS.mild_concern.some((kw) => lower.includes(kw))) return 'mild_concern'
  return 'neutral'
}

export async function detectEmotionWithLLM(
  messages: ChatMessage[],
  elderName: string
): Promise<{ state: EmotionalState; confidence: number; reasoning: string; action: AgentAction }> {
  const recentMessages = messages.slice(-6)
  const transcript = recentMessages
    .filter((m) => m.role === 'user')
    .map((m) => m.content)
    .join('\n')

  // Fast keyword check first
  const keywordResult = detectEmotionFromKeywords(transcript)
  if (keywordResult === 'crisis') {
    return {
      state: 'crisis',
      confidence: 0.95,
      reasoning: 'Crisis keyword detected in user messages',
      action: { type: 'detect_emotion', description: 'CRISIS detected via keywords', timestamp: new Date() },
    }
  }

  const prompt = `Analyse the emotional state of an elderly Singaporean named ${elderName} from their recent chat messages.

Messages from ${elderName}:
${transcript}

Respond in JSON only:
{
  "state": "positive|neutral|mild_concern|distress|crisis",
  "confidence": 0.0-1.0,
  "reasoning": "one sentence explanation"
}

States:
- positive: happy, content, engaged
- neutral: okay, neither happy nor sad
- mild_concern: some worry, tiredness, minor pain
- distress: sadness, loneliness, significant anxiety
- crisis: self-harm ideation, extreme hopelessness`

  try {
    const raw = await ollamaChat([
      { role: 'system', content: 'You are an emotion classifier. Respond only with valid JSON.' },
      { role: 'user', content: prompt },
    ])

    const parsed = JSON.parse(raw.replace(/```json|```/g, '').trim())
    return {
      state: parsed.state as EmotionalState,
      confidence: parsed.confidence,
      reasoning: parsed.reasoning,
      action: {
        type: 'detect_emotion',
        description: `Detected ${parsed.state} with ${Math.round(parsed.confidence * 100)}% confidence for ${elderName}`,
        timestamp: new Date(),
        output: JSON.stringify(parsed),
      },
    }
  } catch {
    return {
      state: keywordResult,
      confidence: 0.6,
      reasoning: 'LLM parsing failed, fell back to keyword detection',
      action: { type: 'detect_emotion', description: 'Fallback keyword detection used', timestamp: new Date() },
    }
  }
}

// ─── 3. Intervention Suggester ────────────────────────────────────────────────

export async function suggestInterventions(
  summary: string,
  emotionalState: EmotionalState,
  elderProfile: Partial<ElderProfile>
): Promise<{ actions: string[]; agentAction: AgentAction }> {
  const prompt = `You are a geriatric care coordinator in Singapore. Based on the session summary below, suggest 3-5 specific, actionable follow-up actions for the caregiver.

Elder Profile: Age ${elderProfile.age ?? 'unknown'}, ${elderProfile.livingSituation === 'alone' ? 'lives alone' : 'lives with family'}
Emotional State: ${emotionalState}
Session Summary: ${summary}

Provide actions as a JSON array of short, specific strings. Reference Singapore-specific services where relevant (Silver Generation Office, Community Centres, polyclinics, NTUC Health).

Respond with ONLY a JSON array: ["action 1", "action 2", ...]`

  try {
    const raw = await ollamaChat([
      { role: 'system', content: 'You are a care coordinator. Respond only with a JSON array.' },
      { role: 'user', content: prompt },
    ])

    const actions: string[] = JSON.parse(raw.replace(/```json|```/g, '').trim())
    return {
      actions,
      agentAction: {
        type: 'suggest_intervention',
        description: `Generated ${actions.length} follow-up actions`,
        timestamp: new Date(),
        output: JSON.stringify(actions),
      },
    }
  } catch {
    const fallback = [
      'Schedule GP follow-up within 3 days',
      'Increase AI companion check-in frequency to daily',
      'Notify family member of session findings',
    ]
    return {
      actions: fallback,
      agentAction: {
        type: 'suggest_intervention',
        description: 'Used fallback interventions (LLM unavailable)',
        timestamp: new Date(),
      },
    }
  }
}

// ─── 4. Wellbeing Report Generator ───────────────────────────────────────────

export async function generateWellbeingReport(
  elderName: string,
  sessions: Array<{ summary: string; emotionalState: EmotionalState; date: Date }>,
  riskScore: number
): Promise<{ report: string; agentAction: AgentAction }> {
  const sessionData = sessions
    .map((s) => `Date: ${s.date.toLocaleDateString('en-SG')} | Mood: ${s.emotionalState} | Summary: ${s.summary}`)
    .join('\n')

  const prompt = `Generate a weekly wellbeing report for ${elderName} for a Singapore elder care team.

Risk Score: ${riskScore}/100
Sessions This Week:
${sessionData}

Write a professional 150-200 word report covering: overall wellbeing trend, emotional state pattern, key health concerns raised, social engagement level, and caregiver recommendations. Use clear language suitable for a care team log.`

  const report = await ollamaChat([
    { role: 'system', content: 'You are a professional geriatric care report writer.' },
    { role: 'user', content: prompt },
  ])

  return {
    report: report.trim(),
    agentAction: {
      type: 'generate_report',
      description: `Generated weekly wellbeing report for ${elderName}`,
      timestamp: new Date(),
      output: report.trim(),
    },
  }
}

// ─── 5. Full Agentic Pipeline ─────────────────────────────────────────────────

export async function runFullAgentPipeline(
  messages: ChatMessage[],
  elder: Partial<ElderProfile> & { name: string },
  riskScore: number
): Promise<{
  summary: string
  emotionalState: EmotionalState
  distressDetected: boolean
  suggestedActions: string[]
  agentActions: AgentAction[]
}> {
  const agentActions: AgentAction[] = []

  // Step 1: Summarise
  const { summary, action: sumAction } = await summariseConversation(messages, elder.name)
  agentActions.push(sumAction)

  // Step 2: Detect emotion
  const { state, agentAction: emoAction } = await detectEmotionWithLLM(messages, elder.name)
  agentActions.push(emoAction)

  const distressDetected = state === 'distress' || state === 'crisis'

  // Step 3: Suggest interventions
  const { actions, agentAction: intAction } = await suggestInterventions(summary, state, elder)
  agentActions.push(intAction)

  return {
    summary,
    emotionalState: state,
    distressDetected,
    suggestedActions: actions,
    agentActions,
  }
}