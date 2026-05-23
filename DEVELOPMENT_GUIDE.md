# 微信小程序开发指南

## 📱 项目概述

这是一个与 WEB 端共享同一数据库的微信小程序项目。所有数据通过统一的 API 接口进行同步，确保数据一致性。

**项目位置**: `d:\equipment-inspection-system\equipment-inspection-miniprogram`

---

## 🚀 快速开始

### 1. 安装依赖

```bash
cd d:\equipment-inspection-system\equipment-inspection-miniprogram
npm install
```

### 2. 开发模式

```bash
npm run dev
```

访问: http://localhost:5173

### 3. 构建

```bash
npm run build
```

---

## 📂 项目结构

```
src/
├── pages/                      # 页面组件
│   ├── LoginPage.tsx          # 登录页面 ✅
│   ├── HomePage.tsx           # 首页 ✅
│   ├── InspectionPage.tsx     # 巡检页面 (待开发)
│   ├── RepairPage.tsx         # 报修页面 (待开发)
│   ├── MaintenancePage.tsx    # 维修页面 (待开发)
│   ├── ProfilePage.tsx        # 个人信息页面 (待开发)
│   ├── NotificationsPage.tsx  # 通知页面 (待开发)
│   └── SettingsPage.tsx       # 设置页面 (待开发)
│
├── components/                 # 可复用组件
│   ├── MainLayout.tsx         # 主布局 ✅
│   ├── DeviceCard.tsx         # 设备卡片 (待开发)
│   ├── RepairCard.tsx         # 报修卡片 (待开发)
│   ├── MaintenanceCard.tsx    # 维修卡片 (待开发)
│   └── ...
│
├── lib/                        # 工具库
│   ├── api.ts                 # API 服务 ✅
│   ├── request.ts             # 网络请求 ✅
│   ├── storage.ts             # 本地存储 ✅
│   └── utils.ts               # 工具函数 (待开发)
│
├── config/                     # 配置文件
│   └── env.ts                 # 环境配置 ✅
│
├── types/                      # 类型定义
│   └── index.ts               # 核心类型 ✅
│
├── App.tsx                     # 应用入口 ✅
├── index.css                   # 全局样式
└── main.tsx                    # 程序入口
```

---

## 🔧 已完成的工作

### ✅ 核心基础设施
- [x] 环境配置 (`src/config/env.ts`)
- [x] 类型定义 (`src/types/index.ts`)
- [x] API 服务 (`src/lib/api.ts`)
- [x] 网络请求 (`src/lib/request.ts`)
- [x] 本地存储 (`src/lib/storage.ts`)

### ✅ 页面和组件
- [x] 应用入口 (`src/App.tsx`)
- [x] 主布局 (`src/components/MainLayout.tsx`)
- [x] 登录页面 (`src/pages/LoginPage.tsx`)
- [x] 首页 (`src/pages/HomePage.tsx`)

### 📝 待开发的页面

#### 1. 巡检页面 (`src/pages/InspectionPage.tsx`)
**功能**:
- 显示巡检计划列表
- 选择计划开始巡检
- 逐个设备录入巡检数据
- 拍照上传
- 提交巡检记录

**API 调用**:
```typescript
inspectionApi.listPlans()           // 获取计划列表
inspectionApi.getPlan(id)           // 获取计划详情
inspectionApi.execute(payload)      // 提交巡检记录
inspectionApi.listRecords()         // 获取巡检记录
```

**数据模型**:
```typescript
InspectionPlan
InspectionItem
InspectionRecord
InspectionRecordItem
```

#### 2. 报修页面 (`src/pages/RepairPage.tsx`)
**功能**:
- 显示报修单列表
- 创建新报修单
- 选择设备
- 填写故障描述
- 拍照上传
- 查看报修详情

**API 调用**:
```typescript
repairApi.list()                    // 获取报修单列表
repairApi.get(id)                   // 获取报修单详情
repairApi.create(payload)           // 创建报修单
repairApi.updateStatus(id, payload) // 更新报修单状态
deviceApi.search(query)             // 搜索设备
```

**数据模型**:
```typescript
Repair
CreateRepairRequest
UpdateRepairStatusRequest
```

#### 3. 维修页面 (`src/pages/MaintenancePage.tsx`)
**功能**:
- 显示待维修列表
- 接单维修任务
- 填写维修详情
- 拍照上传
- 标记完成

