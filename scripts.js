// Loader
if (document.body.classList.contains("home")) {
    // Check if the loader animation has been played this session
    if (!sessionStorage.getItem("animationPlayed")) {
      window.addEventListener('load', () => {
        const loader = document.querySelector('.loader');
        setTimeout(() => {
          loader.classList.add('fade-out');
          loader.addEventListener('transitionend', () => {
            loader.remove();
          });
          // Mark the animation as played for this session
          sessionStorage.setItem("animationPlayed", "true");
        }, 300);
      });
    } else {
      // If already played, remove the loader immediately on DOM ready
      document.addEventListener('DOMContentLoaded', () => {
        const loader = document.querySelector('.loader');
        if (loader) {
          loader.remove();
        }
      });
    }
  } else {
    // For non-home pages, remove the loader immediately once DOM is ready
    document.addEventListener('DOMContentLoaded', () => {
      const loader = document.querySelector('.loader');
      if (loader) {
        loader.remove();
      }
    });
  }

// Header Scroll Effect
let lastScroll = 0;
const header = document.querySelector('.header');

window.addEventListener('scroll', () => {
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

burger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    burger.classList.toggle('toggle');
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// AOS Initialization
AOS.init({
    duration: 1000,
    once: true,
    easing: 'ease-in-out'
});

// Create Floating Elements
function createFloatingElements() {
    const container = document.querySelector('.floating-elements');
    for (let i = 0; i < 5; i++) {
        const circle = document.createElement('div');
        // Changed: wrapped the class name in backticks for template literal
        circle.className = `float-circle circle-${i + 1}`;
        // Changed: wrapped style values in backticks
        circle.style.width = `${Math.random() * 100 + 50}px`;
        circle.style.height = circle.style.width;
        circle.style.left = `${Math.random() * 100}%`;
        circle.style.top = `${Math.random() * 100}%`;
        circle.style.animationDelay = `${Math.random() * 10}s`;
        container.appendChild(circle);
    }
}
createFloatingElements();

// Project Card Hover Effect
document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.transform = `perspective(1000px) rotateX(${(y - rect.height / 2) / 10}deg) rotateY(${-(x - rect.width / 2) / 10}deg)`;
    });    

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    });
});

