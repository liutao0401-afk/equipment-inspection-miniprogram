const app = getApp()

Page({
  data: {
    loading: false,
    stats: {},
    isInspectorOrLeader: false,
    isMaintenance: false,
    unreadCount: 0,
    recentMessages: [],
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActive('/pages/home/home')
    }

    // 角色判断
    const user = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
    const role = user.role || ''
    this.setData({
      isInspectorOrLeader: role === 'inspector',
      isMaintenance: role === 'maintenance',
    })

    this.ensureLogin()
    this.loadStats()
    this.loadMessages()
  },

  ensureLogin() {
    if (!app.globalData.token && !wx.getStorageSync('token')) {
      wx.reLaunch({ url: '/pages/login/login' })
    }
  },

  async loadStats() {
    this.setData({ loading: true })
    try {
      const stats = await app.request({ url: '/stats/dashboard' })
      this.setData({ stats: stats || {} })
    } catch (error) {
      wx.showToast({ title: error.message || '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  goInspection() {
    wx.switchTab({ url: '/pages/inspection/inspection' })
  },

  goRepair() {
    wx.switchTab({ url: '/pages/repair/repair' })
  },

  goMaintenance() {
    wx.switchTab({ url: '/pages/maintenance/maintenance' })
  },

  goMessages() {
    wx.navigateTo({ url: '/pages/messages/messages' })
  },

  async loadMessages() {
    try {
      const user = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
      const res = await app.request({
        url: `/notifications?userId=${user.id}&userRole=${user.role}&userTeamId=${user.teamId || ''}`,
      })
      const items = (res && res.items) || []
      const sorted = (items || []).sort((a, b) => {
        return (b.createdAt || '').localeCompare(a.createdAt || '')
      })
      const unreadItems = sorted.filter(m => !m.isRead)
      const recent = sorted.slice(0, 3).map(m => ({
        id: m.id,
        title: m.title,
        content: m.content,
        type: m.type,
        _time: this.formatTime(m.createdAt),
      }))
      this.setData({
        unreadCount: unreadItems.length,
        recentMessages: recent,
      })
    } catch (_) {}
  },

  formatTime(t) {
    if (!t) return ''
    const s = String(t)
    return s.length > 16 ? s.slice(0, 16) : s
  },
})
