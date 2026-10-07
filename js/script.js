// Header state on scroll
const header = document.querySelector('header');
const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 50);
window.addEventListener('scroll', onScroll, { passive: true }); onScroll();

// Overlay menu
const overlay = document.getElementById('overlayMenu');
const toggle = document.getElementById('menuToggle');
const setMenu = open => {
  overlay.classList.toggle('active', open);
  overlay.setAttribute('aria-hidden', String(!open));
  toggle.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('no-scroll', open);
};
toggle.addEventListener('click', () => setMenu(true));
document.getElementById('overlayClose').addEventListener('click', () => setMenu(false));
overlay.querySelectorAll('a').forEach(a => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

// Media (below the fold): sources load only when near the viewport; videos play only while visible.
// Missing files leave the labelled placeholder in place.
const io = new IntersectionObserver(entries => entries.forEach(({ target: el, isIntersecting }) => {
  if (isIntersecting) {
    if (!el.src) el.src = el.dataset.src;
    if (el.tagName === 'VIDEO') el.play().catch(() => {});
  } else if (el.tagName === 'VIDEO') el.pause();
}), { rootMargin: '300px 0px' });

document.querySelectorAll('.media[data-src]').forEach(box => {
  const isImg = box.dataset.type === 'image';
  const el = document.createElement(isImg ? 'img' : 'video');
  el.dataset.src = box.dataset.src;
  if (isImg) { el.loading = 'lazy'; el.alt = ''; }
  else { Object.assign(el, { muted: true, loop: true, playsInline: true, autoplay: true }); el.setAttribute('muted', ''); el.preload = 'metadata'; }
  el.addEventListener('error', () => el.remove());
  box.appendChild(el);
  io.observe(el);
});

// Gallery arrows
const gallery = document.getElementById('gallery');
document.querySelector('.arrow.prev').onclick = () => gallery.scrollBy({ left: -gallery.clientWidth * 0.7, behavior: 'smooth' });
document.querySelector('.arrow.next').onclick = () => gallery.scrollBy({ left: gallery.clientWidth * 0.7, behavior: 'smooth' });

// Scroll reveal
const rev = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); rev.unobserve(e.target); } }), { threshold: 0.12 });
document.querySelectorAll('.block .wrap > *, .cta .wrap > *').forEach(el => { el.classList.add('reveal'); rev.observe(el); });
