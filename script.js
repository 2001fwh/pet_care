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

const bookingForm = document.querySelector('#booking-form');
const visitTime = document.querySelector('#visit-time');
const shopClock = new Intl.DateTimeFormat('sv-SE', {
  timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit',
  hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
});
function validateVisitTime() {
  const now = shopClock.format(new Date()).replace(' ', 'T');
  visitTime.min = now;
  visitTime.setCustomValidity('');
  if (!visitTime.value) return;
  const date = new Date(`${visitTime.value}+08:00`);
  const day = new Date(`${visitTime.value.slice(0, 10)}T12:00:00Z`).getUTCDay();
  const time = visitTime.value.slice(11, 16);
  if (!Number.isFinite(date.getTime()) || visitTime.value <= now) {
    visitTime.setCustomValidity('请选择未来的到店时间。');
  } else if (day === 1) {
    visitTime.setCustomValidity('每周一店休，请选择周二至周日到店。');
  } else if (time < '10:00' || time > '20:00') {
    visitTime.setCustomValidity('请选择营业时间 10:00–20:00 内到店。');
  }
}
visitTime.addEventListener('input', validateVisitTime);
visitTime.addEventListener('focus', validateVisitTime);
validateVisitTime();
let toastTimer;
bookingForm.addEventListener('submit', (event) => {
  event.preventDefault();
  validateVisitTime();
  if (!event.currentTarget.reportValidity()) return;
  const toast = document.querySelector('#toast');
  toast.querySelector('b').textContent = '预约信息预览';
  toast.querySelector('small').textContent = `期望到店：${visitTime.value.replace('T', ' ')}（北京时间）。当前为演示，尚未发送至门店。`;
  toast.classList.add('show');
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('show'), 8000);
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
