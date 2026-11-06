const $ = (id) => document.getElementById(id);
let photoData = [];
let musicData = "";

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, ch => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
}

function updatePreview() {
  $("pRecipient").textContent = $("recipient").value || "Alguien especial";
  $("pOccasion").textContent = $("occasion").value.toUpperCase();
  $("pTitle").textContent = $("title").value || "Un regalo para vos";
  $("pMessage").textContent = $("message").value;
  $("pSurprise").textContent = $("surprise").value;
  $("pSurprise").hidden = true;
  const holder = $("photoPreview");
  holder.innerHTML = "";
  if (!photoData.length) holder.innerHTML = "<span>♡</span><span>♡</span><span>♡</span>";
  else photoData.slice(0, 4).forEach(src => {
    const img = document.createElement("img"); img.src = src; img.alt = "Foto del regalo"; holder.appendChild(img);
  });
  const date = $("specialDate").value;
  $("pDate").textContent = date ? `Un día que empezó algo hermoso · ${new Date(`${date}T12:00:00`).toLocaleDateString("es-AR")}` : "Un detalle hecho especialmente para vos";
}

$("photos").addEventListener("change", async (event) => {
  const files = [...event.target.files].slice(0, 8);
  photoData = await Promise.all(files.map(file => new Promise((resolve, reject) => {
    const reader = new FileReader(); reader.onload = () => resolve(reader.result); reader.onerror = reject; reader.readAsDataURL(file);
  })));
  updatePreview();
});

$("musicFile").addEventListener("change", () => {
  const file = $("musicFile").files[0];
  if (!file) { musicData = ""; return; }
  if (!file.type.startsWith("audio/")) { alert("Elegí un archivo de audio, por ejemplo MP3."); $("musicFile").value = ""; return; }
  const reader = new FileReader();
  reader.onload = () => { musicData = reader.result; $("musicStatus").textContent = `Canción lista: ${file.name}`; };
  reader.readAsDataURL(file);
});

$("giftForm").addEventListener("input", updatePreview);
$("giftForm").addEventListener("submit", event => { event.preventDefault(); updatePreview(); });
$("openSurprise").addEventListener("click", () => { $("pSurprise").hidden = !$("pSurprise").hidden; });

