const app = getApp()

const roleMap = {
  admin: '管理员',
  inspector: '巡检员',
  maintenance: '维修员',
}

Page({
  data: {
    user: {},
    avatarText: '巡',
    roleText: '-',

    // 密码修改
    showPasswordSection: false,
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
    showOldPwd: false,
    showNewPwd: false,
    showConfirmPwd: false,
    changingPassword: false,
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActive('/pages/profile/profile')
    }
    this.loadUserInfo()
  },

  loadUserInfo() {
    const user = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
    const displayName = user.name || user.username || '巡'
    this.setData({
      user,
      avatarText: displayName.slice(0, 1),
      roleText: (user.role === 'inspector' && user.isLeader) ? '班长' : (roleMap[user.role] || user.role || '-'),
    })
  },

  // ==================== 密码修改 ====================

  togglePasswordSection() {
    this.setData({
      showPasswordSection: !this.data.showPasswordSection,
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
      showOldPwd: false,
      showNewPwd: false,
      showConfirmPwd: false,
    })
  },

  toggleShowOldPwd() {
    this.setData({ showOldPwd: !this.data.showOldPwd })
  },
  toggleShowNewPwd() {
    this.setData({ showNewPwd: !this.data.showNewPwd })
  },
  toggleShowConfirmPwd() {
    this.setData({ showConfirmPwd: !this.data.showConfirmPwd })
  },

  onOldPasswordInput(e) {
    this.setData({ oldPassword: e.detail.value })
  },
  onNewPasswordInput(e) {
    this.setData({ newPassword: e.detail.value })
  },
  onConfirmPasswordInput(e) {
    this.setData({ confirmPassword: e.detail.value })
  },

  async changePassword() {
    const { user, oldPassword, newPassword, confirmPassword } = this.data

    if (!oldPassword) {
      wx.showToast({ title: '请输入当前密码', icon: 'none' })
      return
    }
    if (!newPassword) {
      wx.showToast({ title: '请输入新密码', icon: 'none' })
      return
    }
    if (newPassword.length < 6) {
      wx.showToast({ title: '新密码至少6位', icon: 'none' })
      return
    }
    if (newPassword !== confirmPassword) {
      wx.showToast({ title: '两次输入的新密码不一致', icon: 'none' })
      return
    }

    this.setData({ changingPassword: true })
    try {
      // Fastify: PUT /accounts/:id/password 接受 { password } 明文
      await app.request({
        url: `/accounts/${user.id}/password`,
        method: 'PUT',
        data: {
          password: newPassword,
        },
      })

      wx.showToast({ title: '密码修改成功', icon: 'success' })

      this.setData({
        showPasswordSection: false,
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    } catch (error) {
      wx.showToast({ title: error.message || '密码修改失败', icon: 'none' })
    } finally {
      this.setData({ changingPassword: false })
    }
  },

  // ==================== 导航 ====================

  goPlans() {
    wx.navigateTo({ url: '/pages/plans/plans' })
  },

  logout() {
    wx.showModal({
      title: '退出登录',
      content: '确定要退出当前账号吗？',
      success: (res) => {
        if (res.confirm) {
          app.clearSession()
          wx.reLaunch({ url: '/pages/login/login' })
        }
      },
    })
  },
})