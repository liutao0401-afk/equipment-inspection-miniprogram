const app = getApp()

function buildWebviewUrl() {
  const { h5Url, token, userInfo } = app.globalData
  const hashParams = []

  if (token) {
    hashParams.push(`wechat_token=${encodeURIComponent(token)}`)
  }

  if (userInfo) {
    hashParams.push(`wechat_user=${encodeURIComponent(JSON.stringify(userInfo))}`)
  }

  return hashParams.length > 0 ? `${h5Url}#${hashParams.join('&')}` : h5Url
}

Page({
  data: {
    webviewUrl: '',
    isLoading: true,
    loadError: false,
    errorMsg: ''
  },

  onLoad() {
    this.setData({
      webviewUrl: buildWebviewUrl(),
      isLoading: true,
      loadError: false
    })
  },

  onShow() {
    const url = buildWebviewUrl()
    if (this.data.webviewUrl !== url) {
      this.setData({ webviewUrl: url })
    }
  },

  onWebviewLoad() {
    this.setData({ isLoading: false, loadError: false })
  },

  onWebviewError() {
    this.setData({
      isLoading: false,
      loadError: true,
      errorMsg: '页面加载失败，请检查网络连接'
    })
  },

  onRetry() {
    this.setData({
      isLoading: true,
      loadError: false,
      webviewUrl: ''
    })
    setTimeout(() => {
      this.setData({ webviewUrl: buildWebviewUrl() })
    }, 100)
  },

  onShareAppMessage() {
    return {
      title: '设备巡检系统',
      path: '/pages/index/index'
    }
  }
})
