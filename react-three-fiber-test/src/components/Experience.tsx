import { Center, Environment, Sky, useGLTF } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Controls } from "../Controls";
import { Model } from "../Room";

export const Experience = () => {

    const gltf = useGLTF('/room-transformed.glb')

    return (
        <>
            <Physics gravity={[0, 0, 0]} debug>
                
                <Controls />
                <Center>
                      <Model />
                </Center>
                <Environment preset="sunset" />
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.4} />
                <Sky inclination={0.52} />
            </Physics>
        </>
    );
};