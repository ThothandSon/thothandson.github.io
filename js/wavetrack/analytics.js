// ==========================================
// Analytics - Event Tracking & Metrics
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initAnalytics();
  initSocialProof();
});

// ==========================================
// Analytics Initialization
// ==========================================

function initAnalytics() {
  // Track page view
  trackPageView();

  // Track scroll depth
  initScrollTracking();

  // Track time on page
  initTimeTracking();

  // Track CTA clicks
  initCTATracking();

  // Track exit intent
  initExitIntent();
}

function trackPageView() {
  const pageData = {
    url: window.location.href,
    title: document.title,
    referrer: document.referrer,
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    screenSize: `${window.screen.width}x${window.screen.height}`,
    viewport: `${window.innerWidth}x${window.innerHeight}`,
  };

  trackEvent("page_view", pageData);
}

function initScrollTracking() {
  let scrollMilestones = [25, 50, 75, 100];
  let trackedMilestones = new Set();

  window.addEventListener(
    "scroll",
    debounce(() => {
      const scrollPercentage =
        (window.scrollY /
          (document.documentElement.scrollHeight - window.innerHeight)) *
        100;

      scrollMilestones.forEach((milestone) => {
        if (
          scrollPercentage >= milestone &&
          !trackedMilestones.has(milestone)
        ) {
          trackedMilestones.add(milestone);
          trackEvent("scroll_depth", { percentage: milestone });
        }
      });
    }, 500),
  );
}

function initTimeTracking() {
  const startTime = Date.now();

  // Track at intervals
  const intervals = [30, 60, 120, 300]; // 30s, 1min, 2min, 5min

  intervals.forEach((seconds) => {
    setTimeout(() => {
      const timeSpent = Math.floor((Date.now() - startTime) / 1000);
      trackEvent("time_on_page", { seconds: timeSpent });
    }, seconds * 1000);
  });

  // Track on page unload
  window.addEventListener("beforeunload", () => {
    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    trackEvent("page_exit", { timeSpent });
  });
}

function initCTATracking() {
  // Track all CTA button clicks
  document.querySelectorAll(".btn-primary, .btn-cta").forEach((button) => {
    button.addEventListener("click", (e) => {
      trackEvent("cta_clicked", {
        text: button.textContent.trim(),
        location: getElementLocation(button),
      });
    });
  });
}

function initExitIntent() {
  let exitIntentShown = false;

  document.addEventListener("mouseleave", (e) => {
    if (e.clientY < 0 && !exitIntentShown) {
      exitIntentShown = true;
      trackEvent("exit_intent_detected");

      // Could trigger exit intent popup here
      // showExitIntentPopup();
    }
  });
}

// ==========================================
// Social Proof - Dynamic Updates
// ==========================================

function initSocialProof() {
  updateLiveStats();
  startSocialProofTicker();
}

function updateLiveStats() {
  // Animate company count
  const companyCount = document.querySelector('.stat-number[data-count="127"]');
  if (companyCount) {
    // Increment occasionally
    setInterval(() => {
      const current = parseInt(companyCount.textContent) || 127;
      if (Math.random() > 0.7) {
        // 30% chance every interval
        companyCount.textContent = current + 1;

        // Show notification
        showSocialProofNotification();
      }
    }, 45000); // Every 45 seconds
  }
}

