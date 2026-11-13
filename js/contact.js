// iPhone: intenta abrir el perfil en la app, con respaldo HTTPS.
// El resto de los dispositivos conserva la navegación normal del enlace.
let cancelarIntento = () => {};

export function abrirInstagramEnIPhone(evento, url) {
  if (!/iPhone|iPod/.test(navigator.userAgent) ||
      !['instagram.com', 'www.instagram.com'].includes(url.hostname)) return false;
  const usuario = url.pathname.split('/').filter(Boolean);
  if (usuario.length !== 1 || !/^[\w.]+$/.test(usuario[0])) return false;

  evento.preventDefault();
  cancelarIntento();
  let temporizador;
  const limpiar = () => {
    clearTimeout(temporizador);
    document.removeEventListener('visibilitychange', alOcultar);
    window.removeEventListener('pagehide', limpiar);
    cancelarIntento = () => {};
  };
  const alOcultar = () => { if (document.hidden) limpiar(); };
  cancelarIntento = limpiar;
  document.addEventListener('visibilitychange', alOcultar);
  window.addEventListener('pagehide', limpiar);
  temporizador = setTimeout(() => {
    const visible = !document.hidden;
    limpiar();
    if (visible) window.location.assign(url.href);
  }, 1800);
  try {
    window.location.assign(`instagram://user?username=${encodeURIComponent(usuario[0])}`);
  } catch {
    limpiar();
    window.location.assign(url.href);
  }
  return true;
}
