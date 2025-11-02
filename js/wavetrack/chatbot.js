// ==========================================
// Chatbot - Contextual Assistant
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initChatbot();
});

const chatbotScenarios = {
  greeting: [
    "Olá! 👋 Sou o assistente do Wavetrack. Como posso ajudar?",
    "Oi! Tem alguma dúvida sobre como reduzir fraudes no ponto?",
  ],
  pricing: [
    "Nossos planos começam em R$ 499/mês para até 30 funcionários.",
    "Oferecemos 3 planos: Starter (R$ 499), Professional (R$ 999) e Enterprise (personalizado).",
    "O investimento se paga no primeiro mês com a economia em horas extras! 💰",
  ],
  howItWorks: [
    "O Wavetrack monitora dispositivos na rede WiFi do escritório e cruza com os registros de ponto eletrônico.",
    "Detectamos automaticamente quando alguém marca ponto mas não está presente, ou vice-versa.",
    "É simples: instalação em minutos, detecção automática, alertas em tempo real. ✅",
  ],
  savings: [
    "Empresas economizam em média R$ 15.000/mês detectando horas extras indevidas.",
    "A média de fraude em ponto no Brasil é de 17%. Com o Wavetrack, você detecta 85% desses casos.",
    "Quer calcular quanto sua empresa pode economizar? Use nossa calculadora de ROI acima! 📊",
  ],
  trial: [
    "Sim! Oferecemos 14 dias de teste grátis, sem necessidade de cartão de crédito.",
    "O teste grátis inclui todas as funcionalidades do plano Professional por 14 dias.",
    "Quer começar o teste agora? Posso te direcionar para o cadastro! 🚀",
  ],
  lgpd: [
    "Somos 100% LGPD compliant! Dados criptografados, anonimizados e armazenados em servidores brasileiros.",
    "Não rastreamos localização GPS nem mensagens. Apenas presença na rede WiFi corporativa.",
    "Temos certificação ISO 27001 e auditoria de segurança regular. 🔒",
  ],
  integration: [
    "Integramos com os principais sistemas de ponto: Ahgora, Pontomais, Tangerino, Secullum e outros.",
    "Também temos API REST para integração customizada com seu sistema interno.",
    "A instalação leva menos de 15 minutos! 🔌",
  ],
  fraud: [
    "Os casos mais comuns: marcar ponto e sair cedo, chegar tarde mas marcar no horário, horas extras falsas.",
    "Com evidências WiFi, você tem prova sólida para questões trabalhistas.",
    "Já evitamos mais de R$ 2.4M em fraudes este mês! 🛡️",
  ],
  support: [
    "Oferecemos suporte por email, chat e telefone (planos Professional e Enterprise).",
    "Temos onboarding completo com especialista dedicado.",
    "SLA de resposta: 2h (Professional) e 30min (Enterprise). ⚡",
  ],
};

function initChatbot() {
  const chatBody = document.getElementById("chatbotBody");
  if (!chatBody) return;

  // Add welcome message
  setTimeout(() => {
    addChatMessage(getRandomResponse("greeting"), "bot");
    addQuickReplies();
  }, 1000);

  // Add enter key support
  const chatInput = document.getElementById("chatInput");
  if (chatInput) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        sendChatMessage();
      }
    });
  }

  // Track chatbot open
  trackEvent("chatbot_opened");
}

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  if (!input || !input.value.trim()) return;

  const message = input.value.trim();
  input.value = "";

  // Add user message
  addChatMessage(message, "user");

  // Get bot response
  const response = getBotResponse(message);

  // Simulate typing delay
  setTimeout(() => {
    showTypingIndicator();
    setTimeout(
      () => {
        hideTypingIndicator();
        addChatMessage(response, "bot");

        // Sometimes add quick replies
        if (Math.random() > 0.5) {
          addQuickReplies();
        }
      },
      1000 + Math.random() * 1000,
    );
  }, 300);

  // Track message
  trackEvent("chat_message_sent", { message });
}

function getBotResponse(message) {
  const lowerMessage = message.toLowerCase();

  // Keywords mapping
  const keywordMap = {
    pricing: ["preço", "quanto custa", "valor", "plano", "custo"],
    howItWorks: ["funciona", "como", "trabalha", "detecta"],
    savings: ["economia", "economizar", "poupar", "reduz"],
    trial: ["teste", "grátis", "experimentar", "trial"],
    lgpd: ["lgpd", "privacidade", "dados", "segurança", "seguro"],
    integration: ["integra", "compatível", "sistema", "instala"],
    fraud: ["fraude", "golpe", "burlar", "evidência"],
    support: ["suporte", "ajuda", "atendimento", "contato"],
  };

  // Find matching scenario
  for (const [scenario, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((keyword) => lowerMessage.includes(keyword))) {
      return getRandomResponse(scenario);
    }
  }

  // Default responses
  const defaultResponses = [
    "Interessante! Nossa equipe pode responder isso em detalhes. Quer agendar uma demonstração? 📅",
    "Boa pergunta! Posso conectar você com um especialista. Deixe seu email? 📧",
    "Não encontrei uma resposta específica, mas posso te mostrar como o Wavetrack resolve isso na prática! 💡",
  ];

  return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
}

function getRandomResponse(scenario) {
  const responses = chatbotScenarios[scenario] || chatbotScenarios.greeting;
  return responses[Math.floor(Math.random() * responses.length)];
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

function addQuickReplies() {
  const chatBody = document.getElementById("chatbotBody");
  if (!chatBody) return;

  const quickReplies = [
    "Quanto custa?",
    "Como funciona?",
    "Quero testar grátis",
    "É seguro?",
  ];

  const repliesDiv = document.createElement("div");
  repliesDiv.className = "quick-replies";
  repliesDiv.style.cssText = `
        display: flex;
        flex-wrap: wrap;
        gap: 0.5rem;
        margin: 0.5rem 0;
    `;

  quickReplies.forEach((reply) => {
    const button = document.createElement("button");
    button.textContent = reply;
    button.style.cssText = `
            padding: 0.5rem 1rem;
            background: white;
            border: 2px solid #2563eb;
            color: #2563eb;
            border-radius: 20px;
            font-size: 0.75rem;
            cursor: pointer;
            transition: all 0.3s ease;
        `;
    button.onclick = () => {
      document.getElementById("chatInput").value = reply;
      sendChatMessage();
      repliesDiv.remove();
    };

    button.onmouseover = () => {
      button.style.background = "#2563eb";
      button.style.color = "white";
    };

    button.onmouseout = () => {
      button.style.background = "white";
      button.style.color = "#2563eb";
    };

    repliesDiv.appendChild(button);
  });

  chatBody.appendChild(repliesDiv);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function showTypingIndicator() {
  const chatBody = document.getElementById("chatbotBody");
  if (!chatBody) return;

  const indicator = document.createElement("div");
  indicator.className = "typing-indicator";
  indicator.style.cssText = `
        padding: 0.5rem 1rem;
        background: #f1f5f9;
        border-radius: 8px;
        max-width: 80%;
        align-self: flex-start;
    `;
  indicator.innerHTML =
    '<span style="animation: pulse 1.5s infinite;">...</span>';

  chatBody.appendChild(indicator);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function hideTypingIndicator() {
  const indicator = document.querySelector(".typing-indicator");
  if (indicator) {
    indicator.remove();
  }
}

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    getBotResponse,
    chatbotScenarios,
  };
}
