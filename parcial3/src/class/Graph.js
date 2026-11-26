const STOP_WORDS = ["the", "of", "a", "me", "my", "you", "la", "el", "de", "del", "mi", "y"];

const WEIGHT_SINGER = 3;
const WEIGHT_WORD = 1;

class Graph {
  constructor() {
    this.adyacencia = new Map();
  }

  addVertex(cancion) {
    if (!this.adyacencia.has(cancion)) {
      this.adyacencia.set(cancion, new Map());
    }
  }

  add_edge(a, b, weight = 1) {
    if (a === b) {
      return;
    }

    this.addVertex(a);
    this.addVertex(b);

    const total = this.peso(a, b) + weight;
    this.adyacencia.get(a).set(b, total);
    this.adyacencia.get(b).set(a, total);
  }

  peso(a, b) {
    if (!this.adyacencia.has(a)) {
      return 0;
    }
    return this.adyacencia.get(a).get(b) || 0;
  }

  neibors(cancion) {
    if (!this.adyacencia.has(cancion)) {
      return [];
    }
    return [...this.adyacencia.get(cancion).keys()];
  }

  words(name) {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9áéíóúñü' ]/g, "")
      .split(" ")
      .filter((word) => word !== "" && !STOP_WORDS.includes(word));
  }

  similarity(songA, songB) {
    let weight = 0;

    if (songA.artist.trim().toLowerCase() === songB.artist.trim().toLowerCase()) {
      weight += WEIGHT_SINGER;
    }

    const wordsB = this.words(songB.name);
    for (const word of new Set(this.words(songA.name))) {
      if (wordsB.includes(word)) {
        weight += WEIGHT_WORD;
      }
    }

    return weight;
  }

  connectBySimilarity(song, others) {
    for (const other of others) {
      if (other.name === song.name) {
        continue;
      }

      const weight = this.similarity(song, other);
      if (weight > 0) {
        this.add_edge(song.name, other.name, weight);
      }
    }
  }

  recomendar(start, nivelMax) {
    const resultado = [];

    if (!this.adyacencia.has(start)) {
      return resultado;
    }

    const visitados = new Set([start]);
    const cola = [{ song: start, level: 0 }];

    while (cola.length > 0) {
      const { song, level } = cola.shift();

      if (level === nivelMax) {
        continue;
      }

      for (const neibor of this.neibors(song)) {
        if (!visitados.has(neibor)) {
          visitados.add(neibor);
          resultado.push({
            song: neibor,
            level: level + 1,
            weight: this.peso(song, neibor),
          });
          cola.push({ song: neibor, level: level + 1 });
        }
      }
    }

    return resultado.sort((a, b) => a.level - b.level || b.weight - a.weight);
  }
}

export default Graph;