function startSocialProofTicker() {
  const ticker = document.getElementById("proofTicker");
  if (!ticker) return;

  const proofEvents = [
    {
      icon: "🎉",
      text: "Supermercado Vila Nova começou teste grátis",
      time: "2 min atrás",
    },
    {
      icon: "💰",
      text: "Metalúrgica São José economizou R$ 18.420 este mês",
      time: "3 min atrás",
    },
    {
      icon: "✅",
      text: "Transportadora Rodoeste detectou 52 discrepâncias hoje",
      time: "5 min atrás",
    },
    {
      icon: "🚀",
      text: "Lojas União ativou o plano Professional",
      time: "8 min atrás",
    },
    {
      icon: "📊",
      text: "Clínica Saúde Plus gerou relatório de 847 alertas",
      time: "10 min atrás",
    },
    {
      icon: "🎯",
      text: "Construtora Horizonte validou 134 horas extras hoje",
      time: "12 min atrás",
    },
    {
      icon: "⚡",
      text: "Centro de Distribuição Nordeste economizou R$ 9.850 esta semana",
      time: "15 min atrás",
    },
    {
      icon: "🔥",
      text: "Shopping Centro Sul preveniu R$ 15.200 em fraudes",
      time: "18 min atrás",
    },
    {
      icon: "💼",
      text: "Cooperativa Crédito Fácil auditou 2.340 registros automaticamente",
      time: "20 min atrás",
    },
    {
      icon: "✨",
      text: "Indústria Química Progresso integrou com sistema de ponto",
      time: "22 min atrás",
    },
    {
      icon: "🏆",
      text: "Restaurante Sabor & Cia detectou 28 inconsistências",
      time: "25 min atrás",
    },
    {
      icon: "📈",
      text: "Farmácia Preço Bom aumentou eficiência em 34%",
      time: "28 min atrás",
    },
    {
      icon: "🎖️",
      text: "Faculdade Integrada validou 156 presenças",
      time: "30 min atrás",
    },
    {
      icon: "⭐",
      text: "Call Center TeleSuporte economizou R$ 22.100 em horas extras",
      time: "32 min atrás",
    },
    {
      icon: "🚛",
      text: "Transportadora Via Rápida auditou 890 rotas hoje",
      time: "35 min atrás",
    },
    {
      icon: "🏭",
      text: "Confecções Textil Moderna detectou 41 anomalias",
      time: "38 min atrás",
    },
  ];

  let currentIndex = 0;

  function addProofItem() {
    const event = proofEvents[currentIndex];

    const item = document.createElement("div");
    item.className = "proof-item";
    item.innerHTML = `
            <span>${event.icon}</span>
            <span><strong>${event.text}</strong> • ${event.time}</span>
        `;

    ticker.appendChild(item);

    // Remove old items if more than 6
    if (ticker.children.length > 6) {
      ticker.removeChild(ticker.firstChild);
    }

    currentIndex = (currentIndex + 1) % proofEvents.length;

    trackEvent("social_proof_shown", { event: event.text });
  }

  // Add initial items
  for (let i = 0; i < 3; i++) {
    addProofItem();
  }

  // Add new item every 20 seconds
  setInterval(addProofItem, 20000);
}

function showSocialProofNotification() {
  const companies = [
    "Atacadista Central",
    "Metalúrgica Paulista",
    "Logística Expressa",
    "Varejo Familiar",
    "Clínica Vida Nova",
    "Construções Alvorada",
    "Auto Peças Brasil",
    "Galeria Comercial",
    "Financeira Confiança",
    "Química Industrial",
    "Restaurante Bom Gosto",
    "Drogaria Popular",
    "Centro Universitário",
    "Telemarketing Pro",
    "Cargas Rodoviárias",
    "Fábrica de Uniformes",
    "Pousada Serra Verde",
    "Laboratório Diagnóstico",
  ];

  const company = companies[Math.floor(Math.random() * companies.length)];

  const notification = document.createElement("div");
  notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 20px;
        background: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
        z-index: 1000;
        animation: slideInRight 0.5s ease;
        max-width: 300px;
    `;

  notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.75rem;">
            <div style="font-size: 1.5rem;">👤</div>
            <div>
                <div style="font-weight: 600; margin-bottom: 0.25rem;">Nova Empresa!</div>
                <div style="font-size: 0.875rem; color: #64748b;">
                    ${company} acabou de se cadastrar
                </div>
            </div>
        </div>
    `;

  document.body.appendChild(notification);

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.5s ease";
    setTimeout(() => notification.remove(), 500);
  }, 5000);
}

// ==========================================
// Utility Functions
// ==========================================

function getElementLocation(element) {
  const rect = element.getBoundingClientRect();
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

  return {
    top: rect.top + scrollTop,
    section: getClosestSection(element),
  };
}

function getClosestSection(element) {
  const section = element.closest("section");
  return section?.className || "unknown";
}

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
// A/B Testing (Optional)
// ==========================================

function initABTest() {
  // Example: Test different hero headlines
  const variant = Math.random() > 0.5 ? "A" : "B";

  if (variant === "B") {
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      heroTitle.innerHTML =
        'Detecte Fraudes de Ponto e <span class="highlight">Economize Milhares</span>';
    }
  }

  trackEvent("ab_test_assigned", { variant });
}

// Add CSS animation for social proof
const style = document.createElement("style");
style.textContent = `
    @keyframes slideInRight {
        from {
            opacity: 0;
            transform: translateX(100px);
        }
        to {
            opacity: 1;
            transform: translateX(0);
        }
    }

    @keyframes slideOutRight {
        from {
            opacity: 1;
            transform: translateX(0);
        }
        to {
            opacity: 0;
            transform: translateX(100px);
        }
    }

    @keyframes pulse {
        0%, 100% { opacity: 0.4; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(style);

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    trackPageView,
    updateLiveStats,
    showSocialProofNotification,
  };
}
