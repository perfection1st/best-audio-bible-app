import './css/Header.css';

export default function Header(props) {
    const { showBooks, setShowBooks } = props;

    return(
        <>
            <header>
                {!showBooks && <button className="back-to-books" onClick={() => { setShowBooks(true); }}>Back</button>}
                <h1>The Holy Bible</h1>
            </header>
        </>
    )
}