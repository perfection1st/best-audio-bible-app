import './css/Books.css';

// IMPORT BIBLE DATA
import bibleData from '../../data/bible.json';

// Get old testament books
const otBooks = bibleData.filter(book => book.testament === "Old Testament").map(book => book.name);

// Get new testament books
const ntBooks = bibleData.filter(book => book.testament === "New Testament").map(book => book.name);

export default function Books({ setCurrentBook, setShowBooks }) {

    function handleSetBook(book) {
        setCurrentBook(book);
        setShowBooks(false);
    }

    return(
        <>
        <div className="book-selection-container">
        <div className="old-testament-books">
            <h2>Old Testament</h2>
        <div className="old-testament-buttons">
            <ul>
        {otBooks.map((book, index) => (
            <li key={index}>
            <button onClick={() => handleSetBook(book)}>
                {book}
            </button>
            </li>
        ))}
        </ul>
        </div>
        </div>
        <div className="new-testament-books">
            <h2>New Testament</h2>
        <div className="new-testament-buttons">
            <ul>
            {ntBooks.map((book, index) => (
                <li key={index}>
                <button onClick={() => handleSetBook(book)}>
                    {book}
                </button>
                </li>
            ))}
            </ul>
        </div>
        </div>
        </div>
        </>
    )
}