import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import './App.css'
import { Experience } from './components/Experience'
import { KeyboardControls, OrbitControls, PointerLockControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useStore } from './store'
import { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib'
import { useShallow } from 'zustand/shallow'

function App() {

  //or fov 45

  const { isInteracting, isOrbitControls, isCameraAnimating } = useStore(useShallow((state) =>
  ({isInteracting: state.isInteracting, isOrbitControls: state.isOrbitControls, isCameraAnimating: state.isCameraAnimating})),)
  const plControls = useRef<PointerLockControlsImpl>(null!)


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


  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
        ]}>
        <Canvas shadows camera={{ position: [0, 0.3, 3], fov: 55 }}>

          <Perf position="top-left" />
          <group position-y={0}>
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </group>
          {!isOrbitControls && (
            <PointerLockControls ref={plControls}
              minPolarAngle={Math.PI / 5}
              maxPolarAngle={Math.PI - Math.PI / 5}
            />
          )}
          {isOrbitControls && (
            <OrbitControls />
          )}
        </Canvas>
      </KeyboardControls>
    </>
  )
}

export default App