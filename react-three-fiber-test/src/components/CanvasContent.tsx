import { Center, Environment, OrbitControls, useGLTF } from "@react-three/drei";

export const Experience = () => {

    const gltf = useGLTF('/room-transformed.glb')

    return (
        <>
            <Center><primitive object={gltf.scene}  /></Center>
            <OrbitControls />
            <Environment
      files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/2k/evening_road_01_2k.hdr"
      ground={{ height: 5, radius: 40, scale: 15 }}
    />
            <directionalLight
                position={[2, 5, 2]}
                intensity={2.5}
                castShadow
                shadow-mapSize-width={2048}
                shadow-mapSize-height={2048}
                shadow-bias={-0.0001}
            />
            <mesh position-y={-1.5} rotation-x={-Math.PI / 2} receiveShadow>
                <planeGeometry args={[100, 100]} />
                <shadowMaterial transparent opacity={0.2} />
            </mesh>
        </>
    );
};