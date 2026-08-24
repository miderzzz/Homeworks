// Arrays Metodos
let array = [1, 2, 3, 4, 5];


// length: Devuelve la cantidad de elementos que tiene el array.
console.log(array.length); // 5

// at: Devuelve el elemento en la posición indicada, si es negativo, cuenta desde el final del array.
console.log(array.at(4)); // 5
console.log(array.at(-1)); // 5

// concat: Devuelve un nuevo array que es la concatenación de los arrays pasados como argumentos.
let array2 = ["a", "b", "c"];
console.log(array.concat(array2)); // [1, 2, 3, 4, 5, 'a', 'b', 'c']

// constructor: Devuelve una referencia al constructor del array.
console.log(array.constructor); // [Function: Array]

/* copyWithin: Copia una parte del array dentro del mismo array, 
 sobrescribiendo los elementos existentes. */
console.log(array.copyWithin(0, 3, 5)); // [4, 5, 3, 4, 5]

/* entries: Devuelve un nuevo objeto Array Iterator que contiene los pares 
 clave/valor de cada índice del array. */
let iterador = array.entries();
for (const [indice, valor] of iterador) {
  console.log(`Posición ${indice}: ${valor}`);
} // Posicion 0 : 1 . Posicion 1 : 2 . Posicion 2 : 3 . Posicion 3 : 4 . Posicion 4 : 5

/* every: Comprueba si todos los elementos del array cumplen con la condición 
   de la función pasada como argumento.*/
console.log(array.every((x) => x > 0)); // true

/* fill: Rellena todos los elementos del array con un valor estático,
    desde el índice de inicio hasta el índice de fin (no incluido). */
console.log(array.fill("a")); // [a, a, a, a, a]

/* filter: Crea un nuevo array con todos los elementos que cumplan la condición */
console.log(array.filter((x) => x < 2)); // [1]

/* find: Devuelve el primer elemento del array que cumpla con la condición */
console.log(array.find((x) => x > 3)); // 4

/* findIndex: Devuelve el índice del primer elemento del array que cumpla con la condición */
console.log(array.findIndex((x) => x > 3)); // 3

/* findLast: Devuelve el último elemento del array que cumpla con la condición */
console.log(array.findLast((x) => x < 3)); // 2

/* findLastIndex: Devuelve el índice del último elemento del array que cumpla con la condición */
console.log(array.findLastIndex((x) => x < 3)); // 1

/* flat: Devuelve un nuevo array con todos los elementos de sub-array concatenados en él
   hasta la profundidad especificada. */
let array3 = [1, 2, [3, 4, [5, 6]]];
console.log(array3.flat(2)); // [1, 2, 3, 4, 5, 6]  USAR INFINITY CUANDO NO SABEMOS LA PROFUNDIDAD

/* flatMap: Primero mapea cada elemento usando una función de mapeo, 
   luego aplana el resultado en un nuevo array. */

        // Con .map() normal:
        const resultadoMap = numeros.map(num => [num, num * 2]);
        console.log(resultadoMap); 
        // Resultado: [[1, 2], [2, 4], [3, 6]] Queda un array de arrays

        // Con .flatMap():
        const resultadoFlatMap = numeros.flatMap(num => [num, num * 2]);
        console.log(resultadoFlatMap); 
        // Resultado: [1, 2, 2, 4, 3, 6]  Mapeado y aplanado a la vez

/* forEach: recorre los elementos de un array uno por uno. Ejecuta una función por cada elemento del array. */
array.forEach((elemento, indice) => {
    console.log("Elemento de la posicion " + indice  + ": " + elemento);
}
);

/* includes: Comprueba si un array incluye un determinado elemento, devuelve true o false según corresponda. */
console.log(array.includes(3));

/* indexOf: Devuelve el primer índice en el que se encuentra un elemento dado en el array, o -1 si no está presente. */
console.log(array.indexOf(3)); // 2

/* join: Une todos los elementos de un array en una cadena y devuelve esta cadena. */
console.log(array.join(", ")); // "1, 2, 3, 4, 5"

/* keys: Devuelve un nuevo objeto Array Iterator que contiene las claves de índice de cada elemento del array. */
let keysIterator = array.keys();
for (const key of keysIterator) {
  console.log(key);
}

/* lastIndexOf: Devuelve el último índice en el que se encuentra un elemento dado en el array, o -1 si no está presente. */
console.log(array.lastIndexOf(3)); // 2 

/* map: Crea un nuevo array con los resultados de la llamada a la función indicada aplicados a cada uno de sus elementos. */
let resultaMap = array.map((x) => x * 2);
console.log(resultadoMap); // [2, 4, 6, 8, 10]

/* pop: Elimina el último elemento de un array y lo devuelve. Este método cambia la longitud del array. */
array.pop();
console.log(array); // [1, 2, 3, 4]

/* push: Añade uno o más elementos al final de un array y devuelve la nueva longitud del array. */
array.push(5);
console.log(array); // [1, 2, 3, 4, 5]

/* reduce: Aplica una función a un acumulador y a cada valor de un array (de izquierda a derecha) para reducirlo a un único valor. */
let resultadoReduce = array.reduce((acumulador, x) => acumulador + x, 0);
console.log(resultadoReduce); // 15

/* reduceRight: Aplica una función a un acumulador y a cada valor de un array (de derecha a izquierda) para reducirlo a un único valor. */
let resultadoReduceRight = array.reduceRight((acumulador, x) => acumulador + x, 0);
console.log(resultadoReduceRight); // 15

/* reverse: Invierte el orden de los elementos de un array. El primer elemento pasa a ser el último y el último pasa a ser el primero. */
array.reverse();
console.log(array); // [5, 4, 3, 2, 1]

/* shift: Elimina el primer elemento de un array y lo devuelve. Este método cambia la longitud del array. */
let ultimo = array.shift();
console.log(ultimo); // 5
console.log(array); // [4, 3, 2, 1]

/* slice: Devuelve una copia superficial de una porción del array dentro de un nuevo array. */
let copia = array.slice(1, 4);
console.log(copia); // [3, 2, 1]

/* some: Comprueba si al menos un elemento del array cumple con la condición de la función pasada como argumento. */
console.log(array.some((x) => x > 3)); // true

/* sort: Ordena los elementos de un array in situ y devuelve el array. */
array.sort((a, b) => b - a);
console.log(array); // [4, 3, 2, 1]

/* splice: Cambia el contenido de un array eliminando elementos existentes y/o agregando nuevos elementos modificando el array original. */
array.splice(1, 2, 1, 2)
console.log(array); // [1, 1, 2, 4]

/* toLocaleString: Este método sirve para convertir un dato (como un número o una fecha) en un texto adaptado al idioma y país de tu usuario. */
let precio = 2500.50;
    // Formato Euros para España
    precio.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' }); // Devuelve: "2.500,50 €"
    // Formato Dólares para Estados Unidos
    precio.toLocaleString('en-US', { style: 'currency', currency: 'USD' }); // Devuelve: "$2,500.50"


/* toString: Devuelve una cadena de caracteres representando el array especificado y sus elementos. */
console.log(array.toString()); // "1,2,3,4"

/* unshift: Añade uno o más elementos al inicio de un array y devuelve la nueva longitud del array. */
array.unshift(0);
console.log(array); // [0, 1, 2, 3, 4]

/* values: Sirve para extraer únicamente los valores que están guardados dentro de una estructura. */
const usuario = {
  nombre: 'Carlos',
  edad: 19,
  pais: 'Colombia'
};

const valores = Object.values(usuario);
console.log(valores); 
// Resultado: ['Carlos', 19, 'Colombia']




