// IMPORT HOOKS
import { useState, useRef, useEffect } from 'react';

// IMPORT CSS
import './css/AudioPlayer.css';

// IMPORT SUBCOMPONENTS
import Header from './Header';
import Controls from './Controls';
import Books from './Books';
import Chapters from './Chapters';

// IMPORT BIBLE DATA
import bibleData from '../../data/bible.json';

// Get Audio API
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";
const API_TOKEN = import.meta.env.VITE_API_TOKEN;

export default function AudioPlayer() {

  // Get reference to audio player
  const audioRef = useRef();

  // UI state to show Books component if user has selected a chapter
  const [showBooks, setShowBooks] = useState(true);

  // State to hold potential error messages
  const [errorMessage, setErrorMessage] = useState(null);

  // Loading state
  const [isLoading, setIsLoading] = useState(false);

  // Playing state
  const [isPlaying, setIsPlaying] = useState(false);

  // Scrubbing state
  const [isScrubbing, setIsScrubbing] = useState(false);

  // State to hold current version
  const [currentVersion, setCurrentVersion] = useState('kjv');

  // State to hold current book
  const [currentBook, setCurrentBook] = useState('genesis');

  // State to hold current chapter number
  const [currentChapter, setCurrentChapter] = useState(1);

  // State to hold the audio file's duration
  const [audioDuration, setAudioDuration] = useState(null);

  // State to hold the current audio seek time
  const [currentTime, setCurrentTime] = useState(0);


  // PROP OBJECTS
  const controlsProps = {
    audioRef,
    isLoading,
    setIsLoading,
    isPlaying,
    handlePlay,
    handlePlayPause,
    audioDuration,
    currentTime,
    setCurrentTime,
    currentBook,
    setCurrentBook,
    currentChapter,
    setCurrentChapter,
    isScrubbing,
    setIsScrubbing
  }

  const headerProps = {
    showBooks,
    setShowBooks
  }

  const booksProps = {
    currentBook,
    setCurrentBook,
    showBooks,
    setShowBooks
  }

  const chaptersProps = {
    currentBook,
    setCurrentChapter,
    setShowBooks,
    handlePlayPause,
  }
  useEffect(() => {
    console.log("Current Book and Chapter changed: ", { currentBook, currentChapter });
}, [currentBook, currentChapter]);

  // useEffect to load in audio file
  useEffect(() => {
    audioRef.current.src = `${API_URL}/${currentVersion}/${currentBook}/${currentChapter}.mp3`;
    audioRef.current.load();
    handlePlay();
  }, [currentChapter]);

  function handleAudioError(e) {
    setIsLoading(false);
    let error = e.target.error;

      switch(error.code) {
        case 1: 
            return setErrorMessage("The audio playback was aborted. (Error code 1)");
        case 2:
            return setErrorMessage("Network error. (Error code 2)");
        case 3:
            return setErrorMessage("The audio playback was aborted. (Error code 3)");
        case 4:
            return setErrorMessage("The audio could not be loaded. (Error code 4)");
        default:
            return setErrorMessage("An unknown error occurred. Please try again later.");
    }
  }

  // Set audio duration after meta data loads
  function handleDurationChange() {
    setAudioDuration(audioRef.current.duration);
  }

  // Update time state as time changes
  function handleTimeUpdate() {
    if(!isScrubbing) {
      setCurrentTime(audioRef.current.currentTime);
    }
  }

  // Set the isPlaying state to true/false based on the audio element events onPlay or onPause
  async function handlePlay() {
    try {
        await audioRef.current.play();
    } catch (error) {
        console.error(error.message);
    }
}

  async function handlePlayPause() {
    if(isPlaying) {
        audioRef.current.pause();
    } else {
        try {
            await audioRef.current.play();
            console.log('Audio is playing!');
        } catch(error) {
            console.error('Failed to play audio!');
        }
    }
}

  return (
    <>
    <Header {...headerProps} />
    <main>
    {errorMessage && <div className="error"><p>{errorMessage}</p></div>}
    {isLoading && <div className="loading"><p>Loading...</p> <span className="loader"></span></div>}
    <audio preload="true"
      ref={audioRef}
      onError={handleAudioError}
      onLoadStart={() => { setIsLoading(true); } }
      onLoadedData={() => { setIsLoading(false); } }
      onCanPlayThrough={() => { setIsLoading(false); } }
      onPlay={() => { setIsPlaying(true); }}
      onPause={() => { setIsPlaying(false); }}
      onAbort={() => {setIsPlaying(false); } }
      onDurationChange={handleDurationChange}
      onTimeUpdate={handleTimeUpdate}
    >
      Your browser does not support the audio element.
    </audio>
    {showBooks ?
        <Books {...booksProps} />
        :
        <Chapters {...chaptersProps} />
    }
    </main>
    <footer>
      <Controls {...controlsProps} />
    </footer>

    </>
  )
}
