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
  const { isSessionActive, toggleCall, conversation, initializeVapi, currentAssistantId, sendMessage } = useVapi()

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
      case 'ru': return "Отк��йте Свой Глобальный Карьерный Путь"
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

  const suggestedTopics = {
    en: ["🌍 How to find a job abroad?", "📜 What are the visa requirements?", "🗣️ How to prepare for an interview?", "🌟 What are the best countries for my profession?"],
    es: ["🌍 ¿Cómo encontrar trabajo en el extranjero?", "📜 ¿Cuáles son los requisitos de visa?", "🗣️ ¿Cómo prepararse para una entrevista?", "🌟 ¿Cuáles son los mejores países para mi profesión?"],
    uk: ["🌍 Як знайти роботу за кордоном?", "📜 Які вимоги до візи?", "🗣️ Як підготуватися до співбесіди?", "🌟 Які найкращі країни для моєї професії?"],
    ru: ["🌍 Как найти работу за границей?", "📜 Каковы требования к визе?", "🗣️ Как подготовиться к собеседованию?", "🌟 Какие лучшие страны для моей профессии?"],
    pl: ["🌍 Jak znaleźć pracę za granicą?", "📜 Jakie są wymagania wizowe?", "🗣️ Jak przygotować się do rozmowy kwalifikacyjnej?", "🌟 Jakie są najlepsze kraje dla mojego zawodu?"]
  };

  const handleSuggestedTopicClick = (topic: string) => {
    console.log('Suggested topic clicked:', topic);
    sendMessage('user', topic); // Send the topic to Vapi assistant
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100"> {/* Lighter background */}
      <header className="flex justify-between items-center p-4 border-b">
        <Link href="/" className="text-3xl font-bold">MigrantJobs</Link> {/* Enlarged text */}
        {/* Navbar links removed */}
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <div className="flex justify-center space-x-4 mb-8">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageChange(lang)}
              className={`text-5xl p-2 rounded-lg transition-all ${ // Enlarged icons
                selectedLanguage.code === lang.code
                  ? 'bg-primary text-primary-foreground scale-110'
                  : 'bg-muted hover:bg-muted/80'
              }`}
            >
              {lang.flag}
            </button>
          ))}
        </div>

        <h1 className="text-5xl font-bold mb-8">{getOpportunityText(selectedLanguage)}</h1> {/* Enlarged text */}
        
        {/* Job search component removed */}

        <div className="text-3xl font-semibold mb-4"> {/* Enlarged text */}
          {selectedLanguage.greeting}, job seeker!
        </div>

        <Button 
          className="mb-8" 
          size="lg" 
          onClick={handleMicClick}
          variant={isSessionActive ? "destructive" : "default"}
        >
          <Mic className="h-6 w-6 mr-2" /> {/* Enlarged icon */}
          {isSessionActive ? "Stop Voice Search" : getVoiceSearchText(selectedLanguage)}
        </Button>

        {isSessionActive && (
          <>
            <Card className="w-full max-w-3xl mb-8"> {/* Slightly wider card */}
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">Suggested Topics</h3> {/* Enlarged text */}
                <div className="flex flex-wrap gap-2">
                  {suggestedTopics[selectedLanguage.code].map((topic, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSuggestedTopicClick(topic)}
                      className="border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all"
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card className="w-full max-w-3xl mb-8"> {/* Slightly wider card */}
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">Conversation</h3> {/* Enlarged text */}
                <ul className="list-disc pl-5">
                  {conversation.map((msg, index) => (
                    <li key={index} className={`mb-2 ${msg.role === 'assistant' ? 'text-blue-600' : 'text-green-600'}`}>
                      <strong>{msg.role}:</strong> {msg.text}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </>
        )}
      </main>

      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        © 2024 MigrantJobs. All rights reserved.
      </footer>
    </div>
  )
}