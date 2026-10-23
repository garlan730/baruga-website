import { createContext, useContext, useEffect, useState } from 'react'

const LangContext = createContext({ lang: 'id', setLang: () => {}, t: (v) => v })

const STORAGE_KEY = 'bmc-lang'

function readStoredLang() {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    return v === 'en' || v === 'id' ? v : 'id'
  } catch {
    return 'id'
  }
}

export function LangProvider({ children }) {
  const [lang, setLang] = useState(readStoredLang)

  useEffect(() => {
    document.documentElement.lang = lang
    try {
      localStorage.setItem(STORAGE_KEY, lang)
    } catch {
      // storage unavailable; language just won't persist
    }
  }, [lang])

  // Accepts either a plain string or an { id, en } pair.
  const t = (v) => (v && typeof v === 'object' && 'id' in v ? v[lang] ?? v.id : v)

  return <LangContext.Provider value={{ lang, setLang, t }}>{children}</LangContext.Provider>
}

export const useLang = () => useContext(LangContext)
