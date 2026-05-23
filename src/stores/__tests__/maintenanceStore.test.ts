import { describe, it, expect, beforeEach } from 'vitest'
import { useMaintenanceStore } from '../maintenanceStore'

describe('MaintenanceStore', () => {
  beforeEach(() => {
    const store = useMaintenanceStore()
    store.reset()
  })

  it('should initialize with default values', () => {
    const store = useMaintenanceStore()
    expect(store.maintenance).toEqual([])
    expect(store.selectedMaintenance).toBeNull()
  })

  it('should set maintenance', () => {
    const store = useMaintenanceStore()
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
    expect(store.maintenance).toEqual(mockMaintenance)
  })

  it('should set selected maintenance', () => {
    const store = useMaintenanceStore()
    const mockMaintenance = {
      id: 1,
      code: 'M001',
      deviceName: 'Device 1',
      type: 'repair',
      status: 'in_progress',
    }
    store.setSelectedMaintenance(mockMaintenance as any)
    expect(store.selectedMaintenance).toEqual(mockMaintenance)
  })

  it('should update maintenance', () => {
    const store = useMaintenanceStore()
    const mockMaintenance = {
      id: 1,
      code: 'M001',
      deviceName: 'Device 1',
      type: 'repair',
      status: 'in_progress',
    }
    store.setMaintenance([mockMaintenance as any])
    store.updateMaintenance(1, { status: 'completed' })
    expect(store.maintenance[0].status).toBe('completed')
  })

  it('should reset store', () => {
    const store = useMaintenanceStore()
    store.setMaintenance([{ id: 1 } as any])
    store.setSelectedMaintenance({ id: 1 } as any)

    store.reset()

    expect(store.maintenance).toEqual([])
    expect(store.selectedMaintenance).toBeNull()
  })
})
