import { useState, useEffect } from 'react'
import { BarChart3, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react'
import { toast } from 'sonner'
import { statsApi } from '../lib/api'
import type { DashboardStats } from '../types'

export function HomePage() {
  const [stats, setStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const data = await statsApi.getDashboard()
      setStats(data)
    } catch (error) {
      console.error('Failed to load stats:', error)
      toast.error('加载统计数据失败')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-2">欢迎，用户</h1>
        <p className="text-blue-100">
          巡检员
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Devices */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">设备总数</span>
            <Zap className="w-5 h-5 text-blue-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.totalDevices || 0}</p>
        </div>

        {/* Pending Repairs */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">待派单</span>
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.pendingRepairs || 0}</p>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">处理中</span>
            <Clock className="w-5 h-5 text-yellow-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.totalRepairs || 0}</p>
        </div>

        {/* Completed */}
        <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-600 text-sm">已完成</span>
            <CheckCircle className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{stats?.completedRepairs || 0}</p>
        </div>
      </div>

      {/* Inspection Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <BarChart3 className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">巡检统计</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">总巡检数</span>
              <span className="text-xl font-bold text-gray-900">{stats?.totalInspections || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">异常项</span>
              <span className="text-xl font-bold text-red-600">{stats?.abnormalInspections || 0}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Zap className="w-6 h-6 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">维修统计</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">维修任务</span>
              <span className="text-xl font-bold text-gray-900">{stats?.maintenanceTasks || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">已完成</span>
              <span className="text-xl font-bold text-green-600">{stats?.completedMaintenance || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">快速操作</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {true && (
            <>
              <a
                href="/inspection"
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-3 px-4 rounded-lg text-center transition"
              >
                开始巡检
              </a>
              <a
                href="/repair"
                className="bg-red-50 hover:bg-red-100 text-red-600 font-medium py-3 px-4 rounded-lg text-center transition"
              >
                报修
              </a>
            </>
          )}
          {true && (
            <>
              <a
                href="/maintenance"
                className="bg-yellow-50 hover:bg-yellow-100 text-yellow-600 font-medium py-3 px-4 rounded-lg text-center transition"
              >
                待维修
              </a>
              <a
                href="/repair"
                className="bg-blue-50 hover:bg-blue-100 text-blue-600 font-medium py-3 px-4 rounded-lg text-center transition"
              >
                报修单
              </a>
            </>
          )}
          <a
            href="/notifications"
            className="bg-purple-50 hover:bg-purple-100 text-purple-600 font-medium py-3 px-4 rounded-lg text-center transition"
          >
            通知
          </a>
          <a
            href="/profile"
            className="bg-gray-50 hover:bg-gray-100 text-gray-600 font-medium py-3 px-4 rounded-lg text-center transition"
          >
            个人信息
          </a>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">💡 提示</p>
        <p>小程序与 WEB 端共享同一数据库，所有数据实时同步。</p>
      </div>
    </div>
  )
}
