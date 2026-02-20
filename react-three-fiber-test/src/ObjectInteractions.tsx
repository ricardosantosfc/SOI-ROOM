/* handles object interaction through custom hooks and related state : collisons, pointing, object related html toggling,*/
import type { CollisionPayload } from "@react-three/rapier"
import type { ThreeEvent } from '@react-three/fiber'
import { Html, Outlines } from "@react-three/drei"
import { useStore } from "./store"
import { useShallow } from "zustand/shallow"
import { useEffect } from "react"
import * as THREE from 'three'

export function useObjectInteractions() {

    const { isInteracting, setIsInteracting, currentInteraction, setCurrentInteraction, isCameraAnimating,
        isPointing, setIsPointing,
        setIsOnRaisedFloor
    } = useStore(useShallow((state) =>
    ({
        isInteracting: state.isInteracting,
        setIsInteracting: state.setIsInteracting,
        currentInteraction: state.currentInteraction,
        setCurrentInteraction: state.setcurrentInteraction,
        isCameraAnimating: state.shouldAnimateCamera,
        isPointing: state.isPointing,
        setIsPointing: state.setIsPointing,
        setIsOnRaisedFloor: state.setIsOnRaisedFloor,
    })),)

     const intersectionSet = new Set<number>();

    //a bit dumb, but considering modularity + separation of concerns
    const setIsOnRaisedFloorImpl= (bool: boolean): void =>{
        setIsOnRaisedFloor(bool)
    }
    // interactble -1 = none , 0 = paitnng , 1 = sketchbook, 2= radio

   
     const handleIntersectionEnter = (state: CollisionPayload, id: number): void => {
        const player = state.other.rigidBody
        if (!player) return

        intersectionSet.add(id)
        console.log("is intersecitng" + id)
    }

     const handleIntersectionExit = (state: CollisionPayload, id: number): void => {
        const player = state.other.rigidBody
        if (!player) return

        intersectionSet.delete(id)
   
    }


    //handle hovering enter/exit with interactable mesh
    //gets worldPosition to be set in the  Player interactionCameraMap meshPositions.
    //do dynamically-------------------------------------------------
    const handlePointerChange = (event: ThreeEvent<PointerEvent>, id: number): void => {

        if(!isInteracting){
            //const worldPos = new THREE.Vector3()
            //event.object.getWorldPosition(worldPos)
            //console.log(worldPos)
            setIsPointing(id)
           //have to see docs 
            //console.log("is pointing" + id)
        }
         event.stopPropagation() 
       
    }

    //rturn isPointing
    //trun is intrecting

    //if is colliding and hoveringertain mesh, then can interact
    const canInteract = (): boolean => {
        console.log("seeing if can interact")
        if (intersectionSet.has(isPointing)) {

            return true
        }
        console.log("cannotinteract not in set pionting" + isPointing)
        return false
    }


    //when can interact with mesh, show prompt
    const showCanInteractHtml = (id: number) => {
        if (canInteract() && !isInteracting && isPointing === id) {
            return (
                <>
                    <Outlines thickness={30} />
                    <Html>
                        <div className="interact-message">
                            <img
                                src="../hand-pointer-who.svg"
                                className="interact-image"
                            />
                            <h1>Interact</h1>
                        </div>
                    </Html>
                </>
            )
        }
    }
    //on click on canInteract mesh, 
    useEffect(() => {
        if (isInteracting) return

        const handleGlobalClick = () => {
            if (canInteract()) {

                setIsInteracting(true)
                setCurrentInteraction(isPointing)

            }
        }

        window.addEventListener('pointerup', handleGlobalClick)

        return () => {
            window.removeEventListener('pointerup', handleGlobalClick)
        }
    }, [isInteracting, isPointing, canInteract, setIsInteracting, setCurrentInteraction])

    //exit interaction -------------------needs refact ---NO SPACE
    useEffect(() => {
        const handleKey = (e: KeyboardEvent) => {

            if (isInteracting && !isCameraAnimating && e.code === "Space") {

                setIsInteracting(false)
                setCurrentInteraction(-1)

            }
        }

        window.addEventListener("keydown", handleKey)

        return () => {
            window.removeEventListener("keydown", handleKey)
        }
    }, [isInteracting, isCameraAnimating, setIsInteracting, setCurrentInteraction])



    return {
       
        handlePointerChange,
        showCanInteractHtml,
        canInteract,
        setIsOnRaisedFloorImpl,
        handleIntersectionEnter,
        handleIntersectionExit

    }
}