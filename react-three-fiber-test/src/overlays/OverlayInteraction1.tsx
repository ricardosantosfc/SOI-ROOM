import styles from "./OverlayInteraction1.module.css"
/* handles book and page ui + state*/
import { useShallow } from "zustand/shallow";
import { useStore } from "../store";


const informations = [

  {
    name: "Lucky",
    mediumYear: "Charcoal, 2021 "
  },
  {
    name: "Musashi (Takehiko Inoue study)",
    mediumYear: "Ink, watercolor, and gouache, 2016 "
  },
  {
    name: "Tormenta",
    mediumYear: "Charcoal,  "
  },
  {
    name: "Fräulein Bürstner",
    mediumYear: "Watercolor, 2021 "
  },

  {
    name: "Musashi (Takehiko Inoue study)",
    mediumYear: "Ink and digital, 2016 "
  }


]
const pictures = [
  "p1",
  "p2",
  "p3",
  "p4",
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
  back: "back",
});

export const OverlayInteraction1 = () => {
  const { page, setPage, isInfoHidden, setIsInfoHidden } = useStore(useShallow((state) => ({

    page: state.page,
    setPage: state.setPage,
    isInfoHidden: state.isInfoHidden,
    setIsInfoHidden: state.setIsInfoHidden

  })),)

  const changePage = (value:number )=>{
    if((page + value>=0) && (page + value <= pictures.length/2)){
      setPage(page+value)
    }
  }

  return (
    <>
      <main className={styles.main} /*className=" pointer-events-none select-none z-10 fixed  inset-0  flex justify-between flex-col" */ >

        <div className={styles.controls} /*className="w-full overflow-auto pointer-events-auto flex justify-center"*/>
          <button className={styles.buttonControl} onClick={() => changePage(-1)}>
            <img src= "../arrow-left.svg"></img>
          </button>
          <input className={styles.pageInput}
            value={page}
            onChange={(e) => {
              const value = e.target.valueAsNumber;

              if (Number.isNaN(value)) {
                setPage(0);
                return;
              }
              const clamped = Math.min(2, Math.max(0, value));
              setPage(clamped);
            }}
            type="number"
            max={pictures.length / 2}
            min={0}
          ></input>
          <button className={styles.buttonControl} onClick={() => changePage(1)}>
            <img src= "../arrow-right.svg"></img>
          </button>
        </div>

      </main>
      {!isInfoHidden && page !== 0 && (<div className={styles.information} >
        <div className={styles.informationChild}>
          <h2 >{informations[(page - 1) * 2].name}</h2>
          <h3>{informations[(page - 1) * 2].mediumYear}</h3>
        </div>
        <div className={styles.informationChild}>
          <h2 >{informations[(page - 1) * 2 + 1].name}</h2>
          <h3>{informations[(page - 1) * 2 + 1].mediumYear}</h3>
        </div>
      </div>)}
      {page !== 0 && (<button className="btn"
        onClick={() => setIsInfoHidden(!isInfoHidden)}
      > <img className="btn-img" src={isInfoHidden ? "../chevron-down.svg" : "../chevron-up.svg"}></img></button>)}
    </>
  );
};