import { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { DailyLogProvider } from './context/DailyLogContext'
import { MacroGoalsProvider } from './context/MacroGoalsContext'
import { UserSettingsProvider, useUserSettingsContext } from './context/UserSettingsContext'
import TabNavigation from './components/TabNavigation'
import HomeView from './components/HomeView'
import DailySummaryView from './components/DailySummaryView'
import ExerciseReviewView from './components/ExerciseReviewView'
import MoreTabView from './components/MoreTabView'
import AIMacroEstimator from './components/AIMacroEstimator'
import AIExerciseEstimator from './components/AIExerciseEstimator'
import BarcodeScanner from './components/BarcodeScanner'
import SettingsView from './components/SettingsView'
import MacroGoalsView from './components/MacroGoalsView'
import CalendarHistoryView from './components/CalendarHistoryView'
import DailyLogHistoryView from './components/DailyLogHistoryView'
import ProgressGraphView from './components/ProgressGraphView'

function ThemeApplier() {
  const { theme } = useUserSettingsContext()

  useEffect(() => {
    const root = document.documentElement
    if (theme === 'dark') {
      root.setAttribute('data-theme', 'dark')
    } else if (theme === 'light') {
      root.removeAttribute('data-theme')
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      if (prefersDark) root.setAttribute('data-theme', 'dark')
      else root.removeAttribute('data-theme')
    }
  }, [theme])

  return null
}

export default function App() {
  return (
    <UserSettingsProvider>
      <MacroGoalsProvider>
        <DailyLogProvider>
          <BrowserRouter>
            <ThemeApplier />
            <div className="app">
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomeView />} />
                  <Route path="/summary" element={<DailySummaryView />} />
                  <Route path="/exercise" element={<ExerciseReviewView />} />
                  <Route path="/more" element={<MoreTabView />} />
                  <Route path="/more/settings" element={<SettingsView />} />
                  <Route path="/more/goals" element={<MacroGoalsView />} />
                  <Route path="/more/history" element={<CalendarHistoryView />} />
                  <Route path="/more/history/log" element={<DailyLogHistoryView />} />
                  <Route path="/more/progress" element={<ProgressGraphView />} />
                  <Route path="/ai-macro" element={<AIMacroEstimator />} />
                  <Route path="/ai-exercise" element={<AIExerciseEstimator />} />
                  <Route path="/barcode" element={<BarcodeScanner />} />
                </Routes>
              </main>
              <TabNavigation />
            </div>
          </BrowserRouter>
        </DailyLogProvider>
      </MacroGoalsProvider>
    </UserSettingsProvider>
  )
}
