# 第 2 阶段：测试和优化计划

**日期**: 2026-05-23  
**版本**: 1.0.0  
**阶段**: 第 2 阶段 - 测试和优化

---

## 📋 阶段目标

1. **单元测试** - 为核心功能编写单元测试
2. **集成测试** - 测试页面交互和数据流
3. **性能优化** - 优化包大小和加载速度
4. **用户体验优化** - 改进加载动画、错误提示和反馈

---

## 🧪 测试计划

### 1. 单元测试设置

#### 1.1 安装测试依赖

```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom @testing-library/user-event
npm install --save-dev @vitest/ui jsdom
```

#### 1.2 配置 Vitest

创建 `vitest.config.ts`:
```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

#### 1.3 创建测试设置文件

创建 `src/test/setup.ts`:
```typescript
import '@testing-library/jest-dom'
import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'

// 清理每个测试后的 DOM
afterEach(() => {
  cleanup()
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
global.localStorage = localStorageMock as any
```

### 2. Stores 单元测试

#### 2.1 测试 InspectionStore

创建 `src/stores/__tests__/inspectionStore.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useInspectionStore } from '../inspectionStore'

describe('InspectionStore', () => {
  beforeEach(() => {
    // 重置 store
    const store = useInspectionStore()
    store.reset()
  })

  it('should initialize with default values', () => {
    const store = useInspectionStore()
    expect(store.plans).toEqual([])
    expect(store.records).toEqual([])
    expect(store.currentPlan).toBeNull()
    expect(store.recordItems).toEqual([])
  })

  it('should set plans', () => {
    const store = useInspectionStore()
    const mockPlans = [
      { id: 1, name: 'Plan 1', code: 'P001' },
    ]
    store.setPlans(mockPlans as any)
    expect(store.plans).toEqual(mockPlans)
  })

  it('should add record item', () => {
    const store = useInspectionStore()
    const mockItem = {
      id: 1,
      recordId: 0,
      itemId: 1,
      deviceId: 1,
      itemName: 'Item 1',
      result: 'OK',
      status: 'normal' as any,
      remarks: 'Good',
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    store.addRecordItem(mockItem)
    expect(store.recordItems).toHaveLength(1)
    expect(store.recordItems[0]).toEqual(mockItem)
  })

  it('should remove record item', () => {
    const store = useInspectionStore()
    const mockItem = {
      id: 1,
      recordId: 0,
      itemId: 1,
      deviceId: 1,
      itemName: 'Item 1',
      result: 'OK',
      status: 'normal' as any,
      remarks: 'Good',
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    store.addRecordItem(mockItem)
    expect(store.recordItems).toHaveLength(1)
    
    store.removeRecordItem(1)
    expect(store.recordItems).toHaveLength(0)
  })
})
```

#### 2.2 测试 RepairStore

创建 `src/stores/__tests__/repairStore.test.ts`:

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { useRepairStore } from '../repairStore'

describe('RepairStore', () => {
  beforeEach(() => {
    const store = useRepairStore()
    store.reset()
  })

  it('should initialize with default values', () => {
    const store = useRepairStore()
    expect(store.repairs).toEqual([])
    expect(store.selectedRepair).toBeNull()
  })

  it('should set repairs', () => {
    const store = useRepairStore()
    const mockRepairs = [
      { id: 1, code: 'R001', deviceName: 'Device 1' },
    ]
    store.setRepairs(mockRepairs as any)
    expect(store.repairs).toEqual(mockRepairs)
  })

  it('should add repair', () => {
    const store = useRepairStore()
    const mockRepair = {
      id: 1,
      code: 'R001',
      deviceName: 'Device 1',
      description: 'Broken',
      status: 'pending',
    }
    store.addRepair(mockRepair as any)
    expect(store.repairs).toHaveLength(1)
  })

  it('should update repair', () => {
    const store = useRepairStore()
    const mockRepair = {
      id: 1,
      code: 'R001',
      deviceName: 'Device 1',
      description: 'Broken',
      status: 'pending',
    }
    store.addRepair(mockRepair as any)
    store.updateRepair(1, { status: 'processing' })
    expect(store.repairs[0].status).toBe('processing')
  })
})
```

### 3. Hooks 单元测试

#### 3.1 测试 useInspection Hook

创建 `src/hooks/__tests__/useInspection.test.ts`:

```typescript
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useInspection } from '../useInspection'
import * as api from '../../lib/api'

vi.mock('../../lib/api')

describe('useInspection', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should load plans on mount', async () => {
    const mockPlans = [
      { id: 1, name: 'Plan 1', code: 'P001' },
    ]
    vi.spyOn(api.inspectionApi, 'listPlans').mockResolvedValue(mockPlans as any)

    const { result } = renderHook(() => useInspection())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.plans).toEqual(mockPlans)
  })

  it('should handle load plans error', async () => {
    const error = new Error('API Error')
    vi.spyOn(api.inspectionApi, 'listPlans').mockRejectedValue(error)

    const { result } = renderHook(() => useInspection())

    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 100))
    })

    expect(result.current.plans).toEqual([])
  })
})
```

### 4. 组件单元测试

#### 4.1 测试 InspectionForm

创建 `src/components/__tests__/InspectionForm.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InspectionForm } from '../InspectionForm'
import { useInspectionStore } from '../../stores/inspectionStore'

vi.mock('../../stores/inspectionStore')
vi.mock('../../hooks/useInspection')

describe('InspectionForm', () => {
  it('should render form fields', () => {
    render(<InspectionForm />)
    expect(screen.getByText('请先选择巡检计划')).toBeInTheDocument()
  })

  it('should display current plan info', () => {
    const mockPlan = {
      id: 1,
      name: 'Test Plan',
      code: 'P001',
      routeName: 'Route 1',
      teamName: 'Team 1',
      frequency: 'daily',
      items: [],
    }

    vi.mocked(useInspectionStore).mockReturnValue({
      currentPlan: mockPlan,
      recordItems: [],
      addRecordItem: vi.fn(),
      removeRecordItem: vi.fn(),
    } as any)

    render(<InspectionForm />)
    expect(screen.getByText('Test Plan')).toBeInTheDocument()
  })
})
```

#### 4.2 测试 RepairForm

创建 `src/components/__tests__/RepairForm.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { RepairForm } from '../RepairForm'
import { useRepair } from '../../hooks/useRepair'

vi.mock('../../hooks/useRepair')

describe('RepairForm', () => {
  it('should render form fields', () => {
    vi.mocked(useRepair).mockReturnValue({
      devices: [],
      searchQuery: '',
      createRepair: vi.fn(),
      setSearchQuery: vi.fn(),
    } as any)

    render(<RepairForm />)
    expect(screen.getByText('设备')).toBeInTheDocument()
    expect(screen.getByText('故障描述')).toBeInTheDocument()
    expect(screen.getByText('优先级')).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    vi.mocked(useRepair).mockReturnValue({
      devices: [],
      searchQuery: '',
      createRepair: vi.fn(),
      setSearchQuery: vi.fn(),
    } as any)

    render(<RepairForm />)
    const submitButton = screen.getByText('提交报修单')
    
    fireEvent.click(submitButton)
    
    // 应该显示验证错误
    expect(await screen.findByText('请选择设备')).toBeInTheDocument()
  })
})
```

### 5. 集成测试

#### 5.1 测试页面交互

创建 `src/pages/__tests__/InspectionPage.test.tsx`:

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { InspectionPage } from '../InspectionPage'
import { useInspection } from '../../hooks/useInspection'

vi.mock('../../hooks/useInspection')
vi.mock('../../stores/inspectionStore')

describe('InspectionPage', () => {
  it('should render tabs', () => {
    vi.mocked(useInspection).mockReturnValue({
      plans: [],
      records: [],
      loadPlans: vi.fn(),
      loadRecords: vi.fn(),
    } as any)

    render(<InspectionPage />)
    expect(screen.getByText('巡检计划')).toBeInTheDocument()
    expect(screen.getByText('巡检记录')).toBeInTheDocument()
  })

  it('should switch tabs', async () => {
    vi.mocked(useInspection).mockReturnValue({
      plans: [],
      records: [],
      loadPlans: vi.fn(),
      loadRecords: vi.fn(),
    } as any)

    render(<InspectionPage />)
    
    const recordsTab = screen.getByText('巡检记录')
    fireEvent.click(recordsTab)
    
    await waitFor(() => {
      expect(recordsTab).toHaveClass('border-blue-600')
    })
  })
})
```

---

## 🚀 性能优化

### 1. 代码分割

#### 1.1 路由级别的代码分割

更新 `src/App.tsx`:

```typescript
import { lazy, Suspense } from 'react'

const HomePage = lazy(() => import('./pages/HomePage'))
const InspectionPage = lazy(() => import('./pages/InspectionPage'))
const RepairPage = lazy(() => import('./pages/RepairPage'))
const MaintenancePage = lazy(() => import('./pages/MaintenancePage'))

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
    </div>
  )
}

// 在路由中使用
<Suspense fallback={<LoadingFallback />}>
  <Route path="/" element={<HomePage />} />
  <Route path="/inspection" element={<InspectionPage />} />
  <Route path="/repair" element={<RepairPage />} />
  <Route path="/maintenance" element={<MaintenancePage />} />
</Suspense>
```

### 2. 组件优化

#### 2.1 使用 React.memo

```typescript
import { memo } from 'react'

export const RepairCard = memo(function RepairCard({ repair }) {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200">
      {/* 卡片内容 */}
    </div>
  )
})
```

#### 2.2 使用 useCallback

```typescript
import { useCallback } from 'react'

