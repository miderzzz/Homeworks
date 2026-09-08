import { useState, useRef } from 'react';
import { LinkedList } from '../clases/LinkedLast';
import { mockSongs } from '../data/mockSongs';
import type { Song } from '../data/mockSongs';
import type { Node } from '../clases/Node';

function SongsPage() {
  const listRef = useRef<LinkedList<Song> | null>(null);

  if (!listRef.current) {
    const list = new LinkedList<Song>();
    mockSongs.forEach((song) => list.append(song));
    listRef.current = list;
  }

  const list = listRef.current;
  const [currentNode, setCurrentNode] = useState<Node<Song> | null>(list.head);

  const handleNext = () => {
    if (currentNode?.next) {
      setCurrentNode(currentNode.next);
    }
  };

  const handleRestart = () => {
    setCurrentNode(list.head);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Reproductor (Lista Enlazada)</h2>

      {currentNode ? (
        <div style={{ margin: '20px 0' }}>
          <p style={{ fontSize: '24px' }}>{currentNode.value.title}</p>
          <p style={{ color: '#888' }}>{currentNode.value.artist}</p>
        </div>
      ) : (
        <p>No hay mas canciones.</p>
      )}

      <button onClick={handleNext} disabled={!currentNode?.next}>
        Siguiente ▶
      </button>
      <button onClick={handleRestart} style={{ marginLeft: '10px' }}>
        Reiniciar
      </button>

      <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
        {list.print((song) => song.title)}
      </p>
    </div>
  );
}

export default SongsPage;