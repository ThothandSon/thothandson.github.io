// ==========================================
// Quiz - Diagnostic Assessment
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initQuiz();
});

const quizQuestions = [
  {
    id: 1,
    question: "Qual o tamanho da sua empresa?",
    options: [
      { text: "Menos de 20 funcionários", value: 1, risk: "low" },
      { text: "20-50 funcionários", value: 2, risk: "medium" },
      { text: "51-100 funcionários", value: 3, risk: "high" },
      { text: "Mais de 100 funcionários", value: 4, risk: "high" },
    ],
  },
  {
    id: 2,
    question: "Quanto sua empresa gasta com horas extras por mês?",
    options: [
      { text: "Menos de R$ 5.000", value: 1, risk: "low" },
      { text: "R$ 5.000 - R$ 15.000", value: 2, risk: "medium" },
      { text: "R$ 15.000 - R$ 30.000", value: 3, risk: "high" },
      { text: "Mais de R$ 30.000", value: 4, risk: "high" },
    ],
  },
  {
    id: 3,
    question: "Já identificou casos de fraude no ponto?",
    options: [
      { text: "Nunca", value: 1, risk: "low" },
      { text: "Suspeitas, mas sem provas", value: 3, risk: "medium" },
      { text: "Sim, casos comprovados", value: 4, risk: "high" },
      { text: "Não sei dizer", value: 2, risk: "medium" },
    ],
  },
  {
    id: 4,
    question: "Como você controla a presença real dos funcionários?",
    options: [
      { text: "Apenas pelo sistema de ponto", value: 4, risk: "high" },
      { text: "Controle manual/visual", value: 3, risk: "medium" },
      { text: "Sistema de ponto + câmeras", value: 2, risk: "low" },
      { text: "Não controlamos efetivamente", value: 5, risk: "high" },
    ],
  },
];

let currentQuestion = 0;
let quizAnswers = [];

function initQuiz() {
  const container = document.getElementById("quizContainer");
  if (!container) return;

  renderQuestion();

  // Track quiz start
  trackEvent("quiz_started");
}

function renderQuestion() {
  const container = document.getElementById("quizContainer");
  if (!container || currentQuestion >= quizQuestions.length) return;

  const question = quizQuestions[currentQuestion];

  const html = `
        <div class="quiz-question">
            <div style="text-align: center; margin-bottom: 1rem;">
                <span style="color: #64748b; font-size: 0.875rem;">
                    Pergunta ${currentQuestion + 1} de ${quizQuestions.length}
                </span>
            </div>
            <h3>${question.question}</h3>
            <div class="quiz-options">
                ${question.options
                  .map(
                    (option, index) => `
                    <div class="quiz-option" onclick="selectQuizOption(${index})">
                        ${option.text}
                    </div>
                `,
                  )
                  .join("")}
            </div>
        </div>
        <div style="margin-top: 1rem; text-align: center;">
            <div style="display: flex; gap: 0.5rem; justify-content: center;">
                ${Array(quizQuestions.length)
                  .fill(0)
                  .map(
                    (_, i) => `
                    <div style="width: 40px; height: 4px; background: ${i <= currentQuestion ? "#2563eb" : "#e2e8f0"}; border-radius: 2px;"></div>
                `,
                  )
                  .join("")}
            </div>
        </div>
    `;

  container.innerHTML = html;
}

function selectQuizOption(optionIndex) {
  const question = quizQuestions[currentQuestion];
  const selectedOption = question.options[optionIndex];

  // Save answer
  quizAnswers.push({
    questionId: question.id,
    answer: selectedOption,
  });

  // Track answer
  trackEvent("quiz_question_answered", {
    question: currentQuestion + 1,
    answer: selectedOption.text,
  });

  // Move to next question or show results
  currentQuestion++;

  if (currentQuestion < quizQuestions.length) {
    setTimeout(() => renderQuestion(), 300);
  } else {
    setTimeout(() => showQuizResults(), 500);
  }
}

function showQuizResults() {
  const container = document.getElementById("quizContainer");
  if (!container) return;

  // Calculate risk score
  const totalRisk = quizAnswers.reduce(
    (sum, answer) => sum + answer.answer.value,
    0,
  );
  const maxRisk = quizQuestions.length * 5;
  const riskPercentage = (totalRisk / maxRisk) * 100;

  let riskLevel, riskEmoji, riskColor, riskMessage, estimatedSavings;

  if (riskPercentage < 40) {
    riskLevel = "Baixo";
    riskEmoji = "✅";
    riskColor = "#10b981";
    riskMessage =
      "Sua empresa parece ter bom controle de presença, mas ainda há espaço para otimização.";
    estimatedSavings = "R$ 2.000 - R$ 5.000";
  } else if (riskPercentage < 70) {
    riskLevel = "Médio";
    riskEmoji = "⚠️";
    riskColor = "#f59e0b";
    riskMessage =
      "Existem vulnerabilidades no seu sistema de ponto que podem estar custando caro.";
    estimatedSavings = "R$ 5.000 - R$ 15.000";
  } else {
    riskLevel = "Alto";
    riskEmoji = "🚨";
    riskColor = "#ef4444";
    riskMessage =
      "Sua empresa está em zona de risco! Fraudes de ponto podem estar custando milhares por mês.";
    estimatedSavings = "R$ 15.000 - R$ 40.000";
  }

  const html = `
        <div class="quiz-result">
            <div class="risk-level" style="color: ${riskColor};">
                ${riskEmoji}
            </div>
            <h3 style="font-size: 1.75rem; margin-bottom: 0.5rem;">
                Nível de Risco: <span style="color: ${riskColor};">${riskLevel}</span>
            </h3>
            <p style="color: #64748b; margin-bottom: 1.5rem;">
                ${riskMessage}
            </p>
            <div style="background: #f1f5f9; padding: 1.5rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.5rem;">
                    Economia Potencial Mensal
                </div>
                <div style="font-size: 2rem; font-weight: 800; color: #2563eb;">
                    ${estimatedSavings}
                </div>
            </div>
            <div style="display: flex; flex-direction: column; gap: 0.75rem;">
                <button class="btn btn-primary" onclick="openLeadForm('quiz')">
                    🎯 Quero Economizar Agora
                </button>
                <button class="btn btn-secondary" onclick="restartQuiz()">
                    🔄 Refazer Diagnóstico
                </button>
            </div>
        </div>
    `;

  container.innerHTML = html;

  // Track completion
  trackEvent("quiz_completed", {
    riskLevel,
    riskPercentage: Math.round(riskPercentage),
    estimatedSavings,
  });
}

function restartQuiz() {
  currentQuestion = 0;
  quizAnswers = [];
  renderQuestion();
  trackEvent("quiz_restarted");
}

// Make functions globally available
window.selectQuizOption = selectQuizOption;
window.restartQuiz = restartQuiz;

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    quizQuestions,
    selectQuizOption,
    showQuizResults,
  };
}
