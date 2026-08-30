const target = new Date('2026-09-12T20:00:00+05:30');
function tick(){
  let diff=Math.max(0,target.getTime()-Date.now());
  const d=Math.floor(diff/86400000);diff%=86400000;
  const h=Math.floor(diff/3600000);diff%=3600000;
  const m=Math.floor(diff/60000);diff%=60000;
  const s=Math.floor(diff/1000);
  document.getElementById('days').textContent=String(d).padStart(2,'0');
  document.getElementById('hours').textContent=String(h).padStart(2,'0');
  document.getElementById('minutes').textContent=String(m).padStart(2,'0');
  document.getElementById('seconds').textContent=String(s).padStart(2,'0');
}
tick();setInterval(tick,1000);

const card=document.getElementById('scratchCard'), canvas=document.getElementById('scratchCanvas'), btn=document.getElementById('revealDateBtn');
let ctx,done=false,down=false;
function initScratch(){
  if(done)return;
  const r=window.devicePixelRatio||1; canvas.width=card.clientWidth*r;canvas.height=card.clientHeight*r;canvas.style.width=card.clientWidth+'px';canvas.style.height=card.clientHeight+'px';
  ctx=canvas.getContext('2d');ctx.scale(r,r);
  ctx.fillStyle='#d8c1c8';ctx.fillRect(0,0,card.clientWidth,card.clientHeight);
  ctx.globalAlpha=.35;
  for(let i=0;i<80;i++){ctx.fillStyle=i%2?'#f4e5e9':'#bfa6ae';ctx.fillRect(Math.random()*card.clientWidth,Math.random()*card.clientHeight,8+Math.random()*18,2)}
  ctx.globalAlpha=1;
}
function erase(x,y){if(done)return;const r=canvas.getBoundingClientRect(),px=x-r.left,py=y-r.top;ctx.globalCompositeOperation='destination-out';ctx.beginPath();ctx.arc(px,py,20,0,Math.PI*2);ctx.fill();check();}
function check(){const d=ctx.getImageData(0,0,canvas.width,canvas.height).data;let tr=0;for(let i=3;i<d.length;i+=32)if(d[i]<90)tr++;if(tr/(d.length/32)>.45)reveal();}
function reveal(){if(done)return;done=true;canvas.style.transition='opacity .45s';canvas.style.opacity=0;setTimeout(()=>canvas.remove(),500)}
canvas.addEventListener('pointerdown',e=>{down=true;canvas.setPointerCapture(e.pointerId);erase(e.clientX,e.clientY)});
canvas.addEventListener('pointermove',e=>{if(down)erase(e.clientX,e.clientY)});canvas.addEventListener('pointerup',()=>down=false);canvas.addEventListener('pointercancel',()=>down=false);btn.addEventListener('click',reveal);window.addEventListener('resize',initScratch);initScratch();

