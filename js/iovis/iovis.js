// ==========================================
// IOVIS - LANDING PAGE JAVASCRIPT
// Interactive Features & Animations
// ==========================================

// ==========================================
// NAVIGATION SCROLL EFFECT
// ==========================================
const nav = document.querySelector(".nav");
let lastScroll = 0;

window.addEventListener("scroll", () => {
  const currentScroll = window.pageYOffset;

  // Add shadow on scroll
  if (currentScroll > 50) {
    nav.style.boxShadow = "0 4px 6px -1px rgba(0, 0, 0, 0.1)";
  } else {
    nav.style.boxShadow = "none";
  }

  // Hide/show nav on scroll direction
  if (currentScroll > lastScroll && currentScroll > 500) {
    nav.style.transform = "translateY(-100%)";
  } else {
    nav.style.transform = "translateY(0)";
  }

  lastScroll = currentScroll;
});

// ==========================================
// MOBILE MENU TOGGLE
// ==========================================
const mobileMenuBtn = document.querySelector(".mobile-menu-btn");
const navLinks = document.querySelector(".nav-links");

if (mobileMenuBtn) {
  mobileMenuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    mobileMenuBtn.classList.toggle("active");

    // Animate menu button
    const spans = mobileMenuBtn.querySelectorAll("span");
    if (mobileMenuBtn.classList.contains("active")) {
      spans[0].style.transform = "rotate(45deg) translateY(10px)";
      spans[1].style.opacity = "0";
      spans[2].style.transform = "rotate(-45deg) translateY(-10px)";
    } else {
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    }
  });

  // Close menu when clicking on a link
  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("active");
      mobileMenuBtn.classList.remove("active");
      const spans = mobileMenuBtn.querySelectorAll("span");
      spans[0].style.transform = "none";
      spans[1].style.opacity = "1";
      spans[2].style.transform = "none";
    });
  });
}

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));

    if (target) {
      const navHeight = nav.offsetHeight;
      const targetPosition =
        target.getBoundingClientRect().top + window.pageYOffset - navHeight;

      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ==========================================
// INTERSECTION OBSERVER FOR ANIMATIONS
// ==========================================
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -100px 0px",
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("animate-in");
      observer.unobserve(entry.target);
    }
  });
}, observerOptions);

// Observe all elements with data-animate attribute
document.querySelectorAll("[data-animate]").forEach((el) => {
  observer.observe(el);
});

// ==========================================
// PARALLAX EFFECT FOR HERO BACKGROUND
// ==========================================
const heroBg = document.querySelector(".hero-bg");

window.addEventListener("scroll", () => {
  const scrolled = window.pageYOffset;
  const parallaxSpeed = 0.5;

  if (heroBg) {
    heroBg.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
  }
});

// ==========================================
// FEATURE CARDS STAGGER ANIMATION
// ==========================================
const featureCards = document.querySelectorAll(".feature-card");

featureCards.forEach((card, index) => {
  card.style.animationDelay = `${index * 0.1}s`;
});

// ==========================================
// PROCESS STEPS COUNTER ANIMATION
// ==========================================
const processSteps = document.querySelectorAll(".process-step");

const animateSteps = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const stepNumber = entry.target.querySelector(".step-number");
      if (stepNumber) {
        stepNumber.style.animation = "countUp 0.6s ease forwards";
      }
      animateSteps.unobserve(entry.target);
    }
  });
}, observerOptions);

processSteps.forEach((step) => {
  animateSteps.observe(step);
});

// ==========================================
// STATS COUNTER ANIMATION
// ==========================================
const statNumbers = document.querySelectorAll(".stat-number");

const animateValue = (element, start, end, duration) => {
  // Skip if not a number
  if (isNaN(end)) return;

  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    element.textContent = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
};

const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const statNumber = entry.target;
      const finalValue = parseInt(statNumber.textContent);

      if (!isNaN(finalValue)) {
        animateValue(statNumber, 0, finalValue, 2000);
      }

      statsObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

statNumbers.forEach((stat) => {
  // Only observe numeric stats
  if (!isNaN(parseInt(stat.textContent))) {
    statsObserver.observe(stat);
  }
});

// ==========================================
// GRADIENT TEXT ANIMATION
// ==========================================
const gradientTexts = document.querySelectorAll(".gradient-text");

gradientTexts.forEach((text) => {
  text.style.backgroundSize = "200% 200%";
  text.style.animation = "gradientShift 8s ease infinite";
});

// Add gradient animation keyframes dynamically
const style = document.createElement("style");
style.textContent = `
    @keyframes gradientShift {
        0% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
        100% { background-position: 0% 50%; }
    }

    @keyframes countUp {
        from {
            opacity: 0;
            transform: scale(0.5);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }

    @media (max-width: 768px) {
        .nav-links.active {
            display: flex;
            flex-direction: column;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: rgba(255, 255, 255, 0.98);
            backdrop-filter: blur(10px);
            padding: 2rem;
            box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
            animation: slideDown 0.3s ease;
        }

        @keyframes slideDown {
            from {
                opacity: 0;
                transform: translateY(-20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    }
`;
document.head.appendChild(style);

