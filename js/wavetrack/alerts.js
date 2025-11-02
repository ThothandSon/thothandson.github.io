// ==========================================
// Live Alerts Feed - Real-time Notifications
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initAlertsFeed();
});

let alertsInterval = null;
const alertTemplates = [
  {
    type: "discrepancy",
    icon: "⚠️",
    title: "Discrepância detectada",
    messages: [
      "João Silva marcou saída às 18:00, mas dispositivo permaneceu na rede até 18:47",
      "Maria Santos registrou entrada às 08:00, mas o primeiro acesso à rede foi 08:32",
      "Pedro Costa marcou hora extra das 19:00-21:00, sem detecção de presença no escritório",
      "Ana Oliveira: ponto marcado remotamente, mas dispositivo não detectado no escritório",
      "Carlos Ferreira saiu às 17:30 (ponto), dispositivo desconectou às 17:05",
      "Ricardo Moura: intervalo de almoço de 35min registrado, mas dispositivo offline por 1h20min",
      "Camila Dias marcou entrada às 07:45, mas chegou à rede apenas às 08:15",
      "Bruno Henrique: ponto de saída às 17:00, dispositivo ativo até 17:52",
      "Patrícia Gomes registrou trabalho remoto, mas dispositivo detectado no escritório",
      "Thiago Almeida: 3 marcações de ponto com intervalo inferior a 2 minutos de conexão WiFi",
    ],
  },
  {
    type: "device",
    icon: "📱",
    title: "Dispositivo detectado",
    messages: [
      "iPhone de Juliana Souza conectado à rede - Setor Financeiro",
      "Notebook de Roberto Lima ativo - Sala de Reuniões 2",
      "Dispositivo de Fernanda Alves reconectado após 2h offline",
      "Tablet de Marcos Paulo detectado - Área Administrativa",
      "MacBook de Daniela Costa conectado - Departamento de TI",
      "Smartphone de Rafael Santos ativo - Recepção",
      "Notebook de Beatriz Rocha reconectado - Sala de Projetos",
      "iPad de Leonardo Souza detectado - Área Comercial",
    ],
  },
  {
    type: "fraud",
    icon: "🚨",
    title: "Possível fraude",
    messages: [
      "Padrão suspeito: 5 marcações de saída após horário sem presença detectada",
      "Lucas Martins: 8 horas extras em 3 dias, presença total de 4h20min",
      "Dispositivo compartilhado detectado: 2 funcionários usando mesmo MAC address",
      "Amanda Rocha: marcação de ponto em local diferente do escritório cadastrado",
      "Gustavo Pereira: 12 horas extras registradas sem evidência de presença WiFi",
      "Padrão irregular: Renata Lima marca ponto mas nunca conecta dispositivo à rede",
      "Diego Carvalho: horário de almoço inconsistente - dispositivo ativo durante pausas",
      "Mariana Torres: 4 dias consecutivos com saída registrada mas permanência até 20h+",
    ],
  },
  {
    type: "savings",
    icon: "💰",
    title: "Economia identificada",
    messages: [
      "R$ 347 economizados hoje ao validar horas extras reais",
      "R$ 1.245 em horas extras infundadas detectadas esta semana",
      "Validação automática evitou R$ 523 em pagamentos incorretos",
      "14h de horas extras não confirmadas pela auditoria WiFi",
      "R$ 892 economizados em horas extras fantasma este mês",
      "22h de trabalho remoto não validado detectadas hoje",
      "Auditoria evitou pagamento de R$ 1.840 em discrepâncias de horário",
      "R$ 456 recuperados com validação de intervalos reais",
    ],
  },
];

function initAlertsFeed() {
  const feed = document.getElementById("alertsFeed");
  if (!feed) return;

  // Add initial alerts
  addInitialAlerts(feed);

  // Start live updates
  startLiveAlerts(feed);

  // Track view
  trackEvent("alerts_feed_viewed");
}

function addInitialAlerts(feed) {
  // Add 5 initial alerts
  for (let i = 0; i < 5; i++) {
    const alert = generateRandomAlert();
    feed.appendChild(createAlertElement(alert));
  }
}

function startLiveAlerts(feed) {
  // Add new alert every 12 seconds
  alertsInterval = setInterval(() => {
    const alert = generateRandomAlert();
    const alertElement = createAlertElement(alert);

    // Add to top of feed
    feed.insertBefore(alertElement, feed.firstChild);

    // Remove oldest if more than 10
    if (feed.children.length > 10) {
      feed.removeChild(feed.lastChild);
    }

    // Track event
    trackEvent("live_alert_generated", { type: alert.type });
  }, 12000);
}

function generateRandomAlert() {
  const template =
    alertTemplates[Math.floor(Math.random() * alertTemplates.length)];
  const message =
    template.messages[Math.floor(Math.random() * template.messages.length)];

  // Generate timestamp (last 5-30 minutes)
  const minutesAgo = Math.floor(Math.random() * 25) + 5;
  const timestamp = `${minutesAgo} min atrás`;

  return {
    type: template.type,
    icon: template.icon,
    title: template.title,
    message: message,
    timestamp: timestamp,
  };
}

function createAlertElement(alert) {
  const div = document.createElement("div");
  div.className = "alert-item";

  div.innerHTML = `
        <div class="alert-icon">${alert.icon}</div>
        <div class="alert-content">
            <div class="alert-title">${alert.title}</div>
            <div class="alert-message">${alert.message}</div>
            <div class="alert-time">${alert.timestamp}</div>
        </div>
    `;

  return div;
}

// Stop alerts when page is not visible (performance optimization)
document.addEventListener("visibilitychange", () => {
  if (document.hidden && alertsInterval) {
    clearInterval(alertsInterval);
  } else if (!document.hidden) {
    const feed = document.getElementById("alertsFeed");
    if (feed) {
      startLiveAlerts(feed);
    }
  }
});

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateRandomAlert,
    createAlertElement,
  };
}
