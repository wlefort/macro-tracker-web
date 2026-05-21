import { createContext, useContext } from 'react'
import { useMacroGoals } from '../hooks/useMacroGoals'

const MacroGoalsContext = createContext(null)

export function MacroGoalsProvider({ children }) {
  const value = useMacroGoals()
  return <MacroGoalsContext.Provider value={value}>{children}</MacroGoalsContext.Provider>
}

export function useMacroGoalsContext() {
  const ctx = useContext(MacroGoalsContext)
  if (!ctx) throw new Error('useMacroGoalsContext must be used within MacroGoalsProvider')
  return ctx
}
