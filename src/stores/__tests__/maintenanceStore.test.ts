import { describe, it, expect, beforeEach } from 'vitest'
import { useMaintenanceStore } from '../maintenanceStore'

// 在测试环境中使用 getState() 而非 React hook
const getStore = () => useMaintenanceStore.getState()

describe('MaintenanceStore', () => {
  beforeEach(() => {
    getStore().reset()
  })

  it('should initialize with default values', () => {
    const store = getStore()
    expect(store.maintenance).toEqual([])
    expect(store.selectedMaintenance).toBeNull()
  })

  it('should set maintenance', () => {
    const store = getStore()
    const mockMaintenance = [
      {
        id: 1,
        code: 'M001',
        deviceName: 'Device 1',
        type: 'repair',
        status: 'in_progress',
      },
    ]
    store.setMaintenance(mockMaintenance as any)
    expect(getStore().maintenance).toEqual(mockMaintenance)
  })

  it('should set selected maintenance', () => {
    const store = getStore()
    const mockMaintenance = {
      id: 1,
      code: 'M001',
      deviceName: 'Device 1',
      type: 'repair',
      status: 'in_progress',
    }
    store.setSelectedMaintenance(mockMaintenance as any)
    expect(getStore().selectedMaintenance).toEqual(mockMaintenance)
  })

  it('should update maintenance', () => {
    const store = getStore()
    const mockMaintenance = {
      id: 1,
      code: 'M001',
      deviceName: 'Device 1',
      type: 'repair',
      status: 'in_progress',
    }
    store.setMaintenance([mockMaintenance as any])
    store.updateMaintenance(1, { status: 'completed' })
    expect(getStore().maintenance[0].status).toBe('completed')
  })

  it('should reset store', () => {
    const store = getStore()
    store.setMaintenance([{ id: 1 } as any])
    store.setSelectedMaintenance({ id: 1 } as any)

    store.reset()

    expect(getStore().maintenance).toEqual([])
    expect(getStore().selectedMaintenance).toBeNull()
  })
})
