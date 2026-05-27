import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Home,
  ClipboardCheck,
  Wrench,
  Bell,
  User as UserIcon,
  LogOut,
  Menu,
  X,
  Zap,
} from 'lucide-react'
import type { User } from '../types'

interface MainLayoutProps {
  user: User
  onLogout: () => void
  children: React.ReactNode
}

export function MainLayout({ user, onLogout, children }: MainLayoutProps) {
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const menuItems = [
    { path: '/', label: '棣栭〉', icon: Home },
    { path: '/inspection', label: '宸℃', icon: ClipboardCheck },
    { path: '/repair', label: '鎶ヤ慨', icon: Wrench },
    { path: '/maintenance', label: '缁翠慨', icon: Zap },
    { path: '/notifications', label: '閫氱煡', icon: Bell },
    { path: '/profile', label: '涓汉', icon: UserIcon },
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-blue-600" />
            <h1 className="text-xl font-bold text-gray-900">璁惧宸℃</h1>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <div className="text-sm text-gray-600">
              <span className="font-medium">{user.name}</span>
              <span className="text-gray-400 ml-2">({user.role})</span>
            </div>
            <button
              onClick={onLogout}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg transition"
            >
              <LogOut className="w-4 h-4" />
              閫€鍑?
            </button>
          </div>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-200 bg-white">
            <div className="px-4 py-3 space-y-2">
              <div className="text-sm text-gray-600 mb-3">
                <span className="font-medium">{user.name}</span>
                <span className="text-gray-400 ml-2">({user.role})</span>
              </div>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                    isActive(item.path)
                      ? 'bg-blue-50 text-blue-600 font-medium'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {item.label}
                </Link>
              ))}
              <button
                onClick={() => {
                  onLogout()
                  setMobileMenuOpen(false)
                }}
                className="w-full flex items-center gap-3 px-3 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition"
              >
                <LogOut className="w-5 h-5" />
                閫€鍑虹櫥褰?
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-7xl mx-auto px-4 py-6">{children}</div>
      </main>

      {/* Bottom Navigation (Mobile) */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40">
        <div className="flex items-center justify-around">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex-1 flex flex-col items-center justify-center py-3 transition ${
                isActive(item.path)
                  ? 'text-blue-600 border-t-2 border-blue-600'
                  : 'text-gray-600'
              }`}
            >
              <item.icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{item.label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Padding for bottom nav on mobile */}
      <div className="md:hidden h-20"></div>
    </div>
  )
}
