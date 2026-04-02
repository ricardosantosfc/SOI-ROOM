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
import { KeyboardInputHandler } from './KeyboardInputHandler'
import { OverlayInteraction2 } from './overlays/OverlayInteraction2'
import * as THREE from 'three'
import { Loader } from './Loader'

//  0 = paitnng , 1 = sketchbook, 2= radio
const overlayMap: Record<number, ComponentType> = {
  0: OverlayInteraction0,
  1: OverlayInteraction1,
}

function App() {

  //or fov 45
 

  const { isOrbitControls, setObControls, currentInteraction, showMainMenu, setShowMainMenu, isMobile, setIsMobile} = useStore(useShallow((state) =>
  ({
    isOrbitControls: state.isOrbitControls, 
    setObControls: state.setObControls, currentInteraction: state.currentInteraction, showMainMenu : state.showMainMenu,
    setShowMainMenu: state.setShowMainMenu,
    isMobile: state.isMobile,
    setIsMobile: state.setIsMobile
  })),)



useEffect(() => {
    // Detect mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent);

    // Update the store
    setIsMobile(isMobile);
  }, [setIsMobile]);

  const plControls = useRef<PointerLockControlsImpl>(null!)
  const [isMoving, setIsMoving] = useState(false)

  const CurrentOverlayComponent = overlayMap[currentInteraction]

  //on interaction exit, or show menu exit while on plControls,since plControls mounting isnt immediate after !isOrbitControls is set,
  //and pointerlocking needs to come from an explicit user input,try locking for next frames, until its mounteds
  //wont work properly outside app, even if curr pl is stored. so for this reason, call pass this as prop to child comp so it can be called
  const tryLock = () => {
    if (plControls.current) {
      plControls.current.lock()
      console.log("Pointer locked after tryLock")
    } else {
      requestAnimationFrame(tryLock)
    }
  }
  
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
  
 //TODO
 //check is mobile
  
  //setting a background color on wrapper div so when menu is unmounted, 
  // immediatly on canvas fade start to opacity 1 is more natural than pure white
  /*about loading: 
  three-drei/loader doesnt seem to be working properly, stuck at 0. couldnt find any proper soultion for it 
  <Suspense fallback={<Loader/>}> , renders a div on the canvas, progresss amount isnt properly updtated, 
  but it auto unmmounts once loading is over => good.
  but uses the canvas, which is opaque while loading + has mainmenu overlaid on top. 
  so kinda iffy solution, but works - make loader fallback rneder nothing, just set zustand bool on unmount, 
  which is then read by main menu 
  additonally could also be used for timeout preventing play clisk too fast and not toggling pointerlock
  */ 
  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
          { name: "space", keys: ["Space"] },
          { name: "esc", keys: ["Escape"] },
        ]}>
           <KeyboardInputHandler tryLock={tryLock} />
        <div style={{ backgroundColor:"rgb(197, 197, 197)", position: "relative", width: "100vw", height: "100vh", cursor: !isOrbitControls || showMainMenu? "default": isMoving? "grabbing" : "grab"
   }}>
        {!isMobile &&  (<Canvas  className={`canvas ${showMainMenu ? "non-opaque" : ""}`}shadows camera={{ position: [0, 0.3, 3], fov: 55 }}
          gl={{
    toneMapping: THREE.NeutralToneMapping,
    toneMappingExposure: 0.85
  }}
          >

            {<Perf position="top-left" />}
            <group position-y={0}>
              <Suspense fallback={<Loader/>}> 
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
          </Canvas>)}
          <div className='ui-overlay'>
            {<OverlayInteraction2 visible={!showMainMenu && isOrbitControls && !isMoving && currentInteraction ==2 }/>}
           
            {!showMainMenu && isOrbitControls && !isMoving && currentInteraction !== -1 && currentInteraction !== 2 && (<CurrentOverlayComponent />)}
            {showMainMenu && (<MainMenu tryLock={tryLock}/>)}
          </div>

        </div>
      </KeyboardControls>
    </>
  )
}

export default App