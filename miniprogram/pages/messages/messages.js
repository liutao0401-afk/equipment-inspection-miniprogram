const app = getApp()

Page({
  data: {
    loading: false,
    messages: [],
  },

  onShow() {
    this.loadMessages()
  },

  async loadMessages() {
    this.setData({ loading: true })
    try {
      const user = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
      const res = await app.request({
        url: `/notifications?userId=${user.id}&userRole=${user.role}&userTeamId=${user.teamId || ''}`,
      })
      const items = (res && res.items) || []
      // 最新消息排最前面
      const sorted = (items || []).sort((a, b) => {
        return (b.createdAt || '').localeCompare(a.createdAt || '')
      })
      const messages = sorted.map(m => ({
        ...m,
        _typeIcon: m.type === 'warning' ? '' : m.type === 'error' ? '' : m.type === 'success' ? '' : '',
        _time: this.formatTime(m.createdAt),
      }))
      this.setData({ messages })
    } catch (error) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  goDetail(e) {
    const id = e.currentTarget.dataset.id
    wx.navigateTo({ url: `/pages/message-detail/message-detail?id=${id}` })
  },

  async markAllRead() {
    try {
      const user = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
      await app.request({
        url: `/notifications/read-all?userId=${user.id}&userRole=${user.role}`,
        method: 'PUT',
      })
      this.loadMessages()
    } catch (_) {}
  },

  formatTime(t) {
    if (!t) return ''
    const s = String(t)
    // Keep first 16 chars: "2026-05-12 21:47"
    return s.length > 16 ? s.slice(0, 16) : s
  },
})