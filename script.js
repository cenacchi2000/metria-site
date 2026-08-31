const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  navLinks.classList.toggle('mobile-open');
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
    if (entry.isIntersecting) observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

