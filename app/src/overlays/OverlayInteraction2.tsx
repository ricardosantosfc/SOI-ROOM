import { useEffect, useRef, useState } from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css';
import { useStore } from "../store"
import { useShallow } from "zustand/shallow"
import styles from "./styles/OverlayInteraction2.module.css"
import { ChevronToggleButton } from './ChevronToggleButton';
import { radio } from '../data/RadioData';


const stationChangeAudio = new Audio("/sfx/stationChange-004.mp3");
stationChangeAudio.volume= 0.6

const LoopCustomIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    width="1em"
    height="1em"
    fill="currentColor"
  >
    <path d="M13,15V9H12L10,10V11H11.5V15M17,17H7V14L3,18L7,22V19H19V13H17M7,7H17V10L21,6L17,2V5H5V11H7V7Z" /></svg>
);



export function OverlayInteraction2 ({ visible }: { visible: boolean }){


  const player = useRef<AudioPlayer>(null);
  const [currentStationIndex, setStationIndex] = useState(0);
  const [currentTrackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const wasPlayingRef = useRef(false); 
  const currentStation = radio[currentStationIndex];
  const currentTrack = currentStation.tracks[currentTrackIndex];

  const { isOverlayCollapsed, showMainMenu} = useStore(useShallow((state) => ({
  
        isOverlayCollapsed: state.isOverlayCollapsed,
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
        playSfx()
    };

    const handleClickPreviousStation = () => {
      setTrackIndex(0)
        setStationIndex((currentStationIndex) => {
            return currentStationIndex -1 > -1 ? currentStationIndex -1 : radio.length-1
    }) 
    playSfx()
    };

    const playSfx = () => {
      if(!stationChangeAudio.paused){
        stationChangeAudio.pause();
        stationChangeAudio.currentTime =0;
      }
      stationChangeAudio.play();
    }

  return (
    <>
      <div className={styles.container} style={{display: visible && !isOverlayCollapsed ? 'block' : 'none', "--light-color": currentStation.lightColor,
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
          showSkipControls={currentStation.tracks.length > 1 }
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
          customIcons={{ loop: <LoopCustomIcon />, loopOff: <LoopCustomIcon/>}}
        />
      </div>  
       {visible && ( <ChevronToggleButton/> )}
    </>
  );
} 
