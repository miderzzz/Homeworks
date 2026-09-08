import { useState, useRef } from 'react';
import { DoublyLinkedList } from '../clases/DoublyLinkedList';
import { mockPages } from '../data/mockPages';
import type { VisitedPage } from '../data/mockPages';
import type { DoublyNode } from '../clases/DoublyNode';

function BrowserPage() {
  const listRef = useRef<DoublyLinkedList<VisitedPage> | null>(null);

  if (!listRef.current) {
    const list = new DoublyLinkedList<VisitedPage>();
    mockPages.forEach((page) => list.append(page));
    listRef.current = list;
  }

  const list = listRef.current;
  const [currentNode, setCurrentNode] = useState<DoublyNode<VisitedPage> | null>(list.head);

  const handleBack = () => {
    if (currentNode?.prev) {
      setCurrentNode(currentNode.prev);
    }
  };

  const handleForward = () => {
    if (currentNode?.next) {
      setCurrentNode(currentNode.next);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h2>Navegador (Lista Doblemente Enlazada)</h2>

      {currentNode ? (
        <div style={{ margin: '20px 0', border: '1px solid #444', borderRadius: '8px', padding: '20px' }}>
          <p style={{ fontSize: '20px' }}>{currentNode.value.title}</p>
          <p style={{ color: '#888' }}>{currentNode.value.url}</p>
        </div>
      ) : (
        <p>No hay página cargada.</p>
      )}

      <button onClick={handleBack} disabled={!currentNode?.prev}>
        ◀ Atrás
      </button>
      <button onClick={handleForward} disabled={!currentNode?.next} style={{ marginLeft: '10px' }}>
        Adelante ▶
      </button>

      <p style={{ marginTop: '20px', color: '#666', fontSize: '14px' }}>
        {list.print((page) => `${page.title} (${page.url})`)}
      </p>
    </div>
  );
}

export default BrowserPage;