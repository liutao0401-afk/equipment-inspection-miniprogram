// 微信小程序 - 核心数据类型定义
// 与 WEB 端共享相同的数据模型

// ==================== 枚举类型 ====================

export enum UserRole {
  ADMIN = 'admin',
  INSPECTOR = 'inspector',
  MAINTENANCE = 'maintenance',
}

export enum DeviceType {
  INSTRUMENT = 'instrument',
  MOTOR = 'motor',
}

export enum RepairStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  REPAIRED = 'repaired',
  ACCEPTED = 'accepted',
  CANCELLED = 'cancelled',
}

export enum InspectionCycle {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
}

export enum InspectionItemStatus {
  NORMAL = 'normal',
  ABNORMAL = 'abnormal',
}

export enum NotificationType {
  NEW_REPAIR = 'new_repair',
  INSPECTION_ABNORMAL = 'inspection_abnormal',
  REPAIR_UPDATE = 'repair_update',
  SYSTEM = 'system',
}

// ==================== 用户相关 ====================

export interface User {
  id: number
  username: string
  name: string
  role: UserRole
  teamId?: number
  teamName?: string
  email?: string
  phone?: string
  avatar?: string
  createdAt?: string
  updatedAt?: string
}

export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  user: User
  token: string
}

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

// ==================== 设备相关 ====================

export interface Device {
  id: number
  code: string
  name: string
  type: DeviceType
  location: string
  areaId: number
  areaName?: string
  routeId: number
  routeName?: string
  manufacturer?: string
  tagNo?: string
  startDate?: string
  status?: 'normal' | 'warning' | 'fault'
  
  // 仪表特有字段
  range?: string
  material?: string
  pipeDiameter?: string
  flangeSize?: string
  
  // 电机特有字段
  power?: string
  ratedCurrent?: string
  
  createdAt?: string
  updatedAt?: string
}

export interface DeviceListResponse {
  data: Device[]
  total: number
  page: number
  pageSize: number
}

// ==================== 巡检相关 ====================

export interface InspectionPlan {
  id: number
  code: string
  name: string
  routeId: number
  routeName?: string
  teamId: number
  teamName?: string
  frequency: InspectionCycle
  items: InspectionItem[]
  status?: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}

export interface InspectionItem {
  id: number
  planId: number
  deviceId: number
  deviceCode?: string
  deviceName?: string
  name: string
  standard?: string
  type?: string
  createdAt?: string
  updatedAt?: string
}

export interface InspectionRecord {
  id: number
  planId: number
  planName?: string
  inspectorId: number
  inspectorName?: string
  teamId: number
  teamName?: string
  startTime: string
  endTime?: string
  status: 'in_progress' | 'completed'
  items: InspectionRecordItem[]
  abnormalCount: number
  createdAt?: string
  updatedAt?: string
}

export interface InspectionRecordItem {
  id: number
  recordId: number
  itemId: number
  deviceId: number
  deviceCode?: string
  deviceName?: string
  itemName?: string
  result?: string
  status: InspectionItemStatus
  remarks?: string
  images?: string[]
  createdAt?: string
  updatedAt?: string
}

export interface InspectionExecuteRequest {
  planId: number
  inspectorId: number
  items: {
    itemId: number
    deviceId: number
    result?: string
    status: InspectionItemStatus
    remarks?: string
    images?: string[]
  }[]
}

// ==================== 报修相关 ====================

export interface Repair {
  id: number
  code: string
  deviceId: number
  deviceCode?: string
  deviceName?: string
  description: string
  priority?: 'low' | 'medium' | 'high'
  status: RepairStatus
  images?: string[]
  reporterId: number
  reporterName?: string
  teamId?: number
  teamName?: string
  createdAt?: string
  updatedAt?: string
  completedAt?: string
}

export interface RepairListResponse {
  data: Repair[]
  total: number
  page: number
  pageSize: number
}

export interface CreateRepairRequest {
  deviceId: number
  description: string
  priority?: 'low' | 'medium' | 'high'
  images?: string[]
}

export interface UpdateRepairStatusRequest {
  status: RepairStatus
  remarks?: string
}

// ==================== 维修相关 ====================

export interface Maintenance {
  id: number
  code: string
  repairId: number
  repairCode?: string
  deviceId: number
  deviceCode?: string
  deviceName?: string
  type: 'repair' | 'maintenance' | 'replacement'
  status: 'in_progress' | 'completed'
  maintenanceDetails?: string
  images?: string[]
  maintenerId: number
  maintainerName?: string
  teamId: number
  teamName?: string
  startTime?: string
  completedTime?: string
  createdAt?: string
  updatedAt?: string
}

export interface MaintenanceListResponse {
  data: Maintenance[]
  total: number
  page: number
  pageSize: number
}

export interface CompleteMaintenanceRequest {
  maintenanceDetails: string
  images: string[]
}

// ==================== 统计相关 ====================

export interface DashboardStats {
  totalDevices: number
  totalRepairs: number
  pendingRepairs: number
  completedRepairs: number
  totalInspections: number
  abnormalInspections: number
  maintenanceTasks: number
  completedMaintenance: number
}

export interface TrendData {
  date: string
  inspections: number
  repairs: number
  maintenance: number
}

export interface DeviceDistribution {
  type: string
  count: number
  percentage: number
}

// ==================== 通知相关 ====================

export interface Notification {
  id: number
  userId: number
  type: NotificationType
  title: string
  message: string
  data?: Record<string, any>
  read: boolean
  createdAt: string
}

export interface NotificationListResponse {
  data: Notification[]
  total: number
  unreadCount: number
}

// ==================== 班组和人员相关 ====================

export interface Team {
  id: number
  code: string
  name: string
  description?: string
  memberCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface Staff {
  id: number
  code: string
  name: string
  role: UserRole
  teamId: number
  teamName?: string
  phone?: string
  email?: string
  status?: 'active' | 'inactive'
  createdAt?: string
  updatedAt?: string
}

// ==================== 区域和线路相关 ====================

export interface Area {
  id: number
  code: string
  name: string
  description?: string
  deviceCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface Route {
  id: number
  code: string
  name: string
  areaId: number
  areaName?: string
  description?: string
  deviceCount?: number
  createdAt?: string
  updatedAt?: string
}

// ==================== API 响应类型 ====================

export interface ApiResponse<T> {
  code: number
  message: string
  data?: T
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
}

// ==================== 应用状态 ====================

export interface AppState {
  auth: AuthState
  devices: Device[]
  repairs: Repair[]
  maintenance: Maintenance[]
  inspections: InspectionRecord[]
  notifications: Notification[]
  isLoading: boolean
  error: string | null
}
