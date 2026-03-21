import { useState } from 'react';
import AudioPlayer, { RHAP_UI } from 'react-h5-audio-player'
import 'react-h5-audio-player/lib/styles.css';
import styles from "./OverlayInteraction2.module.css"
export function OverlayInteraction2 ({ visible }: { visible: boolean }){



const playlist = [
  { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-9.mp3', name:"song 1" },
  { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3', name:"song 2" },
  { src: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-8.mp3', name:"song 3" },
]

  const [currentTrack, setTrackIndex] = useState(0)
  const handleClickNext = () => {
      console.log('click next')
        setTrackIndex((currentTrack) =>
            currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
        );
    };

    const handleClickPrevious = () => {
      console.log('click next')
        setTrackIndex((currentTrack) =>
            currentTrack -1 > -1 ? currentTrack -1 : playlist.length-1
        );
    };
  
  const handleEnd = () => {
    console.log('end')
    setTrackIndex((currentTrack) =>
            currentTrack < playlist.length - 1 ? currentTrack + 1 : 0
        );
    
  }
  return (
    <>
      <div className={styles.container} style={{ display: visible ? 'block' : 'none' }}>
        
        <AudioPlayer
         className={''}
         header={<div className={styles.playerHeader}>
            <h2>{playlist[currentTrack].name}</h2>
         </div>}
          src={playlist[currentTrack].src}
          showSkipControls={true}
          showJumpControls={false}
          onClickNext={handleClickNext}
          onClickPrevious={handleClickPrevious}
          onEnded={handleEnd}
          customProgressBarSection={[
  RHAP_UI.PROGRESS_BAR,
  <div style={{ fontSize: '0.8rem', opacity: 0.7 }}>
    {currentTrack + 1} / {playlist.length}
  </div>
]}
          hasDefaultKeyBindings={false}
          autoPlayAfterSrcChange={true}
          onError={()=> {console.log('play error')}}
          // Try other props!
        />
      </div>
      </>
    );
}
