import * as THREE from "three"
import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { CapsuleCollider, RapierRigidBody, RigidBody } from "@react-three/rapier"


const SPEED = 3
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()


export function Controls() {

  const ref = useRef<RapierRigidBody | null>(null)
  const [, get] = useKeyboardControls()
  useFrame((state) => {
    const body = ref.current
    if (!body) return

    const { forward, backward, left, right } = get()
    const velocity = body.linvel()


    // update camera
    const t = body.translation()
    state.camera.position.set(t.x, t.y, t.z)
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
      <RigidBody ref={ref} colliders={false} mass={1} type="dynamic" position={[0, 0, 4]} enabledRotations={[false, false, false]}>
        <CapsuleCollider args={[0.75, 0.2]} />
      </RigidBody>
    </>
  )
}