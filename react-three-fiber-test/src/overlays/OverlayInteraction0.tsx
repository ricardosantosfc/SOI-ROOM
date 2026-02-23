//ui overlay for painting
import { useState } from "react"
import styles from "./OverlayInteraction0.module.css"
export function OverlayInteraction0 () {

  const [isInfoHidden, setIsInfoHidden] = useState(false)
    return(
        <>
         {!isInfoHidden && (<div className={styles.information}>
            <h2>Meoto Iwa (monochrome edit)</h2>
            <h3>Watercolor and gouache, 2025</h3>
          </div>)}
       <button className="btn"
        onClick={() => setIsInfoHidden(!isInfoHidden)}
      ><img className ="btn-img" src = {isInfoHidden? "../chevron-down.svg" : "../chevron-up.svg"}></img>
      </button> 
     
          </>
    )
}