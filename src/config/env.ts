// 微信小程序环境配置
// 开发环境: http://localhost:3000 (本地开发)
// 内网: http://192.188.88.48:3000
// 外网: https://weixin.hazlai.com

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// 根据环境确定 API 基础 URL
// 开发环境使用 localhost:3000，与 WEB 端共享同一个 API
export const API_BASE_URL = isDevelopment
  ? 'http://localhost:3000/api' // 开发环境使用本地 API (与 WEB 端共享)
  : isProduction
    ? 'https://weixin.hazlai.com/api' // 生产环境使用外网 HTTPS
    : 'http://192.188.88.48:3000/api' // 内网环境

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

// 应用配置
export const APP_CONFIG = {
  name: '设备巡检小程序',
  version: '1.0.0',
  description: '设备巡检管理系统',
}

// 功能开关
export const FEATURE_FLAGS = {
  enableNotifications: true,
  enableOfflineMode: false,
  enableAnalytics: true,
}

// 用户角色
export const USER_ROLES = {
  ADMIN: 'admin',
  INSPECTOR: 'inspector',
  MAINTENANCE: 'maintenance',
} as const

// 设备类型
export const DEVICE_TYPES = {
  INSTRUMENT: 'instrument',
  MOTOR: 'motor',
} as const

// 报修单状态
export const REPAIR_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  REPAIRED: 'repaired',
  ACCEPTED: 'accepted',
  CANCELLED: 'cancelled',
} as const

// 巡检周期
export const INSPECTION_CYCLES = {
  DAILY: 'daily',
  WEEKLY: 'weekly',
  MONTHLY: 'monthly',
} as const

export default {
  API_BASE_URL,
  API_CONFIG,
  APP_CONFIG,
  FEATURE_FLAGS,
  USER_ROLES,
  DEVICE_TYPES,
  REPAIR_STATUS,
  INSPECTION_CYCLES,
}