// ==========================================
// HOVER EFFECTS FOR CARDS
// ==========================================
const cards = document.querySelectorAll(".feature-card, .highlight-box");

cards.forEach((card) => {
  card.addEventListener("mouseenter", function () {
    this.style.transform = "translateY(-5px) scale(1.02)";
  });

  card.addEventListener("mouseleave", function () {
    this.style.transform = "translateY(0) scale(1)";
  });
});

// ==========================================
// LAZY LOAD IMAGES (if any are added)
// ==========================================
if ("IntersectionObserver" in window) {
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.classList.remove("lazy");
        imageObserver.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img.lazy").forEach((img) => {
    imageObserver.observe(img);
  });
}

// ==========================================
// PARTICLE BURST CURSOR EFFECT
// ==========================================
let mouseX = 0;
let mouseY = 0;

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

// Only add cursor effect on desktop
if (window.innerWidth > 1024) {
  const particles = [];
  const colors = ["#D4AF37", "#E8C96F", "#B8941F", "#8B7355"];

  class Particle {
    constructor(x, y) {
      this.x = x;
      this.y = y;
      this.size = Math.random() * 3 + 2;
      this.speedX = Math.random() * 3 - 1.5;
      this.speedY = Math.random() * 3 - 1.5;
      this.color = colors[Math.floor(Math.random() * colors.length)];
      this.life = 1;
      this.decay = Math.random() * 0.008 + 0.004;
    }

    update() {
      this.x += this.speedX;
      this.y += this.speedY;
      this.life -= this.decay;
      this.size *= 0.96;
    }

    draw(ctx) {
      ctx.save();
      ctx.globalAlpha = this.life;
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  // Create canvas for particles
  const canvas = document.createElement("canvas");
  canvas.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        pointer-events: none;
        z-index: 9999;
    `;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext("2d");

  // Resize canvas on window resize
  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  // Create particles on mouse move
  let lastParticleTime = 0;
  document.addEventListener("mousemove", (e) => {
    const now = Date.now();
    if (now - lastParticleTime > 30) {
      for (let i = 0; i < 2; i++) {
        particles.push(new Particle(e.clientX, e.clientY));
      }
      lastParticleTime = now;
    }
  });

  // Burst effect on click
  document.addEventListener("click", (e) => {
    for (let i = 0; i < 15; i++) {
      particles.push(new Particle(e.clientX, e.clientY));
    }
  });

  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (let i = particles.length - 1; i >= 0; i--) {
      particles[i].update();
      particles[i].draw(ctx);

      if (particles[i].life <= 0) {
        particles.splice(i, 1);
      }
    }

    requestAnimationFrame(animate);
  }
  animate();
}

// ==========================================
// BUTTON RIPPLE EFFECT
// ==========================================
const buttons = document.querySelectorAll(".btn");

buttons.forEach((button) => {
  button.addEventListener("click", function (e) {
    const ripple = document.createElement("span");
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;

    ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.5);
            left: ${x}px;
            top: ${y}px;
            pointer-events: none;
            transform: scale(0);
            animation: ripple 0.6s ease-out;
        `;

    this.style.position = "relative";
    this.style.overflow = "hidden";
    this.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
  });
});

// Add ripple animation
const rippleStyle = document.createElement("style");
rippleStyle.textContent = `
    @keyframes ripple {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

// ==========================================
// PERFORMANCE OPTIMIZATION
// ==========================================
// Debounce function for scroll events
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for mousemove events
function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// ==========================================
// CONSOLE GREETING
// ==========================================
console.log(
  "%c🚀 Bem-vindo ao Iovis! ",
  "background: linear-gradient(135deg, #D4AF37 0%, #8B7355 100%); color: white; font-size: 20px; padding: 10px 20px; border-radius: 5px;",
);
console.log(
  "%cVirtus Iovis & Iovis Combinator",
  "font-size: 16px; color: #D4AF37; font-weight: bold;",
);
console.log(
  "%cConectando as melhores mentes da USP ao futuro da inovação",
  "font-size: 12px; color: #666;",
);

// ==========================================
// INITIALIZE ON PAGE LOAD
// ==========================================
window.addEventListener("load", () => {
  // Remove loading class if exists
  document.body.classList.remove("loading");

  // Trigger initial animations
  const heroElements = document.querySelectorAll(
    ".hero-title .title-line, .hero-subtitle, .hero-cta, .hero-stats",
  );
  heroElements.forEach((el, index) => {
    setTimeout(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }, index * 200);
  });
});

// ==========================================
// MODAL FORM FUNCTIONALITY
// ==========================================
const modal = document.getElementById("formModal");
const openFormBtns = document.querySelectorAll(".open-form-btn");
const closeBtn = document.querySelector(".modal-close");

// Open modal when clicking any CTA button
openFormBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    modal.classList.add("active");
    document.body.style.overflow = "hidden";
  });
});

// Close modal when clicking X
if (closeBtn) {
  closeBtn.addEventListener("click", () => {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  });
}

// Close modal when clicking outside content
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// Close modal with ESC key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
});

// ==========================================
// EXPORT FOR MODULE USAGE (if needed)
// ==========================================
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    debounce,
    throttle,
  };
}
