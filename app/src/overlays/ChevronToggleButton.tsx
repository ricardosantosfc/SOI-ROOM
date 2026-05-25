import { useStore } from "../store"
import { useShallow } from "zustand/shallow"
import styles from "./styles/ChevronToggleButton.module.css"
import chevronDown from '../assets/chevron-down.svg'
import chevronUp from '../assets/chevron-up.svg'

const audio = new Audio("/sfx/buttonclick-004.mp3");
audio.volume= 0.6
export function ChevronToggleButton() {

    const { isOverlayCollapsed, setIsOverlayCollapsed } = useStore(useShallow((state) => ({

        isOverlayCollapsed: state.isOverlayCollapsed,
        setIsOverlayCollapsed: state.setIsOverlayCollapsed

    })),)

    const handleClick =() =>{
        audio.play();
        setIsOverlayCollapsed(!isOverlayCollapsed);
    }
    return (
        <button className={styles.btnChevron} onClick={handleClick}>
            <img className={styles.btnChevronImg} src={isOverlayCollapsed ? chevronDown : chevronUp}></img>
        </button>
    );
}