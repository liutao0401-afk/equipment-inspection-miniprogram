import { Settings, Info, Trash2, Shield } from 'lucide-react'
import { toast } from 'sonner'

export function SettingsPage() {
  const handleClearCache = () => {
    try {
      localStorage.clear()
      sessionStorage.clear()
      toast.success('缂撳瓨宸叉竻闄?)
    } catch (error) {
      toast.error('清除缓存澶辫触')
    }
  }

  const handleExportData = () => {
    try {
      const data = {
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
      toast.success('鏁版嵁宸插鍑?)
    } catch (error) {
      toast.error('导出数据澶辫触')
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
                <p className="font-medium text-gray-900">鑷姩淇濆瓨</p>
                <p className="text-sm text-gray-600">鑷姩淇濆瓨鑽夌</p>
              </div>
              <input type="checkbox" defaultChecked className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="bg-white rounded-lg p-6 border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">鏁版嵁绠＄悊</h2>
          <div className="space-y-3">
            <button
              onClick={handleExportData}
              className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-left"
            >
              <Shield className="w-5 h-5 text-blue-600" />
              <div>
                <p className="font-medium text-gray-900">导出数据</p>
                <p className="text-sm text-gray-600">瀵煎嚭涓汉鏁版嵁涓?JSON</p>
              </div>
            </button>
            <button
              onClick={handleClearCache}
              className="w-full flex items-center gap-3 p-3 bg-gray-50 hover:bg-gray-100 rounded-lg transition text-left"
            >
              <Trash2 className="w-5 h-5 text-red-600" />
              <div>
                <p className="font-medium text-gray-900">清除缓存</p>
                <p className="text-sm text-gray-600">娓呴櫎鏈湴瀛樺偍鐨勬暟鎹?/p>
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
              <span className="font-medium text-gray-900">璁惧宸℃灏忕▼搴?/span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">鐗堟湰鍙?/span>
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
              <p className="font-medium mb-1">绯荤粺淇℃伅</p>
              <p>灏忕▼搴忎笌 WEB 绔叡浜悓涓€数据库，鎵€鏈夋暟鎹疄鏃跺悓姝ャ/p>
              <p className="mt-2">濡傛湁闂锛岃鑱旂郴绯荤粺绠＄悊鍛樸/p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
