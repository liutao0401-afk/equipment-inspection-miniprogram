const app = getApp()

Page({
  data: {
    username: '',
    password: '',
    loading: false
  },

  onLoad() {
    if (app.globalData.token || wx.getStorageSync('token')) {
      wx.switchTab({ url: '/pages/home/home' })
    }
  },

  onUsernameInput(e) {
    this.setData({ username: e.detail.value })
  },

  onPasswordInput(e) {
    this.setData({ password: e.detail.value })
  },

  async onLogin() {
    const { username, password } = this.data

    if (!username.trim() || !password.trim()) {
      wx.showToast({ title: '请输入用户名和密码', icon: 'none' })
      return
    }

    this.setData({ loading: true })

    try {
      const data = await app.request({
        url: '/auth/login',
        method: 'POST',
        data: { username, password }
      })
      // 服务器返回 { token, user: { id, name, username, role, isLeader, teamId, teamName } }
      // 补充 employeeNo 字段兼容旧代码引用
      const user = {
        ...data.user,
        username: data.user.username,
        employeeNo: data.user.username || data.user.employeeNo,
      }
      app.setSession(user, data.token)
      wx.switchTab({ url: '/pages/home/home' })
    } catch (error) {
      wx.showToast({ title: error.message || '登录失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  }
})
