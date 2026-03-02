import { useEffect } from "react"
import { useKeyboardControls } from "@react-three/drei"
import { useStore } from "./store"
/** for handling specific input: space and esc (non useFrame depndent) */


//fucntions from parent app passedas props
type Props = {
  tryLock: () => void
}

//on space press, exit interaction and pl auto frame lock. 
  //on esc press, show main menu
export function KeyboardInputHandler({ tryLock}: Props) {

  const [sub] = useKeyboardControls()
   const setShowMainMenu = useStore((state) => state.setShowMainMenu)

useEffect(() => {
    
  const unsubExit = sub(state => state.space, pressed => {
    
    if (!pressed){

        return
    } 
    const state = useStore.getState()
    if (state.isInteracting && !state.shouldAnimateCamera && !state.showMainMenu) {
      state.setIsInteracting(false)
      state.setCurrentInteraction(-1)
      tryLock()
    }
  })

  //esc (showMenu) is only captured when not pl controls: either in orbit controls, or none at all (ie,when pl contrls are released for menu)
  const unsubMenu = sub(state => state.esc, pressed => {
    if (!pressed){
        return
    } 
    const state = useStore.getState()
    if (!state.shouldAnimateCamera && !state.showMainMenu) {
      setShowMainMenu(true)
    }
  })

  //on unmounrt
  return () => {
    unsubExit()
    unsubMenu()
  }
}, [sub, tryLock, setShowMainMenu])

return null}