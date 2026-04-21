import { Center} from "@react-three/drei";
import { Physics } from "@react-three/rapier"; //throws  warning - https://github.com/dimforge/rapier/issues/811
import { Player } from "./Player";
import { Model } from "./Final_model";
import { Book } from "./Book";
import { DefaultEnvironment } from "./DefaultEnvironment";
import { Skydome } from "./Skydome_only";


export const Experience = () => {

    return (
        <>
            <Physics gravity={[0, 0, 0]}> 
                <Player />
                <Book/>
                <Center>
                    <Skydome/>
                    <Model/>    
                </Center>
                <DefaultEnvironment></DefaultEnvironment>
            </Physics>
        </>
    );
};