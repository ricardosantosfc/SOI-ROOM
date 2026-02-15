
import { create } from 'zustand'

interface ExperienceState {
  isCameraFixed: boolean
  setIsCameraFixed: (fixed: boolean) => void
  isCameraAnimating: boolean
  setIsCameraAnimating : (fixed: boolean) => void
  isOrbitControls: boolean
  setIsOrbitControls : (fixed: boolean) => void
}

export const useStore = create<ExperienceState>()((set) => ({
  isCameraFixed: false,
  setIsCameraFixed: (fixed) => set({ isCameraFixed: fixed }),
  isCameraAnimating: false,
  setIsCameraAnimating: (fixed) => set({ isCameraAnimating: fixed }),
   isOrbitControls: false,
  setIsOrbitControls: (fixed) => set({ isOrbitControls: fixed }),

}))