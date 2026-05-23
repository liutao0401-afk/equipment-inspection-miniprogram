// app.js
App({
  globalData: {
    // H5 应用地址 - 外网访问地址（HTTPS，微信小程序要求）
    h5Url: 'https://weixin.hazlai.com',
    // 内网地址（仅开发调试用）
    // h5Url: 'http://192.188.88.48:3000',
    userInfo: null,
    token: null
  },

  onLaunch() {
    console.log('设备巡检小程序启动')
    // 读取本地存储的登录信息
    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')
    if (token) {
      this.globalData.token = token
      this.globalData.userInfo = userInfo
    }
  },

  onShow() {
    console.log('小程序显示')
  },

  onHide() {
    console.log('小程序隐藏')
  }
})
