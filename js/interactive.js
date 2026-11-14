// Efectos opcionales por vista. Cada inicialización devuelve su limpieza.
const movimientoReducido = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
let transicion;

export function cambiarVista(dibujar, activo) {
  transicion?.skipTransition();
  if (!activo || movimientoReducido()) { dibujar(); return; }
  if (document.startViewTransition) {
    transicion = document.startViewTransition(dibujar);
    // La navegación sigue funcionando aunque el navegador omita la animación.
    transicion.finished.catch(() => {});
  } else {
    dibujar();
    document.getElementById('app').animate?.(
      [{ opacity: .75, transform: 'translateY(8px)' }, { opacity: 1, transform: 'none' }],
      { duration: 240, easing: 'ease-out' });
  }
}

export function iniciarEfectosVista(raiz, cfg) {
  const limpiar = [galeriaVisible(raiz)];
  if (movimientoReducido()) return () => limpiar.forEach(fn => fn());
  if (raiz.querySelector('.areas-carrusel')) limpiar.push(carruselAreas(raiz.querySelector('.areas-carrusel')));
  if (cfg.portadasVideo) limpiar.push(portadas(raiz));
  if (cfg.trama && raiz.querySelector('.hero')) limpiar.push(trama(raiz.querySelector('.hero')));
  return () => limpiar.forEach(fn => fn());
}

// En escritorio los bordes del carrusel permiten recorrerlo al pasar el mouse.
function carruselAreas(el) {
  if (!matchMedia('(hover: hover) and (pointer: fine)').matches) return () => {};
  const controller = new AbortController();
  let frame = 0, direccion = 0, anterior = 0;
  const parar = () => {
    cancelAnimationFrame(frame); frame = 0; anterior = 0; direccion = 0;
    el.classList.remove('desplazando');
  };
  const mover = tiempo => {
    const paso = anterior ? Math.min(tiempo - anterior, 40) * .18 : 0;
    anterior = tiempo;
    el.scrollLeft += paso * direccion;
    if (document.hidden || (direccion < 0 && el.scrollLeft <= 0) || (direccion > 0 && el.scrollLeft >= el.scrollWidth - el.clientWidth - 1)) { parar(); return; }
    frame = requestAnimationFrame(mover);
  };
  el.addEventListener('pointermove', e => {
    const r = el.getBoundingClientRect(), x = e.clientX - r.left;
    const nueva = x < 64 ? -1 : x > r.width - 64 ? 1 : 0;
    if (!nueva) { parar(); return; }
    direccion = nueva;
    if (!frame) { el.classList.add('desplazando'); frame = requestAnimationFrame(mover); }
  }, { signal: controller.signal, passive: true });
  el.addEventListener('pointerleave', parar, { signal: controller.signal });
  el.addEventListener('focusin', parar, { signal: controller.signal });
  document.addEventListener('visibilitychange', parar, { signal: controller.signal });
  return () => { parar(); controller.abort(); };
}

// Los bucles de la galería descargan y reproducen solo al entrar en pantalla.
function galeriaVisible(raiz) {
  const videos = [...raiz.querySelectorAll('[data-gallery-loop]')];
  const visibles = new Set();
  const controller = new AbortController();
  let cerrado = false;
  const cargar = v => { if (!v.getAttribute('src')) v.src = v.dataset.src; };
  const reproducir = v => {
    if (cerrado || document.hidden) return;
    cargar(v);
    v.muted = true;
    v.play().catch(() => { if (!cerrado && visibles.has(v)) v.controls = true; });
  };
  if (movimientoReducido() || typeof IntersectionObserver === 'undefined') {
    videos.forEach(v => { cargar(v); v.controls = true; });
    return () => videos.forEach(v => v.pause());
  }
  const observer = new IntersectionObserver(entries => entries.forEach(e => {
    if (e.isIntersecting) { visibles.add(e.target); reproducir(e.target); }
    else { visibles.delete(e.target); e.target.pause(); }
  }), { threshold: 0 });
  videos.forEach(v => observer.observe(v));
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach(v => v.pause());
    else visibles.forEach(reproducir);
  }, { signal: controller.signal });
  return () => { cerrado = true; controller.abort(); observer.disconnect(); videos.forEach(v => v.pause()); };
}

