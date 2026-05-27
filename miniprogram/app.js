App({
  globalData: {
    apiBaseUrl: '',
    userInfo: null,
    token: null
  },

  onLaunch() {
    // 自动选择API地址：开发者工具用 127.0.0.1，手机预览用公网 HTTPS
    try {
      const sysInfo = wx.getSystemInfoSync()
      const isDevtools = sysInfo.platform === 'devtools'
      this.globalData.apiBaseUrl = isDevtools
        ? 'http://127.0.0.1:3000/api'
        : 'https://weixin.hazlai.com/api'
    } catch {
      this.globalData.apiBaseUrl = 'http://127.0.0.1:3000/api'
    }
    // 允许通过 Storage 覆盖
    const storedUrl = wx.getStorageSync('apiBaseUrl')
    if (storedUrl) {
      this.globalData.apiBaseUrl = storedUrl
    }

    const token = wx.getStorageSync('token')
    const userInfo = wx.getStorageSync('userInfo')

    if (token) {
      this.globalData.token = token
      this.globalData.userInfo = userInfo || null
    }
  },

  setSession(userInfo, token) {
    this.globalData.userInfo = userInfo
    this.globalData.token = token
    wx.setStorageSync('userInfo', userInfo)
    wx.setStorageSync('token', token)
  },

  clearSession() {
    this.globalData.userInfo = null
    this.globalData.token = null
    wx.removeStorageSync('userInfo')
    wx.removeStorageSync('token')
  },

  request(options) {
    const token = this.globalData.token || wx.getStorageSync('token')
    const url = options.url.startsWith('http')
      ? options.url
      : `${this.globalData.apiBaseUrl}${options.url}`

    return new Promise((resolve, reject) => {
      wx.request({
        url,
        method: options.method || 'GET',
        data: options.data || {},
        header: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
          ...(options.header || {})
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const body = res.data

            // 统一处理服务器响应格式: { success: true, data: ..., pagination?: ... }
            if (body && typeof body === 'object' && 'success' in body && 'data' in body) {
              const innerData = body.data
              // data 为数组 → 包装为 { items, total } 兼容页面写法
              if (Array.isArray(innerData)) {
                const result = { items: innerData }
                if (body.pagination && body.pagination.total !== undefined) {
                  result.total = body.pagination.total
                }
                resolve(result)
                return
              }
              // data 为对象（单条记录、登录响应等）→ 直接返回
              resolve(innerData)
              return
            }

            resolve(body)
            return
          }

          if (res.statusCode === 401) {
            this.clearSession()
            wx.reLaunch({ url: '/pages/login/login' })
          }

          reject(new Error((res.data && (res.data.message || res.data.error)) || '请求失败'))
        },
        fail: (error) => reject(new Error(error.errMsg || '网络请求失败'))
      })
    })
  },

  // 上传文件（拍照/相册选择后上传到服务器）
  uploadFile(filePath) {
    const token = this.globalData.token || wx.getStorageSync('token')
    const url = `${this.globalData.apiBaseUrl}/upload`

    // 服务端静态文件的基础地址（去掉 /api 后缀）
    const serverBase = this.globalData.apiBaseUrl.replace(/\/api\/?$/, '')

    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url,
        filePath,
        name: 'file',
        header: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        success: (res) => {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            try {
              const data = JSON.parse(res.data)
              const url = data.url || data.data?.url
              // 如果是相对路径，转为绝对路径
              if (url && url.startsWith('/')) {
                resolve(`${serverBase}${url}`)
              } else {
                resolve(url)
              }
            } catch {
              reject(new Error('上传返回格式异常'))
            }
          } else {
            reject(new Error('上传失败'))
          }
        },
        fail: (error) => reject(new Error(error.errMsg || '上传失败')),
      })
    })
  }
})