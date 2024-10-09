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

type TopicKey = "🌍 How to find a job abroad?" | "📜 What are the visa requirements?" | "🗣️ How to prepare for an interview?" | "🌟 What are the best countries for my profession?";

const initialSuggestedTopics: Record<string, TopicKey[]> = {
  en: ["🌍 How to find a job abroad?", "📜 What are the visa requirements?", "🗣️ How to prepare for an interview?", "🌟 What are the best countries for my profession?"],
  es: ["🌍 ¿Cómo encontrar trabajo en el extranjero?", "📜 ¿Cuáles son los requisitos de visa?", "🗣️ ¿Cómo prepararse para una entrevista?", "🌟 ¿Cuáles son los mejores países para mi profesión?"],
  uk: ["🌍 Як знайти роботу за кордоном?", "📜 Які вимоги до візи?", "🗣️ Як підготуватися до співбесіди?", "🌟 Які найкращі країни для моєї професії?"],
  ru: ["🌍 Как найти работу за границей?", "📜 Каковы требования к визе?", "🗣️ Как подготовиться к собеседованию?", "🌟 Какие лучшие страны для моей профессии?"],
  pl: ["🌍 Jak znaleźć pracę za granicą?", "📜 Jakie są wymagania wizowe?", "🗣️ Jak przygotować się do rozmowy kwalifikacyjnej?", "🌟 Jakie są najlepsze kraje dla mojego zawodu?"]
};

const followUpQuestions: Record<string, Record<TopicKey, string[]>> = {
  en: {
    "🌍 How to find a job abroad?": ["What are the top job search websites?", "How to network effectively?", "What are the common interview questions?", "How to balance work and life abroad?"],
    "📜 What are the visa requirements?": ["What documents are needed for a visa?", "How long does the visa process take?", "What are the costs involved?", "How to find accommodation abroad?"],
    "🗣️ How to prepare for an interview?": ["What are the best interview practices?", "How to dress for an interview?", "How to follow up after an interview?", "How to learn a new language quickly?"],
    "🌟 What are the best countries for my profession?": ["What are the top industries in my field?", "How to adapt to a new culture?", "What are the salary expectations?", "How to start a business abroad?"]
  },
  es: {
    "🌍 ¿Cómo encontrar trabajo en el extranjero?": ["¿Cuáles son los mejores sitios web de búsqueda de empleo?", "¿Cómo hacer networking de manera efectiva?", "¿Cuáles son las preguntas comunes en una entrevista?", "¿Cómo equilibrar el trabajo y la vida en el extranjero?"],
    "📜 ¿Cuáles son los requisitos de visa?": ["¿Qué documentos se necesitan para una visa?", "¿Cuánto tiempo tarda el proceso de visa?", "¿Cuáles son los costos involucrados?", "¿Cómo encontrar alojamiento en el extranjero?"],
    "🗣️ ¿Cómo prepararse para una entrevista?": ["¿Cuáles son las mejores prácticas para entrevistas?", "¿Cómo vestirse para una entrevista?", "¿Cómo hacer un seguimiento después de una entrevista?", "¿Cómo aprender un nuevo idioma rápidamente?"],
    "🌟 ¿Cuáles son los mejores países para mi profesión?": ["¿Cuáles son las principales industrias en mi campo?", "¿Cómo adaptarse a una nueva cultura?", "¿Cuáles son las expectativas salariales?", "¿Cómo iniciar un negocio en el extranjero?"]
  },
  uk: {
    "🌍 Як знайти роботу за кордоном?": ["Які найкращі сайти для пошуку роботи?", "Як ефективно налагоджувати зв'язки?", "Які поширені питання на співбесіді?", "Як збалансувати роботу та життя за кордоном?"],
    "📜 Які вимоги до візи?": ["Які документи потрібні для отримання візи?", "Скільки часу займає процес отримання візи?", "Які витрати пов'язані з цим?", "Як знайти житло за кордоном?"],
    "🗣️ Як підготуватися до співбесіди?": ["Які найкращі практики для співбесід?", "Як одягатися на співбесіду?", "Як слідкувати за результатами співбесіди?", "Як швидко вивчити нову мову?"],
    "🌟 Які найкращі країни для моєї професії?": ["Які основні галузі в моїй сфері?", "Як адаптуватися до нової культури?", "Які очікування щодо заробітної плати?", "Як розпочати бізнес за кордоном?"]
  },
  ru: {
    "🌍 Как найти работу за границей?": ["Какие лучшие сайты для поиска работы?", "Как эффективно налаживать связи?", "Какие распространенные вопросы на собеседовании?", "Как сбалансировать работу и жизнь за границей?"],
    "📜 Каковы требования к визе?": ["Какие документы нужны для визы?", "Сколько времени занимает процесс получения визы?", "Каковы затраты?", "Как найти жилье за границей?"],
    "🗣️ Как подготовиться к собеседованию?": ["Какие лучшие практики для собеседований?", "Как одеваться на собеседование?", "Как следить за результатами собеседования?", "Как быстро выучить новый язык?"],
    "🌟 Какие лучшие страны для моей профессии?": ["Какие основные отрасли в моей сфере?", "Как адаптироваться к новой культуре?", "Каковы ожидания по зарплате?", "Как начать бизнес за границей?"]
  },
  pl: {
    "🌍 Jak znaleźć pracę za granicą?": ["Jakie są najlepsze strony do szukania pracy?", "Jak skutecznie nawiązywać kontakty?", "Jakie są typowe pytania na rozmowie kwalifikacyjnej?", "Jak zrównoważyć pracę i życie za granicą?"],
    "📜 Jakie są wymagania wizowe?": ["Jakie dokumenty są potrzebne do wizy?", "Ile trwa proces wizowy?", "Jakie są koszty?", "Jak znaleźć zakwaterowanie za granicą?"],
    "🗣️ Jak przygotować się do rozmowy kwalifikacyjnej?": ["Jakie są najlepsze praktyki na rozmowy kwalifikacyjne?", "Jak się ubrać na rozmowę kwalifikacyjną?", "Jak śledzić wyniki rozmowy kwalifikacyjnej?", "Jak szybko nauczyć się nowego języka?"],
    "🌟 Jakie są najlepsze kraje dla mojego zawodu?": ["Jakie są główne branże w mojej dziedzinie?", "Jak dostosować się do nowej kultury?", "Jakie są oczekiwania płacowe?", "Jak rozpocząć działalność gospodarczą za granicą?"]
  }
};

