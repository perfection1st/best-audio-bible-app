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


export default function AudioPlayer() {
// SETUP DEFAULTS

// Sets a visibility state for showing Books or Chapters component

const [showBooks, setShowBooks] = useState(true);

// Uses CDN url from env file or defaults to localhost
const AUDIO_CDN = import.meta.env.VITE_AUDIO_CDN_URL || "http://172.20.7.47:3000"; // IP of local machine

// Set default bible version to king james version
const [version, setVersion] = useState('kjv');

// Sets default book
const [currentBook, setCurrentBook] = useState('Genesis');

// Sets default chapter
const [currentChapter, setCurrentChapter] = useState(1);

// Sets a reference to our <audio> element since it doesn't require re-render to UI when something changes
const audioRef = useRef(null);

// Sets isPlaying state to false by default (complies with browser auto-play policy)
const [isPlaying, setIsPlaying] = useState(false);

// Setup a state for audio being loaded
const [audioIsLoaded, setAudioIsLoaded] = useState(false);

// Setup a state for showing the user the loading state
const [isLoading, setIsLoading] = useState(true);

// State for showing the user an error
const [isError, setIsError] = useState(false);

// State for storing error message
const [errorMessage, setErrorMessage] = useState(null);

// State for initial audio source
const [audioSrc, setAudioSrc] = useState(null);

// State for the length of the audio file
const [audioDuration, setAudioDuration] = useState(0);

// State to hold the audio files current seek time
const [currentTime, setCurrentTime] = useState(0);

// Effect runs on application load and then each time currentChapter changes or audioIsLoaded changes
useEffect(() => {
  console.log(audioRef);
  setAudioSrc(`${AUDIO_CDN}/${version}/${currentBook}/${currentChapter}`);
}, [currentChapter, audioIsLoaded]);

// ERROR HANDLING FOR THE AUDIO ELEMENT

function handleError() {
  // Hide loading overlay
  setIsLoading(false);
  // Show error overlay
  setIsError(true);

  if(audioRef.current.error) {

    let errorCode = audioRef.current.error.code;

    switch(errorCode) {
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

  } else {
    return setErrorMessage("An unknown error occurred. Please try again later.");
  }
}

// Function for when the audio element starts playing
function handleOnPlay() {
  setIsPlaying(true);
}

// Function for when the audio element is paused
function handleOnPause() {
  setIsPlaying(false);
}

// Function to move the audio slider with the audio play
function handleUpdateCurrentTime() {
  setCurrentTime(audioRef.current.currentTime);
}

// Function to handle when audio has been loaded enough to play
function handleOnCanPlay() {
  setAudioIsLoaded(true);
  audioRef.current.muted = false;

  if (audioRef.current.paused) {
    audioRef.current.play()
      .then(() => {
        console.log("Play Successful");
        setIsLoading(false);
      })
      .catch((e) => {
        console.log("Play Error", e); 
        setIsLoading(false); // Ensure loading state is false on failure
      });
  }
}



// Waits till the audio file's metadata has been loaded in and sets the duration
function handleLoadedMetaData() {
  setAudioDuration(audioRef.current.duration);
}

// Helper function for getting next chapter/book
function getNextChapter(currentBook, currentChapter) {
  setIsLoading(true);
  // Find the current book data
  const bookData = bibleData.find(book => book.name === currentBook);
  
  if (!bookData) {
    // If for some reason the book isn't found, default to Genesis 1
    return { book: "Genesis", chapter: 1 };
  }
  
  // If the current chapter isn't the last chapter in the current book
  if (currentChapter < bookData.chapters) {
    return { book: currentBook, chapter: currentChapter + 1 };
  } 
  
  // If the current chapter is the last chapter in the current book
  const nextBookIndex = bibleData.findIndex(book => book.name === currentBook) + 1;
  
  // If the next book exists, return the first chapter of that book
  if (nextBookIndex < bibleData.length) {
    return { book: bibleData[nextBookIndex].name, chapter: 1 };
  } 
  
  // If the current book is the last in the list, wrap around to the beginning
  return { book: "Genesis", chapter: 1 };
}

function handleNextChapter() {
  console.log('fired nextChapter');
  
  const { book: nextBook, chapter: nextChapter } = getNextChapter(currentBook, currentChapter);
  setCurrentBook(nextBook);
  setCurrentChapter(nextChapter);
}

function handleOnLoadStart() {
  setIsLoading(true);
}

  return (
    <>
    <Header showBooks={showBooks} setShowBooks={setShowBooks} />
    <main>
    {isError && <div className="error"><p>{errorMessage}</p></div>}
    {isLoading && <div className="loading"><p>Loading...</p> <span className="loader"></span></div>}
    <audio muted
      ref={audioRef} 
      src={audioSrc}
      onTimeUpdate={handleUpdateCurrentTime}
      onError={handleError}
      onCanPlay={handleOnCanPlay}
      onLoadedMetadata={handleLoadedMetaData}
      onPlay={handleOnPlay}
      onPause={handleOnPause}
      onEnded={handleNextChapter}
      onLoadStart={handleOnLoadStart}
    >
    </audio>
    {showBooks ?
        <Books
        setCurrentBook={setCurrentBook}
        setCurrentChapter={setCurrentChapter}
        setShowBooks={setShowBooks}
        />
        :
        <Chapters
        currentBook={currentBook}
        setCurrentChapter={setCurrentChapter}
        setShowBooks={setShowBooks}
        />
    }
    </main>
    <footer>
    <Controls
        audioRef={audioRef}
        audioSrc={audioSrc}
        audioDuration={audioDuration}
        currentTime={currentTime}
        setCurrentTime={setCurrentTime}
        isPlaying={isPlaying}
        setIsPlaying={setIsPlaying}
        currentChapter={currentChapter}
        setCurrentChapter={setCurrentChapter}
        currentBook={currentBook}
        setCurrentBook={setCurrentBook}
        handleNextChapter={handleNextChapter}
        isLoading={isLoading}
      />
    </footer>

    </>
  )
}
