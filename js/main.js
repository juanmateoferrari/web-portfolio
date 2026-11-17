// ============================================================
// MAIN: carga los datos, dibuja las vistas y maneja la navegación.
// Rutas:  #/            -> portada
//         #/nombre-carpeta -> página de ese proyecto
// ============================================================
import { CONFIG } from './config.js';
import { abrirInstagramEnIPhone } from './contact.js';
import { initEfectos, observarRevelado } from './effects.js';
import { iniciarEfectosVista, cambiarVista } from './interactive.js';

const app = document.getElementById('app');
const visor = document.getElementById('visor');
let proyectos = [];
let primeraVista = true;
const base = new URL('.', document.baseURI);
const ruta = () => location.hash.startsWith('#/') ? location.hash.slice(2) : location.pathname.slice(base.pathname.length).replace(/^trabajos\//, '').replace(/\/$/, '');
let actual = ruta();
const posiciones = new Map();
if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
let limpiarVista = () => {};

// Escapa texto para que nunca se interprete como HTML.
const esc = s => String(s ?? '').replace(/[&<>"']/g,
  c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

// ---------- Piezas reutilizables ----------

// Una foto/gif o un video. Videos "loop-*" se reproducen solos y mudos; el resto tiene controles.
const medio = (m, i, p) => m.tipo === 'video'
  ? `<figure class="medio"><video ${m.loop ? `data-gallery-loop data-src="${esc(m.src)}" muted loop playsinline` : `src="${esc(m.src)}" controls`} preload="none"></video></figure>`
  : `<figure class="medio"><img src="${esc(m.src)}" alt="${esc(m.alt || `${p.titulo}, registro ${i + 1}`)}" loading="lazy" data-zoom tabindex="0" role="button" aria-label="Ampliar: ${esc(m.alt || `${p.titulo}, registro ${i + 1}`)}"></figure>`;

// Video incrustado de YouTube o Vimeo (se define en info.json -> embeds).
const embed = e => {
  const url = e.tipo === 'vimeo'
    ? `https://player.vimeo.com/video/${e.id}`
    : `https://www.youtube-nocookie.com/embed/${e.id}`;
  return `<div class="embed"><iframe src="${url}" loading="lazy" allowfullscreen title="Video"></iframe></div>`;
};

const lista = (titulo, items) => items.length
  ? `<div><h3>${esc(titulo)}</h3><ul>${items.map(i => `<li>${esc(i)}</li>`).join('')}</ul></div>` : '';

const enlacesContacto = () => CONFIG.contacto
  .map(c => `<a href="${esc(c.url)}">${esc(c.texto)}</a>`).join('');

const navegacion = etiqueta => `<nav class="navegacion" aria-label="${etiqueta}">
  ${ruta() ? '<a href="./">Home</a>' : ''}
  ${['info', 'contacto'].includes(ruta()) ? `<div class="enlaces-contacto">${enlacesContacto()}</div>` : '<a href="info/">Info</a>'}
</nav>`;

const pie = () => `<footer class="pie" id="contacto">${navegacion('Navegación del pie')}</footer>`;

// Solo los loop-* MP4/WebM se usan como previews; nunca cargan hasta reproducirse.
const preview = p => {
  if (!CONFIG.efectos.portadasVideo || matchMedia('(prefers-reduced-motion: reduce)').matches || navigator.connection?.saveData) return null;
  const mobile = matchMedia('(max-width: 760px), (hover: none) and (pointer: coarse)').matches;
  const src = mobile ? p.previewMobile || p.preview : p.preview;
  return src ? { src } : null;
};
const nombreTransicion = p => CONFIG.efectos.transiciones
  ? `style="view-transition-name: obra-${proyectos.indexOf(p)}"` : '';
const videoPortada = p => {
  const v = preview(p);
  return v ? `<video class="preview-video" data-src="${esc(v.src)}" muted loop playsinline preload="none" aria-hidden="true" tabindex="-1"></video>` : '';
};

// ---------- Vistas ----------

// Portada: nombre, bio y una fila por proyecto (título, año, texto corto, portada).
function vistaInicio() {
  document.title = CONFIG.nombre;
  app.innerHTML = `
    <header class="cabecera">
      ${navegacion('Navegación principal')}</header>
    <section class="hero"><h1>${esc(CONFIG.nombre)}</h1><p>${esc(CONFIG.bio)}</p></section>
    <section class="trabajos" aria-label="Trabajos">
    <div class="filas">${proyectos.map((p, i) => `
      <a class="fila" href="trabajos/${esc(p.slug)}/">
        <div class="fila-img" ${nombreTransicion(p)}>${p.portada ? `<img src="${esc(p.portada)}" alt="${esc(p.titulo)}" ${i < 2 ? 'fetchpriority="high"' : 'loading="lazy"'} decoding="async">` : `<div class="sin-portada"><span>${esc(p.titulo)}</span></div>`}${videoPortada(p)}</div>
        <div class="fila-texto">
          <h2>${esc(p.titulo)}</h2>
          ${p.anio ? `<span class="anio">${esc(p.anio)}</span>` : ''}
        </div>
      </a>`).join('')}</div>
    </section>${pie()}`;
}

function vistaInfo() {
  document.title = `Info | ${CONFIG.nombre}`;
  app.innerHTML = `<header class="cabecera">${navegacion('Navegación principal')}</header>
  <article class="info">
    <div class="info-grilla">
      <div class="info-detalle">
        <div class="info-texto"><p>${esc(CONFIG.sobreMi.intro)}</p>${CONFIG.sobreMi.parrafos.map(p => `<p>${esc(p)}</p>`).join('')}</div>

        <details class="info-experiencia info-contacto-desplegable">
          <summary>Contactame</summary>
          <div class="experiencia-contenido">
            <p>Conversemos para trabajar juntos, podés hablarme por Mail o Instagram.</p>
            <div class="info-contacto-enlaces">${CONFIG.contacto.map(c => {
              const etiqueta = c.url.startsWith('mailto:') ? c.url.slice(7) : `@${new URL(c.url).pathname.split('/').filter(Boolean).pop()}`;
              return `<a href="${esc(c.url)}">${esc(etiqueta)}</a>`;
            }).join('')}</div>
          </div>
        </details>
        <details class="info-experiencia">
          <summary>Ver experiencia</summary>
          <div class="experiencia-contenido">
            ${CONFIG.sobreMi.experiencia.map(e => `<article class="experiencia-puesto">
              <h3>${esc(e.periodo)} // ${esc(e.cargo)}${e.organizacion ? ` en ${esc(e.organizacion)}` : ''}</h3>
              <p>${esc(e.descripcion)}</p>
            </article>`).join('')}
            <h2>Habilidades técnicas</h2>
            <ul>${CONFIG.sobreMi.habilidades.map(h => `<li>${esc(h)}</li>`).join('')}</ul>
          </div>
        </details>
      </div>
      <figure class="info-retrato">
        <img src="${esc(CONFIG.sobreMi.foto)}" alt="Retrato de ${esc(CONFIG.nombre)}" decoding="async">
      </figure>
    </div>

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
    <header class="cabecera">${navegacion('Navegación principal')}</header>
    <article class="proyecto">
      <header class="hero proyecto-cabecera">
        <div>
          <h1>${esc(p.titulo)}</h1>
          ${meta ? `<p class="meta">${meta}</p>` : ''}
        </div>
        ${p.corto ? `<p>${esc(p.corto)}</p>` : ''}
      </header>
      <div class="galeria" style="--cols:${Math.min(p.columnas, Math.max(1, p.media.length))}">${p.media.map((m, i) => medio(m, i, p)).join('')}</div>
      ${p.embeds.map(embed).join('')}
      <div class="texto">${p.largo.map(t => `<p>${esc(t)}</p>`).join('')}</div>
      <div class="listas">${lista(CONFIG.etiquetas.ingenieril, p.ingenieril)}${lista(CONFIG.etiquetas.creativa, p.creativa)}</div>
      <a class="siguiente" href="trabajos/${esc(sig.slug)}/">Siguiente: ${esc(sig.titulo)}</a>
    </article>${pie()}`;
}

// ---------- Navegación y arranque ----------

function navegar() {
  if (ruta() === 'contacto') history.replaceState(null, '', new URL('info/', base));
  // El contacto es un ancla dentro de la vista actual, no un proyecto.
  if (location.hash === '#contacto') {
    document.getElementById('contacto')?.scrollIntoView();
    return;
  }
  const slug = ruta();
  posiciones.set(actual, scrollY);
  actual = slug;
  if (visor.open) visor.close();
  cambiarVista(() => {
    limpiarVista();
    slug === 'info' ? vistaInfo() : slug ? vistaProyecto(slug) : vistaInicio();
    document.documentElement.classList.remove('cargando');
    const p = proyectos.find(p => p.slug === slug);
    const descripcion = p?.corto || 'Escenografía, luz, visuales, objetos e instalaciones interactivas.';
    const url = new URL(['info', 'contacto'].includes(slug) ? `${slug}/` : p ? `trabajos/${p.slug}/` : './', base);
    document.querySelector('meta[name="description"]').content = descripcion;
    document.querySelector('meta[property="og:title"]').content = document.title;
    document.querySelector('meta[property="og:description"]').content = descripcion;
    document.querySelector('meta[property="og:url"]').content = url.href;
    document.querySelector('meta[property="og:image"]').content = new URL(p?.slug === 'mapping-dinamico' ? 'img/social/mapping-dinamico.jpg' : p?.portada || 'proyectos/chiara/portada.jpg', base).href;
    document.querySelector('meta[property="og:image:alt"]').content = p?.titulo || CONFIG.nombre;
    document.querySelector('link[rel="canonical"]').href = url.href;
    scrollTo({ top: posiciones.get(slug) || 0, left: 0, behavior: 'instant' });
    observarRevelado(app);
    limpiarVista = iniciarEfectosVista(app, CONFIG.efectos);
  }, !primeraVista && CONFIG.efectos.transiciones);
  primeraVista = false;
}

// El visor conserva el foco y permite recorrer las fotos con botones y teclado.
let fotos = [], fotoActual = 0, origenVisor;
function mostrarFoto(i) {
  fotoActual = (i + fotos.length) % fotos.length;
  const foto = fotos[fotoActual];
  visor.innerHTML = `<button class="visor-cerrar" aria-label="Cerrar">×</button><button class="visor-anterior" aria-label="Foto anterior">←</button><img src="${esc(foto.src)}" alt="${esc(foto.alt)}"><button class="visor-siguiente" aria-label="Foto siguiente">→</button><span class="visor-contador" aria-live="polite">${fotoActual + 1} / ${fotos.length}</span>`;
}
app.addEventListener('click', e => {
  if (e.target.matches('[data-zoom]')) {
    fotos = [...app.querySelectorAll('[data-zoom]')]; origenVisor = e.target;
    mostrarFoto(fotos.indexOf(e.target)); visor.showModal(); visor.querySelector('button').focus();
    return;
  }
  const a = e.target.closest('a');
  if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.altKey || e.button !== 0 || a.target || a.hasAttribute('download')) return;
  const url = new URL(a.href);
  if (abrirInstagramEnIPhone(e, url)) return;
  if (url.origin !== location.origin || !url.pathname.startsWith(base.pathname) || url.hash) return;
  e.preventDefault(); history.pushState(null, '', url); navegar();
});
app.addEventListener('keydown', e => {
  if (e.target.matches('[data-zoom]') && ['Enter', ' '].includes(e.key)) { e.preventDefault(); e.target.click(); }
});
visor.addEventListener('click', e => {
  if (e.target.closest('.visor-cerrar') || e.target === visor) visor.close();
  else if (e.target.closest('.visor-anterior')) { mostrarFoto(fotoActual - 1); visor.querySelector('.visor-anterior').focus(); }
  else if (e.target.closest('.visor-siguiente')) { mostrarFoto(fotoActual + 1); visor.querySelector('.visor-siguiente').focus(); }
});
visor.addEventListener('keydown', e => {
  if (['ArrowLeft', 'ArrowRight'].includes(e.key)) { e.preventDefault(); const clase = document.activeElement.className; mostrarFoto(fotoActual + (e.key === 'ArrowRight' ? 1 : -1)); visor.querySelector(`.${clase}`)?.focus(); }
});
visor.addEventListener('close', () => origenVisor?.isConnected && origenVisor.focus({ preventScroll: true }));

async function iniciar() {
  document.documentElement.classList.add('js'); // el CSS oculta los .medio solo si hay JS
  try {
    const respuesta = await fetch('data/proyectos.json', { cache: 'no-store' });
    if (!respuesta.ok) throw new Error('No se pudieron cargar los proyectos');
    proyectos = await respuesta.json();
  } catch {
    document.documentElement.classList.remove('cargando');
    app.innerHTML = '<p class="error">No pudimos cargar los trabajos. <a href="./">Volvé a intentar</a> o escribime a juanmaferra2000@gmail.com.</p>';
    return;
  }
  initEfectos(CONFIG.efectos);
  addEventListener('hashchange', navegar);
  addEventListener('popstate', navegar);
  matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', () => {
    limpiarVista();
    limpiarVista = iniciarEfectosVista(app, CONFIG.efectos);
  });
  if (location.hash === '#contacto') vistaInicio();
  navegar();
}
iniciar();
