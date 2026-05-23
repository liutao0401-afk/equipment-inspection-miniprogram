// 微信小程序环境配置
// 内网: http://192.188.88.48:3000
// 外网: https://weixin.hazlai.com

const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// 根据环境确定 API 基础 URL
export const API_BASE_URL = isDevelopment
  ? 'http://192.188.88.48:3000/api' // 开发环境使用内网
  : isProduction
    ? 'https://weixin.hazlai.com/api' // 生产环境使用外网 HTTPS
    : 'http://192.188.88.48:3000/api'

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

export default {
  API_BASE_URL,
  API_CONFIG,
  APP_CONFIG,
  FEATURE_FLAGS,
}
