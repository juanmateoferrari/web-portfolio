// ============================================================
// EFECTOS: cada función es independiente. Se activan desde config.js.
// Si el sistema pide "reducir movimiento", se apagan solos.
// ============================================================
const reducido = matchMedia('(prefers-reduced-motion: reduce)').matches;
let reveladoActivo = true;

export function initEfectos(cfg) {
  reveladoActivo = cfg.revelado && !reducido;
  if (cfg.progreso) progreso();
  if (cfg.luz && !reducido) luz();
  if (cfg.parallax && !reducido) parallax();
}

// Barra superior: ancho = porcentaje recorrido de la página.
function progreso() {
  const barra = document.getElementById('progreso');
  addEventListener('scroll', () => {
    const total = document.documentElement.scrollHeight - innerHeight;
    barra.style.transform = `scaleX(${total > 0 ? scrollY / total : 0})`;
  }, { passive: true });
}

// Foco de luz: guarda la posición del mouse en variables CSS (--x, --y);
// el degradado radial de #luz (style.css) las usa.
function luz() {
  const el = document.getElementById('luz');
  el.classList.add('activa');
  addEventListener('pointermove', e => {
    el.style.setProperty('--x', e.clientX + 'px');
    el.style.setProperty('--y', e.clientY + 'px');
  });
}

// Parallax: cada imagen dentro de [data-parallax] se mueve un 8% de su
// distancia al centro de la pantalla. requestAnimationFrame evita trabajo de más.
function parallax() {
  let pendiente = false;
  const mover = () => {
    document.querySelectorAll('[data-parallax] img').forEach(img => {
      const r = img.parentElement.getBoundingClientRect();
      const d = r.top + r.height / 2 - innerHeight / 2;
      img.style.transform = `translateY(${d * -0.08}px) scale(1.15)`;
    });
    pendiente = false;
  };
  addEventListener('scroll', () => {
    if (!pendiente) { pendiente = true; requestAnimationFrame(mover); }
  }, { passive: true });
  addEventListener('resize', mover);
}

// Revelado: al entrar en pantalla, .medio recibe la clase "on" y el CSS
// hace el barrido tipo escáner. Se llama cada vez que se dibuja una vista nueva.
const io = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entradas => {
  entradas.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('on'); io.unobserve(e.target); }
  });
}, { threshold: 0 });

export function observarRevelado(raiz) {
  io?.disconnect();
  raiz.querySelectorAll('.medio').forEach(el =>
    reveladoActivo && io ? io.observe(el) : el.classList.add('on'));
  dispatchEvent(new Event('scroll')); // posiciona el parallax al cargar
}
