// ─── Elder & Risk Types ─────────────────────────────────────────────────────

export type MobilityLevel = 'full' | 'limited' | 'wheelchair' | 'bedridden'
export type LivingSituation = 'family' | 'alone' | 'nursing_home'
export type SocialFrequency = 'daily' | 'weekly' | 'monthly' | 'rarely'
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical'

export interface ElderProfile {
  id: string
  name: string
  age: number
  avatar?: string
  mobility: MobilityLevel
  conditions: string[]
  livingSituation: LivingSituation
  socialFrequency: SocialFrequency
  clinicDistanceKm: number
  caregiverId: string
  createdAt: Date
  updatedAt: Date
}

export interface RiskAssessment {
  elderId: string
  overallScore: number       // 0–100
  lonelinessScore: number    // 0–100
  fallRiskScore: number      // 0–100
  medicalRiskScore: number   // 0–100
  riskLevel: RiskLevel
  interventions: Intervention[]
  generatedAt: Date
}

export interface Intervention {
  id: string
  priority: 'immediate' | 'short_term' | 'long_term'
  category: 'medical' | 'social' | 'safety' | 'mental_health'
  description: string
  referralOrg?: string       // e.g. "Silver Generation Office"
}

// ─── Companion Chat Types ────────────────────────────────────────────────────

export type MessageRole = 'user' | 'assistant' | 'system'
export type EmotionalState = 'positive' | 'neutral' | 'mild_concern' | 'distress' | 'crisis'

export interface ChatMessage {
  id: string
  role: MessageRole
  content: string
  timestamp: Date
  emotionalState?: EmotionalState
  topics?: string[]
}

export interface CompanionSession {
  id: string
  elderId: string
  messages: ChatMessage[]
  summary?: string
  emotionalState: EmotionalState
  distressDetected: boolean
  suggestedActions: string[]
  startedAt: Date
  endedAt?: Date
}

// ─── Caregiver Types ─────────────────────────────────────────────────────────

export interface Caregiver {
  id: string
  name: string
  email: string
  role: 'lead' | 'volunteer' | 'family' | 'professional'
  assignedElderIds: string[]
}

export interface Alert {
  id: string
  elderId: string
  elderName: string
  severity: 'low' | 'medium' | 'high' | 'critical'
  type: 'missed_checkin' | 'emotional_distress' | 'fall_risk' | 'medication' | 'social_isolation'
  message: string
  resolved: boolean
  createdAt: Date
}

export interface CheckIn {
  id: string
  elderId: string
  method: 'app' | 'ai_companion' | 'phone' | 'in_person'
  status: 'completed' | 'missed' | 'partial'
  notes?: string
  timestamp: Date
}

export interface ActivityEvent {
  id: string
  elderId: string
  elderName: string
  type: 'check_in' | 'medication' | 'exercise' | 'companion_chat' | 'alert' | 'visit'
  description: string
  timestamp: Date
  metadata?: Record<string, unknown>
}

// ─── Report Types ─────────────────────────────────────────────────────────────

export interface WellbeingReport {
  id: string
  elderId?: string            // null = all seniors report
  caregiverId: string
  period: { from: Date; to: Date }
  overallScore: number
  emotionBreakdown: {
    positive: number
    neutral: number
    distress: number
  }
  keyFindings: string[]
  recommendations: string[]
  agentActions: AgentAction[]
  generatedAt: Date
}

export interface AgentAction {
  type: 'summarise' | 'detect_emotion' | 'suggest_intervention' | 'generate_report' | 'send_alert'
  description: string
  timestamp: Date
  output?: string
}

// ─── Ollama / LLM Types ───────────────────────────────────────────────────────

export interface OllamaConfig {
  baseUrl: string
  model: string
  temperature: number
  maxTokens: number
}

export interface OllamaStreamChunk {
  model: string
  created_at: string
  message: { role: string; content: string }
  done: boolean
}
