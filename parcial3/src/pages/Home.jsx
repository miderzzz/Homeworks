import { useRef, useState } from "react";
import "../styles/Home.scss";
import Trie from "../class/Trie";
import MaxHeap from "../class/MaxHeap";
import Graph from "../class/Graph";
import { songs, conections } from "../data/songs";
import Buscador from "../components/Searcher";
import Ranking from "../components/Ranking";
import Recomendaciones from "../components/Recommendations";

function createSystem() {
  const trie = new Trie();
  const heap = new MaxHeap();
  const grafo = new Graph();

  songs.forEach((cancion) => {
    trie.insert(cancion.name);
    heap.insert({ ...cancion });
    grafo.addVertex(cancion.name);
  });


  conections.forEach(([a, b]) => {
    grafo.add_edge(a, b, 1);
  });

  songs.forEach((cancion, i) => {
    grafo.connectBySimilarity(cancion, songs.slice(i + 1));
  });

  return { trie, heap, grafo };
}

function Home() {
  const sistema = useRef(null);
  if (sistema.current === null) {
    sistema.current = createSystem();
  }

  const { trie, heap, grafo } = sistema.current;
  const [seleccionada, setSeleccionada] = useState(null);
  const [, setCambios] = useState(0);

  function actualizar() {
    setCambios((c) => c + 1);
  }

  function agregarCancion(titulo, artista, reproducciones) {
    const song = { name: titulo, artist: artista, streams: reproducciones };

    trie.insert(titulo);
    grafo.addVertex(titulo);
    grafo.connectBySimilarity(song, heap.datos);
    heap.insert(song);
    actualizar();
  }

  function reproducir(titulo) {
    heap.play(titulo);
    setSeleccionada(titulo);
    actualizar();
  }

  return (
    <div className="home">
      <header className="home_header">
        <h1>MiderMusic</h1>
      </header>

      <main className="dashboard">
        <Buscador
          trie={trie}
          onSelect={setSeleccionada}
          onAdd={agregarCancion}
        />
        <Recomendaciones
          graph={grafo}
          selected={seleccionada}
          onSelect={setSeleccionada}
          onPlay={reproducir}
        />
        <Ranking
          top={heap.top(5)}
          onPlay={reproducir}
        />
      </main>
    </div>
  );
}

export default Home;
