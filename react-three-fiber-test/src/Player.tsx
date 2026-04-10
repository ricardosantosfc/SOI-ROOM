/** handles player moevement,  camera */
import * as THREE from "three"
import { useEffect, useRef, useState } from "react"
import { useFrame, useThree, type RootState } from "@react-three/fiber"
import { useKeyboardControls } from "@react-three/drei"
import { CapsuleCollider, RapierRigidBody, RigidBody } from "@react-three/rapier"
import { useStore } from "./store"
import { useShallow } from "zustand/shallow"
import type { Vector } from "three/examples/jsm/physics/RapierPhysics.js"


interface InteractionCameraSettings {

  cameraPosition: THREE.Vector3
  meshPosition: THREE.Vector3
  maxAzimuthAngle: number
  minAzimuthAngle: number
  maxPolarAngle: number
  minPolarAngle: number
  minDistance: number
  maxDistance: number
  initialPolarAngle?: number
  initialAzimuthalAngle?: number

}
//{x: -1.2060902118682861, y: 0.7310000061988831, z: 0.4509589076042175
//  0 = paitnng , 1 = sketchbook, 2= radio
const interactionCameraMap = new Map<number, InteractionCameraSettings>([
  [0, {
    cameraPosition: new THREE.Vector3(-0.3, 0.7310000061988831, 0.4509589076042175),
    meshPosition: new THREE.Vector3(-1.2060902118682861, 0.7310000061988831, 0.4509589076042175),
    maxAzimuthAngle: (Math.PI - (Math.PI / 12)),
    minAzimuthAngle: Math.PI / 12,
    maxPolarAngle: (Math.PI - (Math.PI / 12)),
    minPolarAngle: Math.PI / 10,
    minDistance: 0.6,
    maxDistance: 1,
    



  }], //x: -0.01708, y: 2.398081733190338e-19, z: 0.5
  [1, { 
    cameraPosition: new THREE.Vector3(0.3, 0, -0.02), 
    meshPosition: new THREE.Vector3(-0.01708,2.398081733190338e-19,0.5),
    maxAzimuthAngle: Math.PI/3,
    minAzimuthAngle: -Math.PI/3,
    maxPolarAngle: Math.PI/2.5,
    minPolarAngle: 0,
    minDistance: 0.4,
    maxDistance: 0.7,
    initialPolarAngle: 0,
    initialAzimuthalAngle: 0
    }],

    /** x: 0.8659097669424373 y: 0.2009999957084656 z: -0.9220410861321143*/
    [2, { 
    cameraPosition: new THREE.Vector3(0.865, 0.2, -0.2), 
    meshPosition: new THREE.Vector3(0.8659097669424373,0.2009999957084656,-0.9220410861321143),
    maxAzimuthAngle: Math.PI/8,
    minAzimuthAngle: -Math.PI/2,
    maxPolarAngle: Math.PI/2.2,
    minPolarAngle: Math.PI/14,
    minDistance: 0.5,
    maxDistance: 0.7,

    }]

])

const CAMERA_VIEW_HEIGHT = 0.78
const SPEED = 1.9
const direction = new THREE.Vector3()
const frontVector = new THREE.Vector3()
const sideVector = new THREE.Vector3()

const RAISED_LEVEL_YSTEP = 0.02

 const audio = new Audio("/sfx/footstepsonlytwo-006.mp3");
 audio.loop=true;
 audio.volume=0.6;

 const FOOTSTEPS = [
  "/sfx/footsteps0.mp3",
  "/sfx/footsteps1.mp3",
  "/sfx/footsteps2.mp3",
  "/sfx/footsteps3.mp3",
  "/sfx/footsteps4.mp3",
  "/sfx/footsteps5.mp3",
];

export function Player() {

  const movingRef = useRef(false); // track movement state
  const ref = useRef<RapierRigidBody | null>(null)
  const [, get] = useKeyboardControls()
  const { camera } = useThree()
  const [currentCameraPosition, setCurrentCameraPosition] = useState(new THREE.Vector3(0, CAMERA_VIEW_HEIGHT, 1.5))
  const [currentCameraRotation, setCurrentCameraRotation] = useState(new THREE.Vector3(0, 0, 0))
  const { isInteracting, currentInteraction, shouldAnimateCamera, setShouldAnimateCamera, setIsOrbitControls,
    isOnRaisedFloor, obControls, showMainMenu
  } = useStore(useShallow((state) =>
  ({
    isInteracting: state.isInteracting,
    currentInteraction: state.currentInteraction,
    shouldAnimateCamera: state.shouldAnimateCamera,
    setShouldAnimateCamera: state.setShouldAnimateCamera,
    setIsOrbitControls: state.setIsOrbitControls,
    isOnRaisedFloor: state.isOnRaisedFloor,
    obControls: state.obControls,
    showMainMenu: state.showMainMenu,
    setShowMainMenu: state.setShowMainMenu
  })),)



  //the moment interaction starts, stop movement, get current pl camera rotation, trigger camera animation
  //the moment interaction stops, trigger animation, set old pl camera rotation, start movemnt
  useEffect(() => {

    if (isInteracting) {
      const body = ref.current
      if (!body) return

    
      body.setLinvel({ x: 0, y: 0, z: 0 }, true)

      setCurrentCameraRotation(
        new THREE.Vector3(camera.rotation.x, camera.rotation.y, camera.rotation.z)
      )
      
      setShouldAnimateCamera(true)

    } else {
      //console.log("interacting set to false") //triggered on initial render, but not problemctic. restricting to !showMainMenu causes rotation bugs
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

  //once ob controls are mounted, set mesh as ob target + other ob configs
  useEffect(() => {

    if (obControls) {

      const ics = interactionCameraMap.get(currentInteraction)!
      
      obControls.target.copy(ics.meshPosition)
      obControls.maxAzimuthAngle = ics.maxAzimuthAngle
      obControls.minAzimuthAngle = ics.minAzimuthAngle
      obControls.maxPolarAngle = ics.maxPolarAngle
      obControls.minPolarAngle = ics.minPolarAngle
      obControls.minDistance = ics.minDistance
      obControls.maxDistance = ics.maxDistance

      //a bit iffy, see if lerping a must, would require additional state (keeping old camera rotation before lerp,...) 
      if(ics.initialPolarAngle !== undefined){
         obControls.setPolarAngle(ics.initialPolarAngle)
      }
      if(ics.initialAzimuthalAngle !== undefined){
        obControls.setAzimuthalAngle(ics.initialAzimuthalAngle)
      }

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

    if(showMainMenu){ // see if need to axtually stop the loop or this is enough
      return
    }

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

       const EPS = 0.01; //threshold
    const isMoving = Math.abs(velocity.x) > EPS || Math.abs(velocity.z) > EPS

    if (isMoving && !movingRef.current) {
      movingRef.current = true;
      audio.currentTime=0;
      audio.play(); 
    } else if (!isMoving && movingRef.current) {
      movingRef.current = false;
      audio.pause(); // stop footsteps
    }

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