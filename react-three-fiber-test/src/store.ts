
import type { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
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

  obControls: OrbitControls | null
  setObControls: (c: OrbitControls | null) => void

  areOrbitControlsMounted : boolean
  setAreOrbitControlsMounted : (fixed: boolean) => void
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

  obControls: null,
  setObControls: (c) => set({ obControls: c }),

  setIsOrbitControls: (fixed) => set({ isOrbitControls: fixed }),
  areOrbitControlsMounted: false,
  setAreOrbitControlsMounted: (fixed) => set({ areOrbitControlsMounted: fixed }),
  isOnRaisedFloor: true,
  setIsOnRaisedFloor: (fixed) => set({ isOnRaisedFloor: fixed }),

}))