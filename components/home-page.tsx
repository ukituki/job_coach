'use client'

import { useState, useEffect, useCallback } from 'react'
import { Mic } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { languages, Language } from '@/lib/language-data'
import { useVapi } from '@/hooks/use-vapi'

const getAssistantId = (langCode: string) => {
  switch (langCode) {
    case 'en':
      return process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_ENG
    case 'es':
      return process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_ESP
    case 'uk':
      return process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_UKR
    case 'ru':
      return process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_RUS
    case 'pl':
      return process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_POL
    default:
      return process.env.NEXT_PUBLIC_VAPI_ASSISTANT_ID_ENG
  }
}

export function HomePageComponent() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0])
  const { isSessionActive, toggleCall, conversation, initializeVapi, currentAssistantId } = useVapi()

  const handleLanguageChange = useCallback((lang: Language) => {
    console.log('Language changed:', lang.code)
    setSelectedLanguage(lang)
    const newAssistantId = getAssistantId(lang.code)
    if (newAssistantId) {
      initializeVapi(newAssistantId)
    } else {
      console.error(`No assistant ID found for language: ${lang.code}`)
    }
  }, [initializeVapi])

  useEffect(() => {
    console.log('HomePageComponent mounted')
    const initialAssistantId = getAssistantId(selectedLanguage.code)
    if (initialAssistantId) {
      initializeVapi(initialAssistantId)
    } else {
      console.error(`No assistant ID found for language: ${selectedLanguage.code}`)
    }
  }, [initializeVapi, selectedLanguage.code])

  const handleMicClick = async () => {
    console.log('Mic button clicked')
    if (!currentAssistantId) {
      console.error("No assistant ID set. Cannot start call.");
      return;
    }
    try {
      await toggleCall()
      console.log('VAPI call toggled, new state:', isSessionActive ? 'active' : 'inactive')
    } catch (error) {
      console.error('Error toggling VAPI call')
    }
  }

  const getOpportunityText = (lang: Language) => {
    switch (lang.code) {
      case 'en': return "Discover Your Global Career Path"
      case 'es': return "Descubre Tu Camino Profesional Global"
      case 'uk': return "Відкрийте Свій Глобальний Кар'єрний Шлях"
      case 'ru': return "Откройте Свой Глобальный Карьерный Путь"
      case 'pl': return "Odkryj Swoją Globalną Ścieżkę Kariery"
      default: return "Discover Your Global Career Path"
    }
  }

  const getVoiceSearchText = (lang: Language) => {
    switch (lang.code) {
      case 'en': return "Start Voice Search"
      case 'es': return "Iniciar Búsqueda por Voz"
      case 'uk': return "Почати Голосовий Пошук"
      case 'ru': return "Начать Голосовой Поиск"
      case 'pl': return "Rozpocznij Wyszukiwanie Głosowe"
      default: return "Start Voice Search"
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex justify-between items-center p-4 border-b">
        <Link href="/" className="text-2xl font-bold">MigrantJobs</Link>
        {/* Navbar links removed */}
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="flex justify-center space-x-4 mb-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className={`text-4xl p-2 rounded-lg transition-all ${
                selectedLanguage.code === lang.code
                  ? 'bg-primary text-primary-foreground scale-110'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {lang.flag}
            </button>
          ))}
        </div>

        <h1 className="text-4xl font-bold mb-8">{getOpportunityText(selectedLanguage)}</h1>
        
        {/* Job search component removed */}

        <div className="text-2xl font-semibold mb-4">
          {selectedLanguage.greeting}, job seeker!
        </div>

        <Button 
          className="mb-8" 
          size="lg" 
          onClick={handleMicClick}
          variant={isSessionActive ? "destructive" : "default"}
        >
          <Mic className="h-5 w-5 mr-2" />
          {isSessionActive ? "Stop Voice Search" : getVoiceSearchText(selectedLanguage)}
        </Button>

        {isSessionActive && (
          <Card className="w-full max-w-2xl mb-8">
            <CardContent>
              <h3 className="text-lg font-semibold mb-2">Conversation</h3>
              <ul className="list-disc pl-5">
                {conversation.map((msg, index) => (
                  <li key={index} className={`mb-2 ${msg.role === 'assistant' ? 'text-blue-600' : 'text-green-600'}`}>
                    <strong>{msg.role}:</strong> {msg.text}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        © 2024 MigrantJobs. All rights reserved.
      </footer>
    </div>
  )
}