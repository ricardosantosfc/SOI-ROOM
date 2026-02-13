import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import './App.css'
import { Experience } from './components/Experience'
import { KeyboardControls, PointerLockControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'

function App() {

//or fov 45

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
          <PointerLockControls 
          minPolarAngle={Math.PI/5} /*top */
          maxPolarAngle={Math.PI - Math.PI/5} /*bottom contraint*/ />
        </Canvas>
      </KeyboardControls>
    </>
  )
}

export default App