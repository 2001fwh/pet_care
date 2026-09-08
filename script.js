const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const open = menuButton.getAttribute('aria-expanded') === 'true';
  menuButton.setAttribute('aria-expanded', String(!open));
  menuButton.setAttribute('aria-label', open ? '打开菜单' : '关闭菜单');
  navLinks.classList.toggle('open', !open);
});

navLinks.addEventListener('click', () => {
  menuButton.setAttribute('aria-expanded', 'false');
  navLinks.classList.remove('open');
});

document.querySelector('#booking-form').addEventListener('submit', (event) => {
  event.preventDefault();
  const toast = document.querySelector('#toast');
  toast.classList.add('show');
  event.currentTarget.reset();
  window.setTimeout(() => toast.classList.remove('show'), 4000);
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => entry.isIntersecting && entry.target.classList.add('visible'));
}, { threshold: 0.12 });

document.querySelectorAll('.service-card, .review-grid article, .promise-list > div').forEach((item) => observer.observe(item));

const carousel = document.querySelector('.space-carousel');
const slides = [...carousel.querySelectorAll('.space-slide')];
const dots = [...carousel.querySelectorAll('[data-space-index]')];
const pauseButton = carousel.querySelector('[data-space-pause]');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
let activeSlide = 0;
let paused = reducedMotion.matches;
function showSlide(index) {
  activeSlide = (index + slides.length) % slides.length;
  slides.forEach((slide, i) => { slide.hidden = i !== activeSlide; });
  dots.forEach((dot, i) => dot.setAttribute('aria-pressed', String(i === activeSlide)));
}
function updatePause() {
  pauseButton.textContent = paused ? '▶' : 'Ⅱ';
  pauseButton.setAttribute('aria-label', paused ? '开始自动播放' : '暂停自动播放');
}
carousel.querySelector('[data-space-prev]').addEventListener('click', () => showSlide(activeSlide - 1));
carousel.querySelector('[data-space-next]').addEventListener('click', () => showSlide(activeSlide + 1));
dots.forEach((dot, i) => dot.addEventListener('click', () => showSlide(i)));
pauseButton.addEventListener('click', () => { paused = !paused; updatePause(); });
carousel.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
    event.preventDefault();
    showSlide(activeSlide + (event.key === 'ArrowLeft' ? -1 : 1));
  }
});
reducedMotion.addEventListener('change', (event) => { paused = event.matches; updatePause(); });
updatePause();
window.setInterval(() => {
  if (!paused && !document.hidden && !carousel.matches(':hover') && !carousel.contains(document.activeElement)) showSlide(activeSlide + 1);
}, 6000);
