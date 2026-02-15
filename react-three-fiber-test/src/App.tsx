import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import './App.css'
import { Experience } from './components/Experience'
import { KeyboardControls, OrbitControls, PointerLockControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useStore } from './store'

function App() {


  const isOrbitControls = useStore((state) => state.isOrbitControls)
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
          {!isOrbitControls && (
            <PointerLockControls
              minPolarAngle={Math.PI / 5}
              maxPolarAngle={Math.PI - Math.PI / 5}
            />
          )}
        {isOrbitControls && (
  <OrbitControls
    onUpdate={(state) => {
      console.log(state)
    }}
  />
)}
        </Canvas>
      </KeyboardControls>
    </>
  )
}

export default App