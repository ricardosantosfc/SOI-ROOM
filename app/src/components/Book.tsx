import { useEffect, useMemo, useRef } from "react"
import { pages } from "../overlays/OverlayInteraction1"
import { Bone, BoxGeometry, Color, Float32BufferAttribute, MeshStandardMaterial, Skeleton, SkinnedMesh, SRGBColorSpace, Uint16BufferAttribute, Vector3, type Group } from "three";
import { useTexture } from "@react-three/drei";
import { useStore } from "../store";
import { useShallow } from "zustand/shallow";
import { CuboidCollider } from "@react-three/rapier";
import * as THREE from 'three'
import { useObjectInteractions } from "./ObjectInteractions";
import { useFrame } from "@react-three/fiber";
import { degToRad } from "three/src/math/MathUtils.js";


const textureSrc = import.meta.env.VITE_MEDIA_SRC
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

pageGeometry.translate(PAGE_WIDTH / 2, 0, 0)

const position = pageGeometry.attributes.position;
const vertex = new Vector3();
const skinIndexes = []
const skinWeights = []

for (let i = 0; i < position.count; i++) {

    vertex.fromBufferAttribute(position, i)
    const x = vertex.x;

    const skinIndex = Math.max(0, Math.floor(x / SEGMENT_WIDTH))
    let skinWeight = (x % SEGMENT_WIDTH) / SEGMENT_WIDTH;

    skinIndexes.push(skinIndex, skinIndex + 1, 0, 0);
    skinWeights.push(1 - skinWeight, skinWeight, 0, 0)
}

pageGeometry.setAttribute("skinIndex",
    new Uint16BufferAttribute(skinIndexes, 4)
)

pageGeometry.setAttribute("skinWeight",
    new Float32BufferAttribute(skinWeights, 4)
)

const whiteColor = new Color("white");


const baseColor = new Color("rgba(222, 222, 222, 1)");
const highlightColor = new Color("rgba(186, 186, 186, 1)");
//const highlightColorOpened = new THREE.Color("rgba(75, 75, 75, 1)"); //for different color if opened/closed


const pageMaterials = [
    new MeshStandardMaterial({
        color: highlightColor,
    }),
    new MeshStandardMaterial({
        color: "#2F2F2D",
    }),
    new MeshStandardMaterial({
        color: highlightColor,
    }),
    new MeshStandardMaterial({
        color: highlightColor,
    }),

];



pages.forEach((page) => {
    useTexture.preload(`${textureSrc}${page.front}.jpg`)
    useTexture.preload(`${textureSrc}${page.back}.jpg`)
})

interface PageProps {
    number: number;
    front: string;
    back: string;
    page: number;
    opened: boolean;
    isHighlighted: boolean;
    [key: string]: any; // allow any extra props
}

function Page({ number, front, back, page, opened, isHighlighted, ...props }: PageProps) {


    useEffect(() => {
        if (!skinnedMeshRef.current) return

        const material = skinnedMeshRef.current.material

        const mats = material as MeshStandardMaterial[]


        mats[4].color.copy(isHighlighted ? highlightColor : baseColor)
        mats[5].color.copy(isHighlighted ? highlightColor : baseColor)


    }, [isHighlighted])

    const [picture, picture2] = useTexture([
        `${textureSrc}${front}.jpg`,
        `${textureSrc}${back}.jpg`,
    ])

    picture.colorSpace = picture2.colorSpace = SRGBColorSpace

    const group = useRef<Group>(null);

    const skinnedMeshRef = useRef<SkinnedMesh | null>(null)

    const manualSkinnedMesh = useMemo(() => {

        const bones = [];
        for (let i = 0; i <= PAGE_SEGMENTS; i++) {
            let bone = new Bone();
            bones.push(bone)
            if (i === 0) {
                bone.position.x = 0;
            } else {
                bone.position.x = SEGMENT_WIDTH
            }
            if (i > 0) {
                bones[i - 1].add(bone)
            }
        }
        const skeleton = new Skeleton(bones)

        const materials = [...pageMaterials,
        new MeshStandardMaterial({
            color: whiteColor,
            map: picture, roughness: 1,
        }),

        new MeshStandardMaterial({
            color: whiteColor,
            map: picture2, roughness: 1,
        })

        ];


        const mesh = new SkinnedMesh(pageGeometry, materials)
        mesh.castShadow = true
        mesh.receiveShadow = true
        mesh.frustumCulled = false
        mesh.add(skeleton.bones[0])
        mesh.bind(skeleton)
        return mesh;

    }, [])

    useFrame(() => {

        if (!skinnedMeshRef.current) {
            return
        }

        let targetRotation = opened ? -Math.PI / 2 : Math.PI / 2
        targetRotation += degToRad(number * 0.1)

        const bones = skinnedMeshRef.current.skeleton.bones
        bones[0].rotation.y = THREE.MathUtils.lerp(bones[0].rotation.y, targetRotation, lerpFactor)

    })

    return (
        <group {...props} ref={group}>
            <primitive object={manualSkinnedMesh}
                ref={skinnedMeshRef}
                position-z={-0.1 * PAGE_DEPTH + page * PAGE_DEPTH} />
        </group>
    )
}

interface BookProps {
    [key: string]: any;
}

export function Book(props: BookProps) { 

    const { handleIntersectionEnter, handleIntersectionExit, handlePointerChange, showCanInteractHtml, 
        canInteractWithMesh, handleMeshClick } = useObjectInteractions();

    const { page
    } = useStore(useShallow((state) =>
    ({
        page: state.page,
    })),)


    return (

        <group {...props}
            scale={0.2}
            rotation-y={-Math.PI / 2}
            rotation-x={-Math.PI / 2}
            position-y={0.04}
            position-x={-0.016}
            position-z={0.5}


            onPointerEnter={(event) => { handlePointerChange(event, 1) }}

            onPointerOut={(event) => { handlePointerChange(event, -1) }}

            onClick={(event) => (handleMeshClick(event, 1))}

        >
            {showCanInteractHtml(1, /*page>=1*/)}
            <CuboidCollider args={[1.24, 3.62, 2.77]} position={[0, -8, 0]}

                sensor onIntersectionEnter={(state) => { handleIntersectionEnter(state, 1) }}
                onIntersectionExit={(state) => { handleIntersectionExit(state, 1) }}

            ></CuboidCollider>



            {pages.map((pageData, index) =>
                <Page
                    key={index}
                    page={page}
                    number={index}
                    opened={page > index}
                    isHighlighted={canInteractWithMesh(1)} //to be used as useEffect hook by pages
                    {...pageData}

                />

            )}

        </group>
    );
}