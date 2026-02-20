import styles from "./OverlayInteraction1.module.css"
/* handles book and page ui + state*/ 
import { useShallow } from "zustand/shallow";
import { useStore } from "../store";


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
  const { page, setPage} = useStore(useShallow((state) =>({

          page: state.page,
          setPage: state.setPage,
 
      })),)


 return (
    <>
      <main className={styles.main} /*className=" pointer-events-none select-none z-10 fixed  inset-0  flex justify-between flex-col" */ >

        <div className={styles.controls} /*className="w-full overflow-auto pointer-events-auto flex justify-center"*/>
          <div className="overflow-auto flex items-center gap-4 max-w-full p-10">
            {[...pages].map((_, index) => (
              <button
                key={index}
                className={`border-transparent hover:border-white transition-all duration-300  px-4 py-3 rounded-full  text-lg uppercase shrink-0 border ${
                  index === page
                    ? "bg-white/90 text-black"
                    : "bg-black/30 text-white"
                }`}
                onClick={() => setPage(index)}
              >
                {index === 0 ? "Cover" : `Pages ${index * 2 - 1} – ${index * 2}`}
              </button>
            ))}
            
           
          </div>
        </div>
      </main>
    </>
  );
};