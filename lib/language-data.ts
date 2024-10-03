export interface Language {
  code: string;
  name: string;
  flag: string;
  greeting: string;
}

export const languages: Language[] = [
  { code: 'en', name: 'English', flag: '🇬🇧', greeting: 'Hello' },
  { code: 'es', name: 'Español', flag: '🇪🇸', greeting: 'Hola' },
  { code: 'uk', name: 'Українська', flag: '🇺🇦', greeting: 'Привіт' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺', greeting: 'Привет' },
  { code: 'pl', name: 'Polski', flag: '🇵🇱', greeting: 'Cześć' },
];