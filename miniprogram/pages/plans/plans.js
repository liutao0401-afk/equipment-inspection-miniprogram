const app = getApp()

const CYCLE_OPTIONS = [
  { value: 'daily', label: '日报' },
  { value: 'weekly', label: '周报' },
  { value: 'monthly', label: '月报' },
  { value: 'hourly', label: '小时' },
]

const HOUR_OPTIONS = Array.from({ length: 24 }, (_, i) => ({ value: i + 1, label: `每 ${i + 1} 小时` }))

const FREQ_LABELS = {
  daily: '日报',
  weekly: '周报',
  monthly: '月报',
}

function getFreqLabel(frequency) {
  if (!frequency) return '未知'
  if (frequency === 'hourly') return '小时'
  // 可能是 hourly-N 格式
  if (typeof frequency === 'string' && frequency.startsWith('hourly-')) {
    const hours = frequency.replace('hourly-', '')
    return `每 ${hours} 小时`
  }
  return FREQ_LABELS[frequency] || frequency
}

// 适配 Fastify 服务器的计划字段
function adaptPlan(item) {
  return {
    id: item.id,
    routeId: item.routeId,
    routeName: item.routeName || '',
    teamId: item.teamId,
    teamName: item.teamName || '',
    frequency: item.frequency,        // Fastify 用 frequency 字段
    isActive: item.status === 'active', // Fastify 用 status: 'active'/'paused'
    startDate: item.startDate,
    endDate: item.endDate || null,
    _freqLabel: getFreqLabel(item.frequency),
    _hoursInterval: null,
  }
}

