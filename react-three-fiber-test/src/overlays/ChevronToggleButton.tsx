import { useStore } from "../store"
import { useShallow } from "zustand/shallow"
export function ChevronToggleButton() {

    const { isInfoHidden, setIsInfoHidden } = useStore(useShallow((state) => ({

        isInfoHidden: state.isInfoHidden,
        setIsInfoHidden: state.setIsInfoHidden

    })),)

    return (
        <button className="btn-chevron-hide-toggle" onClick={() => setIsInfoHidden(!isInfoHidden)}>
            <img className="btn-chevron-hide-toggle-img" src={isInfoHidden ? "../chevron-down.svg" : "../chevron-up.svg"}></img>
        </button>
    );
}