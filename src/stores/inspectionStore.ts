import { create } from 'zustand'
import type { InspectionPlan, InspectionRecord, InspectionRecordItem } from '../types'

interface InspectionStore {
  plans: InspectionPlan[]
  records: InspectionRecord[]
  currentPlan: InspectionPlan | null
  currentRecord: InspectionRecord | null
  recordItems: InspectionRecordItem[]
  isLoading: boolean
  error: string | null

  // Actions
  setPlans: (plans: InspectionPlan[]) => void
  setRecords: (records: InspectionRecord[]) => void
  setCurrentPlan: (plan: InspectionPlan | null) => void
  setCurrentRecord: (record: InspectionRecord | null) => void
  setRecordItems: (items: InspectionRecordItem[]) => void
  addRecordItem: (item: InspectionRecordItem) => void
  updateRecordItem: (id: number, item: Partial<InspectionRecordItem>) => void
  removeRecordItem: (id: number) => void
  setIsLoading: (loading: boolean) => void
  setError: (error: string | null) => void
  reset: () => void
}

export const useInspectionStore = create<InspectionStore>((set) => ({
  plans: [],
  records: [],
  currentPlan: null,
  currentRecord: null,
  recordItems: [],
  isLoading: false,
  error: null,

  setPlans: (plans) => set({ plans }),
  setRecords: (records) => set({ records }),
  setCurrentPlan: (plan) => set({ currentPlan: plan }),
  setCurrentRecord: (record) => set({ currentRecord: record }),
  setRecordItems: (items) => set({ recordItems: items }),
  
  addRecordItem: (item) =>
    set((state) => ({
      recordItems: [...state.recordItems, item],
    })),
  
  updateRecordItem: (id, item) =>
    set((state) => ({
      recordItems: state.recordItems.map((i) =>
        i.id === id ? { ...i, ...item } : i
      ),
    })),
  
  removeRecordItem: (id) =>
    set((state) => ({
      recordItems: state.recordItems.filter((i) => i.id !== id),
    })),
  
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  
  reset: () =>
    set({
      currentPlan: null,
      currentRecord: null,
      recordItems: [],
      error: null,
    }),
}))
