import * as THREE from "three"
import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { CapsuleCollider, RapierRigidBody, RigidBody } from "@react-three/rapier"
import { useStore } from "./store"


const SPEED = 3
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()


export function Player() {

  const ref = useRef<RapierRigidBody | null>(null)
  const [, get] = useKeyboardControls()
  const { isCameraFixed } = useStore()
  const [currentCameraPosition, setCurrentCameraPosition] = useState(new THREE.Vector3(0, 1.5, 3))
  
  useFrame((state) => {
    const body = ref.current
    if (!body) return


     if (isCameraFixed) {
      body.setLinvel({ x: 0, y: 0, z: 0 }, true) 

  
      const targetPosition = new THREE.Vector3(0, 1.5, -0.7)
      
      // Interpolate smoothly towards the target position
      const smoothSpeed = 0.1
      currentCameraPosition.lerp(targetPosition, smoothSpeed)

      // Apply the smoothed camera position
      state.camera.position.copy(currentCameraPosition)

      
      //state.camera.lookAt(0, 1.5, 0) 

      return
    }
    
    const { forward, backward, left, right } = get()
    const velocity = body.linvel()


    // update camera
    const t = body.translation()
    state.camera.position.set(t.x, t.y, t.z)
    setCurrentCameraPosition(state.camera.position.clone())
    
    // movement
    const front = Number(backward) - Number(forward)
    const side = Number(left) - Number(right)

    frontVector.set(0, 0, front)
    sideVector.set(side, 0, 0)
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)
    body.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true)

  })
  return (
    <>
      <RigidBody name="Player" ref={ref} colliders={false} mass={1} type="dynamic" position={[0, 0.3, 1.5]} enabledRotations={[false, false, false]}>
        <CapsuleCollider args={[0.75, 0.2]} />
      </RigidBody>
    </>
  )
}