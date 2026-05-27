const app = getApp()

const PRIORITIES = [
  { label: '低', value: 'low' },
  { label: '中', value: 'medium' },
  { label: '高', value: 'high' },
]

const STATUS_OPTIONS = [
  { value: 'pending', label: '待派单' },
  { value: 'processing', label: '处理中' },
  { value: 'repaired', label: '已修复' },
  { value: 'accepted', label: '已验收' },
]

// 状态映射（服务器返回 statusName，这里作为 fallback）
function getStatusLabel(status) {
  const map = { pending: '待派单', processing: '处理中', repaired: '已修复', accepted: '已验收' }
  return map[status] || status
}

// 服务器字段 → 小程序字段 适配
function adaptRepair(item) {
  // 解析 images（可能是JSON字符串或数组）
  let images = item.images || []
  if (typeof images === 'string') {
    try { images = JSON.parse(images) } catch { images = [] }
  }
  return {
    id: item.id,
    code: item.code,                       // Fastify: code
    deviceId: item.deviceId,
    deviceName: item.deviceName,
    deviceCode: item.deviceCode,
    description: item.description,         // Fastify: description
    status: item.status,
    _statusLabel: item.statusName || getStatusLabel(item.status),
    _createTime: item.createTime || '',     // Fastify: createTime
    images,
    teamId: item.teamId,
    handlerName: item.reporterName || '',
    priority: item.priority,
    _raw: item,
  }
}

