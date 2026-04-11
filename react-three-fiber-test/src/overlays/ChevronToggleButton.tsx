import { useStore } from "../store"
import { useShallow } from "zustand/shallow"

const audio = new Audio("/sfx/buttonclick-004.mp3");
audio.volume= 0.7
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
        <button className="btn-chevron-hide-toggle" onClick={handleClick}>
            <img className="btn-chevron-hide-toggle-img" src={isInfoHidden ? "../chevron-down.svg" : "../chevron-up.svg"}></img>
        </button>
    );
}