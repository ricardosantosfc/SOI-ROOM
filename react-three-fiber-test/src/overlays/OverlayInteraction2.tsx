import { useMemo, useState } from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css';
import styles from "./OverlayInteraction2.module.css"


const radio = [
  {
    name: "saveDforest FM ", lightColor: "#A2AA91", darkColor:"#8D9778",
    tracks: [
      { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', name:"Scene 8" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/scene-2-p1.mp3', name: "Main Theme" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/scene-1.mp3', name: "Scene 1" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/scene-2-p2.mp3', name: "Scene 2" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/scene-3.mp3', name: "Scene 3" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/scene-4.mp3', name: "Scene 4" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/scene-5.mp3', name: "Scene 5" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/scene-6.mp3', name: "Scene 6" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/scene-7.mp3', name: "Scene 7" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/scene-8.mp3', name: "Scene 8" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/scene-9.mp3', name: "Scene 9" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/quiz.mp3', name: "Quiz" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/minigame.mp3', name: "Minigame" },
    ]
  },
  {
    name: "otherFM", lightColor: "#AA9191",darkColor:"#977878",
    tracks: [
      { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', name:"Water Ambience" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/quiz.mp3', name: "Quiz" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/minigame.mp3', name: "Minigame" },
    ]
  },
   {
    name: "AndOther", lightColor: "#91A2AA",darkColor:"#788C96",
    tracks: [
      { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', name:"sonaasdsad" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/quiz.mp3', name: "Quizasdas" },
      { src: 'https://r2-worker.media-soi-room.workers.dev/minigame.mp3', name: "Minigamed" },
    ]
  }
]

export function OverlayInteraction2 ({ visible }: { visible: boolean }){



  const [currentStationIndex, setStationIndex] = useState(0);
  const [currentTrackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const currentStation = radio[currentStationIndex];
  const currentTrack = currentStation.tracks[currentTrackIndex];
  //const currentTrackData = useMemo(() => playlist[currentTrack], [currentTrack]); 
  const handleClickNextTrack = () => {
      console.log('click next')
        setTrackIndex((currentTrack) =>
            currentTrack < currentStation.tracks.length - 1 ? currentTrack + 1 : 0
        );
    };

    const handleClickPreviousTrack = () => {
      console.log('click next')
        setTrackIndex((currentTrack) =>
            currentTrack -1 > -1 ? currentTrack -1 : currentStation.tracks.length-1
        );
    };
  
  const handleEnd = () => {
    console.log('end')
    setTrackIndex((currentTrack) =>
            currentTrack < currentStation.tracks.length - 1 ? currentTrack + 1 : 0
        );
    
  }

   const handleClickNextStation = () => {
      console.log('click next playslist')
      setTrackIndex(0)
        setStationIndex((currentStationIndex) =>
            currentStationIndex < radio.length - 1 ? currentStationIndex + 1 : 0
        );
    };

    const handleClickPreviousStation = () => {
      console.log('click previous playsii')
      setTrackIndex(0)
        setStationIndex((currentStationIndex) => {
          console.log(currentStationIndex)
            return currentStationIndex -1 > -1 ? currentStationIndex -1 : radio.length-1
    }) 
    };
    /* >*/
  return (
    <>
      <div className={styles.container}   style={{ display: visible ? 'block' : 'none', "--light-color": currentStation.lightColor,
        "--dark-color": currentStation.darkColor} as React.CSSProperties}>
        
        <AudioPlayer
         
         header={<div className={styles.audioPlayerHeader}>
          <div className={styles.stationControls} >
           <button className={styles.buttonControl} onClick={handleClickPreviousStation}>
             <img src= "../arrow-left.svg"></img>
           </button>
            <h2 >{currentStation.name} </h2>
             <button className={styles.buttonControl} onClick={handleClickNextStation}>
               <img src= "../arrow-right.svg"></img>
             </button>
            </div>
             <div className={styles.trackRow}>
               <div className={`${styles.equalizer} ${ isPlaying? styles.active : ""}`}>
    <span></span>
    <span></span>

    </div>
               <h4>{currentTrack.name}</h4>
                <div className={`${styles.equalizer} ${styles.mirrored} ${ isPlaying? styles.active : ""}`}>
    <span></span>
    <span></span>
    
  </div>       
 </div>
           
         </div>}
         footer={ <div className={styles.audioPlayerFooter}>
           <input className={styles.trackInput}
            value={currentTrackIndex+1}
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
          src={currentTrack.src}
          showSkipControls={true}
          showJumpControls={false}
          volume={0.3}
          onClickNext={handleClickNextTrack}
          onClickPrevious={handleClickPreviousTrack}
          onEnded={handleEnd}
          customProgressBarSection={[RHAP_UI.PROGRESS_BAR,]}
          hasDefaultKeyBindings={false}
          autoPlayAfterSrcChange={true}
          showFilledVolume={true}
          onPlay={() => setIsPlaying(true)}
  onPause={() => setIsPlaying(false)}
          onError={()=> {console.log('play error')}}
          // Try other props!
        />
      </div>
      </>
    );
}
