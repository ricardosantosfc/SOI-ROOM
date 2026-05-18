
import { OrbitControls as OrbitControlsImpl } from 'three-stdlib'
import { create } from 'zustand'

interface ExperienceState { 

  isInteracting: boolean //if curr interaciton !=-1
  setIsInteracting: (fixed: boolean) => void
  currentInteraction: number
  setCurrentInteraction: (fixed: number) => void //might simplify to single current in = -1,...
  shouldAnimateCamera: boolean
  setShouldAnimateCamera : (fixed: boolean) => void
  isOrbitControls: boolean
  setIsOrbitControls : (fixed: boolean) => void

  obControls: OrbitControlsImpl | null
  setObControls: (c: OrbitControlsImpl | null) => void

  page: number;
  setPage: (fixed: number) => void
  
  isPointing: number;
  setIsPointing: (fixed: number) => void 

  //is current active interaction overlay collapsed (fully hidden or partially ) through chevron button?
  //also set to false upon starting new interaction by ObjectInteractions.handleMeshClick
  isOverlayCollapsed: boolean 
  setIsOverlayCollapsed: (fixed: boolean) => void

  isOnRaisedFloor: boolean
  setIsOnRaisedFloor: (fixed: boolean) => void

  showMainMenu: boolean
  setShowMainMenu: (fixed: boolean) => void

  isLoading: boolean
  setIsLoading: (fixed: boolean) => void
  
  isMobile: boolean
  setIsMobile: (fixed: boolean) => void
}

export const useStore = create<ExperienceState>()((set) => ({
  isInteracting: false,
  setIsInteracting: (fixed) => set({ isInteracting: fixed }),
  currentInteraction: -1,
  setCurrentInteraction: (fixed) => set({ currentInteraction: fixed }),
  shouldAnimateCamera: false,
  setShouldAnimateCamera: (fixed) => set({ shouldAnimateCamera: fixed }),
  isOrbitControls: false,
  setIsOrbitControls: (fixed) => set({ isOrbitControls: fixed }),

  obControls: null,
  setObControls: (c) => set({ obControls: c }),

  page: 0,
  setPage: (fixed) => set({ page: fixed }),

  isPointing: -1,
  setIsPointing: (fixed) => set({ isPointing: fixed }),
    
  isOverlayCollapsed: false,
  setIsOverlayCollapsed: (fixed) => set({ isOverlayCollapsed: fixed }),

  isOnRaisedFloor: true,
  setIsOnRaisedFloor: (fixed) => set({ isOnRaisedFloor: fixed }),

  showMainMenu: true,
  setShowMainMenu: (fixed) => set({showMainMenu: fixed }),

  isLoading: true,
  setIsLoading: (fixed) => set({isLoading: fixed }),

  isMobile:false,
  setIsMobile: (fixed) => set({isMobile: fixed }),



}))