
import { create } from 'zustand'

interface ExperienceState {
  isInteracting: boolean
  setIsInteracting: (fixed: boolean) => void
  isCameraAnimating: boolean
  setIsCameraAnimating : (fixed: boolean) => void
  isOrbitControls: boolean
  setIsOrbitControls : (fixed: boolean) => void
}

export const useStore = create<ExperienceState>()((set) => ({
  isInteracting: false,
  setIsInteracting: (fixed) => set({ isInteracting: fixed }),
  isCameraAnimating: false,
  setIsCameraAnimating: (fixed) => set({ isCameraAnimating: fixed }),
   isOrbitControls: false,
  setIsOrbitControls: (fixed) => set({ isOrbitControls: fixed }),

}))