function calendarUrl(title, start, end){
  const location = encodeURIComponent(
    'Spangle Stone, Dhuri Road, Opp. Saffron Palms, Sangrur, Punjab'
  );

  const details = encodeURIComponent(title + '.');

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&location=${location}&details=${details}`;
}

document.querySelectorAll('[data-calendar]').forEach(a =>
  a.addEventListener('click', e => {
    e.preventDefault();
    window.open(
      calendarUrl(a.dataset.title, a.dataset.start, a.dataset.end),
      '_blank',
      'noopener'
    );
  })
);

/* YouTube background music
   Video: Kudmayi (Film Version) — YouTube video ID 3qpxJEp4Ec4
   Starts from the 6-second mark when the invitation is opened. */
let ytPlayer = null;
let ytReady = false;
let invitationOpened = false;
let musicMuted = false;

function loadYouTubeAPI(){
  if (document.getElementById("youtube-iframe-api")) return;
  const tag = document.createElement("script");
  tag.id = "youtube-iframe-api";
  tag.src = "https://www.youtube.com/iframe_api";
  document.head.appendChild(tag);
}

function updateMusicButton(){
  const toggle = document.getElementById("musicToggle");
  if (!toggle) return;
  toggle.classList.toggle("is-muted", musicMuted);
  toggle.setAttribute("aria-pressed", String(musicMuted));
  toggle.setAttribute("aria-label", musicMuted ? "Unmute background music" : "Mute background music");
}

function playKudmayiFromSix(){
  if (!ytReady || !ytPlayer) return;
  try{
    ytPlayer.seekTo(30, true);
    ytPlayer.unMute();
    ytPlayer.setVolume(38);
    ytPlayer.playVideo();
    musicMuted = false;
    updateMusicButton();
  }catch(e){}
}

window.onYouTubeIframeAPIReady = function(){
  ytPlayer = new YT.Player("youtube-player", {
    width: "1",
    height: "1",
    videoId: "x9l2VRJ5-3k",
    playerVars: {
      autoplay: 0,
      controls: 0,
      disablekb: 1,
      fs: 0,
      loop: 1,
      playlist: "x9l2VRJ5-3k",
      playsinline: 1,
      rel: 0,
      modestbranding: 1,
      start: 30
    },
    events: {
      onReady: function(event){
        ytReady = true;
        event.target.setVolume(38);
        if (invitationOpened) playKudmayiFromSix();
      },
      onStateChange: function(event){
        if (event.data === YT.PlayerState.ENDED && invitationOpened) {
          try{
            ytPlayer.seekTo(30, true);
            ytPlayer.playVideo();
          }catch(e){}
        }
      }
    }
  });
};

loadYouTubeAPI();

/* Opening invitation */
const invitationCover = document.getElementById("invitationCover");
const openInvitation = document.getElementById("openInvitation");

function openWeddingInvitation(){
  if (!invitationCover || invitationCover.classList.contains("is-opening")) return;
  invitationOpened = true;
  invitationCover.classList.add("is-opening");
  document.body.classList.remove("invitation-locked");
  if (ytReady) playKudmayiFromSix();

  window.setTimeout(function(){
    invitationCover.remove();
  }, 900);
}

if (openInvitation) {
  openInvitation.addEventListener("click", openWeddingInvitation);
}
if (invitationCover) {
  invitationCover.addEventListener("click", function(e){
    if (e.target.closest("#openInvitation") || e.target.closest(".cover-envelope")) {
      openWeddingInvitation();
    }
  });
}
/* Floating music mute / unmute */
const musicToggle = document.getElementById("musicToggle");
if (musicToggle) {
  musicToggle.addEventListener("click", function(){
    if (!ytReady || !ytPlayer) return;
    try{
      if (musicMuted) {
        ytPlayer.unMute();
        ytPlayer.setVolume(38);
        ytPlayer.playVideo();
        musicMuted = false;
      } else {
        ytPlayer.mute();
        musicMuted = true;
      }
      updateMusicButton();
    }catch(e){}
  });
}
updateMusicButton();

/* Gallery lightbox */
const galleryMasonry = document.getElementById("galleryMasonry");
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");
const lightboxPrev = document.getElementById("lightboxPrev");
const lightboxNext = document.getElementById("lightboxNext");
let galleryImages = [];
let galleryIndex = 0;

if (galleryMasonry && lightbox && lightboxImg) {
  galleryImages = Array.from(galleryMasonry.querySelectorAll("img"));

  function showGalleryImage(index){
    if (!galleryImages.length) return;
    galleryIndex = (index + galleryImages.length) % galleryImages.length;
    const img = galleryImages[galleryIndex];
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt || "";
  }
  function openLightbox(index){
    showGalleryImage(index);
    lightbox.hidden = false;
    document.body.classList.add("modal-open");
  }
  function closeLightbox(){
    lightbox.hidden = true;
    document.body.classList.remove("modal-open");
  }

  galleryImages.forEach((img, i) => {
    img.addEventListener("click", () => openLightbox(i));
  });
  if (lightboxClose) lightboxClose.addEventListener("click", closeLightbox);
  if (lightboxPrev) lightboxPrev.addEventListener("click", () => showGalleryImage(galleryIndex - 1));
  if (lightboxNext) lightboxNext.addEventListener("click", () => showGalleryImage(galleryIndex + 1));
  lightbox.querySelectorAll("[data-close-lightbox]").forEach(el => el.addEventListener("click", closeLightbox));
  document.addEventListener("keydown", e => {
    if (lightbox.hidden) return;
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") showGalleryImage(galleryIndex - 1);
    if (e.key === "ArrowRight") showGalleryImage(galleryIndex + 1);
  });
}

/* Designer contact popup */
const designerModal = document.getElementById("designerModal");
const desaniaLink = document.getElementById("desaniaLink");
const designerClose = document.getElementById("designerClose");

function openDesignerModal(){
  if (!designerModal) return;
  designerModal.hidden = false;
  document.body.classList.add("modal-open");
  if (designerClose) designerClose.focus();
}
function closeDesignerModal(){
  if (!designerModal) return;
  designerModal.hidden = true;
  document.body.classList.remove("modal-open");
}
if (desaniaLink) desaniaLink.addEventListener("click", openDesignerModal);
if (designerClose) designerClose.addEventListener("click", closeDesignerModal);
if (designerModal) {
  designerModal.querySelectorAll("[data-close-designer]").forEach(function(el){
    el.addEventListener("click", closeDesignerModal);
  });
}
document.addEventListener("keydown", function(e){
  if (e.key === "Escape" && designerModal && !designerModal.hidden) closeDesignerModal();
});

/* Gentle reveal effects as sections enter the viewport */
const revealTargets = document.querySelectorAll(
  ".couple-card, .pin-item, .family-card, .event-card, .rsvp-paper, .map-box, .cta-inner, .gallery-item"
);
if ("IntersectionObserver" in window) {
  revealTargets.forEach(function(el){
    el.classList.add("js-reveal");
  });
  const revealObserver = new IntersectionObserver(function(entries, observer){
    entries.forEach(function(entry){
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, {threshold: 0.12, rootMargin: "0px 0px -35px 0px"});
  revealTargets.forEach(function(el){ revealObserver.observe(el); });
} else {
  revealTargets.forEach(function(el){ el.classList.add("is-visible"); });
}
