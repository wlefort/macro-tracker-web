import { createContext, useContext } from 'react'
import { useUserSettings } from '../hooks/useUserSettings'

const UserSettingsContext = createContext(null)

export function UserSettingsProvider({ children }) {
  const value = useUserSettings()
  return <UserSettingsContext.Provider value={value}>{children}</UserSettingsContext.Provider>
}

export function useUserSettingsContext() {
  const ctx = useContext(UserSettingsContext)
  if (!ctx) throw new Error('useUserSettingsContext must be used within UserSettingsProvider')
  return ctx
}
