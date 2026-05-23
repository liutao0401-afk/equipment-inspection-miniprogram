import { describe, it, expect, beforeEach } from 'vitest'
import { useRepairStore } from '../repairStore'

// 在测试环境中使用 getState() 而非 React hook
const getStore = () => useRepairStore.getState()

describe('RepairStore', () => {
  beforeEach(() => {
    getStore().reset()
  })

  it('should initialize with default values', () => {
    const store = getStore()
    expect(store.repairs).toEqual([])
    expect(store.selectedRepair).toBeNull()
  })

  it('should set repairs', () => {
    const store = getStore()
    const mockRepairs = [
      {
        id: 1,
        code: 'R001',
        deviceName: 'Device 1',
        description: 'Broken',
        status: 'pending',
      },
    ]
    store.setRepairs(mockRepairs as any)
    expect(getStore().repairs).toEqual(mockRepairs)
  })

  it('should set selected repair', () => {
    const store = getStore()
    const mockRepair = {
      id: 1,
      code: 'R001',
      deviceName: 'Device 1',
      description: 'Broken',
      status: 'pending',
    }
    store.setSelectedRepair(mockRepair as any)
    expect(getStore().selectedRepair).toEqual(mockRepair)
  })

  it('should add repair', () => {
    const store = getStore()
    const mockRepair = {
      id: 1,
      code: 'R001',
      deviceName: 'Device 1',
      description: 'Broken',
      status: 'pending',
    }
    store.addRepair(mockRepair as any)
    expect(getStore().repairs).toHaveLength(1)
    expect(getStore().repairs[0]).toEqual(mockRepair)
  })

  it('should update repair', () => {
    const store = getStore()
    const mockRepair = {
      id: 1,
      code: 'R001',
      deviceName: 'Device 1',
      description: 'Broken',
      status: 'pending',
    }
    store.addRepair(mockRepair as any)
    store.updateRepair(1, { status: 'processing' as any })
    expect(getStore().repairs[0].status).toBe('processing')
  })

  it('should reset store', () => {
    const store = getStore()
    store.addRepair({ id: 1 } as any)
    store.setSelectedRepair({ id: 1 } as any)

    store.reset()

    expect(getStore().repairs).toEqual([])
    expect(getStore().selectedRepair).toBeNull()
  })
})
