import "./App.css";
import { useMemo, useState } from "react";
import { Graph as D3Graph } from "react-d3-graph";
import { Graph } from "./Graph";

function buildGraph() {
  const g = new Graph();

  g.addPerson("Ana", 22, "Cali");
  g.addPerson("Luis", 25, "Cali");
  g.addPerson("Sofía", 20, "Bogotá");
  g.addPerson("Juan", 30, "Medellín");
  g.addPerson("Camila", 27, "Bogotá");
  g.addPerson("Pedro", 24, "Cali");

  g.addFriendship("Ana", "Luis");
  g.addFriendship("Ana", "Sofía");
  g.addFriendship("Juan", "Camila");
  g.addFriendship("Pedro", "Juan");

  return g;
}

const config = {
  width: 800,
  height: 500,
  nodeHighlightBehavior: true,
  node: {
    labelProperty: "label",
    fontSize: 14,
    highlightFontSize: 14,
    fontColor: "#222",
  },
  link: { strokeWidth: 2, highlightColor: "#2c502c" },
  d3: { gravity: -250, linkLength: 120 },
};

export default function App() {
  const graph = useMemo(buildGraph, []);
  const data = useMemo(() => graph.toD3Data(), [graph]);

  const cities = graph.nodes.filter((n) => n.type === "city");
  const [city, setCity] = useState(cities[0].id);
  const people = graph.peopleInCity(city);

  const selectCity = (name) => {
    setCity(name);
    graph.printPeopleInCity(name);
  };

  const onClickNode = (id) => {
    if (graph.searchNode(id)?.type === "city") selectCity(id);
  };

  return (
    <div style={{ padding: 20, fontFamily: "sans-serif" }}>
      <h1>Graph friends and cities</h1>

      <div
        style={{
          background: "#fff",
          border: "1px solid #ccc",
          borderRadius: 8,
        }}
      >
        <D3Graph
          id="grafo-amigos"
          data={data}
          config={config}
          onClickNode={onClickNode}
        />
      </div>

      <h2>People who live in:</h2>
      <select value={city} onChange={(e) => selectCity(e.target.value)}>
        {cities.map((c) => (
          <option key={c.id} value={c.id}>
            {c.name}
          </option>
        ))}
      </select>

      <ul>
        {people.map((p) => (
          <li className="person" key={p.id}>
            {p.name} ({p.age} years old)
          </li>
        ))}
      </ul>
    </div>
  );
}
