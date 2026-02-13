import { Center, Environment, Sky, useGLTF } from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Player } from "../Player";
import { Model } from "../Testing_dim";

export const Experience = () => {

    const gltf = useGLTF('/testing_dim.glb')

    return (
        <>
            <Physics gravity={[0, 0, 0]} debug>
                
                <Player />
                <Center>
                    <Model/>
                </Center>
                 {/*<Center>
                     <Model/>
                      <group >
                        
                        <primitive object={gltf.scene} position={[0, -1.3, 0]} />
                    </group>
                </Center>*/}
                <Environment preset="sunset" />
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.4} />
                <Sky inclination={0.52} />
            </Physics>
        </>
    );
};