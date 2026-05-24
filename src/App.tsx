import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'sonner'
import { LoginPage } from './pages/LoginPage'
import { HomePage } from './pages/HomePage'
import { InspectionPage } from './pages/InspectionPage'
import { RepairPage } from './pages/RepairPage'
import { MaintenancePage } from './pages/MaintenancePage'
import { ProfilePage } from './pages/ProfilePage'
import { NotificationsPage } from './pages/NotificationsPage'
import { SettingsPage } from './pages/SettingsPage'
import { MainLayout } from './components/MainLayout'
import { authApi } from './lib/api'
import type { User } from './types'

function clearAuthStorage() {
  localStorage.removeItem('user')
  localStorage.removeItem('token')
}

function readWechatSessionFromHash() {
  const hash = window.location.hash.startsWith('#')
    ? window.location.hash.slice(1)
    : window.location.hash
  const params = new URLSearchParams(hash)
  const token = params.get('wechat_token')
  const user = params.get('wechat_user')

  if (token) {
    localStorage.setItem('token', token)
  }

  if (user) {
    localStorage.setItem('user', user)
  }

  if (token || user) {
    window.history.replaceState(null, document.title, window.location.pathname + window.location.search)
  }
}

function App() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const restoreSession = async () => {
      readWechatSessionFromHash()

      const token = localStorage.getItem('token')
      if (!token) {
        clearAuthStorage()
        setIsLoading(false)
        return
      }

      try {
        const profile = await authApi.getProfile()
        setUser(profile)
        localStorage.setItem('user', JSON.stringify(profile))
      } catch (error) {
        console.error('Failed to restore session:', error)
        clearAuthStorage()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    restoreSession()
  }, [])

  const handleLogin = (userData: User, token: string) => {
    setUser(userData)
    localStorage.setItem('user', JSON.stringify(userData))
    localStorage.setItem('token', token)
  }

  const handleLogout = () => {
    setUser(null)
    clearAuthStorage()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            user ? (
              <Navigate to="/" replace />
            ) : (
              <LoginPage onLogin={handleLogin} />
            )
          }
        />
        <Route
          path="/*"
          element={
            user ? (
              <MainLayout user={user} onLogout={handleLogout}>
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/inspection" element={<InspectionPage />} />
                  <Route path="/repair" element={<RepairPage />} />
                  <Route path="/maintenance" element={<MaintenancePage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                  <Route path="/notifications" element={<NotificationsPage />} />
                  <Route path="/settings" element={<SettingsPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
      <Toaster position="top-center" />
    </Router>
  )
}

export default App