export function RepairPage() {
  const handleFormSuccess = useCallback(() => {
    setShowCreateForm(false)
    loadRepairs()
  }, [])

  return (
    <RepairForm onSuccess={handleFormSuccess} />
  )
}
```

### 3. 包大小优化

#### 3.1 分析包大小

```bash
npm install --save-dev rollup-plugin-visualizer
```

更新 `vite.config.ts`:

```typescript
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
})
```

#### 3.2 优化依赖

- 使用 `date-fns` 的按需导入
- 使用 `lucide-react` 的树摇优化
- 移除未使用的 Tailwind CSS 类

---

## 💡 用户体验优化

### 1. 加载状态

#### 1.1 创建加载骨架屏

创建 `src/components/SkeletonLoader.tsx`:

```typescript
export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-20 animate-pulse" />
      ))}
    </div>
  )
}
```

#### 1.2 在页面中使用

```typescript
{isLoading ? (
  <SkeletonLoader />
) : (
  <div>{/* 实际内容 */}</div>
)}
```

### 2. 错误处理

#### 2.1 创建错误边界

创建 `src/components/ErrorBoundary.tsx`:

```typescript
import { Component, ReactNode } from 'react'
import { AlertCircle } from 'lucide-react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-900 mb-2">出错了</h1>
            <p className="text-gray-600">{this.state.error?.message}</p>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
