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
const API_URL = import.meta.env.VITE_API_URL;

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
    setIsScrubbing,
    getNextChapter,
    handleNextChapter
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

  // useEffect to load in audio file
  useEffect(() => {
    audioRef.current.src = `${API_URL}/${currentVersion}/${formatCurrentBook(currentBook)}/${currentChapter}.mp3`;
    audioRef.current.load();
    handlePlay();
  }, [currentChapter, currentBook]);

  function formatCurrentBook(book) {
    const romanNumerals = { '1': 'i', '2': 'ii', '3': 'iii'};

    // Replace numbers with Roman numerals and format the string
    const formattedBook = book
      .split(' ')
      .map(part => romanNumerals[part] || part)
      .join('-')
      .toLowerCase();

    return formattedBook;
  }


  function handleAudioError(e) {
    setIsLoading(false);
    let error = e.target.error;

    switch (error.code) {
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

  function handleCloseModal() {
    setErrorMessage(null);
    setShowBooks(true);
  }

  // Set audio duration after meta data loads
  function handleDurationChange() {
    setAudioDuration(audioRef.current.duration);
  }

  // Update time state as time changes
  function handleTimeUpdate() {
    if (!isScrubbing) {
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
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      try {
        await audioRef.current.play();
        console.log('Audio is playing!');
      } catch (error) {
        console.error('Failed to play audio!');
      }
    }
  }

  function getNextChapter(currentBook, currentChapter) {
    // Ensure currentChapter is a number
    currentChapter = parseInt(currentChapter, 10);

    // Find the current book data with case-insensitive comparison
    const bookData = bibleData.find(book => book.name.toLowerCase() === currentBook.toLowerCase());

    // If for some reason the book isn't found, default to Genesis 1
    if (!bookData) {
      return { book: "Genesis", chapter: 1 };
    }

    // If the current chapter isn't the last chapter in the current book
    if (currentChapter < bookData.chapters) {
      return { book: currentBook, chapter: currentChapter + 1 };
    }

    // If the current chapter is the last chapter in the current book
    const nextBookIndex = bibleData.findIndex(book => book.name.toLowerCase() === currentBook.toLowerCase()) + 1;

    // If the next book exists, return the first chapter of that book
    if (nextBookIndex < bibleData.length) {
      return { book: bibleData[nextBookIndex].name, chapter: 1 };
    }

    // If the current book is the last in the list, wrap around to the start
    return { book: "Genesis", chapter: 1 };
  }


  // Handle Next Chapter
  function handleNextChapter() {
    const { book: nextBook, chapter: nextChapter } = getNextChapter(currentBook, currentChapter);
    setCurrentBook(nextBook);
    setCurrentChapter(nextChapter);
    handlePlay();
  }

  return (
    <>
      <Header {...headerProps} />
      <main>
        {errorMessage && <div className="error"><p>{errorMessage}</p> <button onClick={handleCloseModal} className="close-modal">X</button></div>}
        {isLoading && <div className="loading"><p>Loading...</p> <span className="loader"></span></div>}
        <audio preload="true"
          ref={audioRef}
          onError={handleAudioError}
          onLoadStart={() => { setIsLoading(true); }}
          onLoadedData={() => { setIsLoading(false); }}
          onCanPlayThrough={() => { setIsLoading(false); }}
          onPlay={() => { setIsPlaying(true); }}
          onPause={() => { setIsPlaying(false); }}
          onAbort={() => { setIsPlaying(false); }}
          onDurationChange={handleDurationChange}
          onTimeUpdate={handleTimeUpdate}
          onEnded={handleNextChapter}
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
