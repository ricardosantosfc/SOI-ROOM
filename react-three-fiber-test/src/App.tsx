import { Suspense, useEffect, useRef, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import './App.css'
import { Experience } from './components/Experience'
import { KeyboardControls, OrbitControls, PointerLockControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useStore } from './store'
import { PointerLockControls as PointerLockControlsImpl } from 'three-stdlib'

function App() {


  const isOrbitControls = useStore((state) => state.isOrbitControls)
  //or fov 45
  const plControls = useRef<PointerLockControlsImpl>(null!)

  /*
  useEffect(() => {
  const handleKey = (e: KeyboardEvent) => {
    if (e.code === "KeyQ") {
      console.log("Q pressed — locking")
      plControls.current?.lock()
      console.log(plControls)
    }
  }

  document.addEventListener("keydown", handleKey)

  return () => {
    document.removeEventListener("keydown", handleKey)
  }
}, [])
  
*/
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
              onUpdate={(state) => {
                console.log("on change pointerlockcontrols")
                console.log("is locke " + state.isLocked)
              }}
            />
          )}
          {isOrbitControls && (
            <OrbitControls
              onUpdate={() => {
                console.log("on change orbit controls")
              }}
            />
          )}
        </Canvas>
      </KeyboardControls>
    </>
  )
}

export default App