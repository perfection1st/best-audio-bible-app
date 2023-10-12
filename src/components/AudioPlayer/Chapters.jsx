import './css/Chapters.css';

// IMPORT BIBLE DATA
import bibleData from '../../data/bible.json';

// Get old testament books
const otBooks = bibleData.filter(book => book.testament === "Old Testament").map(book => book.name);

// Get new testament books
const ntBooks = bibleData.filter(book => book.testament === "New Testament").map(book => book.name);

export default function Chapters({ currentBook, setCurrentChapter, setShowBooks, handlePlayPause }) {

    const bookData = bibleData.find(book => book.name === currentBook);
    const chapters = bookData ? bookData.chapters : 0;

    function handleChangeBook(index) {
        setCurrentChapter(index + 1);
        setShowBooks(true);
        handlePlayPause();
    }

    return(
        <>
        <div className="chapter-selection-container">
            <h2>Select chapter</h2>
            <div className="chapter-buttons">
                <ul>
                {[...Array(chapters).keys()].map((_, index) => (
                    <li key={index}>
                        <button onClick={() => { handleChangeBook(index)}}>
                            {index + 1}
                        </button>
                    </li>
                ))}
                </ul>
            </div>
        </div>
        </>
    )
}