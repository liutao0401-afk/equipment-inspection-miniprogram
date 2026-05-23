import { useState } from 'react'
import { useInspectionStore } from '../stores/inspectionStore'
import { useInspection } from '../hooks/useInspection'
import { CheckCircle, AlertCircle, Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

export function InspectionForm() {
  const { currentPlan, recordItems, addRecordItem, removeRecordItem } =
    useInspectionStore()
  const { submitInspection } = useInspection()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [newItem, setNewItem] = useState<{
    itemId: number
    result: string
    status: 'normal' | 'abnormal'
    remarks: string
  }>({
    itemId: 0,
    result: '',
    status: 'normal',
    remarks: '',
  })

  if (!currentPlan) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <p className="text-gray-500">请先选择巡检计划</p>
      </div>
    )
  }

  const handleAddItem = () => {
    if (!newItem.itemId) {
      toast.error('请选择巡检项')
      return
    }

    const item = {
      id: Date.now(),
      recordId: 0,
      itemId: newItem.itemId,
      deviceId: 0,
      itemName: currentPlan.items?.find((i) => i.id === newItem.itemId)?.name || '',
      result: newItem.result,
      status: newItem.status === 'abnormal' ? 'abnormal' : 'normal',
      remarks: newItem.remarks,
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as any

    addRecordItem(item)
    setNewItem({ itemId: 0, result: '', status: 'normal', remarks: '' })
    toast.success('巡检项已添加')
  }

  const handleSubmit = async () => {
    if (recordItems.length === 0) {
      toast.error('请至少添加一个巡检项')
      return
    }

    try {
      setIsSubmitting(true)
      // 这里需要从认证信息获取 inspectorId
      const inspectorId = 1 // 临时使用
      await submitInspection(currentPlan.id, inspectorId)
    } catch (error) {
      console.error('Submit error:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* 计划信息 */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">{currentPlan.name}</h2>
        <div className="space-y-2 text-sm text-gray-600">
          <p>线路: {currentPlan.routeName}</p>
          <p>班组: {currentPlan.teamName}</p>
          <p>周期: {currentPlan.frequency}</p>
        </div>
      </div>

      {/* 添加巡检项 */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">添加巡检项</h3>
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">巡检项</label>
            <select
              value={newItem.itemId}
              onChange={(e) => setNewItem({ ...newItem, itemId: Number(e.target.value) })}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value={0}>请选择巡检项</option>
              {currentPlan.items?.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">检查结果</label>
            <input
              type="text"
              value={newItem.result}
              onChange={(e) => setNewItem({ ...newItem, result: e.target.value })}
              placeholder="输入检查结果"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">状态</label>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="normal"
                  checked={newItem.status === 'normal'}
                  onChange={(e) => setNewItem({ ...newItem, status: e.target.value as any })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">正常</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  value="abnormal"
                  checked={newItem.status === 'abnormal'}
                  onChange={(e) => setNewItem({ ...newItem, status: e.target.value as any })}
                  className="w-4 h-4"
                />
                <span className="text-sm text-gray-700">异常</span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">备注</label>
            <textarea
              value={newItem.remarks}
              onChange={(e) => setNewItem({ ...newItem, remarks: e.target.value })}
              placeholder="输入备注信息"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            onClick={handleAddItem}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            添加巡检项
          </button>
        </div>
      </div>

      {/* 巡检项列表 */}
      <div className="bg-white rounded-lg p-4 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          巡检项列表 ({recordItems.length})
        </h3>
        {recordItems.length === 0 ? (
          <p className="text-center text-gray-500 py-8">暂无巡检项</p>
        ) : (
          <div className="space-y-3">
            {recordItems.map((item) => (
              <div key={item.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-medium text-gray-900">{item.itemName}</h4>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        item.status === 'normal'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.status === 'normal' ? '正常' : '异常'}
                    </span>
                  </div>
                  {item.result && <p className="text-sm text-gray-600">结果: {item.result}</p>}
                  {item.remarks && <p className="text-sm text-gray-600">备注: {item.remarks}</p>}
                </div>
                <button
                  onClick={() => removeRecordItem(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 提交按钮 */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || recordItems.length === 0}
        className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 rounded-lg transition flex items-center justify-center gap-2"
      >
        <CheckCircle className="w-5 h-5" />
        {isSubmitting ? '提交中...' : '提交巡检记录'}
      </button>
    </div>
  )
}
