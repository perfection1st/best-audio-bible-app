import './css/Header.css';

export default function Header({ showBooks, setShowBooks }) {
    return(
        <>
            <header>
                {!showBooks && <button className="back-to-books" onClick={() => { setShowBooks(true); }}>Back</button>}
                <h1>The Holy Bible</h1>
            </header>
        </>
    )
}