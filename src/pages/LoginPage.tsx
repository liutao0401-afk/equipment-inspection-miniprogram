import React, { useState } from 'react'
import { Zap, Eye, EyeOff } from 'lucide-react'
import { toast } from 'sonner'
import { authApi } from '../lib/api'
import type { User } from '../types'

interface LoginPageProps {
  onLogin: (user: User, token: string) => void
}

export function LoginPage({ onLogin }: LoginPageProps) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!username.trim() || !password.trim()) {
      toast.error('璇疯緭鍏ョ敤鎴峰悕鍜屽瘑鐮?)
      return
    }

    setIsLoading(true)
    try {
      const response = await authApi.login({ username, password })
      onLogin(response.user, response.token)
      toast.success('鐧诲綍鎴愬姛')
    } catch (error) {
      console.error('Login error:', error)
      toast.error(error instanceof Error ? error.message : '鐧诲綍澶辫触锛岃閲嶈瘯')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Zap className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">璁惧宸℃</h1>
          </div>
          <p className="text-gray-600">灏忕▼搴忕増鏈?/p>
        </div>

        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                用户名
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="璇疯緭鍏ョ敤鎴峰悕"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                disabled={isLoading}
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                密码
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="璇疯緭鍏ュ瘑鐮?
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-medium py-2 rounded-lg transition mt-6"
            >
              {isLoading ? '登录中..' : '鐧诲綍'}
            </button>
          </form>

          {/* Test Accounts */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3">娴嬭瘯璐﹀彿锛?/p>
            <div className="space-y-2 text-xs text-gray-500">
              <p>鈥?宸℃鍛? inspector / 123456</p>
              <p>鈥?缁翠慨鍛? maintenance / 123456</p>
              <p>鈥?绠＄悊鍛? admin / 123456</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6 text-sm text-gray-600">
          <p>璁惧宸℃绠＄悊绯荤粺 v1.0.0</p>
          <p className="mt-1">涓?WEB 绔叡浜悓涓€鏁版嵁搴?/p>
        </div>
      </div>
    </div>
  )
}
