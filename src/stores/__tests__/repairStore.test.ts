import { describe, it, expect, beforeEach } from 'vitest'
import { useRepairStore } from '../repairStore'

describe('RepairStore', () => {
  beforeEach(() => {
    const store = useRepairStore()
    store.reset()
  })

  it('should initialize with default values', () => {
    const store = useRepairStore()
    expect(store.repairs).toEqual([])
    expect(store.selectedRepair).toBeNull()
  })

  it('should set repairs', () => {
    const store = useRepairStore()
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
    expect(store.repairs).toEqual(mockRepairs)
  })

  it('should set selected repair', () => {
    const store = useRepairStore()
    const mockRepair = {
      id: 1,
      code: 'R001',
      deviceName: 'Device 1',
      description: 'Broken',
      status: 'pending',
    }
    store.setSelectedRepair(mockRepair as any)
    expect(store.selectedRepair).toEqual(mockRepair)
  })

  it('should add repair', () => {
    const store = useRepairStore()
    const mockRepair = {
      id: 1,
      code: 'R001',
      deviceName: 'Device 1',
      description: 'Broken',
      status: 'pending',
    }
    store.addRepair(mockRepair as any)
    expect(store.repairs).toHaveLength(1)
    expect(store.repairs[0]).toEqual(mockRepair)
  })

  it('should update repair', () => {
    const store = useRepairStore()
    const mockRepair = {
      id: 1,
      code: 'R001',
      deviceName: 'Device 1',
      description: 'Broken',
      status: 'pending',
    }
    store.addRepair(mockRepair as any)
    store.updateRepair(1, { status: 'processing' })
    expect(store.repairs[0].status).toBe('processing')
  })

  it('should reset store', () => {
    const store = useRepairStore()
    store.addRepair({ id: 1 } as any)
    store.setSelectedRepair({ id: 1 } as any)

    store.reset()

    expect(store.repairs).toEqual([])
    expect(store.selectedRepair).toBeNull()
  })
})
