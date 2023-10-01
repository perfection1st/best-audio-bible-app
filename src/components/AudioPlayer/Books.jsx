import './css/Books.css';

// IMPORT BIBLE DATA
import bibleData from '../../data/bible.json';

// Get old testament books
const otBooks = bibleData.filter(book => book.testament === "Old Testament").map(book => book.name);

// Get new testament books
const ntBooks = bibleData.filter(book => book.testament === "New Testament").map(book => book.name);

export default function Books(props) {
    const { setCurrentBook } = props;

    function handleSetBook(book) {
        setCurrentBook(book);
    }

    return(
        <>
        <div className="book-selection-container">
        <div className="old-testament-books">
        {otBooks.map((book, index) => (
            <button key={index} onClick={() => handleSetBook(book)}>
                {book}
            </button>
        ))}
        </div>
        <div className="new-testament-books">
        {ntBooks.map((book, index) => (
            <button key={index} onClick={() => handleSetBook(book)}>
                {book}
            </button>
        ))}
        </div>
        </div>
        </>
    )
}