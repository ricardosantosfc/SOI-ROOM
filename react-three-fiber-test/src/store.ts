
import { create } from 'zustand'

interface ExperienceState {
  isCameraFixed: boolean
  setIsCameraFixed: (fixed: boolean) => void
}

export const useStore = create<ExperienceState>()((set) => ({
  isCameraFixed: false,
  setIsCameraFixed: (fixed) => set({ isCameraFixed: fixed }) 
}))