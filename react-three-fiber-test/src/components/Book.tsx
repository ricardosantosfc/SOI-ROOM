import { useMemo, useRef } from "react"
import { pages } from "../BookUI"
import { Bone, BoxGeometry, Color, Float32BufferAttribute, MeshStandardMaterial, Skeleton, SkinnedMesh, SRGBColorSpace, Uint16BufferAttribute, Vector3, type Group } from "three";
import { useTexture } from "@react-three/drei";
import { useStore } from "../store";
import { useShallow } from "zustand/shallow";
import { CuboidCollider } from "@react-three/rapier";
import * as THREE from 'three'
import { useObjectInteractions } from "../ObjectInteractions";


const PAGE_WIDTH = 1.28;
const PAGE_HEIGHT = 1.71;
const PAGE_DEPTH = 0.003;
const PAGE_SEGMENTS = 30;
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

function Page({ number, front, back,page, ...props }: PageProps) {
    
    const[picture, picture2] = useTexture([
    `/textures/${front}.jpg`,
    `/textures/${back}.jpg`, 
    ])

    picture.colorSpace = picture2.colorSpace = SRGBColorSpace // ------------see

    const group = useRef<Group>(null);

    const skinnedMeshRef = useRef(null) 

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
                map: picture, roughness: 0.8

            }),
            new MeshStandardMaterial({
                color: whiteColor,
                map: picture2, roughness: 0.8

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

    return (
        <group {...props} ref={group}>
            <primitive  object = {manualSkinnedMesh}
            scale={0.2} 
            ref={skinnedMeshRef }
            position-z = {-number * PAGE_DEPTH+ page * PAGE_DEPTH}/>
        </group>
    )
}

interface BookProps {
    [key: string]: any;
}

export function Book(props: BookProps) { //

    const { handleIntersectionChange, handlePointerChange,showCanInteractHtml } = useObjectInteractions();
    
   const { page
    } = useStore(useShallow((state) =>
    ({
      page: state.page,
    })),)
    
//const worldPos = new THREE.Vector3()
    //event.object.getWorldPosition(worldPos)
    //console.log(worldPos)
    return (
        
        <group {...props}

         onPointerEnter={(event) => {handlePointerChange(event, 1)}}

         onPointerOut={(event) => {handlePointerChange(event, -1) }}

        >
             <CuboidCollider args={[0.5, 0.1, 0.5]} position={[0.3, 0, 0]}
            
                sensor onIntersectionEnter={(state) => { handleIntersectionChange(state, 1) }}
                 onIntersectionExit={(state) => { handleIntersectionChange(state, -1) }}
            
            ></CuboidCollider>

            {showCanInteractHtml(1)}
            
            {pages.map((pageData, index) => 
                <Page
                    key={index}
                    page={page}
                    number={index}
                    {...pageData}
                    
                    />
            
        ) }
        </group>
    );
}