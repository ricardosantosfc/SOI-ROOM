import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import './App.css'
import { Experience } from './components/CanvasContent'

function App() {



  return (
    <>
  
        <Canvas shadows camera={{ position: [-0.5, 1, 4], fov: 45 }}>

          <group position-y={0}>
            <Suspense fallback={null}>
              <Experience />
            </Suspense>
          </group>

        </Canvas>

    </>
  )
}

export default App