import { Center, Environment, Sky, useGLTF } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Controls } from "../Controls";

export const Experience = () => {

    const gltf = useGLTF('/room-transformed.glb')

    return (
        <>
            <Physics gravity={[0, 0, 0]}>
                <Controls />
                <Center>
                    <group >
                        
                        <primitive object={gltf.scene} />
                    </group>
                </Center>
                <Environment preset="sunset" />
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.4} castShadow />
                <Sky inclination={0.52} />
            </Physics>
        </>
    );
};