function buildGiftPage() {
  const recipient = escapeHtml($("recipient").value || "Alguien especial");
  const occasion = escapeHtml($("occasion").value);
  const title = escapeHtml($("title").value || "Un regalo para vos");
  const message = escapeHtml($("message").value).replace(/\n/g, "<br>");
  const surprise = escapeHtml($("surprise").value).replace(/\n/g, "<br>");
  const signature = escapeHtml($("signature").value || "Con mucho cariño");
  const date = $("specialDate").value;
  const photos = photoData.map((src, i) => `<button class="photo" type="button" data-photo="${i}" aria-label="Ver foto ${i+1}"><img src="${src}" alt="Un recuerdo especial"></button>`).join("");
  const audioUrl = musicData || ( /^https:\/\//i.test($("musicUrl").value.trim()) ? escapeHtml($("musicUrl").value.trim()) : "" );
  const audio = audioUrl ? `<div class="music-player"><span class="music-note">♫</span><div class="music-copy"><b>Nuestra canción</b><small>Un recuerdo para escuchar</small></div><audio id="song" controls loop preload="metadata" src="${audioUrl}"></audio></div>` : "";
  const dateBlock = date ? `<section class="date-card"><small>DESDE AQUEL DÍA</small><strong id="elapsed">♡</strong><span>${new Date(`${date}T12:00:00`).toLocaleDateString("es-AR")}</span></section>` : "";

  return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#211321"><title>${title}</title><link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700&family=Playfair+Display:ital,wght@0,500;0,600;1,500&display=swap" rel="stylesheet"><style>
  *{box-sizing:border-box}body{margin:0;min-height:100vh;background:radial-gradient(ellipse at top,#684057,#211321 65%);color:#4b2a40;font-family:'DM Sans',sans-serif;padding:24px;display:grid;place-items:center}.intro-screen{position:fixed;inset:0;z-index:5;background:radial-gradient(ellipse at center,#75445f,#211321 72%);display:grid;place-items:center;text-align:center;padding:25px;color:#fff5f1;transition:opacity .8s,visibility .8s}.intro-screen.hide{opacity:0;visibility:hidden}.intro-inner{max-width:440px}.intro-heart{font-size:70px;color:#f0b4c4;animation:pulse 1.8s infinite}.intro-screen h1{font:italic clamp(34px,8vw,54px) 'Playfair Display';margin:12px 0}.intro-screen p{color:#e7cbd6;line-height:1.7}.open-btn,.btn{border:0;border-radius:30px;background:#e9a9b8;color:#351d2d;padding:14px 25px;font-weight:700;cursor:pointer;margin-top:18px}.card{width:min(720px,100%);background:#fff7f3;border-radius:18px;padding:clamp(25px,6vw,52px);text-align:center;box-shadow:0 25px 90px #0007;position:relative;overflow:hidden}.card:before{content:'♡';position:absolute;right:18px;top:8px;font-size:90px;color:#f8e5e8;opacity:.65}.heart{font-size:45px;color:#b65f7c}.tag{font-size:10px;letter-spacing:4px;color:#a45e79}.title{font:600 clamp(32px,7vw,52px) 'Playfair Display';margin:14px 0;color:#4b2a40}.to{font-size:14px;color:#80576c}.date-line{font:italic 14px 'Playfair Display';color:#a45e79;margin:24px 0}.photos{display:flex;flex-wrap:wrap;gap:12px;justify-content:center;margin:26px 0}.photo{border:0;padding:0;background:none;cursor:zoom-in}.photo img{width:clamp(115px,25vw,190px);height:clamp(135px,30vw,210px);object-fit:cover;border-radius:9px;box-shadow:0 8px 22px #63364b22;transition:transform .25s}.photo:hover img{transform:rotate(-2deg) scale(1.03)}.message{font:italic 18px/1.9 'Playfair Display';margin:25px auto;max-width:560px;color:#68445a}.music-player{display:flex;align-items:center;gap:12px;background:#f6e6e9;padding:14px;border-radius:12px;margin:24px auto;max-width:490px;text-align:left}.music-note{font-size:25px;color:#a45e79}.music-copy{display:grid;gap:3px;flex:1;color:#68445a}.music-copy small{font-size:10px;color:#9a7185}.music-player audio{width:min(55%,260px);height:36px}.date-card{display:grid;gap:7px;background:#f8e9ec;border-radius:12px;padding:18px;margin:25px auto;max-width:300px;color:#8b536d}.date-card small{letter-spacing:2px;font-size:9px}.date-card strong{font:600 27px 'Playfair Display'}.date-card span{font-size:12px}.btn{background:#713f5d;color:white;border-radius:7px}.surprise{display:none;margin:22px auto 0;padding:22px;background:#f8e9ec;border-radius:12px;line-height:1.8;color:#9a4f6d;font:italic 17px 'Playfair Display';max-width:500px}.signature{font:italic 20px 'Playfair Display';color:#a45e79;margin-top:28px}.foot{margin-top:35px;font-size:9px;letter-spacing:2px;color:#a77b8f}.lightbox{display:none;position:fixed;inset:0;z-index:8;background:#100b10ed;place-items:center;padding:20px}.lightbox.show{display:grid}.lightbox img{max-width:95vw;max-height:85vh;border-radius:10px}.lightbox button{position:absolute;top:20px;right:25px;background:none;border:0;color:white;font-size:35px;cursor:pointer}.float-heart{position:fixed;bottom:-30px;color:#f3b6c7;opacity:.65;pointer-events:none;animation:rise 8s linear forwards}@keyframes rise{to{transform:translateY(-110vh) rotate(35deg);opacity:0}}@keyframes pulse{50%{transform:scale(1.12)}}@media(max-width:520px){body{padding:12px}.card{padding:28px 17px}.music-player{flex-wrap:wrap}.music-player audio{width:100%}}
  </style></head><body>
  <section class="intro-screen" id="intro"><div class="intro-inner"><div class="intro-heart">♡</div><p>HAY ALGO ESPECIAL PARA VOS</p><h1>Un regalo hecho con amor</h1><p>Preparé este pequeño rincón para compartir algo que significa mucho para mí.</p><button class="open-btn" id="openGift">Abrir mi regalo ♡</button></div></section>
  <main class="card"><div class="heart">♡</div><p class="tag">${occasion.toUpperCase()}</p><h1 class="title">${title}</h1><p class="to">Para <b>${recipient}</b></p><p class="date-line">${date ? "Un día que siempre voy a recordar" : "Un detalle hecho especialmente para vos"}</p><div class="photos">${photos}</div><p class="message">${message}</p>${dateBlock}${audio}<button class="btn" id="reveal">✉ Abrir mi carta sorpresa</button><p class="surprise" id="surprise">${surprise}</p><p class="signature">${signature}</p><p class="foot">HECHO CON ♥ EN DG GIFT</p></main>
  <div class="lightbox" id="lightbox"><button id="closePhoto" aria-label="Cerrar">×</button><img id="largePhoto" alt="Foto ampliada"></div>
  <script>
  const intro=document.getElementById('intro');document.getElementById('openGift').addEventListener('click',()=>{intro.classList.add('hide');const song=document.getElementById('song');if(song)song.play().catch(()=>{});});
  document.getElementById('reveal').addEventListener('click',()=>{const s=document.getElementById('surprise');s.style.display=s.style.display==='block'?'none':'block';});
  document.querySelectorAll('[data-photo]').forEach(b=>b.addEventListener('click',()=>{document.getElementById('largePhoto').src=b.querySelector('img').src;document.getElementById('lightbox').classList.add('show');}));
  document.getElementById('closePhoto').addEventListener('click',()=>document.getElementById('lightbox').classList.remove('show'));document.getElementById('lightbox').addEventListener('click',e=>{if(e.target.id==='lightbox')e.currentTarget.classList.remove('show')});
  const elapsed=document.getElementById('elapsed');if(elapsed){const start=new Date('${date}T12:00:00');const days=Math.max(0,Math.floor((new Date()-start)/86400000));elapsed.textContent=days+' días';}
  setInterval(()=>{const h=document.createElement('span');h.className='float-heart';h.textContent=Math.random()>.5?'♡':'♥';h.style.left=Math.random()*100+'vw';h.style.fontSize=(14+Math.random()*18)+'px';document.body.appendChild(h);setTimeout(()=>h.remove(),8000)},1500);
  </script></body></html>`;
}

$("downloadGift").addEventListener("click", () => {
  const blob = new Blob([buildGiftPage()], {type:"text/html;charset=utf-8"});
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = "mi-regalo-dg-gift.html"; a.click(); setTimeout(() => URL.revokeObjectURL(url), 1000);
});
updatePreview();
