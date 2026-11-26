import Button from "./Button";

function Ranking({ top, onPlay }) {
  return (
    <section className="div_ranking">
      <h2 className="title">TOP Songs</h2>

      <ol className="lista-ranking">
        {top.map((cancion, i) => (
          <li key={cancion.name} className="line">
            <span className={`position ${i === 0 ? "position-first" : ""}`}>{i + 1}</span>

            <div className="info">
              <div className="header">
                <strong>{cancion.name}</strong>
                <span className="streams">{cancion.streams}</span>
              </div>
              <span className="artis">{cancion.artist}</span>
            </div>

            <Button variant="boton-icono" onClick={() => onPlay(cancion.name)}>▶</Button>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default Ranking;
