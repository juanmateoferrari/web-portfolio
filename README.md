# Portfolio: guía rápida

## Probarlo en tu computadora
Desde la carpeta `web`, podés ejecutar `npm start`: regenera los datos y abre un servidor local.
El archivo de configuración que usa esta página es `web/js/config.js` (no `js/config.js` fuera de `web`).

Los módulos JS no funcionan abriendo index.html con doble clic; hace falta un servidor local:
    node scripts/scan.js
    npx serve .        (o: python3 -m http.server)
y abrí la dirección que te muestre.

## Estructura
    index.html            esqueleto de la página
    css/style.css         estilos (colores y ancho en la sección 1)
    js/config.js          nombre, bio, links, efectos on/off
    js/main.js            dibuja portada y proyectos, navegación, ampliar fotos
    js/effects.js         foco de luz, revelado, parallax, barra de progreso
    scripts/scan.js       lee las carpetas y genera data/proyectos.json
    proyectos/<nombre>/   una carpeta por proyecto (ver abajo)
    netlify.toml          le dice a Netlify que corra el escáner al publicar

## Agregar un proyecto
1. Creá proyectos/<nombre-sin-espacios>/
2. Poné adentro (todo opcional): info.json, corto.txt, largo.txt, ingenieril.txt, creativa.txt
3. Poné fotos, gifs y videos en la carpeta (o en una subcarpeta media/)
4. node scripts/scan.js  (en Netlify es automático)

info.json:
    { "titulo": "...", "anio": "2025", "orden": 1, "equipo": "...",
      "tags": ["..."], "columnas": 2, "oculto": false,
      "embeds": [ { "tipo": "youtube", "id": "ID_DEL_VIDEO" } ] }

Reglas de archivos:
- Se muestran ordenados por nombre: 01-escena.jpg, 02-detalle.jpg ...
- portada.jpg = portada del proyecto (no aparece en la galería)
- loop-nombre.mp4 = video que se reproduce solo, mudo y en bucle; el resto, con controles
- largo.txt: separá párrafos con una línea vacía. Las listas: un ítem por línea.
- Una carpeta que empieza con _ se ignora; "oculto": true la esconde sin borrarla.
- Galería sin texto (como visuales y luminarias): solo info.json y las fotos.

## Cambiar las portadas
Guardá una imagen como `portada.jpg`, `portada.png` o `portada.webp` dentro de la carpeta del proyecto.
También se reconocen extensiones en mayúscula, como `portada.JPG`.
Después de agregar o renombrar archivos, ejecutá `npm run scan` desde `web` y recargá la página.
Si el servidor ya estaba abierto, agregar la foto por sí solo no actualiza `data/proyectos.json`.
Sin portada explícita se usa la primera foto; si no hay fotos, aparece una tarjeta tipográfica.
Las portadas se recortan en proporción 4:3: conviene dejar el motivo principal cerca del centro.

## Publicar
Subí la carpeta a GitHub y conectala en Netlify (el comando de build ya está en netlify.toml).
Videos pesados: mejor YouTube/Vimeo con "embeds" que archivos en la carpeta.
Comprimí las fotos (ancho máx. ~2000 px) antes de subirlas.
