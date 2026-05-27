const app = getApp()

Page({
  data: {
    loading: false,
    message: null,
    relatedImages: [],
  },

  onLoad(options) {
    if (options.id) {
      this.loadMessage(options.id)
    }
  },

  async loadMessage(id) {
    this.setData({ loading: true })
    try {
      const msg = await app.request({ url: `/notifications/${id}` })
      this.setData({ message: msg })

      // 如果关联了报修单，加载报修单照片
      if (msg.relatedType === 'repair' && msg.relatedId) {
        try {
          const repair = await app.request({ url: `/repairs/${msg.relatedId}` })
          let images = []
          if (repair.images) {
            if (typeof repair.images === 'string') {
              try { images = JSON.parse(repair.images) } catch { images = [] }
            } else if (Array.isArray(repair.images)) {
              images = repair.images
            }
          }
          images = images.map(u => this._resolveImageUrl(u))
          this.setData({ relatedImages: images })
        } catch (_) {}
      }
    } catch (error) {
      wx.showToast({ title: '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  previewImage(e) {
    const src = e.currentTarget.dataset.src
    if (src) {
      wx.previewImage({
        urls: this.data.relatedImages,
        current: src,
      })
    }
  },

  _resolveImageUrl(url) {
    if (!url) return ''
    if (url.startsWith('http://') || url.startsWith('https://')) return url
    const apiBase = (app.globalData.apiBaseUrl || 'http://localhost:3000/api').replace(/\/api$/, '')
    return `${apiBase}${url.startsWith('/') ? '' : '/'}${url}`
  },
})