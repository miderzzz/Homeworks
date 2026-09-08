import { useState } from 'react';
import SongsPage from './pages/SongsPage';
import BrowserPage from './pages/BrowserPage';

type Page = 'songs' | 'browser';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('songs');

  return (
    <div style={{ maxWidth: '500px', margin: '40px auto', fontFamily: 'sans-serif' }}>
      <nav style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
        <button onClick={() => setCurrentPage('songs')} disabled={currentPage === 'songs'}>
          Canciones
        </button>
        <button onClick={() => setCurrentPage('browser')} disabled={currentPage === 'browser'}>
          Navegador
        </button>
      </nav>

      {currentPage === 'songs' ? <SongsPage /> : <BrowserPage />}
    </div>
  );
}

export default App;