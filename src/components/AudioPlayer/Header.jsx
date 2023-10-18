import './css/Header.css';

export default function Header({ showBooks, setShowBooks }) {
    return(
        <>
            <header>
                <div className="nav">
                    {!showBooks && <button className="back-to-books" onClick={() => { setShowBooks(true); }}>Back</button>}
                </div>
                <h1>The Holy Bible</h1>
                <p className="app-version">ver {APP_VERSION}</p>
            </header>
        </>
    )
}