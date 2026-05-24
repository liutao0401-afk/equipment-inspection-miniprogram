const env = import.meta.env

export const API_BASE_URL = env.VITE_API_BASE_URL || '/api'

export const API_CONFIG = {
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
}

export const APP_CONFIG = {
  name: '设备巡检小程序',
  version: '1.0.0',
  description: '设备巡检管理系统',
}

export const FEATURE_FLAGS = {
  enableNotifications: true,
  enableOfflineMode: false,
  enableAnalytics: true,
}

export const USER_ROLES = {
  ADMIN: 'admin',
  INSPECTOR: 'inspector',
  MAINTENANCE: 'maintenance',
} as const

export const DEVICE_TYPES = {
  INSTRUMENT: 'instrument',
  MOTOR: 'motor',
} as const

export const REPAIR_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  REPAIRED: 'repaired',
  ACCEPTED: 'accepted',
  CANCELLED: 'cancelled',
} as const

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
