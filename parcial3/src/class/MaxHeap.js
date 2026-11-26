class MaxHeap {
  constructor() {
    this.datos = [];
  }

  padre(i) {
    return Math.floor((i - 1) / 2);
  }

  izquierdo(i) {
    return 2 * i + 1;
  }

  derecho(i) {
    return 2 * i + 2;
  }

  intercambiar(i, j) {
    const temp = this.datos[i];
    this.datos[i] = this.datos[j];
    this.datos[j] = temp;
  }

  insert(cancion) {
    this.datos.push(cancion);
    this.subir(this.datos.length - 1);
  }

  subir(i) {
    while (
      i > 0 &&
      this.datos[i].streams > this.datos[this.padre(i)].streams
    ) {
      this.intercambiar(i, this.padre(i));
      i = this.padre(i);
    }
  }

  bajar(i) {
    const tamano = this.datos.length;

    while (true) {
      let mayor = i;
      const izq = this.izquierdo(i);
      const der = this.derecho(i);

      if (
        izq < tamano &&
        this.datos[izq].streams > this.datos[mayor].streams
      ) {
        mayor = izq;
      }
      if (
        der < tamano &&
        this.datos[der].streams > this.datos[mayor].streams
      ) {
        mayor = der;
      }
      if (mayor === i) {
        break;
      }

      this.intercambiar(i, mayor);
      i = mayor;
    }
  }

  verMax() {
    return this.datos.length > 0 ? this.datos[0] : null;
  }

  extraerMax() {
    if (this.datos.length === 0) {
      return null;
    }

    const max = this.datos[0];
    const ultimo = this.datos.pop();

    if (this.datos.length > 0) {
      this.datos[0] = ultimo;
      this.bajar(0);
    }

    return max;
  }

  play(titulo) {
    const i = this.datos.findIndex((c) => c.name === titulo);

    if (i === -1) {
      return;
    }

    this.datos[i].streams++;
    this.subir(i);
  }

  top(k) {
    const copia = new MaxHeap();
    copia.datos = this.datos.map((c) => ({ ...c }));

    const resultado = [];
    while (resultado.length < k && copia.datos.length > 0) {
      resultado.push(copia.extraerMax());
    }

    return resultado;
  }
}

export default MaxHeap;
