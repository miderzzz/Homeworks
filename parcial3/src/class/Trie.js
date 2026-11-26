class NodoTrie {
  constructor() {
    this.sons = {};
    this.isFinal = false;
    this.title = null;
  }
}

class Trie {
  constructor() {
    this.raiz = new NodoTrie();
  }

  insert(titulo) {
    let actual = this.raiz;
    const palabra = titulo.toLowerCase();

    for (const letra of palabra) {
      if (!actual.sons[letra]) {
        actual.sons[letra] = new NodoTrie();
      }
      actual = actual.sons[letra];
    }

    actual.isFinal = true;
    actual.title = titulo;
  }

  buscarNodo(texto) {
    let actual = this.raiz;

    for (const letra of texto.toLowerCase()) {
      if (!actual.sons[letra]) {
        return null;
      }
      actual = actual.sons[letra];
    }

    return actual;
  }

  buscar(titulo) {
    const nodo = this.buscarNodo(titulo);
    return nodo !== null && nodo.isFinal;
  }

  sugerencias(prefijo) {
    const resultado = [];
    const nodo = this.buscarNodo(prefijo);

    if (nodo === null) {
      return resultado;
    }

    this.recolectar(nodo, resultado);
    return resultado;
  }

  recolectar(nodo, resultado) {
    if (nodo.isFinal) {
      resultado.push(nodo.title);
    }

    for (const letra in nodo.sons) {
      this.recolectar(nodo.sons[letra], resultado);
    }
  }
}

export default Trie;
