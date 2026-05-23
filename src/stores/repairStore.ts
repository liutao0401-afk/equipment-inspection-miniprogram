import { create } from 'zustand'
import type { Repair, Device } from '../types'

interface RepairStore {
  repairs: Repair[]
  selectedRepair: Repair | null
  devices: Device[]
  searchQuery: string
  isLoading: boolean
  error: string | null

  // Actions
  setRepairs: (repairs: Repair[]) => void
  setSelectedRepair: (repair: Repair | null) => void
  setDevices: (devices: Device[]) => void
  setSearchQuery: (query: string) => void
  addRepair: (repair: Repair) => void
  updateRepair: (id: number, repair: Partial<Repair>) => void
  removeRepair: (id: number) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useRepairStore = create<RepairStore>((set) => ({
  repairs: [],
  selectedRepair: null,
  devices: [],
  searchQuery: '',
  isLoading: false,
  error: null,

  setRepairs: (repairs) => set({ repairs }),
  setSelectedRepair: (repair) => set({ selectedRepair: repair }),
  setDevices: (devices) => set({ devices }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  addRepair: (repair) =>
    set((state) => ({
      repairs: [repair, ...state.repairs],
    })),
  
  updateRepair: (id, repair) =>
    set((state) => ({
      repairs: state.repairs.map((r) =>
        r.id === id ? { ...r, ...repair } : r
      ),
    })),
  
  removeRepair: (id) =>
    set((state) => ({
      repairs: state.repairs.filter((r) => r.id !== id),
    })),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      repairs: [],
      selectedRepair: null,
      devices: [],
      searchQuery: '',
      isLoading: false,
      error: null,
    }),
}))
