import styles from "./OverlayInteraction0.module.css"
export function OverlayInteraction0 () {

    return(
        <>
         <div className={styles.information}>
            <h2>"Meoto Iwa (monochrome edit)"</h2>
            <h3>Watercolor and gouache, 2025</h3>
          </div>
       <button className={styles.btn}
        onClick={() => console.log("btn")}
      >
        ?
      </button> 
     
          </>
    )
}