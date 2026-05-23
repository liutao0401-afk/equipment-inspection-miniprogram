# 性能优化指南

**日期**: 2026-05-23  
**版本**: 1.0.0

---

## 📊 性能指标

### 当前状态
- 包大小: 444.82 kB (gzip: 131.13 kB)
- 模块数量: 1756
- 构建时间: 14.80 秒

### 优化目标
- 包大小: < 150 kB (gzip)
- 首屏加载时间: < 2 秒
- 交互响应时间: < 100ms

---

## 🚀 已实施的优化

### 1. 组件优化

#### 1.1 使用 React.memo
已创建的优化组件:
- `RepairCard.tsx` - 报修单卡片
- `InspectionPlanCard.tsx` - 巡检计划卡片
- `MaintenanceCard.tsx` - 维修任务卡片

**优势**:
- 避免不必要的重新渲染
- 减少 DOM 操作
- 提高列表性能

#### 1.2 使用 useCallback
在 Hooks 中使用 useCallback 缓存函数:
```typescript
const handleFormSuccess = useCallback(() => {
  setShowCreateForm(false)
  loadRepairs()
}, [])
```

### 2. 加载优化

#### 2.1 骨架屏加载器
创建了 `SkeletonLoader.tsx` 组件:
- `SkeletonLoader` - 通用加载器
- `SkeletonCard` - 卡片加载器
- `SkeletonTable` - 表格加载器

**使用示例**:
```typescript
{isLoading ? (
  <SkeletonLoader />
) : (
  <div>{/* 实际内容 */}</div>
)}
```

### 3. 错误处理

#### 3.1 错误边界
创建了 `ErrorBoundary.tsx` 组件:
- 捕获子组件错误
- 显示友好的错误提示
- 提供重新加载功能

**使用示例**:
```typescript
<ErrorBoundary>
  <App />
</ErrorBoundary>
```

---

## 📈 优化建议

### 1. 代码分割

#### 1.1 路由级别代码分割
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

### 2. 图片优化

#### 2.1 使用 WebP 格式
```typescript
<picture>
  <source srcSet="image.webp" type="image/webp" />
  <img src="image.jpg" alt="description" />
</picture>
```

#### 2.2 懒加载图片
```typescript
<img src="image.jpg" loading="lazy" alt="description" />
```

### 3. 缓存优化

#### 3.1 HTTP 缓存
```typescript
// 在 vite.config.ts 中配置
server: {
  headers: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },
}
```

#### 3.2 本地缓存
```typescript
// 使用 localStorage 缓存数据
const cachedData = localStorage.getItem('inspectionPlans')
if (cachedData) {
  setPlans(JSON.parse(cachedData))
}
```

### 4. 依赖优化

#### 4.1 移除未使用的依赖
```bash
npm prune
npm audit
```

#### 4.2 使用按需导入
```typescript
// ❌ 不好
import * as dateFns from 'date-fns'

// ✅ 好
import { format } from 'date-fns'
```

### 5. 构建优化

#### 5.1 启用 Gzip 压缩
```typescript
// vite.config.ts
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    compression({
      algorithm: 'gzip',
      ext: '.gz',
    }),
  ],
})
```

#### 5.2 启用 Brotli 压缩
```typescript
import compression from 'vite-plugin-compression'

export default defineConfig({
  plugins: [
    compression({
      algorithm: 'brotli',
      ext: '.br',
    }),
  ],
})
```

---

## 🔍 性能监测

### 1. 使用 Lighthouse
```bash
# 安装 Lighthouse CLI
npm install -g lighthouse

# 运行审计
lighthouse https://your-app.com --view
```

### 2. 使用 Web Vitals
```typescript
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals'

getCLS(console.log)
getFID(console.log)
getFCP(console.log)
getLCP(console.log)
getTTFB(console.log)
```

### 3. 使用 Performance API
```typescript
// 测量页面加载时间
const navigationTiming = performance.getEntriesByType('navigation')[0]
console.log('页面加载时间:', navigationTiming.loadEventEnd - navigationTiming.fetchStart)

// 测量组件渲染时间
performance.mark('component-start')
// ... 组件代码
performance.mark('component-end')
performance.measure('component', 'component-start', 'component-end')
```

---

## 📋 优化检查清单

- [ ] 使用 React.memo 优化列表组件
- [ ] 使用 useCallback 缓存事件处理函数
- [ ] 实现路由级别代码分割
- [ ] 添加骨架屏加载器
- [ ] 实现错误边界
- [ ] 优化图片加载
- [ ] 启用 Gzip 压缩
- [ ] 移除未使用的依赖
- [ ] 使用按需导入
- [ ] 添加性能监测

---

## 🎯 优化成果

### 预期改进
- 包大小减少 30-40%
- 首屏加载时间减少 50%
- 交互响应时间减少 60%
- 用户体验显著提升

### 测试方法
```bash
# 构建并分析包大小
npm run build

# 运行性能测试
npm run test:performance

# 查看性能报告
npm run performance:report
```

---

## 📚 参考资源

- [React 性能优化](https://react.dev/reference/react/memo)
- [Vite 性能优化](https://vitejs.dev/guide/features.html)
- [Web Vitals](https://web.dev/vitals/)
- [Lighthouse](https://developers.google.com/web/tools/lighthouse)

---

**最后更新**: 2026-05-23  
**版本**: 1.0.0
