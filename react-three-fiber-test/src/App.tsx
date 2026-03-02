import { Suspense, useEffect, useRef, useState, type ComponentType} from 'react'
import { Canvas } from '@react-three/fiber'
import './App.css'
import { Experience } from './components/Experience'
import { KeyboardControls, OrbitControls, PointerLockControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useStore } from './store'
import { OrbitControls as OrbitControlsImpl, PointerLockControls as PointerLockControlsImpl } from 'three-stdlib'
import { useShallow } from 'zustand/shallow'
import { OverlayInteraction0 } from './overlays/OverlayInteraction0'
import { OverlayInteraction1 } from './overlays/OverlayInteraction1'
import { MainMenu } from './overlays/MainMenu'

//  0 = paitnng , 1 = sketchbook, 2= radio
const overlayMap: Record<number, ComponentType> = {
  0: OverlayInteraction0,
  1: OverlayInteraction1,
}

function App() {

  //or fov 45

  const { isOrbitControls, setObControls, currentInteraction, showMainMenu, setShowMainMenu } = useStore(useShallow((state) =>
  ({
    isOrbitControls: state.isOrbitControls, 
    setObControls: state.setObControls, currentInteraction: state.currentInteraction, showMainMenu : state.showMainMenu,
    setShowMainMenu: state.setShowMainMenu
  })),)

  const plControls = useRef<PointerLockControlsImpl>(null!)
  const [isMoving, setIsMoving] = useState(false)


  const CurrentOverlayComponent = overlayMap[currentInteraction]

  //on interaction or show menu exit while on plControls,
  const tryLock = () => {
    if (plControls.current) {
      plControls.current.lock()
      console.log("Pointer locked after tryLock")
    } else {
      requestAnimationFrame(tryLock)
    }
  }

  //on space press, exit interaction and pl auto frame lock. wont work properly outside app, even if curr pl is stored
  //on esc press, show main menu
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      console.log("running key press space pl lock handle app.tsx")
      if (e.code !== "Space" && e.code !== "Escape") {
        return
      }

      const state = useStore.getState()

      if (e.code === "Space" && state.isInteracting && !state.shouldAnimateCamera && !state.showMainMenu) {

        //previously in objInteractions
        state.setIsInteracting(false)
        state.setCurrentInteraction(-1)
        tryLock()

      } else if (e.code === "Escape" && !state.shouldAnimateCamera && !state.showMainMenu) { //is only captured when not pl controls: either in orbit controls, or none at all (ie,when pl contrls are released for menu)
        console.log("showin main menu due to esc pressed")
        setShowMainMenu(true)
      }
    }

    document.addEventListener("keydown", handleKey)

    return () => {
      document.removeEventListener("keydown", handleKey)
    }
  }, [])

// for assigning when to show the main menu for pl controls (as esc key press event is not caught when in pl controls)- instead,
//since pointerlock is unlocked when esc is pressed, listen to it.
//but poiterlock is alos programmaticaly unlocked when ob controls are set, so must check
  useEffect(() => {
    const handlePointerLockChange = () => {

      if (document.pointerLockElement) { //this is triggered with every click while on plcontrols
        return
      } else {
        if (isOrbitControls) {
          console.log(" unlocked pointer for ob controls")
        } else {
          console.log(" unlocked pointer for show main menu")
          setShowMainMenu(true)
        }
      }
    }

    document.addEventListener("pointerlockchange", handlePointerLockChange)

    return () => {
      document.removeEventListener("pointerlockchange", handlePointerLockChange)
    }
  }, [isOrbitControls])
  
  //might still need some sort of cooldown or message for when lock/unlock successively too fast and browser blocks
  const handleStartClick = () => {
    console.log("pressed button start main menu")
    setShowMainMenu(false);

    if (!isOrbitControls) {
      tryLock()
    }
  }
  
  //setting a background color on wrapper div so when menu is unmounted, immediatly on canvas fade start to opacity 1 is more natural than pure white
  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "exitInteraction", keys: ["Space"] },
          { name: "menu", keys: ["Escape"] },
        ]}>
        <div style={{ backgroundColor:"rgb(197, 197, 197)", position: "relative", width: "100vw", height: "100vh", cursor: !isOrbitControls || showMainMenu? "default": isMoving? "grabbing" : "grab"
   }}>
          <Canvas className={`canvas ${showMainMenu ? "non-opaque" : ""}`}shadows camera={{ position: [0, 0.3, 3], fov: 55 }}>

            {/*<Perf position="top-left" />*/}
            <group position-y={0}>
              <Suspense fallback={null}>
                <Experience />
              </Suspense>
            </group> {/**!showMainMenu because if not, any click on the main mennu is going to toggle it  */}
            {!isOrbitControls && !showMainMenu && (
              <PointerLockControls ref={plControls}
                minPolarAngle={Math.PI / 5}
                maxPolarAngle={Math.PI - Math.PI / 5.5}
              />
            )}
            {isOrbitControls && !showMainMenu &&(
              <OrbitControls ref={(ref) => {
                setObControls(ref)
              }}
                onStart={() => {
                  console.log("mving")
                  setIsMoving(true)
                }}
                onEnd={() => {
                  console.log("stop")
                  setIsMoving(false)
                }

                }
                enablePan={false}
          
               />
            )}
          </Canvas>
          <div className='ui-overlay'>
            {!showMainMenu && isOrbitControls && !isMoving && currentInteraction !== -1 && (<CurrentOverlayComponent />)}
            {showMainMenu && (
              <>
             
              <div className='menu'>
                <MainMenu></MainMenu>
                <div className="startButtonWrapper"> {/* startButton isnt on MainMenu as it needs to lock pointer */ }
                <button 
                  className="startButton"
                  onClick={handleStartClick}
                >
                      <svg width="104" height="100" viewBox="0 0 104 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <rect x="2" y="2" width="100" height="96" rx="6" fill="var(--button-background)" stroke="#1E1E1E" strokeWidth="4" />
                        <path d="M40 32L68 50L40 68V32Z" fill="var(--button-fill)" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>

                  
                </button>
                </div>
                </div>
              </>)}
          </div>

        </div>
      </KeyboardControls>
    </>
  )
}

export default App