Page({
  data: {
    loading: false,
    submitting: false,
    isInspector: false,

    // 列表
    repairs: [],
    paginatedRepairs: [],
    hasMore: false,
    remainingCount: 0,
    displayCount: 10,
    statusFilter: 'all',
    searchQuery: '',

    // 统计
    pendingCount: 0,
    processingCount: 0,
    repairedCount: 0,
    acceptedCount: 0,

    // 设备列表（创建用）
    devices: [],
    deviceSearchQuery: '',
    searchingDevice: false,

    // 班组列表
    teams: [],

    // 弹窗状态
    showCreatePopup: false,
    showDetailPopup: false,
    showProcessPopup: false,

    // 选中项
    selectedRepair: null,
    selectedRepairImages: [],

    // 创建表单
    deviceId: '',
    deviceCode: '',
    deviceName: '',
    priorityIndex: 1,
    photos: [],
    problemDescription: '',

    // 处理表单
    processStatus: 'processing',
    processStatusIdx: 1,
    processTeamId: 3,
    processTeamIdx: 0,
    processTeamName: '请选择班组',
    processRemark: '',
    repairContent: '',

    // 常量
    priorities: PRIORITIES,
    statusOptions: STATUS_OPTIONS,
  },

  // ==================== 生命周期 ====================

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActive('/pages/repair/repair')
    }

    // 角色权限：巡检员只能新建和查看，不能处理/删除
    const user = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
    const role = user.role || ''
    this.setData({ isInspector: role === 'inspector' })

    this.loadAllData()
  },

  // ==================== 数据加载 ====================

  async loadAllData() {
    this.setData({ loading: true })
    try {
      const [repairsResult, teamsResult] = await Promise.all([
        app.request({ url: '/repairs' }),
        app.request({ url: '/teams' }),
      ])

      const rawRepairs = (repairsResult && repairsResult.items) || []
      const repairs = rawRepairs.map(adaptRepair)
      const teams = (teamsResult && teamsResult.items) || teamsResult || []

      this.setData({ repairs, teams, displayCount: 10 })
      this.updateStats(repairs)
      this.applyFilter()
    } catch (error) {
      wx.showToast({ title: error.message || '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  updateStats(repairs) {
    this.setData({
      pendingCount: repairs.filter(r => r.status === 'pending').length,
      processingCount: repairs.filter(r => r.status === 'processing').length,
      repairedCount: repairs.filter(r => r.status === 'repaired').length,
      acceptedCount: repairs.filter(r => r.status === 'accepted').length,
    })
  },

  // ==================== 列表筛选与分页 ====================

  switchFilter(e) {
    const status = e.currentTarget.dataset.status
    this.setData({ statusFilter: status, displayCount: 10 })
    this.applyFilter()
  },

  onSearchInput(e) {
    this.setData({ searchQuery: e.detail.value, displayCount: 10 })
    this.applyFilter()
  },

  applyFilter() {
    const { repairs, statusFilter, searchQuery, displayCount, teams } = this.data
    let result = repairs

    if (statusFilter !== 'all') {
      result = result.filter(r => r.status === statusFilter)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(r =>
        (r.code || '').toLowerCase().includes(q) ||
        (r.deviceName || '').toLowerCase().includes(q) ||
        (r.description || '').toLowerCase().includes(q)
      )
    }

    const paginated = result.slice(0, displayCount)
    const hasMore = result.length > displayCount
    const remaining = Math.max(0, result.length - displayCount)

    this.setData({
      paginatedRepairs: paginated,
      hasMore,
      remainingCount: remaining,
    })
  },

  loadMore() {
    this.setData({ displayCount: this.data.displayCount + 10 })
    this.applyFilter()
  },

  // ==================== 设备搜索 ====================

  onDeviceSearchInput(e) {
    this.setData({ deviceSearchQuery: e.detail.value })
  },

  async searchDevices() {
    const query = this.data.deviceSearchQuery.trim()
    if (!query) {
      wx.showToast({ title: '请输入设备关键词', icon: 'none' })
      return
    }

    this.setData({ searchingDevice: true })
    try {
      const result = await app.request({ url: `/devices?search=${encodeURIComponent(query)}` })
      const devices = (result && result.items) || []
      this.setData({ devices })
    } catch (error) {
      wx.showToast({ title: error.message || '搜索失败', icon: 'none' })
    } finally {
      this.setData({ searchingDevice: false })
    }
  },

  selectDevice(e) {
    const id = e.currentTarget.dataset.id
    const code = e.currentTarget.dataset.code
    const name = e.currentTarget.dataset.name
    this.setData({
      deviceId: id,
      deviceCode: code,
      deviceName: name,
      devices: [],
      deviceSearchQuery: '',
    })
  },

  // ==================== 创建报修 ====================

  openCreatePopup() {
    this.setData({
      showCreatePopup: true,
      deviceId: '',
      deviceCode: '',
      deviceName: '',
      priorityIndex: 1,
      photos: [],
      problemDescription: '',
      devices: [],
      deviceSearchQuery: '',
    })
  },

  closeCreatePopup() {
    this.setData({ showCreatePopup: false })
  },

  onPriorityChange(e) {
    this.setData({ priorityIndex: Number(e.detail.value) })
  },

  onProblemDescriptionInput(e) {
    this.setData({ problemDescription: e.detail.value })
  },

  async submitRepair() {
    const { deviceId, deviceCode, deviceName, problemDescription, photos, priorityIndex, priorities } = this.data

    if (!deviceId) {
      wx.showToast({ title: '请选择设备', icon: 'none' })
      return
    }
    if (!problemDescription.trim()) {
      wx.showToast({ title: '请填写问题描述', icon: 'none' })
      return
    }

    // 提取已上传完成的远程图片URL
    const imageUrls = photos
      .filter(p => p.remote)
      .map(p => p.remote)

    this.setData({ submitting: true })
    try {
      // 获取当前用户信息
      const user = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}

      // Fastify POST /repairs 期望：deviceId, deviceCode, deviceName, reporterId, reporterName, description, images, priority
      await app.request({
        url: '/repairs',
        method: 'POST',
        data: {
          deviceId,
          deviceCode,
          deviceName,
          description: problemDescription,
          images: imageUrls,
          reporterId: user.id || '',
          reporterName: user.name || '',
          priority: priorities[priorityIndex]?.value || 'medium',
        },
      })

      wx.showToast({ title: '报修单已创建', icon: 'success' })
      this.setData({ showCreatePopup: false })
      this.loadAllData()
    } catch (error) {
      wx.showToast({ title: error.message || '提交失败', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  },

  // 将相对路径图片 URL 转为绝对路径（带域名）
  _resolveImageUrl(url) {
    if (!url || url.startsWith('http://') || url.startsWith('https://') || url.startsWith('wxfile://')) {
      return url
    }
    const serverBase = app.globalData.apiBaseUrl.replace(/\/api\/?$/, '')
    if (url.startsWith('/')) {
      return `${serverBase}${url}`
    }
    return url
  },

  // ==================== 详情 ====================

  async openDetailPopup(e) {
    const id = e.currentTarget.dataset.id
    // 查找已适配的数据
    const repair = this.data.repairs.find(r => r.id === id)
    if (!repair) return

    // 获取设备详细信息（含位置）
    let deviceLocation = '-'
    if (repair.deviceId) {
      try {
        const device = await app.request({ url: `/devices/${repair.deviceId}` })
        if (device && device.location) {
          deviceLocation = device.location
        }
      } catch {
        // 设备可能已被删除，忽略
      }
    }

    this.setData({
      selectedRepair: {
        ...repair,
        _deviceLocation: deviceLocation,
      },
      selectedRepairImages: (repair.images || []).map(url => this._resolveImageUrl(url)),
      showDetailPopup: true,
    })
  },

  closeDetailPopup() {
    this.setData({ showDetailPopup: false })
  },

  // 详情页照片放大预览
  previewImage(e) {
    const src = e.currentTarget.dataset.src
    if (src) {
      wx.previewImage({
        urls: this.data.selectedRepairImages,
        current: src,
      })
    }
  },

  // ==================== 处理报修 ====================

  openProcessPopup(e) {
    const id = e.currentTarget.dataset.id
    const repair = this.data.repairs.find(r => r.id === id)
    if (!repair) return

    // 默认：处理状态为"处理中"、班组为维修班(id=3)
    const statusIdx = STATUS_OPTIONS.findIndex(s => s.value === 'processing')
    const defaultTeamId = 3 // 维修班
    const teamIdx = this.data.teams.findIndex(t => t.id === defaultTeamId)
    const teamName = teamIdx >= 0 ? this.data.teams[teamIdx].name : '请选择班组'

    this.setData({
      selectedRepair: repair,
      showProcessPopup: true,
      processStatus: 'processing',
      processStatusIdx: statusIdx >= 0 ? statusIdx : 0,
      processTeamId: defaultTeamId,
      processTeamIdx: teamIdx >= 0 ? teamIdx : 0,
      processTeamName: teamName,
      processRemark: '',
      repairContent: '',
    })
  },

  closeProcessPopup() {
    this.setData({ showProcessPopup: false })
  },

  onProcessStatusChange(e) {
    const idx = Number(e.detail.value)
    this.setData({
      processStatusIdx: idx,
      processStatus: STATUS_OPTIONS[idx].value,
    })
  },

  onProcessTeamChange(e) {
    const idx = Number(e.detail.value)
    const team = this.data.teams[idx]
    this.setData({
      processTeamIdx: idx,
      processTeamId: team ? team.id : '',
      processTeamName: team ? team.name : '请选择班组',
    })
  },

  onProcessRemarkInput(e) {
    this.setData({ processRemark: e.detail.value })
  },

  onRepairContentInput(e) {
    this.setData({ repairContent: e.detail.value })
  },

  async processRepair() {
    const { selectedRepair, processStatus, processTeamId, processRemark, repairContent } = this.data
    if (!selectedRepair) return

    this.setData({ submitting: true })
    try {
      // 统一走 PUT /repairs/:id 更新状态、班组、备注
      await app.request({
        url: `/repairs/${selectedRepair.id}`,
        method: 'PUT',
        data: {
          status: processStatus,
          teamId: Number(processTeamId) || selectedRepair.teamId,
          handleRemark: processRemark || '',
          repairContent: repairContent || processRemark || '',
        },
      })
      wx.showToast({ title: '处理状态已更新', icon: 'success' })

      this.setData({ showProcessPopup: false })
      this.loadAllData()
    } catch (error) {
      wx.showToast({ title: error.message || '处理失败', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  },

  // ==================== 删除报修 ====================

  deleteRepair(e) {
    const id = e.currentTarget.dataset.id
    const code = e.currentTarget.dataset.code

    wx.showModal({
      title: '确认删除',
      content: `确定要删除报修单 ${code} 吗？`,
      success: async (res) => {
        if (res.confirm) {
          try {
            await app.request({ url: `/repairs/${id}`, method: 'DELETE' })
            wx.showToast({ title: '已删除', icon: 'success' })
            this.loadAllData()
          } catch (error) {
            wx.showToast({ title: error.message || '删除失败', icon: 'none' })
          }
        }
      },
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
        // 先用本地路径显示，上传后替换为远程URL
        const photos = [...this.data.photos, { local: tempPath, remote: '' }]
        this.setData({ photos })
        this.uploadPhoto(tempPath, photos.length - 1)
      },
      fail: () => {},
    })
  },

  async uploadPhoto(tempPath, index) {
    wx.showLoading({ title: '上传中...' })
    try {
      const url = await app.uploadFile(tempPath)
      const photos = this.data.photos.slice()
      if (photos[index]) {
        photos[index].remote = url
        this.setData({ photos })
      }
    } catch (error) {
      wx.showToast({ title: error.message || '上传失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  removePhoto(e) {
    const index = Number(e.currentTarget.dataset.index)
    const photos = this.data.photos.slice()
    photos.splice(index, 1)
    this.setData({ photos })
  },

  // ==================== 辅助方法 ====================

  statusLabel(status) {
    return getStatusLabel(status)
  },

  formatTime(isoStr) {
    if (!isoStr) return ''
    return isoStr.replace('T', ' ').slice(0, 16)
  },

  getTeamName(teamId) {
    if (!teamId) return '-'
    const team = this.data.teams.find(t => t.id === teamId)
    return team ? team.name : '-'
  },
})