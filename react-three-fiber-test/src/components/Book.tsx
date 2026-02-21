import { useEffect, useMemo, useRef } from "react"
import { pages } from "../overlays/OverlayInteraction1"
import { Bone, BoxGeometry, Color, Float32BufferAttribute, MeshStandardMaterial, Skeleton, SkinnedMesh, SRGBColorSpace, Uint16BufferAttribute, Vector3, type Group } from "three";
import { useTexture } from "@react-three/drei";
import { useStore } from "../store";
import { useShallow } from "zustand/shallow";
import { CuboidCollider } from "@react-three/rapier";
import * as THREE from 'three'
import { useObjectInteractions } from "../ObjectInteractions";
import { useFrame } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";

const lerpFactor = 0.05;
const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.006;
const PAGE_SEGMENTS = 1;
const SEGMENT_WIDTH = PAGE_WIDTH / PAGE_SEGMENTS;

const pageGeometry = new BoxGeometry(
    PAGE_WIDTH,
    PAGE_HEIGHT,
    PAGE_DEPTH,
    PAGE_SEGMENTS,
    2
)

pageGeometry.translate(PAGE_WIDTH / 2,0,0)

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = []
const skinWeights = []

for(let i = 0; i< position.count; i++){

    vertex.fromBufferAttribute(position,i)
    const x = vertex.x;

    const skinIndex = Math.max(0,Math.floor(x/ SEGMENT_WIDTH))
    let skinWeight = (x %SEGMENT_WIDTH) /SEGMENT_WIDTH;

    skinIndexes.push(skinIndex, skinIndex +1, 0,0);
    skinWeights.push(1-skinWeight, skinWeight,0,0)
}

pageGeometry.setAttribute("skinIndex", 
    new Uint16BufferAttribute(skinIndexes,4)
)

pageGeometry.setAttribute("skinWeight",
    new Float32BufferAttribute(skinWeights,4)
)

const whiteColor = new Color("white");

const pageMaterials = [
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: "#111",
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  new MeshStandardMaterial({
    color: whiteColor,
  }),
  
];

pages.forEach((page) => {
    useTexture.preload(`/textures/${page.front }.jpg`)
    useTexture.preload(`/textures/${page.back }.jpg`)
})

interface PageProps {
    number: number;
    front?: string;
    back?: string;
    [key: string]: any; // allow any extra props
}

function Page({ number, front, back,page, opened, isHighlighted, ...props }: PageProps) {
    
     const { emissiveHighlightIntensity, emissiveHighlightColor } = useObjectInteractions();

    useEffect(() => {
        if (!skinnedMeshRef.current) return

        const material = skinnedMeshRef.current.material

        const mats = material as MeshStandardMaterial[]

        //only wil change on front and back of pages, not other faces
        mats[4].emissiveIntensity = isHighlighted ? emissiveHighlightIntensity : 0
        mats[5].emissiveIntensity = isHighlighted ? emissiveHighlightIntensity : 0

    }, [isHighlighted])
    
    const[picture, picture2] = useTexture([
    `/textures/${front}.jpg`,
    `/textures/${back}.jpg`, 
    ])

    picture.colorSpace = picture2.colorSpace = SRGBColorSpace // ------------see

    const group = useRef<Group>(null);

    const skinnedMeshRef = useRef<SkinnedMesh | null>(null)

    const manualSkinnedMesh = useMemo( () => {
        
        const bones = [];
        for (let i = 0; i<= PAGE_SEGMENTS; i++){
            let bone = new Bone();
            bones.push(bone)
            if(i===0){
                bone.position.x = 0;
            } else{
                bone.position.x = SEGMENT_WIDTH
            }
            if (i > 0){
                bones[i - 1].add(bone)
            }
        }
        const skeleton = new Skeleton(bones)

        const materials = [...pageMaterials, 
            new MeshStandardMaterial({
                color: whiteColor,
                map: picture, roughness: 0.8,
                emissive: emissiveHighlightColor,
                emissiveIntensity: 0

            }),
            new MeshStandardMaterial({
                color: whiteColor,
                map: picture2, roughness: 0.8,
                emissive: emissiveHighlightColor, 
                emissiveIntensity: 0
            })
            
        ];


        const mesh = new SkinnedMesh(pageGeometry,materials)
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false //---------------------see
        mesh.add(skeleton.bones[0])
        mesh.bind(skeleton)
        return mesh;

    },[])

    useFrame(() =>{

        if(!skinnedMeshRef.current){
            return
        }

        let targetRotation = opened ? -Math.PI /2 : Math.PI /2 
        targetRotation +=degToRad(number* 0.8)

        const bones = skinnedMeshRef.current.skeleton.bones
        bones[0].rotation.y = THREE.MathUtils.lerp(bones[0].rotation.y, targetRotation, lerpFactor)

    })

    return (
        <group {...props} ref={group}>
            <primitive  object = {manualSkinnedMesh}
            
            
            ref={skinnedMeshRef }
            position-z = {-0.1 * PAGE_DEPTH + page * PAGE_DEPTH}/>
        </group>
    )
}

interface BookProps {
    [key: string]: any;
}

export function Book(props: BookProps) { //

    const { handleIntersectionEnter, handleIntersectionExit, handlePointerChange,showCanInteractHtml, canInteractWithMesh } = useObjectInteractions();
    
   const { page
    } = useStore(useShallow((state) =>
    ({
      page: state.page,
    })),)
    

    return (
        
        <group {...props} 
        scale={0.2} 
            rotation-y={-Math.PI/2}
            rotation-x={-Math.PI/2}
            position-y={-0.3}
        /*rotation-y = {-Math.PI/2}*/

         onPointerEnter={(event) => {handlePointerChange(event, 1)}}

         onPointerOut={(event) => {handlePointerChange(event, -1) }}

        >
            {showCanInteractHtml(1)}
             <CuboidCollider args={[0.9, 3, 2]} position={[0, -6, 0]}
            
                sensor onIntersectionEnter={(state) => { handleIntersectionEnter(state, 1) }}
                 onIntersectionExit={(state) => { handleIntersectionExit(state, 1) }}
            
            ></CuboidCollider>

        
            
            {pages.map((pageData, index) => 
                <Page
                    key={index}
                    page={page}
                    number={index}
                    opened = {page > index}
                    isHighlighted = {canInteractWithMesh(1)} //to be used as useEffect hook by pages
                    {...pageData}
                    
                    />
            
        ) }

{/*
        <mesh  scale={0.2} 
            rotation={[-Math.PI / 2, 0,0]}
            position-y={-0.31}
      
            position-z = {-0.1 * PAGE_DEPTH + page * PAGE_DEPTH}>

  <boxGeometry args={[PAGE_WIDTH, PAGE_HEIGHT, PAGE_DEPTH]}  />
  <meshPhongMaterial color="#f1f1f107" opacity={0} transparent/>
 
</mesh> */}
        </group>
    );
}