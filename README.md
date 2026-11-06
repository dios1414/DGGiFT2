# DG Gift — versión mejorada

Generador estático de regalos digitales personalizados. Incluye vista previa, selección de hasta 8 fotos, música integrada, fecha especial, carta sorpresa y descarga de un HTML autónomo.

## Probar
Abrí `index.html` en un navegador. Completá los campos, elegí fotos y opcionalmente un MP3, revisá la vista previa y tocá **Descargar mi regalo HTML**.

## Música
La opción recomendada es subir un archivo MP3 (o audio compatible). El audio queda incorporado dentro del HTML descargado y se reproduce desde un control integrado. También se acepta un enlace HTTPS directo a un archivo de audio. Los enlaces de Spotify o YouTube no son archivos de audio directos y no se convierten automáticamente en audio reproducible.

La reproducción automática puede estar bloqueada por el navegador; por eso la persona debe tocar **Abrir mi regalo** y puede controlar la canción desde el reproductor.

## Publicar en Cloudflare Pages
1. Subí `index.html`, `styles.css`, `app.js` y `README.md` a la raíz de un repositorio.
2. En Cloudflare, entrá a **Workers & Pages → Create → Pages → Connect to Git**.
3. Seleccioná el repositorio, dejá el comando de compilación vacío y el directorio de salida como `/`.
4. Publicá y probá la dirección generada.

## Nota
Es un prototipo frontend: no incluye cuentas, base de datos, pagos, almacenamiento permanente ni panel administrador. Cada regalo descargado es un HTML independiente. Si se incorpora un MP3 grande, el archivo HTML también será grande.
