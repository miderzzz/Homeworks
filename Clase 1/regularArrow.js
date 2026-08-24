/* Regular Arrow Function

Funciones regulares: Son las funciones que se definen con la palabra reservada function y pueden ser
llamadas en cualquier parte del codigo, incluso antes de su declaracion, debido a que son hoisted. 

Forma: 
function saludar (nombre) {
    console.log('Hola, ' + nombre + '!');
}
saludar('Geek');

En las funciones normales, se puede acceder a todos los argumentos pasados ​
​mediante el objeto arguments, que es un objeto similar a un array que 
contiene cada argumento pasado a la función.


Funciones flecha: Son funciones que se definen con la sintaxis de flecha (=>) y no tienen su 
propio this, arguments, super o new.target.

Forma:
const saludar = (nombre) => {
    console.log(`Hola, ${nombre}!`);
};
saludar('Geeks');

Las funciones flecha no tienen su propio objeto de argumentos. Para acceder a los argumentos en las 
funciones flecha, utilice parámetros rest para agrupar todos los argumentos en un array.

*/
let resultado = 0;

const regularFunction = function (a) {
    let resultado = a%2 === 0 ? 'odd' : 'even';
    console.log(resultado);
}

const arrowFunction = (a) => {
    let resultado = a%2 === 0 ? 'odd' : 'even';
    console.log(resultado);
}
