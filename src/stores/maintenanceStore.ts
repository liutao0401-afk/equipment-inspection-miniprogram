import { create } from 'zustand'
import type { Maintenance } from '../types'

interface MaintenanceStore {
  maintenance: Maintenance[]
  selectedMaintenance: Maintenance | null
  inProgressMaintenance: Maintenance[]
  completedMaintenance: Maintenance[]
  isLoading: boolean
  error: string | null

  // Actions
  setMaintenance: (maintenance: Maintenance[]) => void
  setSelectedMaintenance: (maintenance: Maintenance | null) => void
  setInProgressMaintenance: (maintenance: Maintenance[]) => void
  setCompletedMaintenance: (maintenance: Maintenance[]) => void
  updateMaintenance: (id: number, data: Partial<Maintenance>) => void
  addMaintenance: (maintenance: Maintenance) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useMaintenanceStore = create<MaintenanceStore>((set) => ({
  maintenance: [],
  selectedMaintenance: null,
  inProgressMaintenance: [],
  completedMaintenance: [],
  isLoading: false,
  error: null,

  setMaintenance: (maintenance) => set({ maintenance }),
  setSelectedMaintenance: (maintenance) => set({ selectedMaintenance: maintenance }),
  setInProgressMaintenance: (maintenance) => set({ inProgressMaintenance: maintenance }),
  setCompletedMaintenance: (maintenance) => set({ completedMaintenance: maintenance }),
  
  updateMaintenance: (id, data) =>
    set((state) => ({
      maintenance: state.maintenance.map((m) =>
        m.id === id ? { ...m, ...data } : m
      ),
      inProgressMaintenance: state.inProgressMaintenance.map((m) =>
        m.id === id ? { ...m, ...data } : m
      ),
      completedMaintenance: state.completedMaintenance.map((m) =>
        m.id === id ? { ...m, ...data } : m
      ),
    })),
  
  addMaintenance: (maintenance) =>
    set((state) => ({
      maintenance: [maintenance, ...state.maintenance],
      inProgressMaintenance: [maintenance, ...state.inProgressMaintenance],
    })),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      selectedMaintenance: null,
      error: null,
    }),
}))
