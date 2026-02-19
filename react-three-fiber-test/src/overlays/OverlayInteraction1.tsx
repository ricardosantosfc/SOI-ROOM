import styles from "./OverlayInteraction1.module.css"
export function OverlayInteraction1 () {

    return(
        <>
         <div className={styles.information}>
            <h2>"skethcbook"</h2>
            <h3>soemthing something, today 3am</h3>
          </div>
       <button className={styles.btn}
        onClick={() => console.log("btn")}
      >
        ?
      </button> 
     
          </>
    )
}