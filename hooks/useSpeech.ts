'use client'

import { useState, useCallback, useRef, useEffect } from 'react'

interface UseSpeechOptions {
  onTranscript?: (text: string) => void
  onError?: (error: string) => void
  language?: string
}

export function useSpeech(options: UseSpeechOptions = {}) {
  const [isListening, setIsListening] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [supported, setSupported] = useState(false)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const synthRef = useRef<SpeechSynthesis | null>(null)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as unknown as { SpeechRecognition?: typeof globalThis.SpeechRecognition }).SpeechRecognition ||
        (window as unknown as { webkitSpeechRecognition?: typeof globalThis.SpeechRecognition }).webkitSpeechRecognition

      if (SpeechRecognition) {
        setSupported(true)
        const recognition = new SpeechRecognition()
        recognition.continuous = false
        recognition.interimResults = true
        recognition.lang = options.language ?? 'en-SG'

        recognition.onresult = (event) => {
          let interimTranscript = ''
          let finalTranscript = ''

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const text = event.results[i][0].transcript
            if (event.results[i].isFinal) {
              finalTranscript += text
            } else {
              interimTranscript += text
            }
          }

          setTranscript(finalTranscript || interimTranscript)

          if (finalTranscript) {
            options.onTranscript?.(finalTranscript)
            setIsListening(false)
          }
        }

        recognition.onerror = (event) => {
          options.onError?.(event.error)
          setIsListening(false)
        }

        recognition.onend = () => {
          setIsListening(false)
        }

        recognitionRef.current = recognition
      }

      if (window.speechSynthesis) {
        synthRef.current = window.speechSynthesis
      }
    }
  }, [])

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return
    setTranscript('')
    setIsListening(true)
    recognitionRef.current.start()
  }, [isListening])

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop()
    setIsListening(false)
  }, [])

  const toggleListening = useCallback(() => {
    if (isListening) stopListening()
    else startListening()
  }, [isListening, startListening, stopListening])

  const speak = useCallback((text: string, options?: SpeechSynthesisUtterance) => {
    if (!synthRef.current) return

    // Cancel any current speech
    synthRef.current.cancel()

    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = 'en-SG'
    utterance.rate = 0.85       // Slightly slower for elderly
    utterance.pitch = 1.0
    utterance.volume = 1.0

    // Prefer a local en-SG voice if available
    const voices = synthRef.current.getVoices()
    const sgVoice = voices.find((v) => v.lang === 'en-SG') ??
                    voices.find((v) => v.lang.startsWith('en-'))
    if (sgVoice) utterance.voice = sgVoice

    utterance.onstart = () => setIsSpeaking(true)
    utterance.onend = () => setIsSpeaking(false)
    utterance.onerror = () => setIsSpeaking(false)

    synthRef.current.speak(utterance)
  }, [])

  const stopSpeaking = useCallback(() => {
    synthRef.current?.cancel()
    setIsSpeaking(false)
  }, [])

  return {
    isListening,
    isSpeaking,
    transcript,
    supported,
    startListening,
    stopListening,
    toggleListening,
    speak,
    stopSpeaking,
  }
}