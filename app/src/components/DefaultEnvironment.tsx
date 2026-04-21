import { useThree } from '@react-three/fiber'
import { useEffect } from 'react'
import * as THREE from 'three'
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js'

//match environment map thats used by the online editor (uses exported env texture RoomEnvironment)
export function DefaultEnvironment() {
  const { gl, scene } = useThree()

  useEffect(() => {
    const pmremGenerator = new THREE.PMREMGenerator(gl)
    const envScene = new RoomEnvironment()

    const envMap = pmremGenerator.fromScene(envScene).texture

    scene.environment = envMap

    return () => {
      envScene.dispose()
      pmremGenerator.dispose()
    }
  }, [gl, scene])

  return null
}