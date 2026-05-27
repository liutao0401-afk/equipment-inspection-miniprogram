/**
 * 宸℃璁″垝鍗＄墖缁勪欢
 * 浣跨敤 React.memo 浼樺寲鎬ц兘
 */

import { memo } from 'react'
import { Plus } from 'lucide-react'
import type { InspectionPlan } from '../types'

interface InspectionPlanCardProps {
  plan: InspectionPlan
  onStartInspection?: (plan: InspectionPlan) => void
}

export const InspectionPlanCard = memo(function InspectionPlanCard({
  plan,
  onStartInspection,
}: InspectionPlanCardProps) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-gray-900">{plan.name}</h3>
          <p className="text-sm text-gray-600">{plan.code}</p>
        </div>
        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
          {plan.frequency}
        </span>
      </div>
      <div className="space-y-1 text-sm text-gray-600 mb-4">
        <p>绾胯矾: {plan.routeName}</p>
        <p>鐝粍: {plan.teamName}</p>
        <p>椤圭洰鏁? {plan.items?.length || 0}</p>
      </div>
      <button
        onClick={() => onStartInspection?.(plan)}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
      >
        <Plus className="w-4 h-4" />
        开始巡检
      </button>
    </div>
  )
})
