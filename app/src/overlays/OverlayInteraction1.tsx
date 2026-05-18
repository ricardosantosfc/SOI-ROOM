/* handles book and page ui + state*/
import styles from "./styles/OverlayInteraction1.module.css"
import { useShallow } from "zustand/shallow";
import { useStore } from "../store";
import { AnimatePresence, motion } from "motion/react"
import { ChevronToggleButton } from "./ChevronToggleButton";
import { informations, images } from "../data/BookData";


 const audio = new Audio("/sfx/pageflipcover-001.mp3");
 audio.volume= 0.6;

export const OverlayInteraction1 = () => {
  
  const { page, setPage, isOverlayCollapsed } = useStore(useShallow((state) => ({

    page: state.page,
    setPage: state.setPage,
    isOverlayCollapsed: state.isOverlayCollapsed,

  })),)

  const pageMax = images.length / 2
  const changePage = (value: number) => {
    if ((page + value >= 0) && (page + value <= pageMax)) {
      setPage(page + value)
      audio.currentTime = 0; 
      audio.play();
    }
  }

  return (
    <>
      <main className={styles.main}>
        <div className={styles.controls}>

          <button className={`${styles.buttonControl} ${page - 1 < 0 ? styles.notClickable : ""}`} onClick={() => changePage(-1)}>
            <img src="../arrow-left.svg"></img>
          </button>

          <div className={styles.inputWrapper}>
            <input className={styles.pageInput}
              value={page}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const value = e.target.valueAsNumber;
                if (Number.isNaN(value)) {
                  setPage(0);
                  return;
                }
                const clamped = Math.min(images.length / 2, Math.max(0, value));
                setPage(clamped);
                audio.currentTime = 0; 
                audio.play();
              }}
              type="number"
              max={images.length / 2}
              min={0}
            ></input>
            <span className={styles.inputPageMax}>/{pageMax}</span>
          </div>

          <button className={`${styles.buttonControl} ${page + 1 > pageMax ? styles.notClickable : ""}`} onClick={() => changePage(1)}>
            <img src="../arrow-right.svg"></img>
          </button>
        </div>

      </main>

      {!isOverlayCollapsed && page !== 0 && (

        <div className={styles.information} >
          <AnimatePresence mode="wait"> {/* throws warning due to multiple children, but is working nicely so far*/}
            <motion.div
              className={styles.informationChild}
              key={informations[(page - 1) * 2].name}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }} //y:15
              transition={{ duration: 0.35 }}
            >
              <h2 >{informations[(page - 1) * 2].name}</h2>
              <h4>{informations[(page - 1) * 2].mediumYear}</h4>
            </motion.div>

            <motion.div
              className={styles.informationChild}
              key={informations[(page - 1) * 2 + 1].name}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 0 }}
              transition={{ duration: 0.35 }}
            >
              <h2 >{informations[(page - 1) * 2 + 1].name}</h2>
              <h4>{informations[(page - 1) * 2 + 1].mediumYear}</h4>
            </motion.div>
          </AnimatePresence>


        </div>
      )}
      {page !== 0 && ( <ChevronToggleButton/>)}
    </>
  );
};