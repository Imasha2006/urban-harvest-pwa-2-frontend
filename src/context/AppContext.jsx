import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { translations } from '../data/translations'
import { useOnline } from '../hooks/useOnline'

const AppContext = createContext(null)
const THEME_KEY = 'uh-theme'
const LANG_KEY = 'uh-lang'

export function AppProvider({ children }) {
  // theme
  const [theme, setTheme] = useState(() => {
    const s = localStorage.getItem(THEME_KEY)
    if (s) return s
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
  })
  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
    localStorage.setItem(THEME_KEY, theme)
  }, [theme])
  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), [])

  // language
  const [lang, setLang] = useState(() => localStorage.getItem(LANG_KEY) || 'en')
  useEffect(() => {
    localStorage.setItem(LANG_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])
  const toggleLang = useCallback(() => setLang((l) => (l === 'en' ? 'si' : 'en')), [])
  const t = translations[lang]

  // online status
  const online = useOnline()

  // PWA install prompt capture
  const [installEvent, setInstallEvent] = useState(null)
  useEffect(() => {
    const handler = (e) => {
      e.preventDefault()
      setInstallEvent(e)
    }
    window.addEventListener('beforeinstallprompt', handler)
    return () => window.removeEventListener('beforeinstallprompt', handler)
  }, [])
  const promptInstall = useCallback(async () => {
    if (!installEvent) return false
    installEvent.prompt()
    const { outcome } = await installEvent.userChoice
    setInstallEvent(null)
    return outcome === 'accepted'
  }, [installEvent])

  const value = {
    theme, toggleTheme,
    lang, toggleLang, t,
    online,
    canInstall: !!installEvent, promptInstall,
  }
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used inside <AppProvider>')
  return ctx
}