export function HomePageComponent() {
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(languages[0]);
  const [currentTopics, setCurrentTopics] = useState<TopicKey[]>(initialSuggestedTopics[selectedLanguage.code as keyof typeof initialSuggestedTopics]);
  const [selectedMainTopic, setSelectedMainTopic] = useState<TopicKey | null>(null);
  const { isSessionActive, toggleCall, conversation, initializeVapi, currentAssistantId, sendMessage } = useVapi();

  const handleLanguageChange = useCallback((lang: Language) => {
    console.log('Language changed:', lang.code);
    setSelectedLanguage(lang);
    setCurrentTopics(initialSuggestedTopics[lang.code as keyof typeof initialSuggestedTopics]);
    setSelectedMainTopic(null);
    const newAssistantId = getAssistantId(lang.code);
    if (newAssistantId) {
      initializeVapi(newAssistantId);
    } else {
      console.error(`No assistant ID found for language: ${lang.code}`);
    }
  }, [initializeVapi]);

  useEffect(() => {
    console.log('HomePageComponent mounted');
    const initialAssistantId = getAssistantId(selectedLanguage.code);
    if (initialAssistantId) {
      initializeVapi(initialAssistantId);
    } else {
      console.error(`No assistant ID found for language: ${selectedLanguage.code}`);
    }
  }, [initializeVapi, selectedLanguage.code]);

  const handleMicClick = async () => {
    console.log('Mic button clicked');
    if (!currentAssistantId) {
      console.error("No assistant ID set. Cannot start call.");
      return;
    }
    try {
      await toggleCall();
      console.log('VAPI call toggled, new state:', isSessionActive ? 'active' : 'inactive');
    } catch (error) {
      console.error('Error toggling VAPI call');
    }
  };

  const handleSuggestedTopicClick = (topic: TopicKey) => {
    console.log('Suggested topic clicked:', topic);
    sendMessage('user', topic); // Send the topic to Vapi assistant
    setSelectedMainTopic(topic);
  };

  const getOpportunityText = (lang: Language) => {
    switch (lang.code) {
      case 'en': return "Discover Your Global Career Path"
      case 'es': return "Descubre Tu Camino Profesional Global"
      case 'uk': return "Відкрийте Свій Глобальний Кар'єрний Шлях"
      case 'ru': return "Откройте Свой Глобальный Карьерный Путь"
      case 'pl': return "Odkryj Swoją Globalną Ścieżkę Kariery"
      default: return "Discover Your Global Career Path"
    }
  };

  const getVoiceSearchText = (lang: Language) => {
    switch (lang.code) {
      case 'en': return "Start Voice Search"
      case 'es': return "Iniciar Búsqueda por Voz"
      case 'uk': return "Почати Голосовий Пошук"
      case 'ru': return "Начать Голосовой Поиск"
      case 'pl': return "Rozpocznij Wyszukiwanie Głosowe"
      default: return "Start Voice Search"
    }
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
                  {initialSuggestedTopics[selectedLanguage.code as keyof typeof initialSuggestedTopics].map((topic, index) => (
                    <Button
                      key={index}
                      onClick={() => handleSuggestedTopicClick(topic)}
                      className={`border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all ${
                        selectedMainTopic === topic ? 'bg-gray-200' : 'bg-white'
                      }`}
                    >
                      {topic}
                    </Button>
                  ))}
                </div>
                {selectedMainTopic && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2">Follow-Up Questions</h4>
                    <div className="flex flex-wrap gap-2">
                      {(followUpQuestions[selectedLanguage.code as keyof typeof followUpQuestions][selectedMainTopic] || []).map((followUp, index) => (
                        <Button
                          key={index}
                          onClick={() => sendMessage('user', followUp)}
                          className="border border-gray-300 text-gray-700 hover:bg-gray-100 transition-all bg-white"
                        >
                          {followUp}
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="w-full max-w-3xl mb-8"> {/* Slightly wider card */}
              <CardContent>
                <h3 className="text-xl font-semibold mb-2">Conversation</h3> {/* Enlarged text */}
                <ul className="list-disc pl-5">
                  {conversation
                    .filter((msg) => msg.isFinal) // Only include final messages
                    .map((msg, index) => (
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