```

### 3. 反馈提示

#### 3.1 优化 Toast 提示

```typescript
import { toast } from 'sonner'

// 成功提示
toast.success('操作成功', {
  duration: 2000,
  position: 'top-center',
})

// 错误提示
toast.error('操作失败', {
  duration: 3000,
  position: 'top-center',
})

// 加载提示
const id = toast.loading('加载中...')
setTimeout(() => {
  toast.success('加载完成', { id })
}, 2000)
```

---

## 📊 测试覆盖率目标

| 模块 | 目标覆盖率 |
|------|-----------|
| Stores | 90% |
| Hooks | 85% |
| Components | 80% |
| Pages | 70% |
| 总体 | 80% |

---

## 📝 测试脚本

更新 `package.json`:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint .",
    "type-check": "tsc --noEmit",
    "test": "vitest",
    "test:ui": "vitest --ui",
    "test:coverage": "vitest --coverage",
    "test:run": "vitest --run"
  }
}
```

---

## 🎯 完成标准

- ✅ 所有核心功能都有单元测试
- ✅ 测试覆盖率达到 80% 以上
- ✅ 所有测试通过
- ✅ 包大小优化到 < 150KB (gzip)
- ✅ 首屏加载时间 < 2 秒
- ✅ 所有页面都有加载状态
- ✅ 所有错误都有友好的提示

---

## ⏱️ 时间估计

| 任务 | 时间 |
|------|------|
| 测试框架设置 | 1 小时 |
| 单元测试编写 | 3 小时 |
| 集成测试编写 | 2 小时 |
| 性能优化 | 2 小时 |
| UX 优化 | 2 小时 |
| 总计 | 10 小时 |

---

**最后更新**: 2026-05-23  
**版本**: 1.0.0
