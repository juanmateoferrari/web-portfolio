// ============================================================
// CONFIG: lo único que tocás para personalizar el sitio.
// ============================================================
export const CONFIG = {
  nombre: 'Juan Mateo Ferrari',
  bio: 'Soy Ingeniero en Sistemas de Comunicación recibido en la Universidad de la República. Me interesa aplicar mis conocimientos técnicos para conectar lo físico y lo digital. Combino trabajo manual, electrónica y programación para crear con luz, imagen y sonido.',
  sobreMi: {                       // presentación de la sección Sobre mí
    foto: 'img/f4bc4094-4b11-41da-bad0-e0839c3f8106.JPG',
    intro: 'Diseño y construyo escenografías e instalaciones interactivas. Me interesa cómo la luz, la imagen y el sonido pueden transformar un espacio.',
    parrafos: [
      'Busco conectar lo físico y lo digital: construir estructuras, diseñar circuitos y programar sistemas teniendo en cuenta cómo la gente los percibe e interactúa con ellos. En mis proyectos conviven el trabajo manual, la carpintería, la cerámica, la electrónica y la programación.',
      // 'Esa búsqueda toma distintas formas: un sistema de mapping que sigue a un objeto en movimiento, una instalación donde las manos del público modifican luces y música, o una escenografía con iluminación LED programada.',
      ],
    experiencia: [
      {
        periodo: 'Actualidad',
        cargo: 'Proyectos independientes',
        organizacion: '',
        descripcion: 'Diseño y desarrollo de escenografías, stands e instalaciones interactivas para artistas y eventos.',
      },
      {
        periodo: 'Junio 2025 – Noviembre 2026',
        cargo: 'Desarrollador de Software Fullstack',
        organizacion: 'Qualabs',
        descripcion: 'Software para video y streaming en tiempo real. Desarrollo y despliegue de servicios en AWS y GCP.',
      },
      {
        periodo: 'Octubre 2021 – Agosto 2024',
        cargo: 'Desarrollador de Python e Inteligencia Artificial',
        organizacion: 'Sere Labs',
        descripcion: 'Modelos de IA, software para estudios médicos y automatización. Gestión de proyectos y firmware de sensores.',
      },
      {
        periodo: 'Febrero 2021 – Agosto 2021',
        cargo: 'Asistente de Ingeniero',
        organizacion: 'Snalux S.A.',
        descripcion: 'Apoyo en planificación y seguimiento de obras. Documentación y coordinación del equipo.',
      },
    ],
    habilidades: [
      'Aprendizaje Automático: conocimientos teóricos y prácticos.',
      'Procesamiento de Señales: experiencia en análisis y procesamiento de imágenes y audio.',
      'Python: experiencia con NumPy, Pandas, OpenCV, Matplotlib, TensorFlow y Tkinter.',
      'C++: programación de alto rendimiento.',
      'Herramientas: Linux (administración y uso), Git (control de versiones), Docker (creación y despliegue de contenedores).',
      'Cloud: AWS, GCP.',
    ],
    areas: [
      { titulo: 'Escena y luz', texto: 'Estructuras, iluminación y atmósferas que acompañan lo que sucede en escena.', proyecto: 'chiara' },
      { titulo: 'Imagen e interacción', texto: 'Proyecciones y sistemas donde el movimiento transforma la imagen, la luz y el sonido.', proyecto: 'mapping-dinamico' },
      { titulo: 'Objetos y cerámica', texto: 'Piezas hechas a mano que exploran el encuentro entre la materia y la luz.', proyecto: 'lamparas-ceramica' },
    ],
  },
  contacto: [                       // links del pie de página
    { texto: 'Mail', url: 'mailto:juanmaferra2000@gmail.com' },
    { texto: 'Instagram', url: 'https://www.instagram.com/juan.mateo.ferrari/' },
  ],
  efectos: {                        // true / false para activar o apagar
    portadasVideo: true, // preview dedicada al pasar el mouse; autoplay en celular al entrar en pantalla
    transiciones: true, // ampliación de portada al entrar y volver de un proyecto
    trama: false,        // puntos que responden al cursor detrás del nombre
    luz: true,         // foco de luz que sigue al mouse
    revelado: false,   // las fotos/videos se "escanean" al entrar en pantalla
    parallax: false,   // las portadas se desplazan a distinta velocidad
    progreso: false,   // barra fina de avance arriba
  },
};
