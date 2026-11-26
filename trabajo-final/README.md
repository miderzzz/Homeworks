Sport Champion

Tienda en línea de uniformes de fútbol con tres vistas: la tienda para los clientes y un panel de administración (Dueño y Empleado) para gestionar uniformes, inventario, pedidos, descuentos y equipo de trabajo.

Enlaces

Sitio publicado (Netlify): _pendiente_
Diseño (Figma): para verlo bien, en el prototipo abre el botón de configuración y elige Fit width y Hide UI.
  - [Vista cliente](https://www.figma.com/proto/lfL4tCOyCGewa3Nh9DN6KC/Sport-Champion?node-id=0-1&t=9jAiGbC8vDabFX6I-1)
  - [Vista admin](https://www.figma.com/proto/lfL4tCOyCGewa3Nh9DN6KC/Sport-Champion?node-id=96-9027&t=9jAiGbC8vDabFX6I-1)
  - [Vista empleado](https://www.figma.com/proto/lfL4tCOyCGewa3Nh9DN6KC/Sport-Champion?node-id=61-5223&t=9jAiGbC8vDabFX6I-1)

Todas las vistas incluyen las funciones del cliente. La diferencia entre admin y empleado es que el admin puede dar y quitar el rol de empleado.

Integrantes

Carlos Alfredo Mideros España

Tecnologías

React 19 + Vite (JavaScript): Para el codigo base y la implementacion de funciones.
React Router 6: Para guiar la navegacion.
SCSS Modules: Para el diseño de la pagina.
Supabase: base de datos PostgreSQL, autenticación, almacenamiento de imágenes, tiempo real, Edge Functions y pg_cron
Resend: Para enviar un correo de notificacion cuando un pedido sea solicitado.
OSRM: Para calcular el tiempo y distancia en carro desde tu ubicacion hasta la tienda.


Funcionalidades por rol

Tienda (cliente)

- Inicio con los uniformes más vendidos, recuadros por liga y distancia en tiempo real a la tienda física.
- Catálogo con barra lateral Liga -> Equipo -> Versión, buscador por nombre o equipo y filtrado avanzado (talla, tipo, manga, formato, precio y existencias).
- Página de cada uniforme con recomendaciones "También te puede gustar".
- Carrito, códigos de descuento y compra sin necesidad de crear cuenta.
- Pago por llave Bre-B con 1 hora de reserva de las prendas; si no se paga, el pedido se cancela y el inventario vuelve a la tienda.
- Código de pedido tipo "CSC-XXXXXX", botón para enviar el comprobante por WhatsApp y correo automático al dueño por cada pedido.
- Registro e inicio de sesión opcionales con historial de pedidos.
- Botón fijo de WhatsApp en todas las páginas.

Panel de administración

- Pedidos en tiempo real, atendidos en orden de llegada.
- Uniformes: equipo, liga, versión, manga, formato, precio, tallas con existencias y hasta 5 imágenes por URL o archivo.
- Inventario editable por talla, con opción de deshacer.
- Códigos de descuento por porcentaje o valor fijo, con fechas, compra mínima y límite de usos.
- Equipo (solo el dueño, protegido con Google Authenticator): dar o quitar acceso de empleado con el correo registrado.


Estructuras de datos

Cola | src/DataStructures/Queue.js | Carrito de compras: Se agregan los uniformes en el orden en el que el cliente los agrega a su carrito. 
Cola de pedidos del panel admin: Los pedidos se guardan y se atienden con base a mayor antiguedad.


Pila | src/DataStructures/Stack.js | Cambios inventario: Cada cambio en el inventario se apila y lo que hace el boton Deshacer es volver a antes del ultimo cambio.


Arbol N-ario | src/DataStructures/NaryTree.js | Barra lateral: Barra de navegacion con padres e hijos. En este caso, la secuencia es Liga -> Equipo -> Version. Ya que los datos son jerarquicos, permite desplegar y/o filtrar por los criterios mencionados anteteriormente.


Trie | src/DataStructures/Trie.js | Buscador: La busqueda se realiza desde el primer caracter empezando a buscar por coincidencia con el nombre del producto, asi que las palabras que empiezan igual saldran. Si pones "Int" saldran Inter de Miami e Inter de Milan porque son las que tienen mas caracteres coincidencia.


Montículo mínimo | src/DataStructures/MinHeap.js | Más vendidos (Top-K): Es un grupo de k uniformes con mas ventas, en el monticulo se almacenan los 4 mas vendidos, cada que que pasa los 4 saca al ultimo, sacando por ende al que menos ventas tenga de los 5. Ordenamiento del catálogo: En este caso no se descarta ninguno, el que va sacando es el que tiene menor coste por ende, sale de primero y se muesta al inicio.


Grafo ponderado | src/DataStructures/Graph.js | También te puede gustar: En este caso, cada uniforme es un nodo, y se conectan los que comparten equipo, liga, version o formato, con peso 4, 2, 1 respectivamente. Para escoger la recomendacion recorre el grafo y se suman los pesos, al final se muestran los 4 uniformes con mas puntaje.


WhatsApp

No usa la API de pago de WhatsApp Business si no que se usan enlaces de "clic para chatear" ("https://wa.me/<número>?text=<mensaje>"), que abre WhatsApp en el celular o en WhatsApp Web con el mensaje ya escrito.
Advertencia: el enlace solo abre el chat; el cliente debe pulsar enviar. Por eso el correo automático (Resend) es el aviso confiable de cada pedido.

Autenticación y seguridad

- Inicio de sesión y registro: Supabase Auth con correo y contraseña. Comprar no exige cuenta.
- Roles (tabla `profiles`): `cliente`, `empleado` y `admin` (el dueño). Empleado y admin entran al panel; solo el admin ve la sección Equipo.
- 2FA con Google Authenticator: la sección Equipo usa TOTP de Supabase (`src/Services/mfaService.js`, `src/Hooks/useMfaGate.js`).
  1. La primera vez se muestra un código QR para escanear con Google Authenticator.
  2. Se confirma con el código de 6 dígitos y la sesión pasa a nivel `aal2`.
  3. En los ingresos siguientes solo se pide el código de la app.
- Seguridad en la base de datos, no solo en la interfaz: las funciones `list_staff` y `set_staff_role` exigen que quien llama sea admin y tenga `aal2`; las políticas RLS impiden que un usuario cambie su propio rol, el rol del dueño no se puede modificar.
- Dar rol de empleado: el admin escribe el correo con el que la persona se registró, esa persona debe tener cuenta creada previamente.

Estructura del proyecto

src/
├── Components/      Componentes hijos, agrupados por página (Index, Shared, Admin, Catalog, ...)
├── Context/         Contextos globales: sesión, catálogo, carrito y admin
├── DataStructures/  Cola, pila, árbol N-ario, trie, montículo y grafo
├── Helpers/         Constantes, formateadores, validadores y utilidades
├── Hooks/           Custom hooks con la lógica de cada vista
├── Pages/           Páginas padre (Index, Catalog, Cart, Admin, ...)
├── Routes/          AppRoutes, UserRoutes y AdminRoutes
├── Services/        Comunicación con Supabase
├── Styles/          Variables y estilos globales
└── assets/          Logos de la marca y de las ligas
supabase/
├── schema.sql                     Base de datos completa
└── functions/notify-order/        Edge Function del correo de pedidos
