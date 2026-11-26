import { useState } from "react";
import Button from "./Button";
import Input from "./Input";

function Searcher({ trie, onSelect, onAdd }) {
  const [text, setTexto] = useState("");
  const [artist, setArtista] = useState("");
  const [streams, setReproducciones] = useState("");
  const [message, setMensaje] = useState(null);

  const suggestions = text.trim() === "" ? [] : trie.sugerencias(text.trim());

  function buscar() {
    const title = text.trim();
    if (title === "") {
      return;
    }

    if (trie.buscar(title)) {
      setMensaje({ tipo: "success", texto: `"${title}" is available on the platform` });
    } else {
      setMensaje({ tipo: "error", texto: `"${title}" is not available on the platform` });
    }
  }

  function agregar() {
    const title = text.trim();
    const singer = artist.trim();

    if (title === "" || singer === "") {
      setMensaje({
        tipo: "error",
        texto: "Write the title and singer to insert",
      });
      return;
    }

    const cantidad = streams === "" ? 0 : Number(streams);

    if (!Number.isInteger(cantidad) || cantidad < 0) {
      setMensaje({
        tipo: "error",
        texto: "Streams must be a positive integer",
      });
      return;
    }

    if (trie.buscar(title)) {
      setMensaje({ tipo: "error", texto: `"${title}" is already registered` });
      return;
    }

    onAdd(title, singer, cantidad);
    setArtista("");
    setReproducciones("");
    setMensaje({
      tipo: "success",
      texto: `"${title}" de ${singer} was added`,
    });
  }

  function elegir(titulo) {
    setTexto(titulo);
    setMensaje(null);
    onSelect(titulo);
  }

  return (
    <section className="div-searcher">
      <h2 className="titulo-panel">Searcher</h2>


      <Input
        placeholder="Escribe el título de una canción..."
        value={text}
        onChange={(e) => {
          setTexto(e.target.value);
          setMensaje(null);
        }}
        onEnter={buscar}
      />

      <div className="datos">
        <Input
          placeholder="Singer"
          value={artist}
          onChange={(e) => {
            setArtista(e.target.value);
            setMensaje(null);
          }}
          onEnter={agregar}
        />

        <Input
          type="number"
          placeholder="Streams"
          value={streams}
          onChange={(e) => {
            setReproducciones(e.target.value);
            setMensaje(null);
          }}
          onEnter={agregar}
        />
      </div>

      <div className="acciones">
        <Button onClick={buscar}>Search</Button>
        <Button variant="boton-secundario" onClick={agregar}>Insert</Button>
      </div>

      {message && (
        <p className={`mensaje mensaje-${message.tipo}`}>{message.texto}</p>
      )}

      {suggestions.length > 0 && (
        <ul className="recommendations_list">
          {suggestions.map((titulo) => (
            <li key={titulo} className="item" onClick={() => elegir(titulo)}>
              <span className="resaltado">{titulo.slice(0, text.trim().length)}</span>
              {titulo.slice(text.trim().length)}
            </li>
          ))}
        </ul>
      )}

      {text.trim() !== "" && suggestions.length === 0 && (
        <p className="vacio">There is no recommendation for "{text.trim()}"</p>
      )}
    </section>
  );
}

export default Searcher;
