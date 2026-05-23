import { useEffect, useCallback } from 'react'
import { useInspectionStore } from '../stores/inspectionStore'
import { inspectionApi } from '../lib/api'
import { toast } from 'sonner'

export function useInspection() {
  const {
    plans,
    records,
    currentPlan,
    recordItems,
    setPlans,
    setRecords,
    setCurrentPlan,
    setRecordItems,
    setIsLoading,
    setError,
    reset,
  } = useInspectionStore()

  // 加载巡检计划
  const loadPlans = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await inspectionApi.listPlans()
      setPlans(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : '加载巡检计划失败'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [setPlans, setIsLoading, setError])

  // 加载巡检记录
  const loadRecords = useCallback(async (page = 1, pageSize = 20) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await inspectionApi.listRecords(page, pageSize)
      setRecords(data.data)
    } catch (error) {
      const message = error instanceof Error ? error.message : '加载巡检记录失败'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [setRecords, setIsLoading, setError])

  // 获取计划详情
  const getPlanDetails = useCallback(async (planId: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const plan = await inspectionApi.getPlan(planId)
      setCurrentPlan(plan)
      setRecordItems(plan.items || [])
    } catch (error) {
      const message = error instanceof Error ? error.message : '获取计划详情失败'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [setCurrentPlan, setRecordItems, setIsLoading, setError])

  // 提交巡检记录
  const submitInspection = useCallback(async (planId: number, inspectorId: number) => {
    try {
      setIsLoading(true)
      setError(null)

      const payload = {
        planId,
        inspectorId,
        items: recordItems.map((item) => ({
          itemId: item.id,
          deviceId: item.deviceId,
          result: item.result,
          status: item.status,
          remarks: item.remarks,
          images: item.images,
        })),
      }

      const result = await inspectionApi.execute(payload)
      toast.success('巡检记录已提交')
      reset()
      await loadRecords()
      return result
    } catch (error) {
      const message = error instanceof Error ? error.message : '提交巡检记录失败'
      setError(message)
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [recordItems, setIsLoading, setError, reset, loadRecords])

  // 初始化加载计划
  useEffect(() => {
    loadPlans()
  }, [loadPlans])

  return {
    plans,
    records,
    currentPlan,
    recordItems,
    loadPlans,
    loadRecords,
    getPlanDetails,
    submitInspection,
  }
}
