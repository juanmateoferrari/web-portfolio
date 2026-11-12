// ============================================================
// CONFIG: lo único que tocás para personalizar el sitio.
// ============================================================
export const CONFIG = {
  nombre: 'Juan Mateo Ferrari',
  bio: 'Ingeniero en Sistemas de Comunicación, Udelar.\nEscenografía, luz e instalaciones interactivas.',
  sobreMi: {                       // presentación de la sección Sobre mí
    intro: 'Soy Juan Mateo Ferrari, ingeniero en Sistemas de Comunicación por la Udelar. Mi trabajo cruza la ingeniería con la escenografía, la luz y la creación de objetos e instalaciones interactivas.',
    parrafos: [
      'Me interesa conectar lo físico y lo digital: construir estructuras, diseñar circuitos y programar sistemas que transforman la luz, la imagen y el sonido. En mis proyectos conviven el trabajo manual, la electrónica y la programación.',
      'Esa búsqueda toma distintas formas: un sistema de mapping que sigue a un objeto en movimiento, una instalación donde las manos del público modifican luces y música, o una escenografía con iluminación LED programada.',
      'También desarrollo lámparas de cerámica hechas a mano, integrando el circuito y el recorrido de la luz desde el diseño de la pieza. La forma, los materiales y la técnica se piensan juntos.',
    ],
    areas: [
      { titulo: 'Escenografía e iluminación', texto: 'Diseño y construcción de estructuras e integración de iluminación LED para espacios escénicos.' },
      { titulo: 'Sistemas interactivos y visuales', texto: 'Programación, mapping y sistemas que vinculan el movimiento con la imagen, la luz y el sonido.' },
      { titulo: 'Objetos y cerámica', texto: 'Diseño y modelado de piezas que incorporan electrónica y luz.' },
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
    luz: true,        // foco de luz que sigue al mouse
    revelado: true,   // las fotos/videos se "escanean" al entrar en pantalla
    parallax: true,   // las portadas se desplazan a distinta velocidad
    progreso: true,   // barra fina de avance arriba
  },
};
