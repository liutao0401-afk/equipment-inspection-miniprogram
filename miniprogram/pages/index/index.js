// pages/index/index.js
const app = getApp()

Page({
  data: {
    webviewUrl: '',
    isLoading: true,
    loadError: false,
    errorMsg: ''
  },

  onLoad() {
    const url = app.globalData.h5Url
    console.log('加载 H5 地址:', url)
    this.setData({
      webviewUrl: url,
      isLoading: true,
      loadError: false
    })
  },

  onShow() {
    // 每次显示时刷新 URL（处理登录状态变化）
    const url = app.globalData.h5Url
    if (this.data.webviewUrl !== url) {
      this.setData({ webviewUrl: url })
    }
  },

  // web-view 加载完成
  onWebviewLoad(e) {
    console.log('H5 加载完成', e.detail)
    this.setData({ isLoading: false, loadError: false })
  },

  // web-view 加载错误
  onWebviewError(e) {
    console.error('H5 加载失败', e.detail)
    this.setData({
      isLoading: false,
      loadError: true,
      errorMsg: '页面加载失败，请检查网络连接'
    })
  },

  // 重新加载
  onRetry() {
    this.setData({
      isLoading: true,
      loadError: false,
      webviewUrl: ''
    })
    setTimeout(() => {
      this.setData({ webviewUrl: app.globalData.h5Url })
    }, 100)
  },

  // 分享
  onShareAppMessage() {
    return {
      title: '设备巡检系统',
      path: '/pages/index/index'
    }
  }
})
