import { createContext, useContext } from 'react'
import { useDailyLog } from '../hooks/useDailyLog'

const DailyLogContext = createContext(null)

export function DailyLogProvider({ children }) {
  const value = useDailyLog()
  return <DailyLogContext.Provider value={value}>{children}</DailyLogContext.Provider>
}

export function useDailyLogContext() {
  const ctx = useContext(DailyLogContext)
  if (!ctx) throw new Error('useDailyLogContext must be used within DailyLogProvider')
  return ctx
}
