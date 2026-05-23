import { useState } from 'react'
import { ClipboardCheck, Plus, Eye, ChevronRight } from 'lucide-react'
import { useInspection } from '../hooks/useInspection'
import { useInspectionStore } from '../stores/inspectionStore'
import { InspectionForm } from '../components/InspectionForm'

export function InspectionPage() {
  const [activeTab, setActiveTab] = useState<'plans' | 'records' | 'execute'>('plans')
  const { plans, records } = useInspection()
  const { currentPlan, setCurrentPlan, isLoading } = useInspectionStore()

  const handleStartInspection = (planId: number) => {
    const plan = plans.find((p) => p.id === planId)
    if (plan) {
      setCurrentPlan(plan)
      setActiveTab('execute')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <ClipboardCheck className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">巡检管理</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'plans'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          巡检计划
        </button>
        <button
          onClick={() => setActiveTab('records')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'records'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          巡检记录
        </button>
        {currentPlan && (
          <button
            onClick={() => setActiveTab('execute')}
            className={`px-4 py-2 font-medium border-b-2 transition ${
              activeTab === 'execute'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-gray-600 hover:text-gray-900'
            }`}
          >
            执行巡检
          </button>
        )}
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      ) : activeTab === 'plans' ? (
        <div className="space-y-4">
          {plans.length === 0 ? (
            <div className="text-center py-12">
              <ClipboardCheck className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无巡检计划</p>
            </div>
          ) : (
            plans.map((plan) => (
              <div
                key={plan.id}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition"
              >
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
                  <p>线路: {plan.routeName}</p>
                  <p>班组: {plan.teamName}</p>
                  <p>项目数: {plan.items?.length || 0}</p>
                </div>
                <button
                  onClick={() => handleStartInspection(plan.id)}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  开始巡检
                </button>
              </div>
            ))
          )}
        </div>
      ) : activeTab === 'records' ? (
        <div className="space-y-4">
          {records.length === 0 ? (
            <div className="text-center py-12">
              <Eye className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">暂无巡检记录</p>
            </div>
          ) : (
            records.map((record) => (
              <div
                key={record.id}
                className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="font-semibold text-gray-900">{record.planName}</h3>
                    <p className="text-sm text-gray-600">{record.inspectorName}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      record.status === 'completed'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-yellow-100 text-yellow-700'
                    }`}
                  >
                    {record.status === 'completed' ? '已完成' : '进行中'}
                  </span>
                </div>
                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <p>班组: {record.teamName}</p>
                  <p>开始时间: {new Date(record.startTime).toLocaleString('zh-CN')}</p>
                  <p>异常项: {record.abnormalCount}</p>
                </div>
                <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition flex items-center justify-center gap-2">
                  查看详情
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      ) : (
        <InspectionForm />
      )}
    </div>
  )
}
