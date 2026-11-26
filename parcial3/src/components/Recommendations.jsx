import Button from "./Button";

function Recommendations({ graph, selected, onSelect, onPlay }) {
  if (selected === null) {
    return (
      <section className="recommendations">
        <h2 className="title">Recommendations</h2>
        <p className="vacio">Search or select a song to see related songs.</p>
      </section>
    );
  }

  const recommend = graph.recomendar(selected, 2);
  const direct = recommend.filter((r) => r.level === 1);
  const far = recommend.filter((r) => r.level === 2);

  return (
    <section className="recommendations">
      <h2 className="title">Recommendations</h2>

      <div className="current">
        <div>
          <span className="played">Played</span>
          <h3>{selected}</h3>
        </div>
        <Button onClick={() => onPlay(selected)}>Play</Button>
      </div>

      <h4>Recommendations</h4>
      {direct.length === 0 ? (
        <p className="vacio">This song doesn't have any direct recommendations.</p>
      ) : (
        <div className="chips">
          {direct.map((r) => (
            <button key={r.song} className="chip" onClick={() => onSelect(r.song)}>
              {r.song}
            </button>
          ))}
        </div>
      )}

      {far.length > 0 && (
        <>
          <h4>Would also like</h4>
          <div className="chips">
            {far.map((r) => (
              <button key={r.song} className="chip chip-tenue" onClick={() => onSelect(r.song)}>
                {r.song}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

export default Recommendations;
