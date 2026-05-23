/**
 * 骨架屏加载器组件
 * 用于在数据加载时显示占位符
 */

export function SkeletonLoader() {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="space-y-3">
          <div className="bg-gray-200 rounded-lg h-12 animate-pulse" />
          <div className="bg-gray-200 rounded-lg h-4 w-3/4 animate-pulse" />
          <div className="bg-gray-200 rounded-lg h-4 w-1/2 animate-pulse" />
        </div>
      ))}
    </div>
  )
}

export function SkeletonCard() {
  return (
    <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
      <div className="bg-gray-200 rounded-lg h-6 w-1/2 animate-pulse" />
      <div className="space-y-2">
        <div className="bg-gray-200 rounded-lg h-4 animate-pulse" />
        <div className="bg-gray-200 rounded-lg h-4 w-5/6 animate-pulse" />
      </div>
      <div className="bg-gray-200 rounded-lg h-10 animate-pulse" />
    </div>
  )
}

export function SkeletonTable() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-gray-200 rounded-lg h-12 animate-pulse" />
      ))}
    </div>
  )
}
