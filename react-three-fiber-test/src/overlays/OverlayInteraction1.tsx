import styles from "./OverlayInteraction1.module.css"
/* handles book and page ui + state*/
import { useShallow } from "zustand/shallow";
import { useStore } from "../store";
import { AnimatePresence, motion } from "motion/react"


const informations = [

  {
    name: "Lucky",
    mediumYear: "Charcoal, 2021"
  },
  {
    name: "Hakuho",
    mediumYear: "Charcoal, 2022"
  },
  {
    name: "La Brasserie",
    mediumYear: "Watercolor and gouache, 2025"
  },
  {
    name: "A Walk",
    mediumYear: "Watercolor, 2021"
  },

  {
    name: "Animal studies",
    mediumYear: "Watercolor, 2022"
  },
  {
    name: "Futamigaura",
    mediumYear: "Watercolor and gouache, 2025"
  },

  {
    name: "Ink & wash sketches",
    mediumYear: "Ink, watercolor, and gouache, 2025"
  },
  
  {
    name: "Tiny landscapes",
    mediumYear: "Watercolor, 2020"
  },

   {
    name: "Hanadriel",
    mediumYear: "Charcoal, 2019 "
  },
   {
    name: "Girl portrait",
    mediumYear: "Charcoal, 2023"
  },
  {
    name: "Sunset studies",
    mediumYear: "Watercolor, 2021 "
  },
   {
    name: "Twilight Sailing",
    mediumYear: "Watercolor, 2025"
  },
  {
    name: "Small portraits",
    mediumYear: "Charcoal, 2021"
  },

  {
    name: "Musashi",
    mediumYear: "Charcoal, 2017"
  },
  
  {
    name: "Shadows of the Sun",
    mediumYear: "Ink and digital, 2024"
  },

   {
    name: "Fräulein Bürstner",
    mediumYear: "Watercolor, 2022"
  },
   {
    name: "Murmúrio da Tormenta",
    mediumYear: "Watercolor, 2021"
  },
  {
    name: "Meoto Iwa",
    mediumYear: "Watercolor, 2025"
  },


]
const pictures = [
  "p1","p2","p3","p4","p5","p6","p7","p8","p9","p10", "p11", "p12","p13", "p14", "p15","p16","p17","p18"
];

export const pages = [
  {
    front: "front",
    back: pictures[0],
  },
];
for (let i = 1; i < pictures.length - 1; i += 2) {
  pages.push({
    front: pictures[i % pictures.length],
    back: pictures[(i + 1) % pictures.length],
  });
}

pages.push({
  front: pictures[pictures.length - 1],
  back: "front",
});

export const OverlayInteraction1 = () => {
  const { page, setPage, isInfoHidden, setIsInfoHidden } = useStore(useShallow((state) => ({

    page: state.page,
    setPage: state.setPage,
    isInfoHidden: state.isInfoHidden,
    setIsInfoHidden: state.setIsInfoHidden

  })),)

  const pageMax = pictures.length/2
  const changePage = (value:number )=>{
    if((page + value>=0) && (page + value <= pageMax)){
      setPage(page+value)
    }
  }

  return (
    <>
      <main className={styles.main} /*className=" pointer-events-none select-none z-10 fixed  inset-0  flex justify-between flex-col" */ >

        <div className={styles.controls} /*className="w-full overflow-auto pointer-events-auto flex justify-center"*/>
          <button  className={`${styles.buttonControl} ${page - 1 < 0 ? styles.notClickable : ""}`} onClick={() => changePage(-1)}>
            <img src= "../arrow-left.svg"></img>
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
              const clamped = Math.min(pictures.length/2, Math.max(0, value));
              setPage(clamped);
            }}
            type="number"
            max={pictures.length / 2}
            min={0}
          ></input>
          <span className={styles.inputPageMax}>/{pageMax}</span>
          </div>
          <button  className={`${styles.buttonControl} ${page + 1 > pageMax ? styles.notClickable : ""}`} onClick={() => changePage(1)}>
            <img src= "../arrow-right.svg"></img>
          </button>
        </div>

      </main>
      {!isInfoHidden && page !== 0 && (
        
        <div className={styles.information} >
          <AnimatePresence mode="wait">
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

        </div>)}
      {page !== 0 && (<button className="btn"
        onClick={() => setIsInfoHidden(!isInfoHidden)}
      > <img className="btn-img" src={isInfoHidden ? "../chevron-down.svg" : "../chevron-up.svg"}></img></button>)}
    </>
  );
};