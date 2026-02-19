/**player moevement, camera and controls */
import * as THREE from "three"
import { useEffect, useRef, useState } from "react"
import { useFrame, useThree, type RootState } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { CapsuleCollider, RapierRigidBody, RigidBody } from "@react-three/rapier"
import { useStore } from "./store"
import { useShallow } from "zustand/shallow"
import type { Vector } from "three/examples/jsm/physics/RapierPhysics.js"

//see if makes sense to set max azimuths etc per mesh  -----------------might really need to--------------
interface InteractionCameraSettings {

  cameraPosition: THREE.Vector3
  meshPosition: THREE.Vector3
}

//  0 = paitnng , 1 = sketchbook, 2= radio
const interactionCameraMap = new Map<number, InteractionCameraSettings>([
  [0, {
    cameraPosition: new THREE.Vector3(-0.3, 0.2, -0.61),
    meshPosition: new THREE.Vector3(-1.185, 0.190, -0.591)
  }],
  [1, 
    { cameraPosition: new THREE.Vector3(0.1, 0, 0.4), 
      meshPosition: new THREE.Vector3(0.15,0,0) }]
])


const SPEED = 1.9
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
  const { isInteracting, currentInteraction, shouldAnimateCamera, setShouldAnimateCamera, setIsOrbitControls,
    isOnRaisedFloor, obControls
  } = useStore(useShallow((state) =>
  ({
    isInteracting: state.isInteracting,
    currentInteraction: state.currentInteraction,
    shouldAnimateCamera: state.shouldAnimateCamera,
    setShouldAnimateCamera: state.setShouldAnimateCamera,
    setIsOrbitControls: state.setIsOrbitControls,
    isOnRaisedFloor: state.isOnRaisedFloor,
    obControls: state.obControls
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
      setShouldAnimateCamera(true)

    } else {
      console.log("interacting set to false")
      setShouldAnimateCamera(true)
    }
  }, [isInteracting])


  //when starts inetracting and camera should be animated, 
  const animateCameraToInteraction = (state: RootState, targetInteraction: InteractionCameraSettings, smoothSpeed: number) => {

    
    const targetCameraPosition = targetInteraction.cameraPosition

    currentCameraPosition.lerp(targetCameraPosition, smoothSpeed)

    // Apply the smoothed camera position
    state.camera.position.copy(currentCameraPosition)
    const distance = currentCameraPosition.distanceTo(targetCameraPosition)

    
    //look at is done outside to account for acutal ob mounting
    if (distance < 0.01) {

      // Snap exactly to target
      currentCameraPosition.copy(targetCameraPosition)
      
      state.camera.position.copy(targetCameraPosition)

      

      setShouldAnimateCamera(false)
      setIsOrbitControls(true);

      document.exitPointerLock();

    }
  }

  //once ob controls are mounted, set mesh as ob target
  useEffect(() => {

    if (obControls) {

      obControls.target.copy(interactionCameraMap.get(currentInteraction)!.meshPosition)
      obControls.update()
    }
  }, [obControls])

  ////when exiting inetractign and camera should be animated,
  const animateCameraToPlayer = (state: RootState, playerTranslation: Vector, smoothSpeed: number) => {

    const targetPosition = new THREE.Vector3(playerTranslation.x, playerTranslation.y, playerTranslation.z)

    // Interpolate smoothly towards the target position
    currentCameraPosition.lerp(targetPosition, smoothSpeed)

    // Apply the smoothed camera position
    state.camera.position.copy(currentCameraPosition)
    const distance = currentCameraPosition.distanceTo(targetPosition)

    state.camera.rotation.set(currentCameraRotation.x, currentCameraRotation.y, currentCameraRotation.z)

    if (distance < 0.01) {
      // Snap exactly to target
      currentCameraPosition.copy(targetPosition)
      state.camera.position.copy(targetPosition)

      setShouldAnimateCamera(false)
      setIsOrbitControls(false)

    }
  }

  //handle raised floor entering/exit
  useEffect(() => {

    const body = ref.current
    if (!body) return

    const yStep = isOnRaisedFloor ? RAISED_LEVEL_YSTEP : -RAISED_LEVEL_YSTEP

    const t = body.translation()

    body.setTranslation(
      { x: t.x, y: t.y + yStep, z: t.z },
      true
    )
  }, [isOnRaisedFloor])

//------------------------------------------------------------frame----------

  useFrame((state) => {

    const body = ref.current
    if (!body) return

    if (isInteracting) {

      if (shouldAnimateCamera) {
        animateCameraToInteraction(state, interactionCameraMap.get(currentInteraction)!, 0.2)
      }

      //avoids jittery effect, done while should animate camera up until actually mounted
      if (!obControls) { 
        state.camera.lookAt(interactionCameraMap.get(currentInteraction)!.meshPosition)
      }

      return

    }

    const { forward, backward, left, right } = get()
    const velocity = body.linvel()

    // update camera
    const t = body.translation()

    //exit interaction
    if (shouldAnimateCamera) {

      animateCameraToPlayer(state, t, 0.2)

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