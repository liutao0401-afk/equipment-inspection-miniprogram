const app = getApp()

function getStatusLabel(status) {
  const map = { pending: '待派单', processing: '处理中', repaired: '已修复', accepted: '已验收' }
  return map[status] || status
}

// 适配服务器报修单字段 → 维修任务视图
function adaptTask(item) {
  // 解析 images（可能是JSON字符串或数组）
  let images = item.images || []
  if (typeof images === 'string') {
    try { images = JSON.parse(images) } catch { images = [] }
  }
  return {
    id: item.id,
    code: item.code || ('任务#' + item.id),
    deviceId: item.deviceId,
    deviceName: item.deviceName,
    deviceCode: item.deviceCode,
    description: item.description || item.handleRemark || '暂无描述',
    status: item.status,
    _statusLabel: item.statusName || getStatusLabel(item.status),
    _createTime: item.createTime || '',
    _endTime: item.updateTime || '',
    // 维修任务来源
    type: 'repair',
    repairCode: item.code,
    // 处理信息
    teamId: item.teamId,
    handlerName: item.reporterName || '',
    images,
    _raw: item,
  }
}

Page({
  data: {
    loading: false,
    submitting: false,

    // 列表（维修任务 = 待处理的报修单）
    maintenances: [],
    paginatedItems: [],
    hasMore: false,
    remainingCount: 0,
    displayCount: 10,
    statusFilter: 'all',
    searchQuery: '',

    // 统计
    inProgressCount: 0,
    completedCount: 0,

    // 弹窗
    showDetailPopup: false,
    showCompletePopup: false,

    // 选中项
    selectedItem: null,
    selectedItemImages: [],

    // 完成表单
    completeRemark: '',
    photos: [],
  },

  // ==================== 生命周期 ====================

  onShow() {
    // 角色守卫：非维修人员跳转到首页
    const user = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
    if (user.role === 'inspector') {
      wx.switchTab({ url: '/pages/home/home' })
      return
    }

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActive('/pages/maintenance/maintenance')
    }
    this.loadAll()
  },

  // ==================== 数据加载 ====================

  async loadAll() {
    this.setData({ loading: true })
    try {
      // 加载报修单中待维修的任务（processing=处理中, repaired=已修复待验收）
      const result = await app.request({ url: '/repairs' })
      const rawItems = (result && result.items) || []

      // 筛选维修相关状态的报修单作为"维修任务"
      const taskStatuses = ['processing', 'repaired']
      const tasks = rawItems
        .filter(r => taskStatuses.includes(r.status))
        .map(adaptTask)

      this.setData({ maintenances: tasks, displayCount: 10 })
      this.updateStats(tasks)
      this.applyFilter()
    } catch (error) {
      wx.showToast({ title: error.message || '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  updateStats(items) {
    this.setData({
      inProgressCount: items.filter(m => m.status === 'processing').length,
      completedCount: items.filter(m => m.status === 'repaired' || m.status === 'accepted').length,
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
    const { maintenances, statusFilter, searchQuery, displayCount } = this.data
    let result = maintenances

    if (statusFilter !== 'all') {
      if (statusFilter === 'in_progress') {
        result = result.filter(m => m.status === 'processing')
      } else {
        result = result.filter(m => m.status === 'repaired' || m.status === 'accepted')
      }
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(m =>
        (m.deviceName || '').toLowerCase().includes(q) ||
        (m.deviceCode || '').toLowerCase().includes(q) ||
        (m.code || '').toLowerCase().includes(q)
      )
    }

    const paginated = result.slice(0, displayCount)
    const hasMore = result.length > displayCount
    const remaining = Math.max(0, result.length - displayCount)

    this.setData({
      paginatedItems: paginated,
      hasMore,
      remainingCount: remaining,
    })
  },

  loadMore() {
    this.setData({ displayCount: this.data.displayCount + 10 })
    this.applyFilter()
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

  openDetailPopup(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.maintenances.find(m => m.id === id)
    if (!item) return

    // 解析 images
    let images = item.images || []
    images = images.map(url => this._resolveImageUrl(url))

    this.setData({
      selectedItem: item,
      selectedItemImages: images,
      showDetailPopup: true,
    })
  },

  closeDetailPopup() {
    this.setData({ showDetailPopup: false })
  },

  // ==================== 完成登记 ====================

  openCompletePopup(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.maintenances.find(m => m.id === id)
    if (!item) return

    this.setData({
      selectedItem: item,
      showCompletePopup: true,
      completeRemark: '',
      photos: [],
    })
  },

  closeCompletePopup() {
    this.setData({ showCompletePopup: false })
  },

  onCompleteRemarkInput(e) {
    this.setData({ completeRemark: e.detail.value })
  },

  async submitComplete() {
    const { selectedItem, completeRemark, photos } = this.data
    if (!selectedItem) return

    if (!completeRemark.trim()) {
      wx.showToast({ title: '请填写维修结果', icon: 'none' })
      return
    }

    this.setData({ submitting: true })
    try {
      // Fastify: PUT /repairs/:id 更新状态为 repaired，同时保存备注和图片
      const updateData = {
        status: 'repaired',
        handleRemark: completeRemark,
        repairContent: completeRemark,
      }
      if (photos.length > 0) {
        updateData.images = photos
      }
      await app.request({
        url: `/repairs/${selectedItem.id}`,
        method: 'PUT',
        data: updateData,
      })

      wx.showToast({ title: '维修已完成', icon: 'success' })
      this.setData({ showCompletePopup: false })
      this.loadAll()
    } catch (error) {
      wx.showToast({ title: error.message || '提交失败', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  },

  // ==================== 删除 ====================

  deleteMaintenance(e) {
    const id = e.currentTarget.dataset.id

    wx.showModal({
      title: '确认删除',
      content: '确定要删除此维修记录吗？',
      success: async (res) => {
        if (res.confirm) {
          try {
            await app.request({ url: `/repairs/${id}`, method: 'DELETE' })
            wx.showToast({ title: '已删除', icon: 'success' })
            this.loadAll()
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
        this.uploadPhoto(tempPath)
      },
      fail: () => {},
    })
  },

  async uploadPhoto(tempPath) {
    wx.showLoading({ title: '上传中...' })
    try {
      const url = await app.uploadFile(tempPath)
      const photos = [...this.data.photos, url]
      this.setData({ photos })
    } catch (error) {
      wx.showToast({ title: error.message || '上传失败', icon: 'none' })
    } finally {
      wx.hideLoading()
    }
  },

  removePhoto(e) {
    const index = e.currentTarget.dataset.index
    const photos = this.data.photos.slice()
    photos.splice(index, 1)
    this.setData({ photos })
  },
})