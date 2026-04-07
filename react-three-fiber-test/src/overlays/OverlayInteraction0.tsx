//ui overlay for painting
import styles from "./OverlayInteraction0.module.css"
import { useStore } from "../store"
import { useShallow } from "zustand/shallow"
export function OverlayInteraction0 () {

   const { isInfoHidden, setIsInfoHidden } = useStore(useShallow((state) => ({

      isInfoHidden: state.isInfoHidden,
      setIsInfoHidden: state.setIsInfoHidden
  
    })),)
    return(
        <>
         {!isInfoHidden && (<div className={styles.information}>
            <h2>Futamigaura (monochrome edit)</h2>
            <h4>Watercolor and gouache, 2025</h4>
          </div>)}
       <button className="btn"
        onClick={() => setIsInfoHidden(!isInfoHidden)}
      ><img className ="btn-img" src = {isInfoHidden? "../chevron-down.svg" : "../chevron-up.svg"}></img>
      </button> 
     
          </>
    )
}