function portadas(raiz) {
  if (navigator.connection?.saveData) return () => {};
  const controller = new AbortController();
  const opciones = { signal: controller.signal };
  const tactil = !matchMedia('(hover: hover) and (pointer: fine)').matches;
  const videos = [...raiz.querySelectorAll('.preview-video')];
  const visibles = new Set();
  let cerrado = false;
  const parar = v => { v.pause(); v.classList.remove('reproduciendo'); };
  const reproducir = async v => {
    videos.filter(otro => otro !== v).forEach(parar);
    if (document.hidden || cerrado) return;
    v.muted = true;
    if (!v.getAttribute('src')) v.src = v.dataset.src;
    try {
      await v.play();
      if (!cerrado && !v.paused) v.classList.add('reproduciendo');
    } catch { parar(v); } // Si se bloquea el autoplay, queda la foto.
  };
  const elegir = () => {
    const candidatos = [...visibles].sort((a, b) =>
      Math.abs(a.getBoundingClientRect().top + a.clientHeight / 2 - innerHeight / 2) -
      Math.abs(b.getBoundingClientRect().top + b.clientHeight / 2 - innerHeight / 2));
    if (candidatos[0]) reproducir(candidatos[0]);
  };
  const observer = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (e.isIntersecting && e.intersectionRatio >= .6) visibles.add(e.target);
      else { visibles.delete(e.target); parar(e.target); }
    });
    if (tactil) elegir();
  }, { threshold: [0, .6] });
  videos.forEach(v => {
    observer?.observe(v);
    if (!tactil) {
      const tarjeta = v.closest('.fila');
      tarjeta.addEventListener('pointerenter', () => reproducir(v), opciones);
      tarjeta.addEventListener('pointerleave', () => parar(v), opciones);
      tarjeta.addEventListener('focusin', () => reproducir(v), opciones);
      tarjeta.addEventListener('focusout', () => parar(v), opciones);
    }
  });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) videos.forEach(parar);
    else if (tactil) elegir();
  }, opciones);
  return () => {
    cerrado = true;
    controller.abort();
    observer?.disconnect();
    videos.forEach(parar);
  };
}

function trama(hero) {
  const canvas = document.createElement('canvas');
  canvas.className = 'trama';
  canvas.setAttribute('aria-hidden', 'true');
  hero.prepend(canvas);
  const ctx = canvas.getContext('2d');
  if (!ctx) { canvas.remove(); return () => {}; }
  const controller = new AbortController();
  let ancho = 0, alto = 0, cursor = null, frame = 0;
  const dibujar = () => {
    frame = 0;
    ctx.clearRect(0, 0, ancho, alto);
    for (let y = 12; y < alto; y += 24) for (let x = 12; x < ancho; x += 24) {
      const dx = cursor ? x - cursor.x : 0, dy = cursor ? y - cursor.y : 0;
      const distancia = Math.hypot(dx, dy);
      const fuerza = cursor ? Math.max(0, 1 - distancia / 140) : 0;
      const mover = fuerza * fuerza * 18 / (distancia || 1);
      ctx.fillStyle = `rgba(215,242,104,${.1 + fuerza * .24})`;
      ctx.beginPath();
      ctx.arc(x + dx * mover, y + dy * mover, 1 + fuerza, 0, Math.PI * 2);
      ctx.fill();
    }
  };
  const solicitar = () => { if (!frame) frame = requestAnimationFrame(dibujar); };
  const ajustar = () => {
    ancho = hero.clientWidth; alto = hero.clientHeight;
    const escala = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(ancho * escala); canvas.height = Math.round(alto * escala);
    ctx.setTransform(escala, 0, 0, escala, 0, 0);
    solicitar();
  };
  hero.addEventListener('pointermove', e => {
    const r = hero.getBoundingClientRect();
    cursor = { x: e.clientX - r.left, y: e.clientY - r.top }; solicitar();
  }, { signal: controller.signal, passive: true });
  hero.addEventListener('pointerleave', () => { cursor = null; solicitar(); }, { signal: controller.signal });
  const observer = typeof ResizeObserver === 'undefined' ? null : new ResizeObserver(ajustar);
  observer?.observe(hero);
  window.addEventListener('resize', ajustar, { signal: controller.signal });
  ajustar();
  return () => { controller.abort(); observer?.disconnect(); cancelAnimationFrame(frame); canvas.remove(); };
}
