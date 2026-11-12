// ============================================================
// CONFIG: lo único que tocás para personalizar el sitio.
// ============================================================
export const CONFIG = {
  nombre: 'Juan Mateo Ferrari',
  bio: 'Ingeniero en Sistemas de Comunicación, Udelar.\nEscenografía, luz e instalaciones interactivas.',
  sobreMi: {                       // presentación de la sección Sobre mí
    foto: 'img/f4bc4094-4b11-41da-bad0-e0839c3f8106.JPG',
    intro: 'Trabajo con la luz, la imagen y los materiales para crear escenografías, objetos e instalaciones interactivas.',
    parrafos: [
      'Me interesa conectar lo físico y lo digital: construir estructuras, diseñar circuitos y programar sistemas que transforman la luz, la imagen y el sonido. En mis proyectos conviven el trabajo manual, la electrónica y la programación.',
      // 'Esa búsqueda toma distintas formas: un sistema de mapping que sigue a un objeto en movimiento, una instalación donde las manos del público modifican luces y música, o una escenografía con iluminación LED programada.',
      // 'También desarrollo lámparas de cerámica hechas a mano, integrando el circuito y el recorrido de la luz desde el diseño de la pieza. La forma, los materiales y la técnica se piensan juntos.',
    ],
    areas: [
      { titulo: 'Escena y luz', texto: 'Estructuras, iluminación y atmósferas que acompañan lo que sucede en escena.', proyecto: 'chiara' },
      { titulo: 'Imagen e interacción', texto: 'Proyecciones y sistemas donde el movimiento transforma la imagen, la luz y el sonido.', proyecto: 'mapping-dinamico' },
      { titulo: 'Objetos y cerámica', texto: 'Piezas hechas a mano que exploran el encuentro entre la materia y la luz.', proyecto: 'lamparas-ceramica' },
    ],
  },
  contacto: [                       // links del pie de página
    { texto: 'Email', url: 'mailto:juanmaferra2000@gmail.com' },
    { texto: 'Instagram', url: 'https://instagram.com/juan.mateo.ferrari' },
  ],
  etiquetas: {                      // títulos de las dos listas de cada proyecto
    ingenieril: 'Lado ingenieril',
    creativa: 'Lado creativo',
  },
  efectos: {                        // true / false para activar o apagar
    portadasVideo: true, // video al pasar el mouse; en celular, al entrar en pantalla
    transiciones: true, // ampliación de portada al entrar y volver de un proyecto
    trama: false,        // puntos que responden al cursor detrás del nombre
    luz: true,        // foco de luz que sigue al mouse
    revelado: false,   // las fotos/videos se "escanean" al entrar en pantalla
    parallax: true,   // las portadas se desplazan a distinta velocidad
    progreso: false,   // barra fina de avance arriba
  },
};
