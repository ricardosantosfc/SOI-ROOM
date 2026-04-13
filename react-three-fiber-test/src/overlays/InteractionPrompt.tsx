import { Html } from "@react-three/drei";
import styles from "./styles/InteractionPrompt.module.css"

export function InteractionPrompt(/* openedBook? : boolean*/) {
    return (
        <>
            <Html>
                <div className={styles.interactMessage}>
                    <div>
                        <div className={styles.innerDot}></div>
                        <div className={styles.outerRing}></div>
                        {/*<div className={`inner-dot ${openedBook ? 'inner-dot-openbook' : ''}`} />
                         <div className={`outer-ring ${openedBook ? 'outer-ring-openbook' : ''}`} /> */}
                    </div>
                </div>
            </Html>
        </>
    )
}