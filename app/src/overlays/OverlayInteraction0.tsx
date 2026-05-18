//ui overlay for painting
import styles from "./styles/OverlayInteraction0.module.css"
import { useStore } from "../store"
import { useShallow } from "zustand/shallow"
import { ChevronToggleButton } from "./ChevronToggleButton"
export function OverlayInteraction0() {

   const { isOverlayCollapsed } = useStore(useShallow((state) => ({

      isOverlayCollapsed: state.isOverlayCollapsed,

   })),)
   
   return (
      <>
         {!isOverlayCollapsed && (<div className={styles.information}>
            <h2>Futamigaura (monochrome edit)</h2>
            <h4>Watercolor and gouache, 2025</h4>
         </div>)}
         <ChevronToggleButton/>

      </>
   )
}