const app = getApp()

const INSTRUMENT_ITEMS = [
  { type: 'appearance', name: '外观检查' },
  { type: 'displayValue', name: '显示值' },
  { type: 'consistency', name: '数值和中控是否一致' },
  { type: 'connection', name: '连接线' },
  { type: 'operation', name: '运行状态' },
]

const MOTOR_ITEMS = [
  { type: 'temperature', name: '温度' },
  { type: 'vibration', name: '振动' },
  { type: 'noise', name: '噪声' },
  { type: 'bearing', name: '轴承' },
  { type: 'wiring', name: '接线' },
  { type: 'operation', name: '运行状态' },
]

const CYCLE_LABEL = { daily: '日报', weekly: '周报', monthly: '月报', hourly: '小时' }

function adaptPlan(item) {
  return {
    id: item.id,
    name: item.name || '',
    code: item.code || '',
    routeId: item.routeId,
    routeName: item.routeName || '',
    teamId: item.teamId,
    teamName: item.teamName || '',
    frequency: item.frequency,           // Fastify 用 frequency 字段
    isActive: item.status === 'active',  // Fastify 用 status: 'active'/'paused'
    startDate: item.startDate,
    endDate: item.endDate,
    cycleName: CYCLE_LABEL[item.frequency] || getFreqLabel(item.frequency),
  }
}

function getFreqLabel(frequency) {
  if (!frequency) return '未知'
  if (frequency === 'hourly') return '小时'
  if (typeof frequency === 'string' && frequency.startsWith('hourly-')) {
    const hours = frequency.replace('hourly-', '')
    return `每 ${hours} 小时`
  }
  return CYCLE_LABEL[frequency] || frequency
}

/**
 * 根据巡检周期计算当前周期的起止时间
 */
function getCycleRange(frequency) {
  const now = new Date()
  let start, end

  if (frequency === 'daily') {
    // 当日 00:00:00 ~ 23:59:59
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  } else if (frequency === 'weekly') {
    // 本周一 00:00:00 ~ 本周日 23:59:59
    const dayOfWeek = now.getDay() // 0=Sun
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset)
    start.setHours(0, 0, 0, 0)
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate() + mondayOffset + 6, 23, 59, 59)
  } else if (frequency === 'monthly') {
    // 本月1日 00:00:00 ~ 本月最后一天 23:59:59
    start = new Date(now.getFullYear(), now.getMonth(), 1)
    start.setHours(0, 0, 0, 0)
    end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)
  } else if (frequency === 'hourly') {
    // 过去1小时内
    start = new Date(now.getTime() - 60 * 60 * 1000)
    end = now
  } else if (typeof frequency === 'string' && frequency.startsWith('hourly-')) {
    // 过去 N 小时内
    const hours = parseInt(frequency.replace('hourly-', ''), 10) || 1
    start = new Date(now.getTime() - hours * 60 * 60 * 1000)
    end = now
  } else {
    // fallback 到日周期
    start = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59)
  }

  return { start, end }
}

function formatISODate(d) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * 判断 createdAt（如 "2026-05-27 07:04:42"）是否在时间窗口内
 */
function isWithinWindow(createdAt, windowStart, windowEnd) {
  const ts = new Date(createdAt.replace(' ', 'T')).getTime()
  return ts >= windowStart.getTime() && ts <= windowEnd.getTime()
}

/**
 * 根据计划周期加载该周期内的已巡检记录
 */
async function loadCycleRecords(app, planId, frequency) {
  const { start, end } = getCycleRange(frequency)
  // 对于小时周期，日期范围需要覆盖可能的时间段（前后各多一天兜底）
  const dateMargin = frequency === 'hourly' || (typeof frequency === 'string' && frequency.startsWith('hourly-'))
    ? 1 : 0
  const queryStart = new Date(start.getTime() - dateMargin * 24 * 60 * 60 * 1000)
  const queryEnd = new Date(end.getTime() + dateMargin * 24 * 60 * 60 * 1000)

  const params = `planId=${planId}&startDate=${formatISODate(queryStart)}&endDate=${formatISODate(queryEnd)}`
  const result = await app.request({ url: `/inspection/records?${params}` })
  const records = (result && result.items) || []

  // 对小时周期，还需要按 createdAt 精确过滤
  if (dateMargin > 0) {
    return records.filter(r =>
      r.createdAt && isWithinWindow(r.createdAt, start, end)
    )
  }

  return records
}

