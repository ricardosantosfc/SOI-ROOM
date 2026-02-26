import { Suspense, useEffect, useRef, useState, type ComponentType, type JSX } from 'react'
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

  const { isInteracting, isOrbitControls, isCameraAnimating, setObControls, currentInteraction, showMainMenu, setShowMainMenu } = useStore(useShallow((state) =>
  ({
    isInteracting: state.isInteracting, isOrbitControls: state.isOrbitControls, isCameraAnimating: state.shouldAnimateCamera,
    setObControls: state.setObControls, currentInteraction: state.currentInteraction, showMainMenu : state.showMainMenu,
    setShowMainMenu: state.setShowMainMenu
  })),)

  const plControls = useRef<PointerLockControlsImpl>(null!)
  const [isMoving, setIsMoving] = useState(false)


  const CurrentOverlayComponent = overlayMap[currentInteraction]

  //on interaction exit, pl auto frame lock. wont work properly outside app, even if curr pl is stored
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (isInteracting && !isCameraAnimating && e.code === "Space") {
        console.log("Q pressed — locking")


        const tryLock = () => {
          console.log("frame lock attempt")
          if (plControls.current) {
            plControls.current.lock()
            console.log("Pointer locked")
          } else {
            requestAnimationFrame(tryLock)
          }
        }

        tryLock()
      }
    }

    document.addEventListener("keydown", handleKey)

    return () => {
      document.removeEventListener("keydown", handleKey)
    }
  }, [isInteracting, isCameraAnimating])

// for assigning when to show the main menu for pl controls (as esc key press event is not caught when in pl controls)- instead,
//since pointerlock is unlocked when esc is pressed, listen to it.
//but poiterlock is alos programmaticaly unlocked when ob controls are set, so must check
useEffect(() => {
  const handlePointerLockChange = () => {
    if (document.pointerLockElement) {
      console.log("locked") //see, being toggle every click
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
  
  //still very sphaget, but works... might still need some sort of cooldown or message for when lock/unlock successively too fast and browser blocks
  const handleStartClick = () => {
    setShowMainMenu(false);

    const tryLock = () => {
      console.log("frame lock attempt")
      if (plControls.current) {
        plControls.current.lock()
        console.log("Pointer locked")
      } else {
        requestAnimationFrame(tryLock)
      }
    }

    tryLock()
  }
  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
        ]}>
        <div style={{ position: "relative", width: "100vw", height: "100vh", cursor: !isOrbitControls? "default": isMoving? "grabbing" : "grab"
   }}>
          <Canvas shadows camera={{ position: [0, 0.3, 3], fov: 55 }}>

            {/*<Perf position="top-left" />*/}
            <group position-y={0}>
              <Suspense fallback={null}>
                <Experience />
              </Suspense>
            </group>
            {!isOrbitControls && !showMainMenu && (
              <PointerLockControls ref={plControls}
                minPolarAngle={Math.PI / 5}
                maxPolarAngle={Math.PI - Math.PI / 5.5}
              />
            )}
            {isOrbitControls && (
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
            {isOrbitControls && !isMoving && currentInteraction !== -1 && (<CurrentOverlayComponent />)}
            {showMainMenu && (
              <>
             
              <div className='menu'>
                <MainMenu></MainMenu>
                <div className="startButtonWrapper">
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