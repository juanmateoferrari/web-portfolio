// ============================================================
// SCAN: recorre proyectos/<carpeta>/ y genera data/proyectos.json.
// Uso:  node scripts/scan.js   (Netlify lo corre solo en cada deploy)
//
// Dentro de cada carpeta de proyecto (todo es opcional):
//   info.json       titulo, anio, orden, equipo, tags[], columnas, embeds[], oculto
//   corto.txt       texto corto (portada y encabezado)
//   largo.txt       texto largo; un párrafo = bloques separados por línea vacía
//   ingenieril.txt  lista, un ítem por línea
//   creativa.txt    lista, un ítem por línea
//   fotos, gifs y videos: sueltos en la carpeta o dentro de media/
//     - se ordenan por nombre (01-..., 02-...)
//     - "portada.*"  = imagen de portada (no aparece en la galería)
//     - "loop-*.mp4" = video que se reproduce solo, mudo y en bucle
// Carpetas que empiezan con "_" se ignoran.
// ============================================================
const fs = require('fs');
const path = require('path');

const RAIZ = path.join(__dirname, '..');
const DIR = path.join(RAIZ, 'proyectos');
const IMG = /\.(jpe?g|png|webp|avif|gif|svg)$/i;
const VID = /\.(mp4|webm|mov)$/i;

const leer = (d, f) => {
  const p = path.join(d, f);
  return fs.existsSync(p) ? fs.readFileSync(p, 'utf8').trim() : '';
};
const parrafos = t => t.split(/\n\s*\n/).map(s => s.trim()).filter(Boolean);
const lineas = t => t.split('\n').map(s => s.trim()).filter(Boolean);

// Devuelve los archivos multimedia de la carpeta (y de media/), ordenados.
function medios(d) {
  const salida = [];
  for (const base of [d, path.join(d, 'media')]) {
    if (!fs.existsSync(base)) continue;
    const archivos = fs.readdirSync(base).sort((a, b) => a.localeCompare(b, 'es', { numeric: true }));
    for (const f of archivos) {
      const tipo = VID.test(f) ? 'video' : IMG.test(f) ? 'imagen' : null;
      if (!tipo) continue;
      salida.push({
        src: path.relative(RAIZ, path.join(base, f)).split(path.sep).map(encodeURIComponent).join('/'),
        tipo,
        loop: /^loop-/i.test(f),
        portada: /^portada\./i.test(f),
      });
    }
  }
  return salida;
}

const proyectos = fs.readdirSync(DIR, { withFileTypes: true })
  .filter(e => e.isDirectory() && !e.name.startsWith('_'))
  .map(e => {
    const d = path.join(DIR, e.name);
    let info = {};
    try { info = JSON.parse(leer(d, 'info.json') || '{}'); }
    catch (err) { console.error(`info.json inválido en ${e.name}: ${err.message}`); }
    const m = medios(d);
    const portada = m.find(x => x.portada) || m.find(x => x.tipo === 'imagen');
    const preview = path.join(d, 'previews', 'portada.mp4');
    const previewMobile = path.join(d, 'previews', 'portada-mobile.mp4');
    return {
      slug: e.name,
      titulo: info.titulo || e.name,
      anio: info.anio || '',
      orden: info.orden ?? 99,
      oculto: !!info.oculto,
      equipo: info.equipo || '',
      tags: info.tags || [],
      columnas: info.columnas || 2,
      embeds: info.embeds || [],
      corto: leer(d, 'corto.txt'),
      largo: parrafos(leer(d, 'largo.txt')),
      ingenieril: lineas(leer(d, 'ingenieril.txt')),
      creativa: lineas(leer(d, 'creativa.txt')),
      portada: portada ? portada.src : '',
      preview: fs.existsSync(preview) ? path.relative(RAIZ, preview).split(path.sep).map(encodeURIComponent).join('/') : '',
      previewMobile: fs.existsSync(previewMobile) ? path.relative(RAIZ, previewMobile).split(path.sep).map(encodeURIComponent).join('/') : '',
      media: m.filter(x => !x.portada).map(x => ({ ...x, alt: info.alt?.[decodeURIComponent(x.src.split('/').pop())] || '' })),
    };
  })
  .filter(p => !p.oculto)
  .sort((a, b) => a.orden - b.orden || a.titulo.localeCompare(b.titulo, 'es'));

fs.mkdirSync(path.join(RAIZ, 'data'), { recursive: true });
fs.writeFileSync(path.join(RAIZ, 'data', 'proyectos.json'), JSON.stringify(proyectos, null, 2));
console.log(`OK: ${proyectos.length} proyectos -> data/proyectos.json`);

require('./pages.js')(proyectos);
