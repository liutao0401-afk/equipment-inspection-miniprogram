App({
  globalData: {
    h5Url: 'https://weixin.hazlai.com',
    userInfo: null,
    token: null
  },

  onLaunch() {
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')

    if (token) {
      this.globalData.token = token
      this.globalData.userInfo = userInfo || null
    }
  }
})
