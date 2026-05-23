import React from 'react'
import { User, Mail, Phone, Users } from 'lucide-react'
import type { UserRole } from '../types'

interface ProfilePageProps {
  user: {
    id: number
    username: string
    name: string
    role: UserRole
    teamId?: number
    teamName?: string
    email?: string
    phone?: string
  }
}

export function ProfilePage({ user }: ProfilePageProps) {
  const getRoleName = (role: UserRole) => {
    switch (role) {
      case 'admin':
        return '管理员'
      case 'inspector':
        return '巡检员'
      case 'maintenance':
        return '维修员'
      default:
        return role
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <User className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">个人信息</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{user.name}</h2>
            <p className="text-gray-600">{getRoleName(user.role)}</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Username */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <User className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">用户名</p>
              <p className="text-gray-900 font-medium">{user.username}</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">角色</p>
              <p className="text-gray-900 font-medium">{getRoleName(user.role)}</p>
            </div>
          </div>

          {/* Team */}
          {user.teamName && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Users className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">班组</p>
                <p className="text-gray-900 font-medium">{user.teamName}</p>
              </div>
            </div>
          )}

          {/* Email */}
          {user.email && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Mail className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">邮箱</p>
                <p className="text-gray-900 font-medium">{user.email}</p>
              </div>
            </div>
          )}

          {/* Phone */}
          {user.phone && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Phone className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-xs text-gray-500">电话</p>
                <p className="text-gray-900 font-medium">{user.phone}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">💡 提示</p>
        <p>如需修改个人信息，请联系管理员。</p>
      </div>
    </div>
  )
}
