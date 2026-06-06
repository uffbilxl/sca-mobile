import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { Appearance } from 'react-native'
import { lightTokens, darkTokens, ThemeTokens } from './theme'

let AsyncStorage: any = null
try { AsyncStorage = require('@react-native-async-storage/async-storage').default } catch {}

const STORAGE_KEY = '@sca_theme'

interface ThemeContextValue {
  colors: ThemeTokens
  isDark: boolean
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightTokens,
  isDark: false,
  toggle: () => {},
})

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemDark = Appearance.getColorScheme() === 'dark'
  const [isDark, setIsDark] = useState(systemDark)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    async function load() {
      try {
        if (AsyncStorage) {
          const saved = await AsyncStorage.getItem(STORAGE_KEY)
          if (saved !== null) setIsDark(saved === 'dark')
        }
      } catch {}
      setLoaded(true)
    }
    load()
  }, [])

  const toggle = useCallback(() => {
    setIsDark(prev => {
      const next = !prev
      try { AsyncStorage?.setItem(STORAGE_KEY, next ? 'dark' : 'light') } catch {}
      return next
    })
  }, [])

  if (!loaded) return null

  return (
    <ThemeContext.Provider value={{ colors: isDark ? darkTokens : lightTokens, isDark, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeContext)
}
