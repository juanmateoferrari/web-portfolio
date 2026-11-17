// Generates crawlable project pages with metadata present before JavaScript runs.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const origin = process.env.SITE_URL || 'https://juan-mateo-ferrari.vercel.app';
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
module.exports = function generarPaginas(proyectos) {
  const template = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
  const pages = proyectos.map(p => ({
    route: `trabajos/${p.slug}/`, title: `${p.titulo} | Juan Mateo Ferrari`,
    description: p.corto || `${p.titulo}: proyecto de Juan Mateo Ferrari.`, image: p.portada,
    body: `<article class="proyecto"><a href="./">Volver a los trabajos</a><h1>${esc(p.titulo)}</h1><p>${esc(p.corto)}</p><p>${esc(p.anio)}${p.equipo ? ' / ' + esc(p.equipo) : ''}</p>${p.media.filter(m => m.tipo === 'imagen').map((m,i) => `<img src="${esc(m.src)}" alt="${esc(m.alt || `${p.titulo}, registro ${i+1}`)}" loading="lazy">`).join('')}${p.largo.map(t => `<p>${esc(t)}</p>`).join('')}</article>`,
  }));
  pages.push({route:'info/', title:'Sobre mí | Juan Mateo Ferrari', description:'Escenografía, luz e instalaciones interactivas. Ingeniero en Sistemas de Comunicación, Udelar.',image:'img/f4bc4094-4b11-41da-bad0-e0839c3f8106.JPG',body:'<article class="proyecto"><h1>Juan Mateo Ferrari</h1><p>Ingeniero en Sistemas de Comunicación, Udelar. Escenografía, luz e instalaciones interactivas.</p><div class="contacto-links"><a href="mailto:juanmaferra2000@gmail.com">Mail</a><a href="https://www.instagram.com/juan.mateo.ferrari/">Instagram</a></div><a href="./">Home</a></article>'});
  pages.push({route:'contacto/', redirect:'info/', title:'Info | Juan Mateo Ferrari', description:'Contact? a Juan Mateo Ferrari por mail o Instagram.', body:'<article class="proyecto contacto"><a class="volver" href="./">Volver a los trabajos</a><h1>Contacto</h1><div class="contacto-links"><a href="mailto:juanmaferra2000@gmail.com">Mail</a><a href="https://www.instagram.com/juan.mateo.ferrari/">Instagram</a></div></article>'});
  for (const p of pages) {
    const url = new URL(p.redirect || p.route, origin + '/').href;
    const image = new URL(p.route === 'trabajos/mapping-dinamico/' ? 'img/social/mapping-dinamico.jpg' : p.image || 'proyectos/chiara/portada.jpg', origin + '/').href;
    let html = template.replace('<base href="./">', `<base href="${'../'.repeat(p.route.split('/').filter(Boolean).length)}">`)
      .replace(/<title>.*?<\/title>/, `<title>${esc(p.title)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(p.description)}`)
      .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(p.title)}`)
      .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(p.description)}`)
      .replace(/(<meta property="og:url" content=")[^"]*/, `$1${esc(url)}`)
      .replace(/(<meta property="og:image" content=")[^"]*/, `$1${esc(image)}`)
      .replace(/(<meta property="og:image:alt" content=")[^"]*/, `$1${esc(p.title)}`)
      .replace(/(<link rel="canonical" href=")[^"]*/, `$1${esc(url)}`)
      .replace(/<main id="app">[\s\S]*?<\/main>/, `<main id="app">${p.body}</main>`);
    if (p.redirect) html = html.replace('</head>', `<meta http-equiv="refresh" content="0;url=../${p.redirect}"></head>`);
    const dir = path.join(root, p.route); fs.mkdirSync(dir, {recursive:true}); fs.writeFileSync(path.join(dir,'index.html'), html);
  }
  // Home links are readable to crawlers even without JavaScript.
  const home = template.replace(/<main id="app">[\s\S]*?<\/main>/, `<main id="app"><h1>Juan Mateo Ferrari</h1><p>Escenografía, luz e instalaciones interactivas.</p><a href="info/">Sobre mí</a><nav aria-label="Trabajos">${proyectos.map(p => `<p><a href="trabajos/${p.slug}/">${esc(p.titulo)}</a></p>`).join('')}</nav></main>`);
  fs.writeFileSync(path.join(root,'index.html'),home);
  const urls = ['', ...pages.map(p => p.route)];
  fs.writeFileSync(path.join(root,'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls.map(u => `<url><loc>${esc(new URL(u,origin+'/').href)}</loc></url>`).join('')}</urlset>`);
  fs.writeFileSync(path.join(root,'robots.txt'), `User-agent: *\nAllow: /\nSitemap: ${origin}/sitemap.xml\n`);
};
