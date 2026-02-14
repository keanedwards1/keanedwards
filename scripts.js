/* Script.js */

// Loader
if (document.body.classList.contains("home")) {
  if (!sessionStorage.getItem("animationPlayed")) {
    window.addEventListener('load', () => {
      const loader = document.querySelector('.loader');
      setTimeout(() => {
        if (!loader) return;
        loader.classList.add('fade-out');
        loader.addEventListener('transitionend', () => {
          loader.remove();
        });
        sessionStorage.setItem("animationPlayed", "true");
      }, 100);
    });
  } else {
    document.addEventListener('DOMContentLoaded', () => {
      const loader = document.querySelector('.loader');
      if (loader) loader.remove();
    });
  }
} else {
  document.addEventListener('DOMContentLoaded', () => {
    const loader = document.querySelector('.loader');
    if (loader) loader.remove();
  });
}

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
  if (!header) return;
  const currentScroll = window.pageYOffset;

  if (currentScroll <= 0) {
    header.classList.remove('scroll-up');
    return;
  }

  if (currentScroll > lastScroll && !header.classList.contains('scroll-down')) {
    header.classList.remove('scroll-up');
    header.classList.add('scroll-down');
  } else if (currentScroll < lastScroll && header.classList.contains('scroll-down')) {
    header.classList.remove('scroll-down');
    header.classList.add('scroll-up');
  }
  lastScroll = currentScroll;
});

// Mobile Menu
const burger = document.querySelector('.burger');
const navLinks = document.querySelector('.nav-links');

if (burger && navLinks) {
  burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
  });
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth' });
  });
});

// AOS Initialization
if (window.AOS) { 
  AOS.init({
    duration: 1000,
    once: true,
    easing: 'ease-in-out'
  });
}

// Create Floating Elements
function createFloatingElements() {
  const container = document.querySelector('.floating-elements');
  if (!container) return;

  for (let i = 0; i < 5; i++) {
    const circle = document.createElement('div');
    circle.className = `float-circle circle-${i + 1}`;
    circle.style.width = `${Math.random() * 100 + 50}px`;
    circle.style.height = circle.style.width;
    circle.style.left = `${Math.random() * 100}%`;
    circle.style.top = `${Math.random() * 100}%`;
    circle.style.animationDelay = `${Math.random() * 10}s`;
    container.appendChild(circle);
  }
}
createFloatingElements();
