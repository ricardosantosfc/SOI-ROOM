/* handles object interaction through custom hooks and related state : collisons, pointing, object related html toggling,*/
import type { CollisionPayload } from "@react-three/rapier"
import type { ThreeEvent } from '@react-three/fiber'
import { Html, Outlines } from "@react-three/drei"
import { useStore } from "./store"
import { useShallow } from "zustand/shallow"
import { useEffect, useState } from "react"
import * as THREE from 'three'

export function useObjectInteractions() {

    const { isInteracting, setIsInteracting, currentInteraction, setCurrentInteraction, isCameraAnimating,
        isPointing, setIsPointing, 
        setIsOnRaisedFloor,
        setIsInfoHidden,
        showMainMenu
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
        setIsInfoHidden: state.setIsInfoHidden,
        showMainMenu: state.showMainMenu
    })),)

    //so showInteract reacts immediatly
   const [intersectionSet, setIntersectionSet] = useState<Set<number>>(new Set());

   const addIntersection = (id: number) => setIntersectionSet((prev) => new Set(prev).add(id));

   const deleteIntersection = (id: number) => setIntersectionSet((prev) => {
    const next = new Set(prev);
    next.delete(id);
    return next;
    });

    //for emissivehighlight to work correctly on the gtlf,interactbale objects must have their own spearate mats
    const emissiveHighlightColor = new THREE.Color("orange") 
    const emissiveHighlightIntensity = 0.22

    //a bit dumb, but considering modularity + separation of concerns
    const setIsOnRaisedFloorImpl= (bool: boolean): void =>{
        setIsOnRaisedFloor(bool)
    }
    // interactble -1 = none , 0 = paitnng , 1 = sketchbook, 2= radio

   
     const handleIntersectionEnter = (state: CollisionPayload, id: number): void => {
        const player = state.other.rigidBody
        if (!player) return

        addIntersection(id)
        console.log("is intersecitng" + id)
    }

     const handleIntersectionExit = (state: CollisionPayload, id: number): void => {
        const player = state.other.rigidBody
        if (!player) return

        console.log("exits : " + id)

        deleteIntersection(id)
   
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

    //if is colliding and hovering a mesh, then can interact
    const canInteract = (): boolean => {
  
        return !isInteracting && intersectionSet.has(isPointing)
 
    }

    //can it interact with certain mesh id? -> forhighlight material emissivenesss, and showcaninteract html
    const canInteractWithMesh = (id: number) => {
  
        return canInteract() && isPointing === id
    }

    //when can interact with mesh, show prompt --- should be specific comp
    const showCanInteractHtml = (id: number) => {
        if (canInteractWithMesh(id)) {
            return (
                <>
                    {/*<Outlines thickness={20} />*/}
                    <Html>
                        <div className="interact-message">
                            <div className="pulse-circle">
                                <div className="inner-dot" />
                                <div className="outer-ring" />
                            </div>
                        </div>
                    </Html>
                </>
            )
        }
    }

    
    //on click on canInteract mesh, 
    useEffect(() => {
  
        console.log("handle globa click obj intera") //being triggered evytoime is poitning
        
        const handleGlobalClick = (event: PointerEvent) => {

            if(event.button!==0){
                return 
            }
            if (canInteract()) {

                setIsInteracting(true)
                setCurrentInteraction(isPointing)
                setIsInfoHidden(false)

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

            if (isInteracting && !isCameraAnimating && e.code === "Space" && !showMainMenu) {

                setIsInteracting(false)
                setCurrentInteraction(-1)

            }
        }

        window.addEventListener("keydown", handleKey)

        return () => {
            window.removeEventListener("keydown", handleKey)
        }
    }, [isInteracting, isCameraAnimating, setIsInteracting, setCurrentInteraction, showMainMenu])



    return {
       
        handlePointerChange,
        showCanInteractHtml,
        setIsOnRaisedFloorImpl,
        handleIntersectionEnter,
        handleIntersectionExit,
        emissiveHighlightColor,
        emissiveHighlightIntensity,
        canInteractWithMesh

    }
}