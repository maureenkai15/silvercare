'use client'

import { useState, useCallback, useRef } from 'react'
import { ollamaChatStream, COMPANION_SYSTEM_PROMPT, checkOllamaHealth } from '@/lib/ollama'
import type { ChatMessage, EmotionalState } from '@/lib/types'
import { detectEmotionFromKeywords } from '@/lib/agents'

interface UseOllamaOptions {
  elderName?: string
  systemPrompt?: string
  onEmotionDetected?: (state: EmotionalState) => void
  onDistressDetected?: () => void
}

export function useOllama(options: UseOllamaOptions = {}) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isStreaming, setIsStreaming] = useState(false)
  const [ollamaAvailable, setOllamaAvailable] = useState<boolean | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  // Check Ollama health on mount
  const checkHealth = useCallback(async () => {
    const healthy = await checkOllamaHealth()
    setOllamaAvailable(healthy)
    return healthy
  }, [])

  const sendMessage = useCallback(async (userInput: string) => {
    if (!userInput.trim() || isLoading) return

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      role: 'user',
      content: userInput.trim(),
      timestamp: new Date(),
      emotionalState: detectEmotionFromKeywords(userInput),
    }

    setMessages((prev) => [...prev, userMsg])
    setIsLoading(true)
    setIsStreaming(false)

    // Check emotion
    const detectedEmotion = detectEmotionFromKeywords(userInput)
    options.onEmotionDetected?.(detectedEmotion)
    if (detectedEmotion === 'crisis' || detectedEmotion === 'distress') {
      options.onDistressDetected?.()
    }

    // Build message history for Ollama
    const history = [
      { role: 'system', content: options.systemPrompt ?? COMPANION_SYSTEM_PROMPT },
      ...messages.map((m) => ({ role: m.role, content: m.content })),
      { role: 'user', content: userInput.trim() },
    ]

    // Create placeholder assistant message for streaming
    const assistantMsgId = `msg-${Date.now() + 1}`
    const assistantMsg: ChatMessage = {
      id: assistantMsgId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
    }
    setMessages((prev) => [...prev, assistantMsg])

    try {
      setIsStreaming(true)
      abortRef.current = new AbortController()

      let fullContent = ''
      for await (const chunk of ollamaChatStream(history)) {
        fullContent += chunk
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantMsgId ? { ...m, content: fullContent } : m
          )
        )
      }
    } catch (err) {
      // Fallback responses for when Ollama is unavailable
      const fallbacks = [
        `Aiyoh, sorry ah — I having a bit of technical problem. But I still here with you! How are you feeling today, ${options.elderName ?? 'friend'}?`,
        'Sorry lah, my system a bit slow today. You were saying? I listening one!',
        `Don't worry ah, ${options.elderName ?? 'friend'}! I hear you. Can you tell me more?`,
      ]
      const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)]
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsgId ? { ...m, content: fallback } : m
        )
      )
    } finally {
      setIsLoading(false)
      setIsStreaming(false)
    }
  }, [messages, isLoading, options])

  const clearMessages = useCallback(() => {
    setMessages([])
  }, [])

  const stopStreaming = useCallback(() => {
    abortRef.current?.abort()
    setIsStreaming(false)
    setIsLoading(false)
  }, [])

  return {
    messages,
    setMessages,
    isLoading,
    isStreaming,
    ollamaAvailable,
    sendMessage,
    clearMessages,
    stopStreaming,
    checkHealth,
  }
}