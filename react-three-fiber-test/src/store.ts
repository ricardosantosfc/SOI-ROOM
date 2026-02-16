
import { create } from 'zustand'

interface ExperienceState {
  isInteracting: boolean
  setIsInteracting: (fixed: boolean) => void
  currentInteraction: number
  setcurrentInteraction: (fixed: number) => void //might simplify to single current in = -1,...
  isCameraAnimating: boolean
  setIsCameraAnimating : (fixed: boolean) => void
  isOrbitControls: boolean
  setIsOrbitControls : (fixed: boolean) => void
}

export const useStore = create<ExperienceState>()((set) => ({
  isInteracting: false,
  setIsInteracting: (fixed) => set({ isInteracting: fixed }),
  currentInteraction: -1,
  setcurrentInteraction: (fixed) => set({ currentInteraction: fixed }),
  isCameraAnimating: false,
  setIsCameraAnimating: (fixed) => set({ isCameraAnimating: fixed }),
   isOrbitControls: false,
  setIsOrbitControls: (fixed) => set({ isOrbitControls: fixed }),

}))