**API 调用**:
```typescript
maintenanceApi.list()               // 获取维修列表
maintenanceApi.get(id)              // 获取维修详情
maintenanceApi.accept(repairId)     // 接单
maintenanceApi.complete(id, payload) // 完成维修
```

**数据模型**:
```typescript
Maintenance
CompleteMaintenance Request
```

#### 4. 个人信息页面 (`src/pages/ProfilePage.tsx`)
**功能**:
- 显示用户信息
- 显示班组信息
- 显示权限信息
- 修改密码（可选）

**API 调用**:
```typescript
authApi.getProfile()                // 获取用户信息
```

**数据模型**:
```typescript
User
```

#### 5. 通知页面 (`src/pages/NotificationsPage.tsx`)
**功能**:
- 显示通知列表
- 标记为已读
- 标记全部已读
- 删除通知

**API 调用**:
```typescript
notificationApi.list()              // 获取通知列表
notificationApi.markAsRead(id)      // 标记为已读
notificationApi.markAllAsRead()     // 标记全部已读
```

**数据模型**:
```typescript
Notification
NotificationListResponse
```

#### 6. 设置页面 (`src/pages/SettingsPage.tsx`)
**功能**:
- 应用设置
- 关于应用
- 版本信息
- 清除缓存

---

## 🛠️ 开发步骤

### 第 1 步: 创建页面框架

```typescript
import React, { useState, useEffect } from 'react'
import { toast } from 'sonner'
import type { User } from '../types'

interface PageProps {
  user: User
}

export function PageName({ user }: PageProps) {
  const [data, setData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setIsLoading(true)
      // 调用 API
      // const result = await api.method()
      // setData(result)
    } catch (error) {
      console.error('Error:', error)
      toast.error('加载失败')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      {/* 页面内容 */}
    </div>
  )
}
```

### 第 2 步: 调用 API

```typescript
import { repairApi, deviceApi } from '../lib/api'

// 获取列表
const repairs = await repairApi.list(page, pageSize)

// 创建
const newRepair = await repairApi.create({
  deviceId: 1,
  description: '故障描述',
  images: ['base64_image_data'],
})

// 更新
const updated = await repairApi.updateStatus(id, {
  status: 'processing',
})
```

### 第 3 步: 处理图片

```typescript
// 拍照或选择图片
const handleImageCapture = async () => {
  // 使用 input[type="file"] 或相机 API
  const file = await selectImage()
  
  // 转换为 Base64
  const base64 = await fileToBase64(file)
  
  // 上传
  const result = await repairApi.create({
    deviceId: 1,
    description: '故障',
    images: [base64],
  })
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}
```

### 第 4 步: 创建组件

```typescript
// src/components/RepairCard.tsx
import React from 'react'
import type { Repair } from '../types'

interface RepairCardProps {
  repair: Repair
  onClick?: () => void
}

export function RepairCard({ repair, onClick }: RepairCardProps) {
  return (
    <div
      onClick={onClick}
      className="bg-white rounded-lg p-4 border border-gray-200 hover:shadow-md transition cursor-pointer"
    >
      <div className="flex justify-between items-start mb-2">
        <h3 className="font-semibold text-gray-900">{repair.code}</h3>
        <span className={`text-xs px-2 py-1 rounded-full ${
          repair.status === 'pending' ? 'bg-red-100 text-red-700' :
          repair.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
          'bg-green-100 text-green-700'
        }`}>
          {repair.status}
        </span>
      </div>
      <p className="text-sm text-gray-600">{repair.deviceName}</p>
      <p className="text-sm text-gray-500 mt-2">{repair.description}</p>
    </div>
  )
}
```

---

## 📡 API 端点

### 认证
```
POST   /api/auth/login              # 登录
POST   /api/auth/logout             # 登出
GET    /api/auth/profile            # 获取用户信息
```

### 设备
```
GET    /api/devices                 # 获取设备列表
GET    /api/devices/:id             # 获取设备详情
GET    /api/devices/search?q=...    # 搜索设备
```

### 巡检
```
GET    /api/inspection/plans        # 获取巡检计划
GET    /api/inspection/plans/:id    # 获取计划详情
POST   /api/inspection/execute      # 提交巡检记录
GET    /api/inspection/records      # 获取巡检记录
GET    /api/inspection/records/:id  # 获取记录详情
```

### 报修
```
GET    /api/repairs                 # 获取报修单列表
GET    /api/repairs/:id             # 获取报修单详情
POST   /api/repairs                 # 创建报修单
PUT    /api/repairs/:id             # 更新报修单
```

