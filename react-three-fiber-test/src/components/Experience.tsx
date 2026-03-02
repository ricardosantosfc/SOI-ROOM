import { Center, Environment, Sky} from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Player } from "../Player";
import { Model } from "../Testing_dim_wpaiting";
import { Book } from "./Book";

export const Experience = () => {

    return (
        <>
            <Physics gravity={[0, 0, 0]} debug>
                <Player />
                <Book/>
                <Center>
                    <Model/>     
                </Center>
                <Environment preset="sunset" />
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.4} />
                <Sky inclination={0.52} />
            </Physics>
        </>
    );
};