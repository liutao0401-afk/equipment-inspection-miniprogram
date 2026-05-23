import React, { useState, useEffect } from 'react'
import { Wrench, Plus, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { repairApi } from '../lib/api'
import type { User, Repair } from '../types'

interface RepairPageProps {
  user: User
}

export function RepairPage({ user }: RepairPageProps) {
  const [repairs, setRepairs] = useState<Repair[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)

  useEffect(() => {
    loadRepairs()
  }, [])

  const loadRepairs = async () => {
    try {
      setIsLoading(true)
      const data = await repairApi.list()
      setRepairs(data.data)
    } catch (error) {
      console.error('Failed to load repairs:', error)
      toast.error('加载报修单失败')
    } finally {
      setIsLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-700'
      case 'processing':
        return 'bg-yellow-100 text-yellow-700'
      case 'repaired':
        return 'bg-blue-100 text-blue-700'
      case 'accepted':
        return 'bg-green-100 text-green-700'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending':
        return '待派单'
      case 'processing':
        return '处理中'
      case 'repaired':
        return '已修复'
      case 'accepted':
        return '已验收'
      default:
        return status
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Wrench className="w-8 h-8 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">报修单</h1>
        </div>
        {user.role === 'inspector' && (
          <button
            onClick={() => setShowCreateForm(!showCreateForm)}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition"
          >
            <Plus className="w-4 h-4" />
            新增
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && user.role === 'inspector' && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">创建报修单</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                设备
              </label>
              <input
                type="text"
                placeholder="搜索设备..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                故障描述
              </label>
              <textarea
                placeholder="请描述故障情况..."
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                优先级
              </label>
              <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="low">低</option>
                <option value="medium">中</option>
                <option value="high">高</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                照片
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setShowCreateForm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition"
              >
                取消
              </button>
              <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition">
                提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Repairs List */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      ) : repairs.length === 0 ? (
        <div className="text-center py-12">
          <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">暂无报修单</p>
        </div>
      ) : (
        <div className="space-y-4">
          {repairs.map((repair) => (
            <div
              key={repair.id}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{repair.code}</h3>
                  <p className="text-sm text-gray-600">{repair.deviceName}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(repair.status)}`}>
                  {getStatusLabel(repair.status)}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-3">{repair.description}</p>
              <div className="flex justify-between items-center text-xs text-gray-500">
                <span>报告人: {repair.reporterName}</span>
                <span>{new Date(repair.createdAt || '').toLocaleString('zh-CN')}</span>
              </div>
              <button className="w-full mt-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition">
                查看详情
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
