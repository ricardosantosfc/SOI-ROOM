
import { useShallow } from "zustand/shallow"
import { useStore } from "../store"
import styles from "./MainMenu.module.css"
import { useState } from "react"
//main menu overlay, when esc is pressed

type Props = {
  tryLock: () => void
}


export function MainMenu({ tryLock }: Props) {

 const { isOrbitControls, setShowMainMenu } = useStore(useShallow((state) =>
  ({isOrbitControls: state.isOrbitControls,setShowMainMenu: state.setShowMainMenu})),)

  const [showInfoMenu, setShowInfoMenu] = useState(false)

  const handleInfoButtonClick = () => {
    setShowInfoMenu(!showInfoMenu)
  }

   //button might still need some sort of cooldown, or message for when unlock->lock too fast and browser blocks pointerlocking
    const handleStartClick = () => {
      console.log("pressed button start main menu")
      setShowMainMenu(false);
  
      if (!isOrbitControls) {
        tryLock()
      }
    }

  //can be a bit simplified now that contains starbutton, seee menu, main, buttonwrapper
  return (
    <div className={styles.menu}>
      <div className={styles.main}>
        <div className={styles.topLeft}>
          <button className={`${styles.infoButton} ${showInfoMenu ? styles.active : ""}`} onClick={handleInfoButtonClick}>
            <svg className={styles.infoButtonImg} width="44" height="44" viewBox="0 0 44 44" fill="var(--icon-fill)" xmlns="http://www.w3.org/2000/svg">
              <path d="M22 30V22M22 14H22.02M42 22C42 33.0457 33.0457 42 22 42C10.9543 42 2 33.0457 2 22C2 10.9543 10.9543 2 22 2C33.0457 2 42 10.9543 42 22Z" stroke="var(--icon-stroke)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className={styles.logo}>
          <img src="../logo4.svg" alt="logo" />
        </div>
        <div className={styles.bottomArea}>
          {!showInfoMenu && (<div className={styles.controls}>
            <div className={styles.controlChild}>
              <span>walk</span>
              <img src="../walk.svg" alt="walk" />
            </div>

            <div className={styles.controlChild}>
              <span>look around</span>
              <img src="../look_around.svg" alt="look around" />
            </div>

            <div className={styles.controlChild}>
              <span>interact</span>
              <img src="../interact.svg" alt="interact" />
            </div>

            <div className={styles.controlChild}>
              <span>exit interaction</span>
              <img src="../exit_interaction.svg" alt="exit interaction" />
            </div>

            <div className={styles.controlChild}>
              <span>main menu</span>
              <img src="../main_menu(1).svg" alt="main menu" />
            </div>
          </div>)}
          {showInfoMenu && (<div className={styles.info}>
            <p className={styles.infoEtymology}>
              <strong><em>sói</em></strong>: archaic Portuguese, from the verb{" "}
              <strong><em>soer</em></strong> - out of habit or custom; usual.
            </p>
            <p className={styles.infoText}>
              SÓI ROOM is a virtual space built to showcase works resulting from my creative hobbies, while also serving as a React and Three.js exploration project.
            </p>



            <p className={styles.infoText}>
              I hope you enjoy your visit.
            </p>
            <div className={styles.logoSignatureWrapper} >
              <a className={styles.logoSignature} href="https://www.ricardo-santos.dev/" target="_blank" rel="noopener noreferrer" aria-label="Visit my personal website through this link ">
                <img src="../logoSignature.svg" ></img>
              </a>
            </div>
          </div>)}
        </div>
        <div className="startButtonWrapper">
          <button
            className={styles.startButton}
            onClick={handleStartClick}
          >
            <svg width="104" height="100" viewBox="0 0 104 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="2" y="2" width="100" height="96" rx="6" fill="var(--button-background)" stroke="#1E1E1E" strokeWidth="4" />
              <path d="M40 32L68 50L40 68V32Z" fill="var(--button-fill)" stroke="#1E1E1E" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
            </svg>

          </button>
        </div>
      </div>
    </div>

  )
}