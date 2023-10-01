// IMPORT BIBLE DATA
import bibleData from '../../data/bible.json';

// Get old testament books
const otBooks = bibleData.filter(book => book.testament === "Old Testament").map(book => book.name);

// Get new testament books
const ntBooks = bibleData.filter(book => book.testament === "New Testament").map(book => book.name);

export default function Chapters(props) {
    const {currentBook, setCurrentChapter} = props;

    const bookData = bibleData.find(book => book.name === currentBook);
    const chapters = bookData ? bookData.chapters : 0;


    return(
        <>
        <h2>CHAPTERS</h2>
        {[...Array(chapters).keys()].map((_, index) => (
            <button key={index} onClick={() => setCurrentChapter(index + 1)}>
              {index + 1}
            </button>
        ))}
        </>
    )
}