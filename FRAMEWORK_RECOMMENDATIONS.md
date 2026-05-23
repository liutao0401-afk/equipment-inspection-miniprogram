# 🚀 微信小程序框架推荐和实现计划

**文档日期**: 2026-05-23  
**版本**: 1.0.0

---

## 📋 目录

1. [推荐框架和库](#推荐框架和库)
2. [第 1 阶段：功能实现](#第-1-阶段功能实现)
3. [第 2 阶段：测试和优化](#第-2-阶段测试和优化)
4. [第 3 阶段：部署](#第-3-阶段部署)
5. [实现步骤](#实现步骤)

---

## 推荐框架和库

### 1. 表单管理和验证

#### **React Hook Form** + **Zod**
- **GitHub**: https://github.com/react-hook-form/react-hook-form
- **特点**:
  - 轻量级、高性能
  - 完整的 TypeScript 支持
  - 与 Zod 完美集成
  - 最小化重新渲染

#### **安装**
```bash
npm install react-hook-form zod @hookform/resolvers
```

#### **使用示例**
```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

// 定义验证 schema
const repairSchema = z.object({
  deviceId: z.number().min(1, '请选择设备'),
  description: z.string().min(10, '描述至少 10 个字符'),
  priority: z.enum(['low', 'medium', 'high']),
})

type RepairFormData = z.infer<typeof repairSchema>

export function RepairForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<RepairFormData>({
    resolver: zodResolver(repairSchema),
  })

  const onSubmit = async (data: RepairFormData) => {
    // 提交数据
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 表单字段 */}
    </form>
  )
}
```

---

### 2. 数据表格

#### **TanStack Table** + **shadcn/ui**
- **GitHub**: https://github.com/TanStack/table
- **特点**:
  - 无头 UI（完全可定制）
  - 支持排序、筛选、分页
  - TypeScript 优先
  - 轻量级

#### **安装**
```bash
npm install @tanstack/react-table
```

#### **使用示例**
```typescript
import { useReactTable, getCoreRowModel } from '@tanstack/react-table'

export function RepairTable({ data }) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  })

  return (
    <table>
      <thead>
        {table.getHeaderGroups().map(headerGroup => (
          <tr key={headerGroup.id}>
            {headerGroup.headers.map(header => (
              <th key={header.id}>
                {header.isPlaceholder ? null : header.renderHeader()}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody>
        {table.getRowModel().rows.map(row => (
          <tr key={row.id}>
            {row.getVisibleCells().map(cell => (
              <td key={cell.id}>{cell.renderCell()}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
```

---

### 3. 状态管理

#### **Zustand**
- **GitHub**: https://github.com/pmndrs/zustand
- **特点**:
  - 轻量级（仅 2KB）
  - 简单的 API
  - 完整的 TypeScript 支持
  - 无需 Provider

#### **安装**
```bash
npm install zustand
```

#### **使用示例**
```typescript
import { create } from 'zustand'

interface RepairStore {
  repairs: Repair[]
  selectedRepair: Repair | null
  setRepairs: (repairs: Repair[]) => void
  setSelectedRepair: (repair: Repair | null) => void
  addRepair: (repair: Repair) => void
}

export const useRepairStore = create<RepairStore>((set) => ({
  repairs: [],
  selectedRepair: null,
  setRepairs: (repairs) => set({ repairs }),
  setSelectedRepair: (repair) => set({ selectedRepair: repair }),
  addRepair: (repair) => set((state) => ({
    repairs: [...state.repairs, repair],
  })),
}))

// 在组件中使用
export function RepairList() {
  const { repairs, setSelectedRepair } = useRepairStore()
  
  return (
    <div>
      {repairs.map(repair => (
        <div key={repair.id} onClick={() => setSelectedRepair(repair)}>
          {repair.code}
        </div>
      ))}
    </div>
  )
}
```

---

### 4. 图片上传

#### **react-images-uploading**
- **GitHub**: https://github.com/vutoan266/react-images-uploading
- **特点**:
  - 简单易用
  - 支持预览
  - 支持拖拽
  - 完整的 TypeScript 支持

#### **安装**
```bash
npm install react-images-uploading
```

#### **使用示例**
```typescript
import ImageUploading, { ImageListType } from 'react-images-uploading'

export function ImageUploadComponent() {
  const [images, setImages] = useState<ImageListType>([])

  const onImageUpload = (imageList: ImageListType) => {
    setImages(imageList)
  }

  return (
    <ImageUploading
      value={images}
      onChange={onImageUpload}
      maxNumber={5}
      multiple
      acceptType={['jpg', 'png']}
    >
      {({ imageList, onImageUpload, onImageRemoveAll }) => (
        <div>
          <button onClick={onImageUpload}>上传图片</button>
          <div>
            {imageList.map((image, index) => (
              <div key={index}>
                <img src={image.dataURL} alt="" />
              </div>
            ))}
          </div>
        </div>
      )}
    </ImageUploading>
  )
}
```

---

### 5. 日期选择

#### **react-day-picker**
- **GitHub**: https://github.com/gpbl/react-day-picker
- **特点**:
  - 轻量级
  - 完整的 TypeScript 支持
  - 易于定制

#### **安装**
```bash
npm install react-day-picker date-fns
```

---

### 6. 通知/Toast

#### **sonner** (已使用)
- **GitHub**: https://github.com/emilkowalski/sonner
- **特点**:
  - 轻量级
  - 美观的 UI
  - 完整的 TypeScript 支持

---

## 第 1 阶段：功能实现 (1-2 周)

### 1.1 巡检功能

#### 文件结构
```
src/
├── pages/
│   └── InspectionPage.tsx (已有框架)
├── components/
│   ├── InspectionPlanCard.tsx (新建)
│   ├── InspectionForm.tsx (新建)
│   ├── InspectionItemList.tsx (新建)
│   └── InspectionPhotoUpload.tsx (新建)
├── hooks/
│   └── useInspection.ts (新建)
└── stores/
    └── inspectionStore.ts (新建)
```

#### 实现步骤

**步骤 1: 创建 Zustand Store**
```typescript
// src/stores/inspectionStore.ts
import { create } from 'zustand'
import type { InspectionPlan, InspectionRecord } from '../types'

interface InspectionStore {
  plans: InspectionPlan[]
  records: InspectionRecord[]
  currentPlan: InspectionPlan | null
  currentRecord: InspectionRecord | null
  
  setPlans: (plans: InspectionPlan[]) => void
  setCurrentPlan: (plan: InspectionPlan | null) => void
  addRecord: (record: InspectionRecord) => void
}

export const useInspectionStore = create<InspectionStore>((set) => ({
  plans: [],
  records: [],
  currentPlan: null,
  currentRecord: null,
  
  setPlans: (plans) => set({ plans }),
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  addRecord: (record) => set((state) => ({
    records: [...state.records, record],
  })),
}))
```

**步骤 2: 创建自定义 Hook**
```typescript
// src/hooks/useInspection.ts
import { useEffect } from 'react'
import { useInspectionStore } from '../stores/inspectionStore'
import { inspectionApi } from '../lib/api'
import { toast } from 'sonner'

export function useInspection() {
  const { setPlans } = useInspectionStore()

  const loadPlans = async () => {
    try {
      const plans = await inspectionApi.listPlans()
      setPlans(plans)
    } catch (error) {
      toast.error('加载巡检计划失败')
    }
  }

  useEffect(() => {
    loadPlans()
  }, [])

  return { loadPlans }
}
```

**步骤 3: 创建表单组件**
```typescript
// src/components/InspectionForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { inspectionApi } from '../lib/api'
import { toast } from 'sonner'

const inspectionSchema = z.object({
  planId: z.number().min(1, '请选择巡检计划'),
  items: z.array(z.object({
    itemId: z.number(),
    result: z.string().optional(),
    status: z.enum(['normal', 'abnormal']),
    remarks: z.string().optional(),
  })),
})

type InspectionFormData = z.infer<typeof inspectionSchema>

export function InspectionForm() {
  const { register, handleSubmit, formState: { errors } } = useForm<InspectionFormData>({
    resolver: zodResolver(inspectionSchema),
  })

  const onSubmit = async (data: InspectionFormData) => {
    try {
      await inspectionApi.execute({
        planId: data.planId,
        inspectorId: 1, // 从认证信息获取
        items: data.items,
      })
      toast.success('巡检记录已提交')
    } catch (error) {
      toast.error('提交失败')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 表单字段 */}
    </form>
  )
}
```

### 1.2 报修功能

#### 文件结构
```
src/
├── pages/
│   └── RepairPage.tsx (已有框架)
├── components/
│   ├── RepairForm.tsx (新建)
│   ├── RepairList.tsx (新建)
│   ├── RepairCard.tsx (新建)
│   └── RepairPhotoUpload.tsx (新建)
├── hooks/
│   └── useRepair.ts (新建)
└── stores/
    └── repairStore.ts (新建)
```

#### 实现步骤

**步骤 1: 创建 Zustand Store**
```typescript
// src/stores/repairStore.ts
import { create } from 'zustand'
import type { Repair } from '../types'

interface RepairStore {
  repairs: Repair[]
  selectedRepair: Repair | null
  
  setRepairs: (repairs: Repair[]) => void
  setSelectedRepair: (repair: Repair | null) => void
  addRepair: (repair: Repair) => void
  updateRepair: (id: number, repair: Partial<Repair>) => void
}

export const useRepairStore = create<RepairStore>((set) => ({
  repairs: [],
  selectedRepair: null,
  
  setRepairs: (repairs) => set({ repairs }),
  setSelectedRepair: (repair) => set({ selectedRepair: repair }),
  addRepair: (repair) => set((state) => ({
    repairs: [...state.repairs, repair],
  })),
  updateRepair: (id, repair) => set((state) => ({
    repairs: state.repairs.map((r) =>
      r.id === id ? { ...r, ...repair } : r
    ),
  })),
}))
```

**步骤 2: 创建表单组件**
```typescript
// src/components/RepairForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUploading from 'react-images-uploading'
import { repairApi, deviceApi } from '../lib/api'
import { toast } from 'sonner'

const repairSchema = z.object({
  deviceId: z.number().min(1, '请选择设备'),
  description: z.string().min(10, '描述至少 10 个字符'),
  priority: z.enum(['low', 'medium', 'high']),
  images: z.array(z.string()).optional(),
})

type RepairFormData = z.infer<typeof repairSchema>

export function RepairForm() {
  const [images, setImages] = useState([])
  const { register, handleSubmit, formState: { errors } } = useForm<RepairFormData>({
    resolver: zodResolver(repairSchema),
  })

  const onSubmit = async (data: RepairFormData) => {
    try {
      // 转换图片为 Base64
      const imageBase64 = images.map((img) => img.dataURL)
      
      await repairApi.create({
        deviceId: data.deviceId,
        description: data.description,
        priority: data.priority,
        images: imageBase64,
      })
      toast.success('报修单已创建')
    } catch (error) {
      toast.error('创建失败')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 表单字段 */}
      <ImageUploading
        value={images}
        onChange={setImages}
        maxNumber={5}
        multiple
      >
        {({ imageList, onImageUpload }) => (
          <div>
            <button type="button" onClick={onImageUpload}>
              上传图片
            </button>
            {/* 图片预览 */}
          </div>
        )}
      </ImageUploading>
    </form>
  )
}
```

### 1.3 维修功能

#### 文件结构
```
src/
├── pages/
│   └── MaintenancePage.tsx (已有框架)
├── components/
│   ├── MaintenanceList.tsx (新建)
│   ├── MaintenanceCard.tsx (新建)
│   ├── MaintenanceForm.tsx (新建)
│   └── MaintenancePhotoUpload.tsx (新建)
├── hooks/
│   └── useMaintenance.ts (新建)
└── stores/
    └── maintenanceStore.ts (新建)
```

#### 实现步骤

**步骤 1: 创建 Zustand Store**
```typescript
// src/stores/maintenanceStore.ts
import { create } from 'zustand'
import type { Maintenance } from '../types'

interface MaintenanceStore {
  maintenance: Maintenance[]
  selectedMaintenance: Maintenance | null
  
  setMaintenance: (maintenance: Maintenance[]) => void
  setSelectedMaintenance: (maintenance: Maintenance | null) => void
  updateMaintenance: (id: number, data: Partial<Maintenance>) => void
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({
  maintenance: [],
  selectedMaintenance: null,
  
  setMaintenance: (maintenance) => set({ maintenance }),
  setSelectedMaintenance: (maintenance) => set({ selectedMaintenance: maintenance }),
  updateMaintenance: (id, data) => set((state) => ({
    maintenance: state.maintenance.map((m) =>
      m.id === id ? { ...m, ...data } : m
    ),
  })),
}))
```

**步骤 2: 创建完成表单**
```typescript
// src/components/MaintenanceForm.tsx
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import ImageUploading from 'react-images-uploading'
import { maintenanceApi } from '../lib/api'
import { toast } from 'sonner'

const maintenanceSchema = z.object({
  maintenanceDetails: z.string().min(10, '维修详情至少 10 个字符'),
  images: z.array(z.string()).min(1, '至少上传一张照片'),
})

type MaintenanceFormData = z.infer<typeof maintenanceSchema>

export function MaintenanceForm({ maintenanceId }: { maintenanceId: number }) {
  const [images, setImages] = useState([])
  const { register, handleSubmit, formState: { errors } } = useForm<MaintenanceFormData>({
    resolver: zodResolver(maintenanceSchema),
  })

  const onSubmit = async (data: MaintenanceFormData) => {
    try {
      const imageBase64 = images.map((img) => img.dataURL)
      
      await maintenanceApi.complete(maintenanceId, {
        maintenanceDetails: data.maintenanceDetails,
        images: imageBase64,
      })
      toast.success('维修已完成')
    } catch (error) {
      toast.error('完成失败')
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* 表单字段 */}
    </form>
  )
}
```

---

## 第 2 阶段：测试和优化 (1 周)

### 2.1 单元测试

#### 安装依赖
```bash
npm install --save-dev vitest @testing-library/react @testing-library/jest-dom
```

#### 测试示例
```typescript
// src/components/__tests__/RepairForm.test.tsx
import { render, screen, fireEvent } from '@testing-library/react'
import { RepairForm } from '../RepairForm'

describe('RepairForm', () => {
  it('should render form fields', () => {
    render(<RepairForm />)
    expect(screen.getByText('设备')).toBeInTheDocument()
  })

  it('should validate required fields', async () => {
    render(<RepairForm />)
    const submitButton = screen.getByText('提交')
    fireEvent.click(submitButton)
    
    expect(await screen.findByText('请选择设备')).toBeInTheDocument()
  })
})
```

### 2.2 性能优化

- 使用 React.memo 优化组件
- 使用 useCallback 缓存函数
- 使用 useMemo 缓存计算结果
- 代码分割和懒加载

### 2.3 用户体验优化

- 添加加载动画
- 添加错误提示
- 添加成功反馈
- 优化移动端体验

---

## 第 3 阶段：部署 (1 周)

### 3.1 构建

```bash
npm run build
```

### 3.2 微信小程序上传

1. 使用微信开发者工具打开 `dist` 目录
2. 上传到微信小程序平台
3. 提交审核

### 3.3 版本管理

```bash
git tag -a v1.0.0 -m "Release version 1.0.0"
git push origin v1.0.0
```

---

## 实现步骤

### 快速开始

#### 1. 安装所有推荐的库

```bash
npm install react-hook-form zod @hookform/resolvers
npm install @tanstack/react-table
npm install zustand
npm install react-images-uploading
npm install react-day-picker date-fns
```

#### 2. 创建项目结构

```bash
mkdir -p src/stores
mkdir -p src/hooks
mkdir -p src/components/__tests__
```

#### 3. 创建 Store 文件

```bash
touch src/stores/inspectionStore.ts
touch src/stores/repairStore.ts
touch src/stores/maintenanceStore.ts
```

#### 4. 创建 Hook 文件

```bash
touch src/hooks/useInspection.ts
touch src/hooks/useRepair.ts
touch src/hooks/useMaintenance.ts
```

#### 5. 创建组件文件

```bash
touch src/components/InspectionForm.tsx
touch src/components/RepairForm.tsx
touch src/components/MaintenanceForm.tsx
```

#### 6. 开始开发

```bash
npm run dev
```

---

## 参考资源

### 官方文档
- [React Hook Form](https://react-hook-form.com/)
- [Zod](https://zod.dev/)
- [TanStack Table](https://tanstack.com/table/latest)
- [Zustand](https://github.com/pmndrs/zustand)
- [react-images-uploading](https://github.com/vutoan266/react-images-uploading)

### 示例项目
- [React Hook Form Examples](https://github.com/react-hook-form/react-hook-form/tree/master/examples)
- [TanStack Table Examples](https://github.com/TanStack/table/tree/main/examples)
- [Zustand Examples](https://github.com/pmndrs/zustand/tree/main/examples)

---

## 总结

通过使用这些推荐的框架和库，你可以：

✅ **快速开发** - 使用成熟的库加快开发速度  
✅ **类型安全** - 完整的 TypeScript 支持  
✅ **易于维护** - 清晰的代码结构  
✅ **高性能** - 优化的渲染和状态管理  
✅ **易于测试** - 易于编写单元测试  

---

**最后更新**: 2026-05-23  
**版本**: 1.0.0

