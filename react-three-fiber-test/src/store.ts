
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { create } from 'zustand'

interface ExperienceState {
  isInteracting: boolean
  setIsInteracting: (fixed: boolean) => void
  currentInteraction: number
  setcurrentInteraction: (fixed: number) => void //might simplify to single current in = -1,...
  shouldAnimateCamera: boolean
  setShouldAnimateCamera : (fixed: boolean) => void
  isOrbitControls: boolean
  setIsOrbitControls : (fixed: boolean) => void

  obControls: OrbitControlsImpl | null
  setObControls: (c: OrbitControlsImpl | null) => void


  isOnRaisedFloor: boolean
  setIsOnRaisedFloor: (fixed: boolean) => void
}

export const useStore = create<ExperienceState>()((set) => ({
  isInteracting: false,
  setIsInteracting: (fixed) => set({ isInteracting: fixed }),
  currentInteraction: -1,
  setcurrentInteraction: (fixed) => set({ currentInteraction: fixed }),
  shouldAnimateCamera: false,
  setShouldAnimateCamera: (fixed) => set({ shouldAnimateCamera: fixed }),
  isOrbitControls: false,
  setIsOrbitControls: (fixed) => set({ isOrbitControls: fixed }),

  obControls: null,
  setObControls: (c) => set({ obControls: c }),

  isOnRaisedFloor: true,
  setIsOnRaisedFloor: (fixed) => set({ isOnRaisedFloor: fixed }),

}))