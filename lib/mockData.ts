import type {
    ElderProfile, Alert, ActivityEvent, CheckIn,
    CompanionSession, ChatMessage, Caregiver
  } from './types'
  
  // ─── Caregivers ───────────────────────────────────────────────────────────────
  
  export const MOCK_CAREGIVERS: Caregiver[] = [
    {
      id: 'cg-1',
      name: 'Chan Gek Lian',
      email: 'geklian@silvercare.sg',
      role: 'lead',
      assignedElderIds: ['e-1', 'e-2', 'e-3', 'e-4', 'e-5', 'e-6'],
    },
    {
      id: 'cg-2',
      name: 'Priya Nair',
      email: 'priya@silvercare.sg',
      role: 'professional',
      assignedElderIds: ['e-7', 'e-8', 'e-9', 'e-10', 'e-11', 'e-12'],
    },
  ]
  
  // ─── Elder Profiles ───────────────────────────────────────────────────────────
  
  export const MOCK_ELDERS: ElderProfile[] = [
    {
      id: 'e-1',
      name: 'Mdm Tan Ah Kow',
      age: 78,
      mobility: 'limited',
      conditions: ['Diabetes', 'Hypertension', 'Osteoporosis'],
      livingSituation: 'alone',
      socialFrequency: 'rarely',
      clinicDistanceKm: 4.2,
      caregiverId: 'cg-1',
      createdAt: new Date('2024-09-01'),
      updatedAt: new Date('2025-05-10'),
    },
    {
      id: 'e-2',
      name: 'Mr Lim Bak Cheng',
      age: 72,
      mobility: 'limited',
      conditions: ['Hypertension', 'Depression'],
      livingSituation: 'alone',
      socialFrequency: 'monthly',
      clinicDistanceKm: 2.8,
      caregiverId: 'cg-1',
      createdAt: new Date('2024-10-15'),
      updatedAt: new Date('2025-05-14'),
    },
    {
      id: 'e-3',
      name: 'Mdm Wong Geok Hua',
      age: 69,
      mobility: 'full',
      conditions: ['Diabetes'],
      livingSituation: 'family',
      socialFrequency: 'weekly',
      clinicDistanceKm: 1.2,
      caregiverId: 'cg-1',
      createdAt: new Date('2024-11-01'),
      updatedAt: new Date('2025-05-16'),
    },
    {
      id: 'e-4',
      name: 'Mr Rajan Pillai',
      age: 81,
      mobility: 'limited',
      conditions: ['Hypertension'],
      livingSituation: 'family',
      socialFrequency: 'weekly',
      clinicDistanceKm: 0.8,
      caregiverId: 'cg-1',
      createdAt: new Date('2024-08-20'),
      updatedAt: new Date('2025-05-16'),
    },
    {
      id: 'e-5',
      name: 'Mdm Fatimah Bte Ali',
      age: 75,
      mobility: 'limited',
      conditions: ['Diabetes', 'Knee Osteoarthritis'],
      livingSituation: 'family',
      socialFrequency: 'weekly',
      clinicDistanceKm: 3.1,
      caregiverId: 'cg-1',
      createdAt: new Date('2024-12-01'),
      updatedAt: new Date('2025-05-15'),
    },
    {
      id: 'e-6',
      name: 'Mr Chen Ah Teck',
      age: 84,
      mobility: 'wheelchair',
      conditions: ['Dementia', 'Hypertension', 'Diabetes'],
      livingSituation: 'nursing_home',
      socialFrequency: 'monthly',
      clinicDistanceKm: 0.5,
      caregiverId: 'cg-1',
      createdAt: new Date('2024-07-10'),
      updatedAt: new Date('2025-05-12'),
    },
  ]
  
  // ─── Alerts ───────────────────────────────────────────────────────────────────
  
  export const MOCK_ALERTS: Alert[] = [
    {
      id: 'al-1',
      elderId: 'e-1',
      elderName: 'Mdm Tan Ah Kow',
      severity: 'critical',
      type: 'missed_checkin',
      message: 'Senior has not completed check-in for 48+ hours. Last known contact: Tuesday 9:12 AM.',
      resolved: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 50),
    },
    {
      id: 'al-2',
      elderId: 'e-2',
      elderName: 'Mr Lim Bak Cheng',
      severity: 'high',
      type: 'emotional_distress',
      message: 'AI companion detected sadness and loneliness signals in 3 consecutive sessions over past 5 days.',
      resolved: false,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
    },
    {
      id: 'al-3',
      elderId: 'e-6',
      elderName: 'Mr Chen Ah Teck',
      severity: 'medium',
      type: 'medication',
      message: 'Medication round missed at 8:00 AM — nursing home staff notified.',
      resolved: true,
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 14),
    },
  ]
  
  // ─── Activity Events ──────────────────────────────────────────────────────────
  
  export const MOCK_ACTIVITY: ActivityEvent[] = [
    {
      id: 'av-1',
      elderId: 'e-5',
      elderName: 'Mdm Fatimah Bte Ali',
      type: 'check_in',
      description: 'Completed morning check-in via AI Companion. Mood: positive.',
      timestamp: new Date(Date.now() - 1000 * 60 * 32),
    },
    {
      id: 'av-2',
      elderId: 'e-4',
      elderName: 'Mr Rajan Pillai',
      type: 'medication',
      description: 'Confirmed Metformin 500mg + Amlodipine 5mg taken after breakfast.',
      timestamp: new Date(Date.now() - 1000 * 60 * 75),
    },
    {
      id: 'av-3',
      elderId: 'e-3',
      elderName: 'Mdm Wong Geok Hua',
      type: 'exercise',
      description: 'Completed 20-minute chair yoga session via SilverCare guided exercise.',
      timestamp: new Date(Date.now() - 1000 * 60 * 95),
    },
    {
      id: 'av-4',
      elderId: 'e-2',
      elderName: 'Mr Lim Bak Cheng',
      type: 'companion_chat',
      description: 'AI flagged mild sadness. Summary saved. Caregiver follow-up recommended.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 6),
    },
    {
      id: 'av-5',
      elderId: 'e-1',
      elderName: 'Mdm Tan Ah Kow',
      type: 'alert',
      description: 'CRITICAL: 48h missed check-in. Welfare check dispatched.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 48),
    },
    {
      id: 'av-6',
      elderId: 'e-4',
      elderName: 'Mr Rajan Pillai',
      type: 'visit',
      description: 'Family visit — daughter Kavitha stayed 2h. Good spirits reported.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 26),
    },
  ]
  
  // ─── Sample Companion Session ─────────────────────────────────────────────────
  
  export const MOCK_COMPANION_MESSAGES: ChatMessage[] = [
    {
      id: 'msg-1',
      role: 'assistant',
      content: 'Wah, good morning! How are you feeling today, ah? Eat already or not? 😊',
      timestamp: new Date(Date.now() - 1000 * 60 * 20),
    },
    {
      id: 'msg-2',
      role: 'user',
      content: 'Aiyah, feel a bit tired lah. Knee also pain pain.',
      timestamp: new Date(Date.now() - 1000 * 60 * 18),
      emotionalState: 'mild_concern',
      topics: ['fatigue', 'knee pain'],
    },
    {
      id: 'msg-3',
      role: 'assistant',
      content: 'Aiyo, knee pain not good hor. Have you tried applying warm compress? Also good to tell your doctor when next appointment. You want me to help remind you, can or not?',
      timestamp: new Date(Date.now() - 1000 * 60 * 17),
    },
    {
      id: 'msg-4',
      role: 'user',
      content: 'Can lah. Remind me tomorrow morning.',
      timestamp: new Date(Date.now() - 1000 * 60 * 15),
      emotionalState: 'neutral',
    },
    {
      id: 'msg-5',
      role: 'assistant',
      content: 'Okay okay, set already! I will remind you at 8 AM tomorrow. By the way, how is your sleep? Last night sleep well or not?',
      timestamp: new Date(Date.now() - 1000 * 60 * 14),
    },
  ]
  
  // ─── Wellbeing Trend Data ─────────────────────────────────────────────────────
  
  export const WELLBEING_TREND_7D = [
    { day: 'Mon', score: 62, checkins: 9 },
    { day: 'Tue', score: 58, checkins: 8 },
    { day: 'Wed', score: 65, checkins: 10 },
    { day: 'Thu', score: 70, checkins: 11 },
    { day: 'Fri', score: 68, checkins: 10 },
    { day: 'Sat', score: 72, checkins: 9 },
    { day: 'Sun', score: 74, checkins: 10 },
  ]
  
  export const EMOTION_TREND_6M = [
    { month: 'Dec', positive: 55, neutral: 30, distress: 15 },
    { month: 'Jan', positive: 58, neutral: 28, distress: 14 },
    { month: 'Feb', positive: 62, neutral: 25, distress: 13 },
    { month: 'Mar', positive: 65, neutral: 22, distress: 13 },
    { month: 'Apr', positive: 70, neutral: 20, distress: 10 },
    { month: 'May', positive: 74, neutral: 18, distress: 8 },
  ]
  
  export const RISK_DISTRIBUTION = {
    low: 5,
    medium: 4,
    high: 2,
    critical: 1,
  }