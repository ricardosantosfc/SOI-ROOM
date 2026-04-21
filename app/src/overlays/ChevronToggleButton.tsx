import { useStore } from "../store"
import { useShallow } from "zustand/shallow"
import styles from "./styles/ChevronToggleButton.module.css"

const audio = new Audio("/sfx/buttonclick-004.mp3");
audio.volume= 0.6
export function ChevronToggleButton() {

    const { isInfoHidden, setIsInfoHidden } = useStore(useShallow((state) => ({

        isInfoHidden: state.isInfoHidden,
        setIsInfoHidden: state.setIsInfoHidden

    })),)

    const handleClick =() =>{
        audio.play();
        setIsInfoHidden(!isInfoHidden);
    }
    return (
        <button className={styles.btnChevron} onClick={handleClick}>
            <img className={styles.btnChevronImg} src={isInfoHidden ? "../chevron-down.svg" : "../chevron-up.svg"}></img>
        </button>
    );
}