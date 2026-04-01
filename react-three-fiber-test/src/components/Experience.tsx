import { Center, Environment, Sky} from "@react-three/drei";
import { Physics } from "@react-three/rapier";
import { Player } from "../Player";
import { Model } from "../Final_model";
import { Book } from "./Book";
import { DefaultEnvironment } from "../DefaultEnvironment";
import { Skydome } from "../Skydome_only";
//import { FakeShadow } from "../Shadow_text_decal";


export const Experience = () => {

    return (
        <>
            <Physics gravity={[0, 0, 0]}>
                <Player />
                <Book/>
                <Center>
                    <Skydome/>
                    <Model/>    
                    {/*<FakeShadow></FakeShadow>*/} 
                </Center>
                <DefaultEnvironment></DefaultEnvironment>
                {/*<hemisphereLight intensity={1} />
                <directionalLight position={[5, 5, 5]} intensity={1} />*/}
                {/*<Environment preset="city" />
                <ambientLight intensity={0.4} />
                <directionalLight position={[5, 5, 5]} intensity={0.4} />
                <Sky inclination={0.52} />*/}
            </Physics>
        </>
    );
};