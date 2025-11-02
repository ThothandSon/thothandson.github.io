// ==========================================
// Wavetrack Landing Page - Main JavaScript
// ==========================================

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", () => {
  initScrollReveal();
  initSmoothScroll();
  initStatsCounter();
});

// ==========================================
// Scroll Reveal Animation
// ==========================================
function initScrollReveal() {
  const revealElements = document.querySelectorAll(
    ".feature-card, .pricing-card, .comparison-side",
  );

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("reveal", "active");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: "0px 0px -50px 0px",
    },
  );

  revealElements.forEach((el) => {
    el.classList.add("reveal");
    revealObserver.observe(el);
  });
}

// ==========================================
// Smooth Scroll for Navigation
// ==========================================
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (href !== "#" && href !== "#demo") {
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) {
          target.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }
    });
  });
}

// ==========================================
// Animated Stats Counter
// ==========================================
function initStatsCounter() {
  const stats = document.querySelectorAll(".stat-number[data-count]");

  const countObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = parseInt(entry.target.dataset.count);
          animateCounter(entry.target, target);
          countObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 },
  );

  stats.forEach((stat) => countObserver.observe(stat));
}

function animateCounter(element, target) {
  let current = 0;
  const increment = target / 50;
  const duration = 2000;
  const stepTime = duration / 50;

  const timer = setInterval(() => {
    current += increment;
    if (current >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(current);
    }
  }, stepTime);
}

// ==========================================
// Lead Form Modal Functions
// ==========================================
function openLeadForm(plan = "") {
  const modal = document.getElementById("leadModal");
  if (modal) {
    modal.classList.add("active");
    document.body.style.overflow = "hidden";

    // Store selected plan
    if (plan) {
      sessionStorage.setItem("selectedPlan", plan);
    }

    // Track event
    trackEvent("lead_form_opened", { plan });
  }
}

function closeLeadForm() {
  const modal = document.getElementById("leadModal");
  if (modal) {
    modal.classList.remove("active");
    document.body.style.overflow = "auto";
  }
}

// Close modal on outside click
window.addEventListener("click", (e) => {
  const modal = document.getElementById("leadModal");
  if (e.target === modal) {
    closeLeadForm();
  }
});

// ==========================================
// Chatbot Functions
// ==========================================
function toggleChatbot() {
  const chatBody = document.getElementById("chatbotBody");
  const toggle = document.querySelector(".chatbot-toggle");

  if (chatBody && toggle) {
    chatBody.classList.toggle("collapsed");
    toggle.textContent = chatBody.classList.contains("collapsed") ? "+" : "−";
  }
}

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  if (!input || !input.value.trim()) return;

  const message = input.value.trim();
  input.value = "";

  // Add user message
  addChatMessage(message, "user");

  // Simulate bot response
  setTimeout(() => {
    const response = getBotResponse(message);
    addChatMessage(response, "bot");
  }, 1000);

  // Track event
  trackEvent("chat_message_sent", { message });
}

function addChatMessage(text, type) {
  const chatBody = document.getElementById("chatbotBody");
  if (!chatBody) return;

  const messageDiv = document.createElement("div");
  messageDiv.className = `chat-message ${type}`;
  messageDiv.textContent = text;

  chatBody.appendChild(messageDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function getBotResponse(message) {
  const responses = {
    preço:
      "Nossos planos começam em R$ 499/mês para até 30 funcionários. Gostaria de ver todos os planos?",
    funciona:
      "O Wavetrack detecta a presença de dispositivos na rede WiFi do escritório e cruza com os registros de ponto. Simples e eficaz!",
    teste:
      "Sim! Oferecemos 14 dias de teste grátis, sem necessidade de cartão de crédito. Quer começar agora?",
    economia:
      "Empresas economizam em média R$ 15.000/mês detectando horas extras indevidas. Quer calcular sua economia?",
    lgpd: "Sim! Somos 100% LGPD compliant. Dados criptografados e anonimizados. Quer saber mais sobre segurança?",
    default:
      "Interessante! Nossa equipe pode responder isso em detalhes. Quer agendar uma demonstração?",
  };

  const lowerMessage = message.toLowerCase();

  for (const [key, response] of Object.entries(responses)) {
    if (lowerMessage.includes(key)) {
      return response;
    }
  }

  return responses.default;
}

// ==========================================
// Analytics Tracking
// ==========================================
function trackEvent(eventName, eventData = {}) {
  // Log to console for development
  console.log("📊 Event:", eventName, eventData);

  // Add your analytics integration here:
  // Google Analytics
  if (typeof gtag !== "undefined") {
    gtag("event", eventName, eventData);
  }

  // Facebook Pixel
  if (typeof fbq !== "undefined") {
    fbq("track", eventName, eventData);
  }

  // Mixpanel
  if (typeof mixpanel !== "undefined") {
    mixpanel.track(eventName, eventData);
  }
}

// Track page scroll depth
let maxScroll = 0;
window.addEventListener("scroll", () => {
  const scrollPercent =
    (window.scrollY /
      (document.documentElement.scrollHeight - window.innerHeight)) *
    100;

  if (scrollPercent > maxScroll) {
    maxScroll = Math.floor(scrollPercent / 25) * 25; // Track in 25% increments

    if ([25, 50, 75, 100].includes(maxScroll)) {
      trackEvent("scroll_depth", { depth: maxScroll });
    }
  }
});

// Track time on page
let timeOnPage = 0;
setInterval(() => {
  timeOnPage += 30;
  if (timeOnPage % 60 === 0) {
    trackEvent("time_on_page", { seconds: timeOnPage });
  }
}, 30000);

// ==========================================
// Utility Functions
// ==========================================

// Format currency in BRL
function formatCurrency(value) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

// Debounce function for performance
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

// ==========================================
// Export functions for use in other modules
// ==========================================
window.openLeadForm = openLeadForm;
window.closeLeadForm = closeLeadForm;
window.toggleChatbot = toggleChatbot;
window.sendChatMessage = sendChatMessage;
window.trackEvent = trackEvent;
window.formatCurrency = formatCurrency;