Page({
  data: {
    loading: false,
    submitting: false,
    plans: [],
    isLeader: false,   // 班长及以上可增删改
    // 表单数据
    formVisible: false,
    editingPlanId: null,
    formData: {
      routeIdx: -1,
      teamIdx: -1,
      cycle: 'daily',
      hoursInterval: 1,
      hoursIdx: 0,
      startDate: '',
    },
    // 下拉选项
    routeOptions: [],
    teamOptions: [],
    // 预置选项
    cycleOptions: CYCLE_OPTIONS,
    hourOptions: HOUR_OPTIONS,
    // 原始数据
    routes: [],
    teams: [],
    // 删除确认
    deleteVisible: false,
    deleteId: null,
  },

  onShow() {
    // 角色权限：班长(leader)和admin可增删改，其他角色只读
    const user = app.globalData.userInfo || wx.getStorageSync('userInfo') || {}
    const role = user.role || ''
    this.setData({
      isLeader: role === 'admin' || (role === 'inspector' && user.isLeader),
    })

    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setActive('/pages/plans/plans')
    }
    this.loadPlans()
    this.loadOptions()
  },

  // ==================== 数据加载 ====================

  async loadPlans() {
    this.setData({ loading: true })
    try {
      const res = await app.request({ url: '/inspection/plans' })
      const items = (res && res.items) || []
      const plans = items.map(adaptPlan)
      this.setData({ plans })
    } catch (error) {
      wx.showToast({ title: error.message || '加载失败', icon: 'none' })
    } finally {
      this.setData({ loading: false })
    }
  },

  async loadOptions() {
    try {
      const [routesRes, teamsRes] = await Promise.all([
        app.request({ url: '/routes' }),
        app.request({ url: '/teams' }),
      ])
      const rawRoutes = (routesRes && routesRes.items) || routesRes || []
      const rawTeams = (teamsRes && teamsRes.items) || teamsRes || []
      const routes = rawRoutes.map(r => ({ id: r.id, name: r.name }))
      const teams = rawTeams.map(t => ({ id: t.id, name: t.name }))
      this.setData({
        routes,
        teams,
        routeOptions: routes.map(r => ({ value: r.id, label: r.name })),
        teamOptions: teams.map(t => ({ value: t.id, label: t.name })),
      })
    } catch (error) {
      console.error('加载选项失败:', error)
    }
  },

  // ==================== 新增/编辑表单 ====================

  showAddPlan() {
    this.setData({
      formVisible: true,
      editingPlanId: null,
      formData: {
        routeIdx: -1,
        teamIdx: -1,
        cycle: 'daily',
        hoursInterval: 1,
        hoursIdx: 0,
        startDate: this.getToday(),
      },
    })
  },

  async showEditPlan(e) {
    const id = e.currentTarget.dataset.id
    const plan = this.data.plans.find(p => p.id === id)
    if (!plan) return

    const routeIdx = this.data.routeOptions.findIndex(r => r.value === plan.routeId)
    const teamIdx = this.data.teamOptions.findIndex(t => t.value === plan.teamId)

    // 解析 frequency
    let cycle = plan.frequency || 'daily'
    let hoursInterval = 1
    if (typeof cycle === 'string' && cycle.startsWith('hourly-')) {
      const hours = parseInt(cycle.replace('hourly-', ''), 10)
      cycle = 'hourly'
      hoursInterval = hours || 1
    }

    this.setData({
      formVisible: true,
      editingPlanId: id,
      formData: {
        routeIdx: routeIdx >= 0 ? routeIdx : -1,
        teamIdx: teamIdx >= 0 ? teamIdx : -1,
        cycle,
        hoursInterval,
        hoursIdx: hoursInterval - 1,
        startDate: plan.startDate || this.getToday(),
      },
    })
  },

  onFormClose(e) {
    if (!e.detail.value) {
      this.setData({ formVisible: false })
    }
  },

  closeForm() {
    this.setData({ formVisible: false })
  },

  onRouteChange(e) {
    this.setData({ 'formData.routeIdx': e.detail.value })
  },

  onTeamChange(e) {
    this.setData({ 'formData.teamIdx': e.detail.value })
  },

  onCycleChange(e) {
    const value = e.currentTarget.dataset.value
    this.setData({ 'formData.cycle': value })
  },

  onHoursChange(e) {
    const idx = e.detail.value
    this.setData({
      'formData.hoursIdx': idx,
      'formData.hoursInterval': idx + 1,
    })
  },

  onStartDateChange(e) {
    this.setData({ 'formData.startDate': e.detail.value })
  },

  // ==================== 保存 ====================

  async savePlan() {
    const { formData, editingPlanId, routeOptions, teamOptions } = this.data

    if (formData.routeIdx < 0 || !routeOptions[formData.routeIdx]) {
      wx.showToast({ title: '请选择巡检线路', icon: 'none' })
      return
    }
    if (formData.teamIdx < 0 || !teamOptions[formData.teamIdx]) {
      wx.showToast({ title: '请选择巡检班组', icon: 'none' })
      return
    }

    const routeId = routeOptions[formData.routeIdx].value
    const teamId = teamOptions[formData.teamIdx].value

    this.setData({ submitting: true })
    try {
      if (editingPlanId) {
        // 更新计划：Fastify PUT /inspection/plans/:id 接受字段直接映射
        const updateData = {
          routeId,
          teamId,
          frequency: formData.cycle,
          startDate: formData.startDate || this.getToday(),
        }
        if (formData.cycle === 'hourly') {
          updateData.frequency = `hourly-${formData.hoursInterval}`
        }
        await app.request({
          url: `/inspection/plans/${editingPlanId}`,
          method: 'PUT',
          data: updateData,
        })
        wx.showToast({ title: '已更新', icon: 'success' })
      } else {
        // 创建计划：Fastify POST /inspection/plans 需要 name 和 code
        let frequency = formData.cycle
        if (frequency === 'hourly') {
          frequency = `hourly-${formData.hoursInterval}`
        }
        await app.request({
          url: '/inspection/plans',
          method: 'POST',
          data: {
            name: `计划-${this.getToday()}`,
            code: `P${Date.now()}`,
            routeId,
            teamId,
            frequency,
            startDate: formData.startDate || this.getToday(),
            items: [],
          },
        })
        wx.showToast({ title: '已创建', icon: 'success' })
      }
      this.setData({ formVisible: false })
      this.loadPlans()
    } catch (error) {
      wx.showToast({ title: error.message || '保存失败', icon: 'none' })
    } finally {
      this.setData({ submitting: false })
    }
  },

  // ==================== 启用/停用 ====================

  async toggleActive(e) {
    const id = e.currentTarget.dataset.id
    const plan = this.data.plans.find(p => p.id === id)
    if (!plan) return

    try {
      // Fastify 用 status: 'active'/'paused' 控制启停
      const newStatus = plan.isActive ? 'paused' : 'active'
      await app.request({
        url: `/inspection/plans/${id}`,
        method: 'PUT',
        data: { status: newStatus },
      })
      wx.showToast({ title: plan.isActive ? '已停用' : '已启用', icon: 'success' })
      this.loadPlans()
    } catch (error) {
      wx.showToast({ title: error.message || '操作失败', icon: 'none' })
    }
  },

  // ==================== 删除 ====================

  confirmDelete(e) {
    this.setData({
      deleteVisible: true,
      deleteId: e.currentTarget.dataset.id,
    })
  },

  closeDelete() {
    this.setData({ deleteVisible: false, deleteId: null })
  },

  async deletePlan() {
    const id = this.data.deleteId
    if (!id) return

    try {
      await app.request({ url: `/inspection/plans/${id}`, method: 'DELETE' })
      wx.showToast({ title: '已删除', icon: 'success' })
      this.setData({ deleteVisible: false, deleteId: null })
      this.loadPlans()
    } catch (error) {
      wx.showToast({ title: error.message || '删除失败', icon: 'none' })
      this.setData({ deleteVisible: false, deleteId: null })
    }
  },

  // ==================== 辅助方法 ====================

  getToday() {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
  },
})