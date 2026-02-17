import * as THREE from "three"
import { useEffect, useRef, useState } from "react"
import { useFrame, useThree, type RootState } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { CapsuleCollider, RapierRigidBody, RigidBody } from "@react-three/rapier"
import { useStore } from "./store"
import { useShallow } from "zustand/shallow"

interface InteractionCameraSettings {

  position: THREE.Vector3
  rotation: THREE.Vector3
}

const interactionCameraMap = new Map<number, InteractionCameraSettings>([
  [0, { position: new THREE.Vector3(-0.3, 0.2, -0.61), rotation: new THREE.Vector3(0, 259.2, 0) }],
  [1, { position: new THREE.Vector3(2, 2, 2), rotation: new THREE.Vector3(0, 259.2, 0) }]
])


const SPEED = 3
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

const RAISED_LEVEL_YSTEP = 0.02

export function Player() {

  const ref = useRef<RapierRigidBody | null>(null)
  const [, get] = useKeyboardControls()
  const { camera } = useThree()
  const [currentCameraPosition, setCurrentCameraPosition] = useState(new THREE.Vector3(0, 0.3, 1.5))
  const [currentCameraRotation, setCurrentCameraRotation] = useState(new THREE.Vector3(0, 0, 0))
  const { isInteracting, currentInteraction, isCameraAnimating, setIsCameraAnimating, setIsOrbitControls,
    isOnRaisedFloor
  } = useStore(useShallow((state) =>
  ({
    isInteracting: state.isInteracting,
    currentInteraction: state.currentInteraction,
    isCameraAnimating: state.isCameraAnimating,
    setIsCameraAnimating: state.setIsCameraAnimating,
    setIsOrbitControls: state.setIsOrbitControls,
    isOnRaisedFloor: state.isOnRaisedFloor
  })),)



  //the moment interaction starts, stop movement, get current pl camera rotation, trigger camera animation
  //the moment interaction stops, trigger animation, set old pl camera rotation, start movemnt
  useEffect(() => {

    if (isInteracting) {
      const body = ref.current
      if (!body) return

      console.log("interacting set true")
      body.setLinvel({ x: 0, y: 0, z: 0 }, true)

      setCurrentCameraRotation(
        new THREE.Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z)
      )
      console.log(currentCameraRotation);
      setIsCameraAnimating(true)

    } else {
      console.log("interacting set to false")
      setIsCameraAnimating(true)
    }
  }, [isInteracting])

  
  const animateCamera = ( state: RootState, targetPosition: THREE.Vector3,targetRotation: THREE.Vector3, smoothSpeed : number) => {

      currentCameraPosition.lerp(targetPosition, smoothSpeed)

        // Apply the smoothed camera position
      state.camera.position.copy(currentCameraPosition)
      const distance = currentCameraPosition.distanceTo(targetPosition)
      state.camera.rotation.set(targetRotation.x, targetRotation.y, targetRotation.z)
       if (distance < 0.01) {

          // Snap exactly to target
          currentCameraPosition.copy(targetPosition)
          state.camera.position.copy(targetPosition)

          setIsCameraAnimating(false)
          setIsOrbitControls(true);
           state.camera.rotation.set(
         targetRotation.x, targetRotation.y, targetRotation.z
        )
  }}

  //handle raised floor entering/exit
  useEffect(() => {

    const body = ref.current
    if (!body) return

    const yStep = isOnRaisedFloor? RAISED_LEVEL_YSTEP: -RAISED_LEVEL_YSTEP

    const t = body.translation()

      body.setTranslation(
        { x: t.x, y: t.y + yStep, z: t.z },
        true
      )
  }, [isOnRaisedFloor])

  //every frame,
  useFrame((state) => {

    const body = ref.current
    if (!body) return


    
    if (isInteracting) {

      //interaction has been triggered
      if (isCameraAnimating) {
        const targetPosition = interactionCameraMap.get(currentInteraction)!.position

        // Interpolate smoothly towards the target position
        const smoothSpeed = 0.1
        currentCameraPosition.lerp(targetPosition, smoothSpeed)

        // Apply the smoothed camera position
        state.camera.position.copy(currentCameraPosition)



        const distance = currentCameraPosition.distanceTo(targetPosition)
         const targetRotation = interactionCameraMap.get(currentInteraction)!.rotation
      state.camera.rotation.set(targetRotation.x, targetRotation.y, targetRotation.z)


        if (distance < 0.01) {

          // Snap exactly to target
          currentCameraPosition.copy(targetPosition)
          state.camera.position.copy(targetPosition)

          setIsCameraAnimating(false)
          setIsOrbitControls(true);
           state.camera.rotation.set(
         targetRotation.x, targetRotation.y, targetRotation.z
        )
          document.exitPointerLock()


        }
      }
      //else{ //apllide after animation
      //state.camera.rotation.set(0,259.2,0)
      //}

      //only to be triggered after the controls have changed
      //here is applying while the lerp jappens, plus continusoly afterwards. 
      //need a listener to immedialty after orbit ctronls stop
      const targetRotation = interactionCameraMap.get(currentInteraction)!.rotation
      state.camera.rotation.set(targetRotation.x, targetRotation.y, targetRotation.z)

      //either apply exact rotation to coincide exaclty after orbit controls are set,
      //or apply while lerping, but then would also need to apply another rotation ater orbit control set



      return
    }

    const { forward, backward, left, right } = get()
    const velocity = body.linvel()


    // update camera
    const t = body.translation()

    //exit interaction
    if (isCameraAnimating) {
      const targetPosition = new THREE.Vector3(t.x, t.y, t.z) //vector depends on clciked mesh

      // Interpolate smoothly towards the target position
      const smoothSpeed = 0.2
      currentCameraPosition.lerp(targetPosition, smoothSpeed)

      // Apply the smoothed camera position
      state.camera.position.copy(currentCameraPosition)



      const distance = currentCameraPosition.distanceTo(targetPosition)
      state.camera.rotation.set(
        currentCameraRotation.x,
        currentCameraRotation.y,
        currentCameraRotation.z
      )

      if (distance < 0.01) {
        // Snap exactly to target
        currentCameraPosition.copy(targetPosition)
        state.camera.position.copy(targetPosition)

        setIsCameraAnimating(false)
        setIsOrbitControls(false)
        state.camera.rotation.set(
          currentCameraRotation.x,
          currentCameraRotation.y,
          currentCameraRotation.z
        )
        console.log(state.camera.rotation)
      }
    } else {


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