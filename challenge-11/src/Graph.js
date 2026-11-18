export class Graph {
  constructor() {
    this.nodes = [];
    this.adjList = {};
  }

  isEmpty() {
    return this.nodes.length === 0;
  }

  searchNode(id) {
    if (this.isEmpty()) return;
    return this.nodes.find((n) => n.id === id);
  }

  addNode(node) {
    if (!this.searchNode(node.id)) {
      this.nodes.push(node);
      this.adjList[node.id] = [];
    }
  }

  addEdge(id1, id2) {
    if (!this.searchNode(id1) || !this.searchNode(id2)) return;
    if (this.adjList[id1].includes(id2)) return;
    this.adjList[id1].push(id2);
    this.adjList[id2].push(id1);
  }

  removeNode(id) {
    if (!this.searchNode(id)) return;
    this.adjList[id].forEach((vecino) => {
      this.adjList[vecino] = this.adjList[vecino].filter((n) => n !== id);
    });
    delete this.adjList[id];
    this.nodes = this.nodes.filter((n) => n.id !== id);
  }

  printAdjacency(id) {
    if (this.searchNode(id)) {
      console.log(this.adjList[id]);
    }
  }

  printGraph() {
    console.log(this.adjList);
  }

  addCity(name) {
    this.addNode({ id: name, name, type: "city" });
  }

  addPerson(name, age, cityName) {
    if (!this.searchNode(cityName)) this.addCity(cityName);
    this.addNode({ id: name, name, age, type: "person" });
    this.addEdge(name, cityName);
  }

  addFriendship(name1, name2) {
    const p1 = this.searchNode(name1);
    const p2 = this.searchNode(name2);
    if (p1?.type === "person" && p2?.type === "person") {
      this.addEdge(name1, name2);
    }
  }

  peopleInCity(cityName) {
    const city = this.searchNode(cityName);
    if (!city || city.type !== "city") return [];
    return this.adjList[cityName]
      .map((id) => this.searchNode(id))
      .filter((n) => n.type === "person");
  }

  printPeopleInCity(cityName) {
    console.log(`People who live in ${cityName}:`);
    this.peopleInCity(cityName).forEach((p) =>
      console.log(`- ${p.name} (${p.age} years old)`),
    );
  }
  toD3Data() {
    const nodes = this.nodes.map((n) => ({
      id: n.id,
      label: n.type === "person" ? `${n.name} (${n.age})` : n.name,
      color: n.type === "city" ? "#e62222" : "#3498db",
      size: n.type === "city" ? 700 : 350,
      symbolType: n.type === "city" ? "triangle" : "circle",
      type: n.type,
    }));

    const links = [];
    const seen = new Set();

    for (const source in this.adjList) {
      this.adjList[source].forEach((target) => {
        const key = [source, target].sort().join("|");
        if (seen.has(key)) return;
        seen.add(key);

        const livesIn =
          this.searchNode(source).type === "city" ||
          this.searchNode(target).type === "city";
        links.push({ source, target, color: livesIn ? "#e62222" : "#0c19ca" });
      });
    }

    return { nodes, links };
  }
}
