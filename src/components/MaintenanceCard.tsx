/**
 * 维修任务卡片组件
 * 使用 React.memo 优化性能
 */

import { memo } from 'react'
import { CheckCircle } from 'lucide-react'
import type { Maintenance } from '../types'

interface MaintenanceCardProps {
  maintenance: Maintenance
  onAction?: (maintenance: Maintenance) => void
  actionLabel?: string
}

export const MaintenanceCard = memo(function MaintenanceCard({
  maintenance,
  onAction,
  actionLabel = '完成维修',
}: MaintenanceCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{maintenance.code}</h3>
          <p className="text-sm text-gray-600">{maintenance.deviceName}</p>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            maintenance.status === 'completed'
              ? 'bg-green-100 text-green-700'
              : 'bg-yellow-100 text-yellow-700'
          }`}
        >
          {maintenance.status === 'completed' ? '已完成' : '进行中'}
        </span>
      </div>
      <div className="space-y-1 text-sm text-gray-600 mb-4">
        <p>维修类型: {maintenance.type}</p>
        <p>维修员: {maintenance.maintainerName}</p>
        <p>班组: {maintenance.teamName}</p>
        {maintenance.startTime && (
          <p>开始时间: {new Date(maintenance.startTime).toLocaleString('zh-CN')}</p>
        )}
        {maintenance.completedTime && (
          <p>完成时间: {new Date(maintenance.completedTime).toLocaleString('zh-CN')}</p>
        )}
      </div>
      {maintenance.maintenanceDetails && (
        <p className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded line-clamp-3">
          {maintenance.maintenanceDetails}
        </p>
      )}
      <button
        onClick={() => onAction?.(maintenance)}
        className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-4 h-4" />
        {actionLabel}
      </button>
    </div>
  )
})
