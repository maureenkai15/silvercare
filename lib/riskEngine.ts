import type {
    ElderProfile,
    RiskAssessment,
    RiskLevel,
    Intervention,
    MobilityLevel,
    SocialFrequency,
  } from './types'
  
  // ─── Scoring Weights ──────────────────────────────────────────────────────────
  
  const WEIGHTS = {
    age: { base: 0, over65: 6, over70: 12, over75: 16, over80: 22, over85: 28 },
    mobility: { full: 0, limited: 14, wheelchair: 22, bedridden: 30 } as Record<MobilityLevel, number>,
    conditions: {
      none: 0, hypertension: 6, diabetes: 8, 'diabetes+hypertension': 14,
      dementia: 22, 'multiple comorbidities': 28,
    } as Record<string, number>,
    living: { family: 0, alone: 20, nursing_home: 10 },
    social: { daily: 0, weekly: 5, monthly: 12, rarely: 20 } as Record<SocialFrequency, number>,
    clinicDistance: (km: number) => km > 5 ? 12 : km > 2 ? 6 : 0,
  }
  
  // ─── Score Calculation ────────────────────────────────────────────────────────
  
  function ageScore(age: number): number {
    if (age >= 85) return WEIGHTS.age.over85
    if (age >= 80) return WEIGHTS.age.over80
    if (age >= 75) return WEIGHTS.age.over75
    if (age >= 70) return WEIGHTS.age.over70
    if (age >= 65) return WEIGHTS.age.over65
    return WEIGHTS.age.base
  }
  
  function conditionsScore(conditions: string[]): number {
    if (conditions.length === 0) return 0
    if (conditions.length >= 3) return WEIGHTS.conditions['multiple comorbidities']
    return Math.max(...conditions.map((c) => {
      const key = c.toLowerCase()
      return WEIGHTS.conditions[key] ?? 5
    }))
  }
  
  export function calculateRiskScore(profile: ElderProfile): RiskAssessment {
    const age = ageScore(profile.age)
    const mobility = WEIGHTS.mobility[profile.mobility] ?? 0
    const conditions = conditionsScore(profile.conditions)
    const living = WEIGHTS.living[profile.livingSituation] ?? 0
    const social = WEIGHTS.social[profile.socialFrequency] ?? 0
    const clinic = WEIGHTS.clinicDistance(profile.clinicDistanceKm)
  
    const rawScore = age + mobility + conditions + living + social + clinic
    const overallScore = Math.min(Math.round(rawScore), 99)
  
    // Loneliness = driven by social isolation + living alone
    const lonelinessScore = Math.min(
      Math.round(social * 2.2 + (profile.livingSituation === 'alone' ? 28 : 0) + (profile.age > 75 ? 10 : 5)),
      99
    )
  
    // Fall risk = mobility + age + clinic access
    const fallRiskScore = Math.min(Math.round(mobility * 1.5 + age * 1.2 + clinic), 99)
  
    // Medical risk = conditions + clinic distance + age
    const medicalRiskScore = Math.min(Math.round(conditions + clinic + age * 0.5), 99)
  
    const riskLevel: RiskLevel =
      overallScore >= 75 ? 'critical'
      : overallScore >= 50 ? 'high'
      : overallScore >= 30 ? 'medium'
      : 'low'
  
    const interventions = generateInterventions(riskLevel, profile, { lonelinessScore, fallRiskScore })
  
    return {
      elderId: profile.id,
      overallScore,
      lonelinessScore,
      fallRiskScore,
      medicalRiskScore,
      riskLevel,
      interventions,
      generatedAt: new Date(),
    }
  }
  
  // ─── Intervention Generator ───────────────────────────────────────────────────
  
  function generateInterventions(
    level: RiskLevel,
    profile: ElderProfile,
    scores: { lonelinessScore: number; fallRiskScore: number }
  ): Intervention[] {
    const interventions: Intervention[] = []
  
    if (level === 'critical') {
      interventions.push({
        id: 'wc-1',
        priority: 'immediate',
        category: 'safety',
        description: 'Immediate welfare check required — contact family or dispatch Silver Generation Office volunteer.',
        referralOrg: 'Silver Generation Office (1800-650-6060)',
      })
      interventions.push({
        id: 'gp-1',
        priority: 'immediate',
        category: 'medical',
        description: 'Schedule GP visit within 48 hours for comprehensive health assessment.',
      })
    }
  
    if (level === 'high' || level === 'critical') {
      interventions.push({
        id: 'checkin-1',
        priority: 'short_term',
        category: 'safety',
        description: 'Enable daily check-in via SilverCare AI companion with alert escalation.',
      })
      interventions.push({
        id: 'ntuc-1',
        priority: 'short_term',
        category: 'social',
        description: 'Enrol in NTUC Health Community Care or Active Ageing Centre near residence.',
        referralOrg: 'NTUC Health (6444 4804)',
      })
    }
  
    if (scores.lonelinessScore >= 60) {
      interventions.push({
        id: 'befriend-1',
        priority: 'short_term',
        category: 'mental_health',
        description: 'Refer to befriending service — Silver Ribbon Singapore for social connection and mental wellness.',
        referralOrg: 'Silver Ribbon (1800-202-0022)',
      })
    }
  
    if (scores.fallRiskScore >= 50) {
      interventions.push({
        id: 'fall-1',
        priority: 'short_term',
        category: 'safety',
        description: 'Conduct home safety assessment — request HDB flat modification grant for grab bars, anti-slip flooring.',
        referralOrg: 'Agency for Integrated Care (1800-650-6060)',
      })
    }
  
    if (profile.socialFrequency === 'rarely' || profile.socialFrequency === 'monthly') {
      interventions.push({
        id: 'cc-1',
        priority: 'long_term',
        category: 'social',
        description: 'Encourage weekly attendance at nearest Community Centre active ageing programme.',
      })
    }
  
    if (profile.clinicDistanceKm > 3) {
      interventions.push({
        id: 'tele-1',
        priority: 'long_term',
        category: 'medical',
        description: 'Register for Healthhub telemedicine — reduce need for physical clinic travel.',
        referralOrg: 'HealthHub (app.gov.sg/healthhub)',
      })
    }
  
    // Always add AI companion
    interventions.push({
      id: 'companion-1',
      priority: level === 'low' ? 'long_term' : 'short_term',
      category: 'mental_health',
      description: 'Daily 10-minute AI companion session to monitor mood, medication, and wellbeing.',
    })
  
    return interventions
  }
  
  // ─── Risk Level Display Helpers ───────────────────────────────────────────────
  
  export const riskColors: Record<RiskLevel, string> = {
    low: '#27ae60',
    medium: '#f39c12',
    high: '#e67e22',
    critical: '#e74c3c',
  }
  
  export const riskLabels: Record<RiskLevel, string> = {
    low: 'Low Risk',
    medium: 'Medium Risk',
    high: 'High Risk',
    critical: 'Critical',
  }
  
  export const riskBadgeStyles: Record<RiskLevel, string> = {
    low: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    medium: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
    high: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
    critical: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  }