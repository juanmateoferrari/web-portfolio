// ============================================================
// MAIN: carga los datos, dibuja las vistas y maneja la navegación.
// Rutas:  #/            -> portada
//         #/nombre-carpeta -> página de ese proyecto
// ============================================================
import { CONFIG } from './config.js';
import { initEfectos, observarRevelado } from './effects.js';

const app = document.getElementById('app');
const visor = document.getElementById('visor');
let proyectos = [];

// Escapa texto para que nunca se interprete como HTML.
const esc = s => String(s ?? '').replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- Piezas reutilizables ----------

// Una foto/gif o un video. Videos "loop-*" se reproducen solos y mudos; el resto tiene controles.
const medio = m => m.tipo === 'video'
  ? `<figure class="medio"><video src="${m.src}" ${m.loop ? 'autoplay muted loop playsinline' : 'controls'} preload="metadata"></video></figure>`
  : `<figure class="medio"><img src="${m.src}" alt="" loading="lazy" data-zoom></figure>`;

// Video incrustado de YouTube o Vimeo (se define en info.json -> embeds).
const embed = e => {
  const url = e.tipo === 'vimeo'
    ? `https://player.vimeo.com/video/${e.id}`
    : `https://www.youtube-nocookie.com/embed/${e.id}`;
  return `<div class="embed"><iframe src="${url}" loading="lazy" allowfullscreen title="Video"></iframe></div>`;
};

const lista = (titulo, items) => items.length
  ? `<div><h3>${esc(titulo)}</h3><ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>` : '';

const pie = () => `<footer class="pie" id="contacto"><span>¿Creamos algo juntos?</span>${CONFIG.contacto
  .map(c => `<a href="${esc(c.url)}">${esc(c.texto)}</a>`).join('')}</footer>`;

// ---------- Vistas ----------

// Portada: nombre, bio y una fila por proyecto (título, año, texto corto, portada).
function vistaInicio() {
  document.title = CONFIG.nombre;
  app.innerHTML = `
    <header class="cabecera"><a class="firma" href="#/">JMF<span aria-hidden="true">✳</span></a>
      <nav aria-label="Navegación principal"><a href="#/info">Sobre mí</a><a class="contacto-link" href="#contacto">Contacto <span aria-hidden="true">↗</span></a></nav></header>
    <section class="hero"><h1>${esc(CONFIG.nombre)}</h1><p>${esc(CONFIG.bio)}</p></section>
    <section class="trabajos" aria-labelledby="titulo-trabajos"><div class="seccion-titulo"><h2 id="titulo-trabajos">Trabajos seleccionados</h2></div>
    <div class="filas">${proyectos.map((p, i) => `
      <a class="fila" href="#/${esc(p.slug)}">
        <div class="fila-img">${p.portada ? `<img src="${esc(p.portada)}" alt="" ${i < 2 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">` : `<div class="sin-portada"><span>${esc(p.titulo)}</span></div>`}</div>
        <div class="fila-texto">
          <h2>${esc(p.titulo)}</h2>
          ${p.anio ? `<span class="anio">${esc(p.anio)}</span>` : ''}
        </div>
      </a>`).join('')}</div>
    </section>${pie()}`;
}

function vistaInfo() {
  document.title = `Sobre mí | ${CONFIG.nombre}`;
  app.innerHTML = `<article class="proyecto info">
    <a class="volver" href="#/">← Volver a los trabajos</a>
    <h1>Sobre mí</h1>
    <p class="lead">${esc(CONFIG.sobreMi.intro)}</p>
    <div class="info-texto">${CONFIG.sobreMi.parrafos.map(p => `<p>${esc(p)}</p>`).join('')}</div>
    <section class="info-areas" aria-labelledby="titulo-areas"><h2 id="titulo-areas">Áreas de trabajo</h2>
      <dl>${CONFIG.sobreMi.areas.map(a => `<div><dt>${esc(a.titulo)}</dt><dd>${esc(a.texto)}</dd></div>`).join('')}</dl>
    </section>
  </article>${pie()}`;
}

// Proyecto: encabezado, galería (columnas configurables), texto largo,
// las dos listas, videos incrustados y link al siguiente.
function vistaProyecto(slug) {
  const i = proyectos.findIndex(p => p.slug === slug);
  if (i < 0) return vistaInicio();
  const p = proyectos[i], sig = proyectos[(i + 1) % proyectos.length];
  const meta = [p.anio, p.equipo, ...p.tags].filter(Boolean).map(esc).join(' / ');
  document.title = `${p.titulo} | ${CONFIG.nombre}`;
  app.innerHTML = `
    <article class="proyecto">
      <a class="volver" href="#/">Volver</a>
      <h1>${esc(p.titulo)}</h1>
      ${meta ? `<p class="meta">${meta}</p>` : ''}
      ${p.corto ? `<p class="lead">${esc(p.corto)}</p>` : ''}
      <div class="galeria" style="--cols:${p.columnas}">${p.media.map(medio).join('')}</div>
      ${p.embeds.map(embed).join('')}
      <div class="texto">${p.largo.map(t => `<p>${esc(t)}</p>`).join('')}</div>
      <div class="listas">${lista(CONFIG.etiquetas.ingenieril, p.ingenieril)}${lista(CONFIG.etiquetas.creativa, p.creativa)}</div>
      <a class="siguiente" href="#/${sig.slug}">Siguiente: ${esc(sig.titulo)}</a>
    </article>${pie()}`;
}

// ---------- Navegación y arranque ----------

function navegar() {
  // El contacto es un ancla dentro de la vista actual, no un proyecto.
  if (location.hash === '#contacto') {
    document.getElementById('contacto')?.scrollIntoView();
    return;
  }
  const slug = location.hash.replace(/^#\/?/, '');
  slug === 'info' ? vistaInfo() : slug ? vistaProyecto(slug) : vistaInicio();
  scrollTo(0, 0);
  observarRevelado(app);
}

// Clic en una foto -> se amplía; clic de nuevo (o Esc) -> se cierra.
app.addEventListener('click', e => {
  if (e.target.matches('[data-zoom]')) {
    visor.innerHTML = `<img src="${e.target.src}" alt="">`;
    visor.showModal();
  }
});
visor.addEventListener('click', () => visor.close());

async function iniciar() {
  document.documentElement.classList.add('js'); // el CSS oculta los .medio solo si hay JS
  try {
    const respuesta = await fetch('data/proyectos.json', { cache: 'no-store' });
    if (!respuesta.ok) throw new Error('No se pudieron cargar los proyectos');
    proyectos = await respuesta.json();
  } catch {
    app.innerHTML = '<p class="error">No se encontró data/proyectos.json. Ejecutá: node scripts/scan.js</p>';
    return;
  }
  initEfectos(CONFIG.efectos);
  addEventListener('hashchange', navegar);
  if (location.hash === '#contacto') vistaInicio();
  navegar();
}
iniciar();
