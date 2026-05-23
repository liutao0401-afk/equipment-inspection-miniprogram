import { useEffect, useCallback } from 'react'
import { useMaintenanceStore } from '../stores/maintenanceStore'
import { maintenanceApi } from '../lib/api'
import { toast } from 'sonner'

export function useMaintenance() {
  const {
    maintenance,
    selectedMaintenance,
    inProgressMaintenance,
    completedMaintenance,
    setMaintenance,
    setSelectedMaintenance,
    setInProgressMaintenance,
    setCompletedMaintenance,
    updateMaintenance,
    addMaintenance,
    setIsLoading,
    setError,
    reset,
  } = useMaintenanceStore()

  // 加载维修列表
  const loadMaintenance = useCallback(async (page = 1, pageSize = 20) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await maintenanceApi.list(page, pageSize)
      setMaintenance(data.data)

      // 分类维修任务
      const inProgress = data.data.filter((m) => m.status === 'in_progress')
      const completed = data.data.filter((m) => m.status === 'completed')
      setInProgressMaintenance(inProgress)
      setCompletedMaintenance(completed)
    } catch (error) {
      const message = error instanceof Error ? error.message : '加载维修列表失败'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [setMaintenance, setInProgressMaintenance, setCompletedMaintenance, setIsLoading, setError])

  // 获取维修详情
  const getMaintenanceDetails = useCallback(async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await maintenanceApi.get(id)
      setSelectedMaintenance(data)
      return data
    } catch (error) {
      const message = error instanceof Error ? error.message : '获取维修详情失败'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [setSelectedMaintenance, setIsLoading, setError])

  // 接单维修
  const acceptRepair = useCallback(async (repairId: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const maintenance = await maintenanceApi.accept(repairId)
      addMaintenance(maintenance)
      toast.success('已接单')
      return maintenance
    } catch (error) {
      const message = error instanceof Error ? error.message : '接单失败'
      setError(message)
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [addMaintenance, setIsLoading, setError])

  // 完成维修
  const completeMaintenance = useCallback(
    async (id: number, maintenanceDetails: string, images: string[]) => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await maintenanceApi.complete(id, {
          maintenanceDetails,
          images,
        })
        updateMaintenance(id, data)
        toast.success('维修已完成')
        reset()
        await loadMaintenance()
        return data
      } catch (error) {
        const message = error instanceof Error ? error.message : '完成维修失败'
        setError(message)
        toast.error(message)
        throw error
      } finally {
        setIsLoading(false)
      }
    },
    [updateMaintenance, setIsLoading, setError, reset, loadMaintenance]
  )

  // 初始化加载维修列表
  useEffect(() => {
    loadMaintenance()
  }, [loadMaintenance])

  return {
    maintenance,
    selectedMaintenance,
    inProgressMaintenance,
    completedMaintenance,
    loadMaintenance,
    getMaintenanceDetails,
    acceptRepair,
    completeMaintenance,
  }
}
