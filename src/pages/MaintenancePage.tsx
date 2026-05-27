import { useState, useEffect } from 'react'
import { Zap, CheckCircle, Clock } from 'lucide-react'
import { toast } from 'sonner'
import { maintenanceApi } from '../lib/api'
import { MaintenanceForm } from '../components/MaintenanceForm'
import type { Maintenance } from '../types'

export function MaintenancePage() {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed'>('pending')
  const [maintenance, setMaintenance] = useState<Maintenance[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMaintenance, setSelectedMaintenance] = useState<Maintenance | null>(null)
  const [showForm, setShowForm] = useState(false)

  useEffect(() => {
    loadMaintenance()
  }, [activeTab])

  const loadMaintenance = async () => {
    try {
      setIsLoading(true)
      const data = await maintenanceApi.list()
      const filtered = data.data.filter((m) =>
        activeTab === 'pending' ? m.status === 'in_progress' : m.status === 'completed'
      )
      setMaintenance(filtered)
    } catch (error) {
      console.error('Failed to load maintenance:', error)
      toast.error('加载维护列表失败')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSelectMaintenance = (item: Maintenance) => {
    setSelectedMaintenance(item)
    setShowForm(true)
  }

  const handleFormSuccess = () => {
    setShowForm(false)
    setSelectedMaintenance(null)
    loadMaintenance()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Zap className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">缁翠慨绠＄悊</h1>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200">
        <button
          onClick={() => setActiveTab('pending')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'pending'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          杩涜涓?
        </button>
        <button
          onClick={() => setActiveTab('completed')}
          className={`px-4 py-2 font-medium border-b-2 transition ${
            activeTab === 'completed'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-600 hover:text-gray-900'
          }`}
        >
          已完成
        </button>
      </div>

      {/* Form Modal */}
      {showForm && selectedMaintenance && (
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">瀹屾垚缁翠慨</h2>
            <button
              onClick={() => {
                setShowForm(false)
                setSelectedMaintenance(null)
              }}
              className="text-gray-500 hover:text-gray-700"
            >
              鉁?
            </button>
          </div>
          <MaintenanceForm maintenance={selectedMaintenance} onSuccess={handleFormSuccess} />
        </div>
      )}

      {/* Content */}
      {isLoading ? (
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
            <p className="text-gray-600">加载中...</p>
          </div>
        </div>
      ) : maintenance.length === 0 ? (
        <div className="text-center py-12">
          {activeTab === 'pending' ? (
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          ) : (
            <CheckCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          )}
          <p className="text-gray-500">
            {activeTab === 'pending' ? '鏆傛棤杩涜涓殑缁翠慨' : '暂无完成的维护'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {maintenance.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition"
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-semibold text-gray-900">{item.code}</h3>
                  <p className="text-sm text-gray-600">{item.deviceName}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  item.status === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : 'bg-yellow-100 text-yellow-700'
                }`}>
                  {item.status === 'completed' ? '已完成 : '杩涜涓?}
                </span>
              </div>
              <div className="space-y-1 text-sm text-gray-600 mb-4">
                <p>缁翠慨绫诲瀷: {item.type}</p>
                <p>缁翠慨鍛? {item.maintainerName}</p>
                <p>鐝粍: {item.teamName}</p>
                {item.startTime && (
                  <p>寮€濮嬫椂闂? {new Date(item.startTime).toLocaleString('zh-CN')}</p>
                )}
                {item.completedTime && (
                  <p>瀹屾垚鏃堕棿: {new Date(item.completedTime).toLocaleString('zh-CN')}</p>
                )}
              </div>
              {item.maintenanceDetails && (
                <p className="text-sm text-gray-600 mb-4 p-3 bg-gray-50 rounded">
                  {item.maintenanceDetails}
                </p>
              )}
              <button
                onClick={() => handleSelectMaintenance(item)}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 rounded-lg transition"
              >
                {activeTab === 'pending' ? '瀹屾垚缁翠慨' : '查看详情'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
