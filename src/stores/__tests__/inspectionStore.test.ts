import { describe, it, expect, beforeEach } from 'vitest'
import { useInspectionStore } from '../inspectionStore'

describe('InspectionStore', () => {
  beforeEach(() => {
    // 重置 store
    const store = useInspectionStore()
    store.reset()
  })

  it('should initialize with default values', () => {
    const store = useInspectionStore()
    expect(store.plans).toEqual([])
    expect(store.records).toEqual([])
    expect(store.currentPlan).toBeNull()
    expect(store.recordItems).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should set plans', () => {
    const store = useInspectionStore()
    const mockPlans = [
      {
        id: 1,
        name: 'Plan 1',
        code: 'P001',
        routeName: 'Route 1',
        teamName: 'Team 1',
        frequency: 'daily',
        items: [],
      },
    ]
    store.setPlans(mockPlans as any)
    expect(store.plans).toEqual(mockPlans)
  })

  it('should set records', () => {
    const store = useInspectionStore()
    const mockRecords = [
      {
        id: 1,
        code: 'R001',
        planName: 'Plan 1',
        inspectorName: 'Inspector 1',
        teamName: 'Team 1',
        status: 'completed',
        startTime: new Date().toISOString(),
        abnormalCount: 0,
      },
    ]
    store.setRecords(mockRecords as any)
    expect(store.records).toEqual(mockRecords)
  })

  it('should set current plan', () => {
    const store = useInspectionStore()
    const mockPlan = {
      id: 1,
      name: 'Plan 1',
      code: 'P001',
      routeName: 'Route 1',
      teamName: 'Team 1',
      frequency: 'daily',
      items: [],
    }
    store.setCurrentPlan(mockPlan as any)
    expect(store.currentPlan).toEqual(mockPlan)
  })

  it('should add record item', () => {
    const store = useInspectionStore()
    const mockItem = {
      id: 1,
      recordId: 0,
      itemId: 1,
      deviceId: 1,
      itemName: 'Item 1',
      result: 'OK',
      status: 'normal' as any,
      remarks: 'Good',
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    store.addRecordItem(mockItem)
    expect(store.recordItems).toHaveLength(1)
    expect(store.recordItems[0]).toEqual(mockItem)
  })

  it('should remove record item', () => {
    const store = useInspectionStore()
    const mockItem = {
      id: 1,
      recordId: 0,
      itemId: 1,
      deviceId: 1,
      itemName: 'Item 1',
      result: 'OK',
      status: 'normal' as any,
      remarks: 'Good',
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    store.addRecordItem(mockItem)
    expect(store.recordItems).toHaveLength(1)

    store.removeRecordItem(1)
    expect(store.recordItems).toHaveLength(0)
  })

  it('should update record item', () => {
    const store = useInspectionStore()
    const mockItem = {
      id: 1,
      recordId: 0,
      itemId: 1,
      deviceId: 1,
      itemName: 'Item 1',
      result: 'OK',
      status: 'normal' as any,
      remarks: 'Good',
      images: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    store.addRecordItem(mockItem)
    store.updateRecordItem(1, { result: 'UPDATED' })
    expect(store.recordItems[0].result).toBe('UPDATED')
  })

  it('should set loading state', () => {
    const store = useInspectionStore()
    store.setIsLoading(true)
    expect(store.isLoading).toBe(true)
    store.setIsLoading(false)
    expect(store.isLoading).toBe(false)
  })

  it('should set error state', () => {
    const store = useInspectionStore()
    store.setError('Test error')
    expect(store.error).toBe('Test error')
    store.setError(null)
    expect(store.error).toBeNull()
  })

  it('should reset store', () => {
    const store = useInspectionStore()
    store.setPlans([{ id: 1 } as any])
    store.setIsLoading(true)
    store.setError('Error')

    store.reset()

    expect(store.plans).toEqual([])
    expect(store.records).toEqual([])
    expect(store.currentPlan).toBeNull()
    expect(store.recordItems).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })
})
