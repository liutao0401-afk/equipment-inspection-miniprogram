/**
 * 报修单卡片组件
 * 使用 React.memo 优化性能
 */

import { memo } from 'react'
import { ChevronRight } from 'lucide-react'
import type { Repair } from '../types'

interface RepairCardProps {
  repair: Repair
  onViewDetails?: (repair: Repair) => void
}

export const RepairCard = memo(function RepairCard({
  repair,
  onViewDetails,
}: RepairCardProps) {
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
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{repair.code}</h3>
          <p className="text-sm text-gray-600">{repair.deviceName}</p>
        </div>
        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(repair.status)}`}>
          {getStatusLabel(repair.status)}
        </span>
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{repair.description}</p>
      <div className="flex justify-between items-center text-xs text-gray-500 mb-3">
        <span>报告人: {repair.reporterName}</span>
        <span>{new Date(repair.createdAt || '').toLocaleString('zh-CN')}</span>
      </div>
      <button
        onClick={() => onViewDetails?.(repair)}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
      >
        查看详情
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
})
