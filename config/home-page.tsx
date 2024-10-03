import { useState } from 'react'
import { Search, Mic } from 'lucide-react'
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"

const languages = [
  { code: 'en', name: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱' },
]

export default function HomePage() {
  const [selectedLanguage, setSelectedLanguage] = useState('en')

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="flex justify-between items-center p-4 border-b">
        <Link href="/" className="text-2xl font-bold">MigrantJobs</Link>
        <nav>
          <Button variant="ghost">Sign In</Button>
          <Button>Post a Job</Button>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-8">
        <h1 className="text-4xl font-bold mb-8">Find Your Next Opportunity</h1>
        
        <Card className="w-full max-w-2xl">
          <CardContent className="p-4">
            <form className="flex gap-2">
              <Input placeholder="Job title or keyword" className="flex-grow" />
              <Input placeholder="Location" className="flex-grow" />
              <Button type="submit" size="icon"><Search className="h-4 w-4" /></Button>
            </form>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-center items-end space-x-2">
          {languages.map((lang, index) => (
            <button
              key={lang.code}
              onClick={() => setSelectedLanguage(lang.code)}
              className={`flex flex-col items-center p-2 rounded-lg transition-all ${
                selectedLanguage === lang.code
                  ? 'bg-primary text-primary-foreground scale-110'
                  : 'bg-muted hover:bg-muted/80'
              } ${index === 2 ? 'pb-4' : 'pb-2'}`}
            >
              <span className="text-2xl mb-1">{lang.flag}</span>
              <Mic className="h-4 w-4" />
            </button>
          ))}
        </div>
      </main>

      <footer className="border-t p-4 text-center text-sm text-muted-foreground">
        © 2024 MigrantJobs. All rights reserved.
      </footer>
    </div>
  )
}