import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import './App.css'
import { Experience } from './components/CanvasContent'
import { KeyboardControls, PointerLockControls } from '@react-three/drei'

function App() {



  return (
    <>
      <KeyboardControls
        map={[
          { name: "forward", keys: ["ArrowUp", "w", "W"] },
          { name: "backward", keys: ["ArrowDown", "s", "S"] },
          { name: "left", keys: ["ArrowLeft", "a", "A"] },
          { name: "right", keys: ["ArrowRight", "d", "D"] },
        ]}>
        <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>

          <group position-y={0}>
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </group>
          <PointerLockControls />
        </Canvas>
      </KeyboardControls>
    </>
  )
}

export default App