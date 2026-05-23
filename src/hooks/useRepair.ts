import { useEffect, useCallback } from 'react'
import { useRepairStore } from '../stores/repairStore'
import { repairApi, deviceApi } from '../lib/api'
import { toast } from 'sonner'
import type { CreateRepairRequest } from '../types'

export function useRepair() {
  const {
    repairs,
    selectedRepair,
    devices,
    searchQuery,
    setRepairs,
    setSelectedRepair,
    setDevices,
    setSearchQuery,
    addRepair,
    updateRepair,
    setIsLoading,
    setError,
    reset,
  } = useRepairStore()

  // 加载报修单列表
  const loadRepairs = useCallback(async (page = 1, pageSize = 20) => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await repairApi.list(page, pageSize)
      setRepairs(data.data)
    } catch (error) {
      const message = error instanceof Error ? error.message : '加载报修单失败'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [setRepairs, setIsLoading, setError])

  // 搜索设备
  const searchDevices = useCallback(async (query: string) => {
    if (!query.trim()) {
      setDevices([])
      return
    }

    try {
      setIsLoading(true)
      setError(null)
      const data = await deviceApi.search(query)
      setDevices(data)
    } catch (error) {
      const message = error instanceof Error ? error.message : '搜索设备失败'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [setDevices, setIsLoading, setError])

  // 创建报修单
  const createRepair = useCallback(async (payload: CreateRepairRequest) => {
    try {
      setIsLoading(true)
      setError(null)
      const repair = await repairApi.create(payload)
      addRepair(repair)
      toast.success('报修单已创建')
      reset()
      return repair
    } catch (error) {
      const message = error instanceof Error ? error.message : '创建报修单失败'
      setError(message)
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [addRepair, setIsLoading, setError, reset])

  // 获取报修单详情
  const getRepairDetails = useCallback(async (id: number) => {
    try {
      setIsLoading(true)
      setError(null)
      const repair = await repairApi.get(id)
      setSelectedRepair(repair)
      return repair
    } catch (error) {
      const message = error instanceof Error ? error.message : '获取报修单详情失败'
      setError(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }, [setSelectedRepair, setIsLoading, setError])

  // 更新报修单状态
  const updateRepairStatus = useCallback(async (id: number, status: string) => {
    try {
      setIsLoading(true)
      setError(null)
      const repair = await repairApi.updateStatus(id, { status: status as any })
      updateRepair(id, repair)
      toast.success('报修单已更新')
      return repair
    } catch (error) {
      const message = error instanceof Error ? error.message : '更新报修单失败'
      setError(message)
      toast.error(message)
      throw error
    } finally {
      setIsLoading(false)
    }
  }, [updateRepair, setIsLoading, setError])

  // 初始化加载报修单
  useEffect(() => {
    loadRepairs()
  }, [loadRepairs])

  // 搜索设备防抖
  useEffect(() => {
    const timer = setTimeout(() => {
      searchDevices(searchQuery)
    }, 300)

    return () => clearTimeout(timer)
  }, [searchQuery, searchDevices])

  return {
    repairs,
    selectedRepair,
    devices,
    searchQuery,
    loadRepairs,
    searchDevices,
    createRepair,
    getRepairDetails,
    updateRepairStatus,
    setSearchQuery,
  }
}
