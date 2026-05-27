import { UserIcon, Mail, Phone, Users } from 'lucide-react'

export function ProfilePage() {

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <UserIcon className="w-8 h-8 text-blue-600" />
        <h1 className="text-2xl font-bold text-gray-900">涓汉淇℃伅</h1>
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-lg p-6 border border-gray-200">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center">
            <UserIcon className="w-8 h-8 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">鐢ㄦ埛淇℃伅</h2>
            <p className="text-gray-600">涓汉璧勬枡</p>
          </div>
        </div>

        <div className="space-y-4">
          {/* Username */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <UserIcon className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">用户名/p>
              <p className="text-gray-900 font-medium">鐢ㄦ埛</p>
            </div>
          </div>

          {/* Role */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">角色</p>
              <p className="text-gray-900 font-medium">宸℃鍛?/p>
            </div>
          </div>

          {/* Team */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">鐝粍</p>
              <p className="text-gray-900 font-medium">鐝粍淇℃伅</p>
            </div>
          </div>

          {/* Email */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Mail className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">閭</p>
              <p className="text-gray-900 font-medium">user@example.com</p>
            </div>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Phone className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-xs text-gray-500">鐢佃瘽</p>
              <p className="text-gray-900 font-medium">+86 10 1234 5678</p>
            </div>
          </div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium mb-1">馃挕 提示</p>
        <p>濡傞渶淇敼涓汉淇℃伅锛岃鑱旂郴绠＄悊鍛樸/p>
      </div>
    </div>
  )
}
