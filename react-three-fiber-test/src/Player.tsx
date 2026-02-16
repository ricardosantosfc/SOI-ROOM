import * as THREE from "three"
import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { CapsuleCollider, RapierRigidBody, RigidBody } from "@react-three/rapier"
import { useStore } from "./store"
import { useShallow } from "zustand/shallow"


const SPEED = 3
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()


export function Player() {

  const ref = useRef<RapierRigidBody | null>(null)
  const [, get] = useKeyboardControls()
  const { isInteracting } = useStore()
  const [currentCameraPosition, setCurrentCameraPosition] = useState(new THREE.Vector3(0, 0.3, 1.5))
  const { isCameraAnimating, setIsCameraAnimating } = useStore(useShallow((state) =>
    ({ isCameraAnimating: state.isCameraAnimating, setIsCameraAnimating: state.setIsCameraAnimating })),)
  const { setIsOrbitControls } = useStore(useShallow((state) =>
    ({  setIsOrbitControls: state.setIsOrbitControls })),)

  useFrame((state) => {
    
    const body = ref.current
    if (!body) return


    if (isInteracting) {

      body.setLinvel({ x: 0, y: 0, z: 0 }, true) //repeating everyframe
      
      if (isCameraAnimating) {
        const targetPosition = new THREE.Vector3(-0.3, 0.20, -0.61) //vector depends on clciked mesh

        // Interpolate smoothly towards the target position
        const smoothSpeed = 0.1
        currentCameraPosition.lerp(targetPosition, smoothSpeed)

        // Apply the smoothed camera position
        state.camera.position.copy(currentCameraPosition)

        

        const distance = currentCameraPosition.distanceTo(targetPosition)

        if (distance < 0.01) {
      
          // Snap exactly to target
          currentCameraPosition.copy(targetPosition)
          state.camera.position.copy(targetPosition)

          setIsCameraAnimating(false)
          setIsOrbitControls(true);
        
          document.exitPointerLock()
          
          
        }
      }
      //else{ //apllide after animation
        //state.camera.rotation.set(0,259.2,0)
      //}
      
      //only to be triggered after the controls have changed
      //here is applying while the lerp jappens, plus continusoly afterwards. 
      //need a listener to immedialty after orbit ctronls stop
      state.camera.rotation.set(0,259.2,0)

      //either apply exact rotation to coincide exaclty after orbit controls are set,
      //or apply while lerping, but then would also need to apply another rotation ater orbit control set

      

      return
    }
   
     const { forward, backward, left, right } = get()
    const velocity = body.linvel()


    // update camera
    const t = body.translation()

    if (isCameraAnimating) {
      const targetPosition = new THREE.Vector3(t.x, t.y, t.z) //vector depends on clciked mesh

        // Interpolate smoothly towards the target position
        const smoothSpeed = 0.2
        currentCameraPosition.lerp(targetPosition, smoothSpeed)

        // Apply the smoothed camera position
        state.camera.position.copy(currentCameraPosition)

        

        const distance = currentCameraPosition.distanceTo(targetPosition)

        if (distance < 0.01) {
          // Snap exactly to target
          currentCameraPosition.copy(targetPosition)
          state.camera.position.copy(targetPosition)

          setIsCameraAnimating(false)
          setIsOrbitControls(false)
          
        }
    }else{


    state.camera.position.set(t.x, t.y, t.z)
    setCurrentCameraPosition(state.camera.position.clone())

    // movement
    const front = Number(backward) - Number(forward)
    const side = Number(left) - Number(right)

    frontVector.set(0, 0, front)
    sideVector.set(side, 0, 0)
    direction.subVectors(frontVector, sideVector).normalize().multiplyScalar(SPEED).applyEuler(state.camera.rotation)
    body.setLinvel({ x: direction.x, y: velocity.y, z: direction.z }, true)
}
  })
  return (
    <>
      <RigidBody name="Player" ref={ref} colliders={false} mass={1} type="dynamic" position={currentCameraPosition} enabledRotations={[false, false, false]}>
        <CapsuleCollider args={[0.75, 0.2]} />
      </RigidBody>
    </>
  )
}