### 维修
```
GET    /api/maintenance             # 获取维修列表
GET    /api/maintenance/:id         # 获取维修详情
POST   /api/maintenance/from-repair # 接单
PUT    /api/maintenance/:id         # 完成维修
```

### 统计
```
GET    /api/stats/dashboard         # 获取仪表板统计
GET    /api/stats/trend?days=7      # 获取趋势数据
GET    /api/stats/distribution      # 获取分布数据
```

### 通知
```
GET    /api/notifications           # 获取通知列表
PUT    /api/notifications/:id/read  # 标记为已读
PUT    /api/notifications/read-all  # 标记全部已读
```

---

## 🎨 UI 组件库

项目使用 Tailwind CSS v4 进行样式设计。

### 常用类名

```css
/* 布局 */
.flex .flex-col .grid .gap-4

/* 颜色 */
.bg-blue-50 .text-blue-600 .border-blue-200

/* 圆角 */
.rounded-lg .rounded-full

/* 阴影 */
.shadow-sm .shadow-md .shadow-lg

/* 响应式 */
.md:flex .lg:grid .sm:hidden

/* 过渡 */
.transition .hover:bg-gray-100
```

### 常用图标 (lucide-react)

```typescript
import {
  Home,
  ClipboardCheck,
  Wrench,
  Bell,
  User,
  LogOut,
  AlertCircle,
  CheckCircle,
  Clock,
  Zap,
  Camera,
  Upload,
  Download,
  Edit,
  Trash2,
  Search,
  Filter,
  Plus,
  X,
  Menu,
  ChevronRight,
} from 'lucide-react'
```

---

## 🔄 数据同步

### 与 WEB 端共享数据库

所有数据通过统一的 API 接口进行同步：

1. **登录时**: 获取用户信息和权限
2. **操作时**: 实时更新数据库
3. **查询时**: 获取最新数据
4. **离线时**: 使用本地缓存（可选）

### 数据一致性保证

- 所有修改都通过 API 进行
- 使用 JWT token 进行身份验证
- 服务器端进行数据验证
- 时间戳记录所有操作

---

## 🧪 测试账号

| 用户名 | 密码 | 角色 | 班组 |
|--------|------|------|------|
| inspector | 123456 | 巡检员 | 巡检一班 |
| maintenance | 123456 | 维修员 | 维修班 |
| admin | 123456 | 管理员 | - |

---

## 📝 开发检查清单

- [ ] 创建 InspectionPage.tsx
- [ ] 创建 RepairPage.tsx
- [ ] 创建 MaintenancePage.tsx
- [ ] 创建 ProfilePage.tsx
- [ ] 创建 NotificationsPage.tsx
- [ ] 创建 SettingsPage.tsx
- [ ] 创建 DeviceCard 组件
- [ ] 创建 RepairCard 组件
- [ ] 创建 MaintenanceCard 组件
- [ ] 创建 ImageUpload 组件
- [ ] 创建 utils.ts 工具函数
- [ ] 测试所有 API 调用
- [ ] 测试图片上传
- [ ] 测试数据同步
- [ ] 测试离线功能（可选）
- [ ] 性能优化
- [ ] 错误处理
- [ ] 用户体验优化

---

## 🚀 部署

### 开发环境
```bash
npm run dev
```

### 生产构建
```bash
npm run build
```

### 微信小程序上传
1. 构建项目: `npm run build`
2. 使用微信开发者工具打开 `dist` 目录
3. 上传到微信小程序平台

---

## 📚 相关文档

- [README.md](./README.md) - 项目概述
- [QUICK_START.md](./QUICK_START.md) - 快速开始
- [GITHUB_READY.md](./GITHUB_READY.md) - GitHub 上传指南

---

## 💡 最佳实践

1. **错误处理**: 使用 try-catch 和 toast 提示
2. **加载状态**: 显示加载动画
3. **数据缓存**: 使用 localStorage 缓存数据
4. **响应式设计**: 使用 Tailwind 的响应式类
5. **类型安全**: 使用 TypeScript 类型
6. **代码复用**: 创建可复用组件
7. **性能优化**: 使用 React.memo 和 useCallback
8. **用户体验**: 提供清晰的反馈和提示

---

**最后更新**: 2026-05-23  
**版本**: 1.0.0  
**状态**: 开发中

