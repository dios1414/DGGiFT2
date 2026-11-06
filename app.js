const $=id=>document.getElementById(id);
let photoFiles=[], videoFile=null, qrInstance=null;
const readData=file=>new Promise((resolve,reject)=>{const r=new FileReader();r.onload=()=>resolve(r.result);r.onerror=reject;r.readAsDataURL(file)});
$('recipient').addEventListener('input',()=>{$('prevRecipient').textContent=$('recipient').value||'Alguien muy especial'});
$('title').addEventListener('input',()=>{$('prevTitle').textContent=$('title').value||'Nuestra historia'});
$('letter').addEventListener('input',()=>{$('prevLetter').textContent=$('letter').value||'Acá aparecerán tus palabras...'});
$('signature').addEventListener('input',()=>{$('prevSignature').textContent=$('signature').value||'Con amor ♥'});
$('photos').addEventListener('change',e=>{
  photoFiles=Array.from(e.target.files||[]).slice(0,20);
  $('photoStatus').textContent=`${photoFiles.length} de 20 fotos seleccionadas.`;
  $('photoThumbs').innerHTML='';
  $('prevPhotos').innerHTML='';
  photoFiles.slice(0,8).forEach(f=>{const u=URL.createObjectURL(f);const img=document.createElement('img');img.src=u;$('photoThumbs').appendChild(img);const p=img.cloneNode();$('prevPhotos').appendChild(p)});
  if(!photoFiles.length)$('prevPhotos').innerHTML='<span>♥</span><span>♥</span><span>♥</span>';
});
$('video').addEventListener('change',e=>{videoFile=e.target.files?.[0]||null;$('videoStatus').textContent=videoFile?`${videoFile.name} · ${(videoFile.size/1024/1024).toFixed(1)} MB`:'Todavía no agregaste un video.';if(videoFile&&videoFile.size>25*1024*1024)$('videoStatus').textContent+=' — Es pesado; conviene comprimirlo para compartirlo más fácilmente.'});
function ytId(raw){try{const u=new URL(raw);if(u.hostname.includes('youtu.be'))return u.pathname.slice(1).split('/')[0];if(u.searchParams.get('v'))return u.searchParams.get('v');const m=u.pathname.match(/\/(embed|shorts)\/([^/?]+)/);return m?m[2]:''}catch{return ''}}
function esc(s){return String(s||'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]))}
$('createGift').addEventListener('click',async()=>{
 const btn=$('createGift');btn.disabled=true;btn.textContent='Preparando tu regalo...';
 try{
  const photos=await Promise.all(photoFiles.map(readData));
  const video=videoFile?await readData(videoFile):'';
  const id=ytId($('youtube').value.trim());
  const payload={recipient:$('recipient').value,title:$('title').value,letter:$('letter').value,signature:$('signature').value,photos,video,youtube:id};
  const html=giftDocument(payload);
  const blob=new Blob([html],{type:'text/html;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='mi-regalo-dg-gift.html';a.click();setTimeout(()=>URL.revokeObjectURL(url),3000);
  $('createStatus').textContent='¡Listo! Se descargó mi-regalo-dg-gift.html. Publicalo en Cloudflare Pages para obtener su enlace.';
 }catch(err){$('createStatus').textContent='No se pudo preparar el regalo. Probá con menos fotos o un video más liviano.'}
 finally{btn.disabled=false;btn.textContent='♥ Crear y descargar mi regalo'}
});
function giftDocument(d){
 const data=JSON.stringify(d).replace(/</g,'\\u003c');
 return `<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#35172f"><title>${esc(d.title||'Un regalo especial')}</title><style>
 *{box-sizing:border-box}body{margin:0;background:#32162e;color:#fff;font-family:Georgia,serif;text-align:center}.screen{min-height:100vh;padding:35px 18px 60px;display:flex;flex-direction:column;align-items:center;justify-content:center}.heart{border:0;background:none;color:#f29fbd;font-size:clamp(110px,30vw,190px);cursor:pointer;filter:drop-shadow(0 8px 25px #f29fbd55);transition:transform .3s}.heart:active{transform:scale(.9)}.hint{font:13px Arial,sans-serif;color:#f1cada;letter-spacing:2px}.fill{animation:beat .8s infinite alternate}@keyframes beat{to{transform:scale(1.13);filter:drop-shadow(0 0 35px #ff8bb8)}}.hidden{display:none!important}.content{max-width:780px;width:100%;margin:auto;padding:45px 18px}.content h1{font-size:clamp(34px,8vw,56px);font-weight:500;margin:12px 0}.sub{font:13px Arial,sans-serif;color:#edcbd9;letter-spacing:2px}.gallery{display:grid;grid-template-columns:repeat(auto-fit,minmax(135px,1fr));gap:10px;margin:28px 0}.gallery img{width:100%;height:190px;object-fit:cover;border-radius:13px;box-shadow:0 8px 20px #0004}.letter{background:#fff9f5;color:#55334a;border-radius:15px;padding:25px;text-align:left;white-space:pre-wrap;font-size:18px;line-height:1.7;margin:30px auto;max-width:650px}.sign{display:block;text-align:right;color:#a34f76;margin-top:18px}.video{width:100%;max-width:680px;border-radius:15px;margin-top:20px}.music{width:100%;max-width:560px;height:90px;border:0;border-radius:12px;margin:15px auto}.divider{color:#f1a9c2;font-size:25px;margin:28px}button.continue{background:#f3b4ca;color:#4a213e;border:0;border-radius:30px;padding:14px 25px;font:bold 14px Arial;cursor:pointer;margin-top:15px}
 </style></head><body><section class="screen" id="start"><button class="heart" id="heart" aria-label="Abrir regalo">♥</button><p class="hint">TOCÁ EL CORAZÓN PARA ABRIR TU REGALO</p></section><main class="content hidden" id="gift"><p class="sub">UN REGALO HECHO CON AMOR</p><h1>${esc(d.title||'Nuestra historia')}</h1><p>${esc(d.recipient||'Para alguien especial')}</p><div id="music"></div><div class="gallery">${d.photos.map((p,i)=>`<img src="${p}" alt="Recuerdo ${i+1}" loading="lazy">`).join('')}</div><div class="divider">♥</div><section class="letter">${esc(d.letter||'Un mensaje especial para vos...')}<span class="sign">${esc(d.signature||'Con amor ♥')}</span></section>${d.video?`<p class="sub">UN ÚLTIMO RECUERDO</p><video class="video" controls playsinline preload="metadata" src="${d.video}"></video>`:''}<p class="divider">♥</p></main><script>const DATA=${data};document.getElementById('heart').addEventListener('click',()=>{const h=document.getElementById('heart');h.classList.add('fill');setTimeout(()=>{document.getElementById('start').classList.add('hidden');document.getElementById('gift').classList.remove('hidden');window.scrollTo(0,0);if(DATA.youtube){document.getElementById('music').innerHTML='<iframe class="music" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen src="https://www.youtube-nocookie.com/embed/'+DATA.youtube+'?playsinline=1" title="Música del regalo"></iframe>'}},650)});</script></body></html>`;
}
$('makeQr').addEventListener('click',()=>{
 const url=$('publicUrl').value.trim();$('qr').innerHTML='';$('downloadQr').disabled=true;
 if(!/^https?:\/\//i.test(url)){ $('qr').textContent='Pegá primero el enlace público completo (https://...)';return}
 if(typeof QRCode==='undefined'){$('qr').textContent='No se pudo cargar el generador de QR. Revisá tu conexión.';return}
 qrInstance=new QRCode($('qr'),{text:url,width:220,height:220,colorDark:'#35172f',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.H});
 setTimeout(()=>{$('downloadQr').disabled=false},300);
});
$('downloadQr').addEventListener('click',()=>{
 const canvas=$('qr').querySelector('canvas');const img=$('qr').querySelector('img');const src=canvas?canvas.toDataURL('image/png'):img?.src;if(!src)return;
 const a=document.createElement('a');a.href=src;a.download='codigo-qr-dg-gift.png';a.click();
});
