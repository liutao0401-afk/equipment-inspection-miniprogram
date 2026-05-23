// API 服务层 - 与 WEB 端共享同一个后端 API
import { API_BASE_URL } from '@/config/env'
import type {
  User,
  LoginRequest,
  LoginResponse,
  Device,
  DeviceListResponse,
  Repair,
  RepairListResponse,
  CreateRepairRequest,
  UpdateRepairStatusRequest,
  Maintenance,
  MaintenanceListResponse,
  InspectionPlan,
  InspectionRecord,
  InspectionExecuteRequest,
  DashboardStats,
  TrendData,
  DeviceDistribution,
  Notification,
  NotificationListResponse,
  Team,
  Staff,
  Area,
  Route,
  ApiResponse,
  PaginatedResponse,
} from '@/types'

// ==================== 认证 API ====================

export const authApi = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    })
    if (!response.ok) throw new Error('登录失败')
    const data = await response.json()
    return data.data
  },

  logout: async (): Promise<void> => {
    const token = localStorage.getItem('token')
    await fetch(`${API_BASE_URL}/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    })
  },

  getProfile: async (): Promise<User> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取用户信息失败')
    const data = await response.json()
    return data.data
  },
}

// ==================== 设备 API ====================

export const deviceApi = {
  list: async (page = 1, pageSize = 20): Promise<DeviceListResponse> => {
    const token = localStorage.getItem('token')
    const response = await fetch(
      `${API_BASE_URL}/devices?page=${page}&pageSize=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!response.ok) throw new Error('获取设备列表失败')
    const data = await response.json()
    return data.data
  },

  get: async (id: number): Promise<Device> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/devices/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取设备详情失败')
    const data = await response.json()
    return data.data
  },

  search: async (query: string): Promise<Device[]> => {
    const token = localStorage.getItem('token')
    const response = await fetch(
      `${API_BASE_URL}/devices/search?q=${encodeURIComponent(query)}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!response.ok) throw new Error('搜索设备失败')
    const data = await response.json()
    return data.data
  },
}

// ==================== 巡检 API ====================

export const inspectionApi = {
  listPlans: async (): Promise<InspectionPlan[]> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/inspection/plans`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取巡检计划失败')
    const data = await response.json()
    return data.data
  },

  getPlan: async (id: number): Promise<InspectionPlan> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/inspection/plans/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取巡检计划详情失败')
    const data = await response.json()
    return data.data
  },

  execute: async (payload: InspectionExecuteRequest): Promise<InspectionRecord> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/inspection/execute`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error('提交巡检记录失败')
    const data = await response.json()
    return data.data
  },

  listRecords: async (page = 1, pageSize = 20): Promise<PaginatedResponse<InspectionRecord>> => {
    const token = localStorage.getItem('token')
    const response = await fetch(
      `${API_BASE_URL}/inspection/records?page=${page}&pageSize=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!response.ok) throw new Error('获取巡检记录失败')
    const data = await response.json()
    return data.data
  },

  getRecord: async (id: number): Promise<InspectionRecord> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/inspection/records/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取巡检记录详情失败')
    const data = await response.json()
    return data.data
  },
}

// ==================== 报修 API ====================

export const repairApi = {
  list: async (page = 1, pageSize = 20): Promise<RepairListResponse> => {
    const token = localStorage.getItem('token')
    const response = await fetch(
      `${API_BASE_URL}/repairs?page=${page}&pageSize=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!response.ok) throw new Error('获取报修单列表失败')
    const data = await response.json()
    return data.data
  },

  get: async (id: number): Promise<Repair> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/repairs/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取报修单详情失败')
    const data = await response.json()
    return data.data
  },

  create: async (payload: CreateRepairRequest): Promise<Repair> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/repairs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error('创建报修单失败')
    const data = await response.json()
    return data.data
  },

  updateStatus: async (id: number, payload: UpdateRepairStatusRequest): Promise<Repair> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/repairs/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error('更新报修单失败')
    const data = await response.json()
    return data.data
  },
}

// ==================== 维修 API ====================

export const maintenanceApi = {
  list: async (page = 1, pageSize = 20): Promise<MaintenanceListResponse> => {
    const token = localStorage.getItem('token')
    const response = await fetch(
      `${API_BASE_URL}/maintenance?page=${page}&pageSize=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!response.ok) throw new Error('获取维修列表失败')
    const data = await response.json()
    return data.data
  },

  get: async (id: number): Promise<Maintenance> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取维修详情失败')
    const data = await response.json()
    return data.data
  },

  accept: async (repairId: number): Promise<Maintenance> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/maintenance/from-repair`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ repairId }),
    })
    if (!response.ok) throw new Error('接单失败')
    const data = await response.json()
    return data.data
  },

  complete: async (id: number, payload: any): Promise<Maintenance> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/maintenance/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    })
    if (!response.ok) throw new Error('完成维修失败')
    const data = await response.json()
    return data.data
  },
}

// ==================== 统计 API ====================

export const statsApi = {
  getDashboard: async (): Promise<DashboardStats> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/stats/dashboard`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取仪表板统计失败')
    const data = await response.json()
    return data.data
  },

  getTrend: async (days = 7): Promise<TrendData[]> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/stats/trend?days=${days}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取趋势数据失败')
    const data = await response.json()
    return data.data
  },

  getDistribution: async (): Promise<DeviceDistribution[]> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/stats/distribution`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取分布数据失败')
    const data = await response.json()
    return data.data
  },
}

// ==================== 通知 API ====================

export const notificationApi = {
  list: async (page = 1, pageSize = 20): Promise<NotificationListResponse> => {
    const token = localStorage.getItem('token')
    const response = await fetch(
      `${API_BASE_URL}/notifications?page=${page}&pageSize=${pageSize}`,
      { headers: { Authorization: `Bearer ${token}` } }
    )
    if (!response.ok) throw new Error('获取通知列表失败')
    const data = await response.json()
    return data.data
  },

  markAsRead: async (id: number): Promise<void> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('标记通知失败')
  },

  markAllAsRead: async (): Promise<void> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
      method: 'PUT',
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('标记所有通知失败')
  },
}

// ==================== 班组和人员 API ====================

export const teamApi = {
  list: async (): Promise<Team[]> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/teams`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取班组列表失败')
    const data = await response.json()
    return data.data
  },
}

export const staffApi = {
  list: async (): Promise<Staff[]> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/staffs`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取人员列表失败')
    const data = await response.json()
    return data.data
  },
}

// ==================== 区域和线路 API ====================

export const areaApi = {
  list: async (): Promise<Area[]> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/areas`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取区域列表失败')
    const data = await response.json()
    return data.data
  },
}

export const routeApi = {
  list: async (): Promise<Route[]> => {
    const token = localStorage.getItem('token')
    const response = await fetch(`${API_BASE_URL}/routes`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (!response.ok) throw new Error('获取线路列表失败')
    const data = await response.json()
    return data.data
  },
}
