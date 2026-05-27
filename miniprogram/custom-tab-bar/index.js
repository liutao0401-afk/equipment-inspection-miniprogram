const app = getApp()

// 按角色定义可见的标签页
const ROLE_TABS = {
  admin: [
    { pagePath: '/pages/home/home', text: '首页', icon: '⌂' },
    { pagePath: '/pages/inspection/inspection', text: '巡检', icon: '✓' },
    { pagePath: '/pages/repair/repair', text: '报修', icon: '+' },
    { pagePath: '/pages/maintenance/maintenance', text: '维修', icon: '⚒' },
    { pagePath: '/pages/profile/profile', text: '我的', icon: '●' },
  ],
  // 巡检员（含班长）：首页、巡检、报修、我的
  inspector: [
    { pagePath: '/pages/home/home', text: '首页', icon: '⌂' },
    { pagePath: '/pages/inspection/inspection', text: '巡检', icon: '✓' },
    { pagePath: '/pages/repair/repair', text: '报修', icon: '+' },
    { pagePath: '/pages/profile/profile', text: '我的', icon: '●' },
  ],
  // 维修员：首页、报修、我的
  maintenance: [
    { pagePath: '/pages/home/home', text: '首页', icon: '⌂' },
    { pagePath: '/pages/repair/repair', text: '报修', icon: '+' },
    { pagePath: '/pages/profile/profile', text: '我的', icon: '●' },
  ],
}

Component({
  data: {
    active: 0,
    tabs: [],
    gridStyle: 'grid-template-columns: repeat(4, 1fr)',
  },

  lifetimes: {
    attached() {
      this.updateTabs()
    },
  },

  pageLifetimes: {
    show() {
      // 每次页面显示时刷新，确保角色变更后 tab 同步
      this.updateTabs()
    },
  },

  methods: {
    // 根据当前用户角色获取标签页列表
    getTabsByRole() {
      const user = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
      const role = user.role || 'admin'
      return ROLE_TABS[role] || ROLE_TABS.admin
    },

    // 刷新 tab 列表
    updateTabs() {
      const tabs = this.getTabsByRole()
      const gridStyle = `grid-template-columns: repeat(${tabs.length}, 1fr)`
      this.setData({ tabs, gridStyle })
    },

    // 根据页面路径设置 active 索引
    setActive(pagePath) {
      const tabs = this.getTabsByRole()
      const index = tabs.findIndex(t => t.pagePath === pagePath)
      const gridStyle = `grid-template-columns: repeat(${tabs.length}, 1fr)`
      this.setData({ active: index >= 0 ? index : 0, tabs, gridStyle })
    },

    switchTab(e) {
      const index = Number(e.currentTarget.dataset.index)
      const tab = this.data.tabs[index]
      if (!tab || index === this.data.active) return
      wx.switchTab({ url: tab.pagePath })
    },
  },
})