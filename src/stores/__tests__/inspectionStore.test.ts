import { describe, it, expect, beforeEach } from 'vitest'
import { useInspectionStore } from '../inspectionStore'

// 在测试环境中使用 getState() 而非 React hook
const getStore = () => useInspectionStore.getState()

describe('InspectionStore', () => {
  beforeEach(() => {
    getStore().reset()
  })

  it('should initialize with default values', () => {
    const store = getStore()
    expect(store.plans).toEqual([])
    expect(store.records).toEqual([])
    expect(store.currentPlan).toBeNull()
    expect(store.recordItems).toEqual([])
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('should set plans', () => {
    const store = getStore()
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
    expect(getStore().plans).toEqual(mockPlans)
  })

  it('should set records', () => {
    const store = getStore()
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
    expect(getStore().records).toEqual(mockRecords)
  })

  it('should set current plan', () => {
    const store = getStore()
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
    expect(getStore().currentPlan).toEqual(mockPlan)
  })

  it('should add record item', () => {
    const store = getStore()
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
    expect(getStore().recordItems).toHaveLength(1)
    expect(getStore().recordItems[0]).toEqual(mockItem)
  })

  it('should remove record item', () => {
    const store = getStore()
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
    expect(getStore().recordItems).toHaveLength(1)

    store.removeRecordItem(1)
    expect(getStore().recordItems).toHaveLength(0)
  })

  it('should update record item', () => {
    const store = getStore()
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
    expect(getStore().recordItems[0].result).toBe('UPDATED')
  })

  it('should set loading state', () => {
    const store = getStore()
    store.setIsLoading(true)
    expect(getStore().isLoading).toBe(true)
    store.setIsLoading(false)
    expect(getStore().isLoading).toBe(false)
  })

  it('should set error state', () => {
    const store = getStore()
    store.setError('Test error')
    expect(getStore().error).toBe('Test error')
    store.setError(null)
    expect(getStore().error).toBeNull()
  })

  it('should reset store', () => {
    const store = getStore()
    store.setPlans([{ id: 1 } as any])
    store.setIsLoading(true)
    store.setError('Error')

    store.reset()

    expect(getStore().plans).toEqual([])
    expect(getStore().records).toEqual([])
    expect(getStore().currentPlan).toBeNull()
    expect(getStore().recordItems).toEqual([])
    expect(getStore().isLoading).toBe(false)
    expect(getStore().error).toBeNull()
  })
})