Page({
  data: {
    loading: false,
    submitting: false,

    // 步骤: 'plans' → 'select' → 'inspect'
    step: 'plans',

    // 计划列表
    plans: [],
    selectedPlanId: '',

    // 人员选择
    staffs: [],
    selectedStaffId: '',
    staffIdx: 0,

    // 筛选
    routes: [],
    areas: [],
    routeFilterOptions: [],
    areaFilterOptions: [],
    routeFilterIdx: 0,
    areaFilterIdx: 0,
    selectedRouteId: '',
    selectedAreaId: '',
    searchQuery: '',

    // 设备列表
    devices: [],
    filteredDevices: [],

    // 当前周期已巡检设备ID集合
    inspectedDeviceIds: [],
    deviceLastInspected: {}, // 设备ID -> 最近一次巡检时间（用于小时周期提示）
    selectedPlanFrequency: '', // 当前选中计划的周期

    // 当前巡检
    currentDevice: null,
    inspectionItems: [],
    hasAbnormal: false,
    overallRemark: '',
    startTime: '',
    abnormalItemName: '',

    // 异常备注弹窗
    showAbnormalPopup: false,
    abnormalItemIndex: -1,
    abnormalRemark: '',
    currentAbnormalPhotos: [],

    // 巡检完成后的报修确认弹窗
    showRepairConfirm: false,
    repairDescription: '',

    // 周期信息
    periodKey: '',
    cycleLabel: '今日',
  },

  onShow() {
    // 角色守卫：非巡检人员跳转到首页
    const user = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
    if (user.role === 'maintenance') {
      wx.switchTab({ url: '/pages/home/home' })
      return
    }

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActive('/pages/inspection/inspection')
    }
    // 每次显示时如果不是在巡检步骤，重新加载数据
    if (this.data.step !== 'inspect') {
      this.loadAllData()
    }
  },

  // ==================== 数据加载 ====================

  async loadAllData() {
    this.setData({ loading: true })
    try {
      const [plansResult, devicesResult, routesResult, areasResult, staffsResult] = await Promise.all([
        app.request({ url: '/inspection/plans' }),
        app.request({ url: '/devices' }),
        app.request({ url: '/routes' }),
        app.request({ url: '/areas' }),
        app.request({ url: '/staffs' }),
      ])

      const rawPlans = (plansResult && plansResult.items) || []
      const plans = rawPlans.map(adaptPlan)

      const rawDevices = (devicesResult && devicesResult.items) || []
      const devices = rawDevices.map(d => ({
        ...d,
        _typeLabel: d.type === 'motor' ? '电机' : '仪表',
      }))

      const rawRoutes = (routesResult && routesResult.items) || routesResult || []
      const routes = rawRoutes.map(r => ({
        id: r.id,
        name: r.name,
        deviceIds: typeof r.deviceIds === 'string' ? (JSON.parse(r.deviceIds) || []) : (r.deviceIds || []),
      }))

      const rawAreas = (areasResult && areasResult.items) || areasResult || []
      const areas = rawAreas.map(a => ({ id: a.id, name: a.name }))

      const rawStaffs = (staffsResult && staffsResult.items) || staffsResult || []
      // 筛选巡检相关角色
      const filteredStaffs = (rawStaffs || []).filter(
        s => s.role === 'inspector' || s.role === 'admin'
      )

      // 默认选中第一个
      let defaultStaffId = ''
      let defaultStaffIdx = 0
      if (filteredStaffs.length > 0) {
        // 优先选 isLeader 字段或第一个
        defaultStaffId = filteredStaffs[0].id
        defaultStaffIdx = 0
      }

      this.setData({
        plans,
        devices,
        routes,
        areas,
        routeFilterOptions: [{ id: '', name: '全部线路' }, ...routes],
        areaFilterOptions: [{ id: '', name: '全部区域' }, ...areas],
        staffs: filteredStaffs,
        selectedStaffId: defaultStaffId,
        staffIdx: defaultStaffIdx,
        inspectedDeviceIds: [],
        step: 'plans',
        selectedPlanId: '',
        selectedRouteId: '',
        selectedAreaId: '',
        searchQuery: '',
      })

      this.applyFilters()
    } catch (error) {
      wx.showToast({ title: error.message || '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  // ==================== 步骤切换 ====================

  // 选择计划，进入设备选择
  async selectPlan(e) {
    const id = e.currentTarget.dataset.id
    const plan = this.data.plans.find(p => p.id === id)
    if (!plan) return

    const routeIdx = this.data.routeFilterOptions.findIndex(r => r.id === plan.routeId)

    // 根据计划周期加载该周期内的已巡检记录
    let inspectedIds = []
    let deviceLastInspected = {}
    try {
      const records = await loadCycleRecords(app, plan.id, plan.frequency)
      inspectedIds = (records || []).map(r => r.deviceId).filter(Boolean)

      // 记录每个设备最近一次巡检时间（用于小时周期展示）
      for (const r of records) {
        if (r.deviceId && r.createdAt) {
          if (!deviceLastInspected[r.deviceId] || r.createdAt > deviceLastInspected[r.deviceId]) {
            deviceLastInspected[r.deviceId] = r.createdAt
          }
        }
      }
    } catch (_) { /* 忽略 */ }

    this.setData({
      step: 'select',
      selectedPlanId: id,
      selectedPlanFrequency: plan.frequency,
      selectedRouteId: plan.routeId || '',
      routeFilterIdx: routeIdx >= 0 ? routeIdx : 0,
      cycleLabel: CYCLE_LABEL[plan.frequency] || '今日',
      inspectedDeviceIds: inspectedIds,
      deviceLastInspected: deviceLastInspected,
      selectedAreaId: '',
      searchQuery: '',
      areaFilterIdx: 0,
    })

    this.applyFilters()
  },

  // 返回计划列表
  backToPlans() {
    this.setData({
      step: 'plans',
      selectedPlanId: '',
      selectedPlanFrequency: '',
      selectedRouteId: '',
      selectedAreaId: '',
      searchQuery: '',
      routeFilterIdx: 0,
      areaFilterIdx: 0,
      inspectedDeviceIds: [],
      deviceLastInspected: {},
    })
  },

  // 返回设备选择
  backToSelect() {
    this.setData({
      step: 'select',
      currentDevice: null,
      inspectionItems: [],
      overallRemark: '',
    })
  },

  // ==================== 筛选 ====================

  onRouteFilter(e) {
    const idx = parseInt(e.detail.value, 10)
    const option = this.data.routeFilterOptions[idx]
    if (!option) return
    this.setData({
      routeFilterIdx: idx,
      selectedRouteId: option.id,
    })
    this.applyFilters()
  },

  onAreaFilter(e) {
    const idx = parseInt(e.detail.value, 10)
    const option = this.data.areaFilterOptions[idx]
    if (!option) return
    this.setData({
      areaFilterIdx: idx,
      selectedAreaId: option.id,
    })
    this.applyFilters()
  },

  onSearchInput(e) {
    this.setData({ searchQuery: e.detail.value })
    this.applyFilters()
  },

  clearFilters() {
    this.setData({ selectedRouteId: '', selectedAreaId: '', searchQuery: '', routeFilterIdx: 0, areaFilterIdx: 0 })
    this.applyFilters()
  },

  applyFilters() {
    const { devices, routes, selectedRouteId, selectedAreaId, searchQuery, inspectedDeviceIds, selectedPlanFrequency } = this.data
    let result = [...devices]

    // 按线路筛选
    if (selectedRouteId) {
      const route = routes.find(r => r.id === selectedRouteId)
      const routeDeviceIds = (route && route.deviceIds) || []
      if (routeDeviceIds.length > 0) {
        result = result.filter(d => routeDeviceIds.includes(d.id))
      }
    }
    if (selectedAreaId) result = result.filter(d => d.areaId === selectedAreaId)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(
        d => d.name.toLowerCase().includes(q) ||
             d.code.toLowerCase().includes(q) ||
             (d.model || '').toLowerCase().includes(q)
      )
    }

    // 生成周期标签
    let cycleLabel = '本周期已巡检'
    if (selectedPlanFrequency === 'daily') cycleLabel = '今日已巡检'
    else if (selectedPlanFrequency === 'weekly') cycleLabel = '本周已巡检'
    else if (selectedPlanFrequency === 'monthly') cycleLabel = '本月已巡检'
    else if (selectedPlanFrequency === 'hourly') cycleLabel = '本小时已巡检'
    else if (typeof selectedPlanFrequency === 'string' && selectedPlanFrequency.startsWith('hourly-')) {
      cycleLabel = `本周期已巡检`
    }

    // 标记是否已巡检
    const withStatus = result.map(d => ({
      ...d,
      _inspected: inspectedDeviceIds.includes(d.id),
      _cycleLabel: cycleLabel,
    }))

    this.setData({ filteredDevices: withStatus })
  },

  // ==================== 人员选择 ====================

  onStaffChange(e) {
    const idx = parseInt(e.detail.value, 10)
    if (idx >= 0 && idx < this.data.staffs.length) {
      this.setData({ staffIdx: idx, selectedStaffId: this.data.staffs[idx].id })
    }
  },

  // ==================== 开始巡检 ====================

  startInspection(e) {
    const id = e.currentTarget.dataset.id
    const device = this.data.filteredDevices.find(d => d.id === id)
    if (!device) return

    if (!this.data.selectedStaffId) {
      wx.showToast({ title: '请先选择巡检人员', icon: 'none' })
      return
    }

    if (device._inspected) {
      wx.showModal({
        title: '重复巡检',
        content: '该设备在本周期内已完成巡检，确定要继续吗？',
        success: (res) => {
          if (res.confirm) this.enterInspectMode(device)
        },
      })
      return
    }

    this.enterInspectMode(device)
  },

  enterInspectMode(device) {
    const items = (device.type === 'meter' || device.type === 'instrument' ? INSTRUMENT_ITEMS : MOTOR_ITEMS).map(item => ({
      type: item.type,
      name: item.name,
      status: 'normal',
      remark: '',
      photos: [],
    }))

    this.setData({
      step: 'inspect',
      currentDevice: device,
      inspectionItems: items,
      hasAbnormal: false,
      overallRemark: '',
      startTime: new Date().toISOString(),
    })
  },

  // ==================== 巡检项操作 ====================

  toggleItem(e) {
    const index = e.currentTarget.dataset.index
    const item = this.data.inspectionItems[index]
    if (!item) return

    if (item.status === 'normal') {
      // 点击正常 → 切换为异常（弹出备注框）
      this.setData({
        showAbnormalPopup: true,
        abnormalItemIndex: index,
        abnormalItemName: item.name,
        abnormalRemark: '',
      })
    } else {
      // 点击异常 → 切换回正常
      const items = this.data.inspectionItems.slice()
      items[index] = { ...items[index], status: 'normal', remark: '' }
      const hasAbnormal = items.some(i => i.status === 'abnormal')
      this.setData({ inspectionItems: items, hasAbnormal })
    }
  },

  onAbnormalRemarkInput(e) {
    this.setData({ abnormalRemark: e.detail.value })
  },

  confirmAbnormal() {
    const { abnormalItemIndex, abnormalRemark, inspectionItems, currentAbnormalPhotos } = this.data
    if (abnormalItemIndex < 0) return

    if (!abnormalRemark.trim() && currentAbnormalPhotos.length === 0) {
      wx.showToast({ title: '请填写异常描述或拍照', icon: 'none' })
      return
    }

    const items = inspectionItems.slice()
    items[abnormalItemIndex] = {
      ...items[abnormalItemIndex],
      status: 'abnormal',
      remark: abnormalRemark,
      photos: currentAbnormalPhotos,
    }

    this.setData({
      inspectionItems: items,
      hasAbnormal: true,
      showAbnormalPopup: false,
      abnormalItemIndex: -1,
      abnormalRemark: '',
      currentAbnormalPhotos: [],
    })
  },

  closeAbnormalPopup() {
    this.setData({
      showAbnormalPopup: false,
      abnormalItemIndex: -1,
      abnormalRemark: '',
      currentAbnormalPhotos: [],
    })
  },

  // ==================== 拍照 ====================

  takePhoto() {
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['camera', 'album'],
      sizeType: ['compressed'],
      success: (res) => {
        const tempPath = res.tempFiles[0].tempFilePath
        this.uploadPhoto(tempPath)
      },
      fail: () => {
        // 用户取消拍照，忽略
      },
    })
  },

  async uploadPhoto(tempPath) {
    wx.showLoading({ title: '上传中...' })
    try {
      const url = await app.uploadFile(tempPath)
      const photos = [...this.data.currentAbnormalPhotos, url]
      this.setData({ currentAbnormalPhotos: photos })
    } catch (error) {
      wx.showToast({ title: error.message || '上传失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  removePhoto(e) {
    const index = e.currentTarget.dataset.index
    const photos = this.data.currentAbnormalPhotos.slice()
    photos.splice(index, 1)
    this.setData({ currentAbnormalPhotos: photos })
  },

  onOverallRemarkInput(e) {
    this.setData({ overallRemark: e.detail.value })
  },

  // ==================== 提交巡检 ====================

  async submitInspection(e) {
    const { currentDevice, selectedStaffId, selectedPlanId, inspectionItems, overallRemark, staffs } = this.data

    if (!currentDevice || !selectedStaffId) return

    this.setData({ submitting: true })
    try {
      const hasAbnormal = inspectionItems.some(item => item.status === 'abnormal')

      // 找到巡检人员姓名
      const selectedStaff = staffs.find(s => String(s.id) === String(selectedStaffId))
      const inspectorName = selectedStaff ? selectedStaff.name : ''

      // Fastify POST /inspection/execute 期望：
      // { planId, deviceId, inspectorId, inspectorName, status, items, deviceCode, deviceName }
      // status: 'normal' | 'warning'（warning 时服务端自动创建报修单）
      // items: [{ name, isNormal, result, remark, image }]
      const body = {
        planId: selectedPlanId,
        deviceId: currentDevice.id,
        inspectorId: selectedStaffId,
        inspectorName,
        deviceCode: currentDevice.code,
        deviceName: currentDevice.name,
        status: hasAbnormal ? 'warning' : 'normal',
        items: inspectionItems.map(item => ({
          type: item.type,
          name: item.name,
          isNormal: item.status === 'normal',
          result: item.status === 'abnormal' ? (item.remark || '异常') : '正常',
          remark: item.remark || '',
          image: (item.photos && item.photos.length > 0) ? item.photos[0] : '',
        })),
        remark: overallRemark || '',
      }

      await app.request({ url: '/inspection/execute', method: 'POST', data: body })

      wx.showToast({ title: '巡检完成', icon: 'success' })

      // 将当前设备加入已巡检列表
      const inspectedDeviceIds = [...this.data.inspectedDeviceIds, currentDevice.id]
      this.setData({ inspectedDeviceIds })

      // 回到设备选择
      this.backToSelect()
      this.applyFilters()
    } catch (error) {
      wx.showToast({ title: error.message || '提交失败', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  },

  // ==================== 辅助方法 ====================

  getToday() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  },

  getDeviceTypeLabel(type) {
    return type === 'meter' || type === 'instrument' ? '仪表' : '电机'
  },
})