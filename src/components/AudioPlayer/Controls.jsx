import { useRef } from 'react';
import './css/Controls.css';

import bibleData from '../../data/bible.json';

// Import Icon SVG's
import playIcon from '../../assets/icons/light/play.svg';
import pauseIcon from '../../assets/icons/light/pause.svg';
import rewindIcon from '../../assets/icons/light/rewind.svg';
import fastForwardIcon from '../../assets/icons/light/fast-forward.svg';
import nextIcon from '../../assets/icons/light/next.svg';
import previousIcon from '../../assets/icons/light/previous.svg';

export default function Controls({
    audioRef,
    isLoading,
    setIsLoading,
    isPlaying,
    setIsPlaying,
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
    handleNextChapter
}) {

    // Display readable time
    const formatTime = (time) => {
        const minutes = Math.floor(time / 60);
        const seconds = Math.floor(time - minutes * 60);
        return `${minutes}:${seconds.toString().padStart(2, '0')}`;
    };

    function formatDuration(duration) {
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60);

        // Adding a leading zero if seconds are less than 10
        const formattedSeconds = seconds < 10 ? '0' + seconds : seconds;

        return `${minutes}:${formattedSeconds}`;
    }

    // Handle scrubbing
    const handleStartScrub = () => {
        setIsScrubbing(true);
      };

      const handleEndScrub = (e) => {
        if (isScrubbing) {
          const newTime = e.target.value;
          audioRef.current.currentTime = newTime;
          setCurrentTime(newTime);
          setIsScrubbing(false);
        }
      };

    // Helper function for finding the previous chapter/book
    function getPreviousChapter(currentBook, currentChapter) {
        // Ensure currentChapter is a number
        currentChapter = parseInt(currentChapter, 10);

        // Find the current book data with a case-insensitive comparison
        const bookData = bibleData.find(book => book.name.toLowerCase() === currentBook.toLowerCase());

        // If for some reason the book isn't found, default to Revelation 22
        if (!bookData) {
            return { book: "Revelation", chapter: 22 };
        }

        // If the current chapter isn't the first chapter in the current book
        if (currentChapter > 1) {
            return { book: currentBook, chapter: currentChapter - 1 };
        }

        // If the current chapter is the first chapter in the current book
        const prevBookIndex = bibleData.findIndex(book => book.name.toLowerCase() === currentBook.toLowerCase()) - 1;

        // If the previous book exists, return the last chapter of that book
        if (prevBookIndex >= 0) {
            return { book: bibleData[prevBookIndex].name, chapter: bibleData[prevBookIndex].chapters };
        }

        // If the current book is the first in the list, wrap around to the end
        // Retrieving the number of chapters in Revelation dynamically
        const revelationData = bibleData.find(book => book.name === "Revelation");
        const lastChapterOfRevelation = revelationData ? revelationData.chapters : 22;

        return { book: "Revelation", chapter: lastChapterOfRevelation };
    }

    // Handle Previous Chapter
    function handlePreviousChapter() {
        const { book: prevBook, chapter: prevChapter } = getPreviousChapter(currentBook, currentChapter);
        setCurrentBook(prevBook);
        setCurrentChapter(prevChapter);
    }

    // Handle fast foward
    function handleFastForward() {
        let fastForwardInterval = 10;
        let currentTime = audioRef.current.currentTime;
        let duration = audioRef.current.duration;

        // If the currentTime + 10 is going to be longer than our audio file, go to the next chapter
        if (currentTime + fastForwardInterval < duration) {
            audioRef.current.currentTime = audioRef.current.currentTime + fastForwardInterval;
        } else if (currentTime + fastForwardInterval > duration) {
            handleNextChapter();
        }
    }
    // Handle Rewind
    function handleRewind() {
        let rewindInterval = 10;
        let currentTime = audioRef.current.currentTime;
        let epsilon = 0.4; // Adjusts tolerance for the rewind at the start of the audio

        if (currentTime <= rewindInterval && currentTime > epsilon) {
            // Rewind to the start of the track
            audioRef.current.currentTime = 0;
        } else if (currentTime <= epsilon) {
            // If already at the start of the track, go to previous chapter
            handlePreviousChapter();
        } else {
            // Otherwise, rewind the audio by the rewind interval
            audioRef.current.currentTime = currentTime - rewindInterval;
        }
    }



    return (
        <>
            <section className="now-playing">
                <h3>{currentBook} {currentChapter}</h3>
            </section>

            <section className="seek">
                <input
                    id="scrubber"
                    type="range"
                    value={currentTime}
                    step="1"
                    min="0"
                    max={audioDuration}
                    onChange={handleEndScrub}
                    onMouseDown={handleStartScrub}
                    onTouchStart={handleStartScrub}
                />
                <p className="current-time"><label htmlFor="scrubber">{formatTime(currentTime)}/{formatDuration(audioDuration)}</label></p>
            </section>

            <section className="audio-control-buttons">
                <button className="back" onClick={handleRewind}><span>10s</span><img src={rewindIcon} alt="Rewind 10 Seconds" /></button>
                <button className="previous" onClick={handlePreviousChapter}><span>Prev</span><img src={previousIcon} alt="Previous Chapter" /></button>
                <button className={isPlaying ? "playing" : "paused"} onClick={handlePlayPause}><img src={isPlaying ? pauseIcon : playIcon} alt={isPlaying ? "Play" : "Pause"} /></button>
                <button className="next" onClick={handleNextChapter}><span>Next</span><img src={nextIcon} alt="Next Chapter" /></button>
                <button className="forward" disabled={isLoading} onClick={handleFastForward}><span>10s</span><img src={fastForwardIcon} alt="Fast Forward 10 Seconds" /></button>
            </section>
        </>
    )
}
