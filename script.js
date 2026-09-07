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
