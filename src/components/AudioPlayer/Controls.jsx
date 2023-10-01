// IMPORT HOOKS
// import { useState, useEffect } from 'react';

import bibleData from '../../data/bible.json';

export default function Controls(props) {

const { 
    audioRef,
    audioSrc,
    isPlaying,
    setIsPlaying,
    audioDuration,
    currentTime,
    setCurrentTime,
    currentBook,
    setCurrentBook,
    currentChapter,
    setCurrentChapter,
    handleNextChapter,
    isLoading
} = props;

// PLAY/PAUSE
function handlePlayPause() {
    if(isPlaying) {
        audioRef.current.pause();
    } else {
        audioRef.current.play();
    }
}

// PLAY
function handlePlay() {
    audioRef.current.play();
}

// PAUSE
function handlePause() {
    audioRef.current.pause();
}

// Helper function to format audio time into human readable time
function formatTime(seconds) {
    const min = Math.floor(seconds / 60);
    const sec = Math.floor(seconds % 60);
    return `${min}:${sec.toString().padStart(2, '0')}`;
}
// Format the time the user sees
const formattedCurrentTime = formatTime(currentTime);
const formattedAudioDuration = formatTime(audioDuration);


// SCRUBBER FUNCTIONS

// Seek
function handleSeek(e) {
    setCurrentTime(e.target.value);
    audioRef.current.currentTime = e.target.value;
}

// Helper function for finding the previous chapter/book
function getPreviousChapter(currentBook, currentChapter) {
    // Find the current book data
    const bookData = bibleData.find(book => book.name === currentBook);
    
    if (!bookData) {
      // If for some reason the book isn't found, default to Revelation 22 (last chapter of the last book)
      return { book: "Revelation", chapter: 22 };
    }
    
// If the current chapter isn't the first chapter in the current book
    if (currentChapter > 1) {
      return { book: currentBook, chapter: currentChapter - 1 };
    } 
    
// If the current chapter is the first chapter in the current book
    const prevBookIndex = bibleData.findIndex(book => book.name === currentBook) - 1;
    
    // If the previous book exists, return the last chapter of that book
    if (prevBookIndex >= 0) {
      return { book: bibleData[prevBookIndex].name, chapter: bibleData[prevBookIndex].chapters };
    } 
    
    // If the current book is the first in the list, wrap around to the end
    return { book: "Revelation", chapter: 22 };  // Assuming 22 chapters in Revelation, adjust as necessary
}

// PREVIOUS CHAPTER
function handlePreviousChapter() {
    const { book: prevBook, chapter: prevChapter } = getPreviousChapter(currentBook, currentChapter);
    
    setCurrentBook(prevBook);
    setCurrentChapter(prevChapter);
}

// FAST FORWARD 10 SECONDS
function handleFastForward() {
    if (isLoading) return;
    const newTime = Math.min(audioRef.current.currentTime + 10, audioRef.current.duration -0.1);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime); 
}

function handleRewind() {
    if (isLoading) return;
    const newTime = Math.max(audioRef.current.currentTime - 10, 0);
    audioRef.current.currentTime = newTime;
    setCurrentTime(newTime); 
}



return(
    <>
        <input
            id="scrubber"
            type="range"
            value={currentTime}
            step="1"
            min="0"
            max={audioDuration}
            onChange={(e) => { handleSeek(e) }}
        />
        <label htmlFor="scrubber">{formattedCurrentTime}/{formattedAudioDuration}</label>
        <button onClick={handlePlay}>Play</button>
        <button onClick={handlePause}>Pause</button>
        <button onClick={handlePlayPause}>Play/Pause</button>
        <button onClick={handleNextChapter}>Next Chapter</button>
        <button onClick={handlePreviousChapter}>Previous Chapter</button>
        <button onClick={handleFastForward}>Forward 10s</button>
        <button onClick={handleRewind}>Rewind 10s</button>
    </>
)
}
