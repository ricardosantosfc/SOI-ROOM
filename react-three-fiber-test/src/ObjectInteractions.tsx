/* handles object interaction through custom hooks and related state : collisons, pointing, object related html toggling,*/
import type { CollisionPayload } from "@react-three/rapier"
import type { ThreeEvent } from '@react-three/fiber'
import { Html } from "@react-three/drei"
import { useStore } from "./store"
import { useShallow } from "zustand/shallow"
import { useState } from "react"
import * as THREE from 'three'

export function useObjectInteractions() {

    const { isInteracting, 
        setIsInteracting, 
        setCurrentInteraction,
        isPointing, setIsPointing, 
        setIsOnRaisedFloor,
        setIsInfoHidden,
    } = useStore(useShallow((state) =>
    ({
        isInteracting: state.isInteracting,
        setIsInteracting: state.setIsInteracting,
        setCurrentInteraction: state.setCurrentInteraction,
        isPointing: state.isPointing,
        setIsPointing: state.setIsPointing,
        setIsOnRaisedFloor: state.setIsOnRaisedFloor,
        setIsInfoHidden: state.setIsInfoHidden,

    })),)

    //so showInteract reacts immediatly
   const [intersectionSet, setIntersectionSet] = useState<Set<number>>(new Set());

   const addIntersection = (id: number) => setIntersectionSet((prev) => new Set(prev).add(id));

   const deleteIntersection = (id: number) => setIntersectionSet((prev) => {
    const next = new Set(prev);
    next.delete(id);
    return next;
    });

    //a bit dumb, but considering modularity + separation of concerns
    const setIsOnRaisedFloorImpl= (bool: boolean): void =>{
        setIsOnRaisedFloor(bool)
    }
    // interactble -1 = none , 0 = paitnng , 1 = sketchbook, 2= radio

   
     const handleIntersectionEnter = (state: CollisionPayload, id: number): void => {
        const player = state.other.rigidBody
        if (!player) return

        addIntersection(id)

    }

     const handleIntersectionExit = (state: CollisionPayload, id: number): void => {
        const player = state.other.rigidBody
        if (!player) return


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
    //openedBook for different , more readable when pages are opneded, but only really needed if chanig emissiveness, not color
    const showCanInteractHtml = (id: number, /* openedBook? : boolean*/) => {
        if (canInteractWithMesh(id)) {
            return (
                <>
                    {/*<Outlines thickness={20} />*/}
                    <Html>
                        <div className="interact-message">
                            <div className="pulse-circle">
                                <div className="inner-dot"></div>
                                <div className="outer-ring"></div>
                                {/*<div className={`inner-dot ${openedBook ? 'inner-dot-openbook' : ''}`} />
                                <div className={`outer-ring ${openedBook ? 'outer-ring-openbook' : ''}`} /> */}
                            </div>
                        </div>
                    </Html>
                </>
            )
        }
    }

    //on click on mesh pointed at, if canInteract mesh,
    //still capturing while interacting (prob same with other pointer events), so see if disabling raycast has any impact performance wise 
    //also have to see if should e.stopPropag,
    const handleMeshClick  = (event: ThreeEvent<MouseEvent>, id:number) => { 

            if (event.button !== 0) {
                return
            }
            const canInteract = !isInteracting && intersectionSet.has(id) 

             if (canInteract) {
                event.stopPropagation()
                setIsInteracting(true)
                setCurrentInteraction(id)
                setIsInfoHidden(false)
             }
    }

    return {
       
        handlePointerChange,
        showCanInteractHtml,
        setIsOnRaisedFloorImpl,
        handleIntersectionEnter,
        handleIntersectionExit,
        canInteractWithMesh,
        handleMeshClick

    }
}