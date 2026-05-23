import React from 'react'
import { Settings, Info, Trash2, Shield } from 'lucide-react'
import { toast } from 'sonner'
import type { User } from '../types'

interface SettingsPageProps {
  user: User
}

export function SettingsPage({ user }: SettingsPageProps) {
  const handleClearCache = () => {
    try {
      localStorage.clear()
      sessionStorage.clear()
      toast.success('缓存已清除')
    } catch (error) {
      toast.error('清除缓存失败')
    }
  }

  const handleExportData = () => {
    try {
      const data = {
        user,
        exportTime: new Date().toISOString(),
      }
      const json = JSON.stringify(data, null, 2)
      const blob = new Blob([json], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `inspection-data-${Date.now()}.json`
      a.click()
      URL.revokeObjectURL(url)
      toast.success('数据已导出')
    } catch (error) {
      toast.error('导出数据失败')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Settings className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">系统设置</h1>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* General Settings */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">通用设置</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">通知提醒</p>
                <p className="text-sm text-gray-600">接收系统通知</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <p className="font-medium text-gray-900">自动保存</p>
                <p className="text-sm text-gray-600">自动保存草稿</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">数据管理</h2>
          <div className="space-y-3">
            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-left"
            >
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">导出数据</p>
                <p className="text-sm text-gray-600">导出个人数据为 JSON</p>
              </div>
            </button>
            <button
              onClick={handleClearCache}
              className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-left"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">清除缓存</p>
                <p className="text-sm text-gray-600">清除本地存储的数据</p>
              </div>
            </button>
          </div>
        </div>

        {/* About */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">关于应用</h2>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">应用名称</span>
              <span className="font-medium text-gray-900">设备巡检小程序</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">版本号</span>
              <span className="font-medium text-gray-900">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">构建时间</span>
              <span className="font-medium text-gray-900">2026-05-23</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">API 版本</span>
              <span className="font-medium text-gray-900">1.0.0</span>
            </div>
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
          <div className="flex gap-3">
            <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium mb-1">系统信息</p>
              <p>小程序与 WEB 端共享同一数据库，所有数据实时同步。</p>
              <p className="mt-2">如有问题，请联系系统管理员。</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
