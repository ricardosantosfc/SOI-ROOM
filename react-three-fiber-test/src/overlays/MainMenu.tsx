import { useShallow } from "zustand/shallow"
import { useStore } from "../store"
import styles from "./MainMenu.module.css"

//main menu overlay, when esc is pressed
export function MainMenu() {
const {  setShowMainMenu} = useStore(useShallow((state) =>({ setShowMainMenu: state.setShowMainMenu})),)

    
   return (
  <div className={styles.menu}>
    
  </div>
)
}