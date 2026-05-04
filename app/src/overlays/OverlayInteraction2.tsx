import { useEffect, useRef, useState } from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css';
import { useStore } from "../store"
import { useShallow } from "zustand/shallow"
import styles from "./styles/OverlayInteraction2.module.css"
import { ChevronToggleButton } from './ChevronToggleButton';

const radioSrc ="https://r2-worker.media-soi-room.workers.dev/"

const radio = [
  {
    name: "AMB-FM", lightColor: "#91A2AA",darkColor:"#788C96",
    tracks: [
      { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', name:"Water Ambience", date:"2025" },
      { src: `${radioSrc}quiz.mp3`, name: "Quiz" },
    ]
  },
  {
    name: "91 Electron", lightColor: "#AA9191",darkColor:"#977878",
    tracks: [
      { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', name:"Navegar", date:"2025" },
      { src: '/tempMusic/oldschool-192-lessdr-eq.mp3', name:"Oldshcol", date:"2026" },
      { src: `${radioSrc}quiz.mp3`, name: "Entropy" },
    ]
  },
  {
    name: "saveDforest FM", lightColor: "#A2AA91", darkColor:"#8D9778",
    tracks: [
      { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', name:"Scene 8", date:"2024" },
      { src: `${radioSrc}scene-2-p1.mp3`, name: "Main Theme", date:"2024"  },
      { src: `${radioSrc}scene-1.mp3`, name: "Scene 1", date:"2024"  },
      { src: `${radioSrc}scene-2-p2.mp3`, name: "Scene 2", date:"2024"  },
      { src: `${radioSrc}scene-3.mp3`, name: "Scene 3", date:"2024" },
      { src: `${radioSrc}scene-4.mp3`, name: "Scene 4" , date:"2024"  },
      { src: `${radioSrc}scene-5.mp3`, name: "Scene 5" , date:"2024"  },
      { src: `${radioSrc}scene-6.mp3`, name: "Scene 6" , date:"2024" },
      { src: `${radioSrc}scene-7.mp3`, name: "Scene 7" , date:"2024"  },
      { src: `${radioSrc}scene-8.mp3`, name: "Scene 8" , date:"2024"  },
      { src: `${radioSrc}scene-9.mp3`, name: "Scene 9" , date:"2024"  },
      { src: `${radioSrc}quiz.mp3`, name: "Quiz" , date:"2024"  },
      { src: `${radioSrc}minigame.mp3`, name: "Minigame" , date:"2024" },
    ]
  },

   {
    name: "CRUNCH-WAVE99", lightColor: "#91A2AA",darkColor:"#788C96",
    tracks: [
      { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', name:"sonaasdsad" },
      { src: `${radioSrc}quiz.mp3`, name: "Quizasdas" },
    ]
  }
]

export function OverlayInteraction2 ({ visible }: { visible: boolean }){


  const player = useRef<AudioPlayer>(null);
  const [currentStationIndex, setStationIndex] = useState(0);
  const [currentTrackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const wasPlayingRef = useRef(false); 
  const currentStation = radio[currentStationIndex];
  const currentTrack = currentStation.tracks[currentTrackIndex];

  const { isInfoHidden, showMainMenu} = useStore(useShallow((state) => ({
  
        isInfoHidden: state.isInfoHidden,
        showMainMenu: state.showMainMenu
    
  })),)

  //to resume playing once main menu is dismissed
  useEffect(() => {
    const audio = player.current?.audio.current;
    if (!audio) return;


    if (showMainMenu) {
      if (isPlaying) {
        audio.pause();
        wasPlayingRef.current = true;
      }
    } else {
      if (wasPlayingRef.current) {
        audio.play();
        wasPlayingRef.current = false;
      }
    }

  }
    , [showMainMenu, isPlaying])


  const handleClickNextTrack = () => {
        setTrackIndex((currentTrack) =>
            currentTrack < currentStation.tracks.length - 1 ? currentTrack + 1 : 0
        );
    };

    const handleClickPreviousTrack = () => {
        setTrackIndex((currentTrack) =>
            currentTrack -1 > -1 ? currentTrack -1 : currentStation.tracks.length-1
        );
    };
  
  const handleEnd = () => {
    setTrackIndex((currentTrack) =>
            currentTrack < currentStation.tracks.length - 1 ? currentTrack + 1 : 0
        );
    
  }

   const handleClickNextStation = () => {
      setTrackIndex(0)
        setStationIndex((currentStationIndex) =>
            currentStationIndex < radio.length - 1 ? currentStationIndex + 1 : 0
        );
    };

    const handleClickPreviousStation = () => {
      setTrackIndex(0)
        setStationIndex((currentStationIndex) => {
            return currentStationIndex -1 > -1 ? currentStationIndex -1 : radio.length-1
    }) 
    };

  return (
    <>
      <div className={styles.container} style={{display: visible && !isInfoHidden ? 'block' : 'none', "--light-color": currentStation.lightColor,
        "--dark-color": currentStation.darkColor} as React.CSSProperties}>
        <AudioPlayer
          header={<div className={styles.audioPlayerHeader}>
            <div className={styles.stationControls} >
              <button className={styles.buttonControl} onClick={handleClickPreviousStation}>
                <img src="../arrow-left.svg"></img>
              </button>
              <h2 >{currentStation.name} </h2>
              <button className={styles.buttonControl} onClick={handleClickNextStation}>
                <img src="../arrow-right.svg"></img>
              </button>
            </div>
            <div className={styles.trackRow}>
              <div className={`${styles.equalizer} ${isPlaying ? styles.active : ""}`}>
                <span></span>
                <span></span>

              </div>
              <h4>{currentTrack.name}</h4>
              <div className={`${styles.equalizer} ${styles.mirrored} ${isPlaying ? styles.active : ""}`}>
                <span></span>
                <span></span>

              </div>
            </div>
            <h6>{currentTrack.date}</h6>

          </div>}
          footer={<div className={styles.audioPlayerFooter}>
            <input className={styles.trackInput}
              value={currentTrackIndex + 1}
              onFocus={(e) => e.target.select()}
              onChange={(e) => {
                const value = e.target.valueAsNumber;

                if (Number.isNaN(value)) {
                  setTrackIndex(0);
                  return;
                }
                const clamped = Math.min(
                  currentStation.tracks.length,
                  Math.max(1, value)
                );

                setTrackIndex(clamped - 1); // convert back to 0-based
              }}
              type="number"
              max={currentStation.tracks.length}
              min={1}
            ></input>
            / {currentStation.tracks.length}
          </div>}
          ref={player}
          src={currentTrack.src}
          showSkipControls={true}
          showJumpControls={false}
          volume={0.1}
          onClickNext={handleClickNextTrack}
          onClickPrevious={handleClickPreviousTrack}
          onEnded={handleEnd}
          customProgressBarSection={[RHAP_UI.PROGRESS_BAR,]}
          hasDefaultKeyBindings={false}
          autoPlayAfterSrcChange={true}
          showFilledVolume={true}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onError={() => { console.log('play error') }}
        />
      </div>  
       {visible && ( <ChevronToggleButton/> )}
    </>
  );
} 
