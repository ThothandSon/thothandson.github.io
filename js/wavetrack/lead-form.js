// ==========================================
// Lead Form - Multi-step Capture
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initLeadForm();
});

let currentStep = 1;
const totalSteps = 3;
const leadData = {};

function initLeadForm() {
  renderLeadForm();
}

function renderLeadForm() {
  const form = document.getElementById("leadForm");
  if (!form) return;

  let stepHTML = "";

  switch (currentStep) {
    case 1:
      stepHTML = `
                <div class="form-step">
                    <h3 style="margin-bottom: 1rem;">📧 Informações Básicas</h3>
                    <div class="input-group">
                        <label for="lead-name">Nome Completo *</label>
                        <input type="text" id="lead-name" required placeholder="João Silva">
                    </div>
                    <div class="input-group">
                        <label for="lead-email">Email Corporativo *</label>
                        <input type="email" id="lead-email" required placeholder="joao@empresa.com.br">
                    </div>
                </div>
            `;
      break;

    case 2:
      stepHTML = `
                <div class="form-step">
                    <h3 style="margin-bottom: 1rem;">🏢 Informações da Empresa</h3>
                    <div class="input-group">
                        <label for="lead-company">Nome da Empresa *</label>
                        <input type="text" id="lead-company" required placeholder="Empresa LTDA">
                    </div>
                    <div class="input-group">
                        <label for="lead-phone">Telefone *</label>
                        <input type="tel" id="lead-phone" required placeholder="(11) 99999-9999">
                    </div>
                </div>
            `;
      break;

    case 3:
      stepHTML = `
                <div class="form-step">
                    <h3 style="margin-bottom: 1rem;">👥 Tamanho da Empresa</h3>
                    <div class="input-group">
                        <label for="lead-size">Quantos funcionários? *</label>
                        <select id="lead-size" required style="padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; width: 100%;">
                            <option value="">Selecione...</option>
                            <option value="1-20">1-20 funcionários</option>
                            <option value="21-50">21-50 funcionários</option>
                            <option value="51-100">51-100 funcionários</option>
                            <option value="101-500">101-500 funcionários</option>
                            <option value="500+">Mais de 500 funcionários</option>
                        </select>
                    </div>
                    <div class="input-group">
                        <label for="lead-overtime">Gasto mensal com horas extras (aprox.)</label>
                        <select id="lead-overtime" style="padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; width: 100%;">
                            <option value="">Selecione...</option>
                            <option value="< 5k">Menos de R$ 5.000</option>
                            <option value="5k-15k">R$ 5.000 - R$ 15.000</option>
                            <option value="15k-30k">R$ 15.000 - R$ 30.000</option>
                            <option value="30k+">Mais de R$ 30.000</option>
                        </select>
                    </div>
                </div>
            `;
      break;
  }

  const progressHTML = `
        <div style="margin-bottom: 1.5rem;">
            <div style="display: flex; gap: 0.5rem; margin-bottom: 0.5rem;">
                ${Array(totalSteps)
                  .fill(0)
                  .map(
                    (_, i) => `
                    <div style="flex: 1; height: 4px; background: ${i < currentStep ? "#2563eb" : "#e2e8f0"}; border-radius: 2px;"></div>
                `,
                  )
                  .join("")}
            </div>
            <div style="text-align: center; color: #64748b; font-size: 0.875rem;">
                Etapa ${currentStep} de ${totalSteps}
            </div>
        </div>
    `;

  const buttonsHTML = `
        <div style="display: flex; gap: 1rem; margin-top: 1.5rem;">
            ${
              currentStep > 1
                ? `
                <button type="button" class="btn btn-secondary" onclick="previousStep()" style="flex: 1;">
                    ← Voltar
                </button>
            `
                : ""
            }
            <button type="button" class="btn btn-primary" onclick="nextStep()" style="flex: 1;">
                ${currentStep === totalSteps ? "🚀 Iniciar Teste Grátis" : "Continuar →"}
            </button>
        </div>
    `;

  form.innerHTML = progressHTML + stepHTML + buttonsHTML;
}

function nextStep() {
  // Validate current step
  if (!validateCurrentStep()) {
    return;
  }

  // Save data from current step
  saveStepData();

  if (currentStep < totalSteps) {
    currentStep++;
    renderLeadForm();
    trackEvent("lead_form_step_completed", { step: currentStep - 1 });
  } else {
    submitLeadForm();
  }
}

function previousStep() {
  if (currentStep > 1) {
    currentStep--;
    renderLeadForm();
  }
}

function validateCurrentStep() {
  const inputs = document.querySelectorAll(
    ".form-step input[required], .form-step select[required]",
  );
  let isValid = true;

  inputs.forEach((input) => {
    if (!input.value.trim()) {
      input.style.borderColor = "#ef4444";
      isValid = false;

      // Add error message if not exists
      if (
        !input.nextElementSibling ||
        !input.nextElementSibling.classList.contains("error-message")
      ) {
        const error = document.createElement("div");
        error.className = "error-message";
        error.style.cssText =
          "color: #ef4444; font-size: 0.75rem; margin-top: 0.25rem;";
        error.textContent = "Este campo é obrigatório";
        input.parentNode.appendChild(error);
      }
    } else {
      input.style.borderColor = "#e2e8f0";

      // Remove error message
      const error = input.parentNode.querySelector(".error-message");
      if (error) {
        error.remove();
      }
    }
  });

  return isValid;
}

function saveStepData() {
  switch (currentStep) {
    case 1:
      leadData.name = document.getElementById("lead-name")?.value;
      leadData.email = document.getElementById("lead-email")?.value;
      break;
    case 2:
      leadData.company = document.getElementById("lead-company")?.value;
      leadData.phone = document.getElementById("lead-phone")?.value;
      break;
    case 3:
      leadData.size = document.getElementById("lead-size")?.value;
      leadData.overtime = document.getElementById("lead-overtime")?.value;
      break;
  }
}

function submitLeadForm() {
  const form = document.getElementById("leadForm");
  if (!form) return;

  // Get selected plan from session storage
  leadData.plan = sessionStorage.getItem("selectedPlan") || "not-selected";
  leadData.timestamp = new Date().toISOString();
  leadData.source = "wavetrack-landing";
  leadData.product = "wavetrack";

  // Show loading state
  form.innerHTML = `
        <div style="text-align: center; padding: 2rem 0;">
            <div style="font-size: 3rem; margin-bottom: 1rem;">⏳</div>
            <p>Enviando seus dados com segurança...</p>
        </div>
    `;

  // Try to send via EmailJS
  sendLeadViaEmailJS(leadData)
    .then(() => {
      showSuccessMessage();
      trackEvent("lead_submitted", leadData);
      console.log("Lead captured via EmailJS:", leadData);
    })
    .catch((err) => {
      console.error("EmailJS error:", err);
      form.innerHTML = `
                <div style="text-align: center; padding: 2rem 0;">
                    <div style="font-size: 3rem; margin-bottom: 1rem;">❌</div>
                    <h3 style="color: #ef4444; margin-bottom: 0.5rem;">Não foi possível enviar agora</h3>
                    <p style="color: #64748b; margin-bottom: 1rem;">Tente novamente em instantes ou envie um email para contato@wavetrack.com.br</p>
                    <div style="display: flex; gap: 0.75rem; justify-content: center;">
                        <button class="btn btn-secondary" onclick="closeLeadForm()">Fechar</button>
                        <button class="btn btn-primary" onclick="renderLeadForm()">Tentar Novamente</button>
                    </div>
                </div>
            `;
    });
}

function showSuccessMessage() {
  const form = document.getElementById("leadForm");
  if (!form) return;

  form.innerHTML = `
        <div style="text-align: center; padding: 2rem 0;">
            <div style="font-size: 4rem; margin-bottom: 1rem;">🎉</div>
            <h3 style="color: #10b981; margin-bottom: 1rem;">Cadastro Concluído!</h3>
            <p style="color: #64748b; margin-bottom: 1.5rem;">
                Enviamos as instruções de acesso para <strong>${leadData.email}</strong>
            </p>
            <div style="background: #f1f5f9; padding: 1rem; border-radius: 8px; margin-bottom: 1.5rem;">
                <div style="font-size: 0.875rem; color: #64748b; margin-bottom: 0.25rem;">
                    Próximos passos:
                </div>
                <div style="text-align: left; margin-top: 0.75rem;">
                    <div style="margin-bottom: 0.5rem;">✅ Check seu email</div>
                    <div style="margin-bottom: 0.5rem;">✅ Agende o onboarding</div>
                    <div>✅ Comece a economizar!</div>
                </div>
            </div>
            <button class="btn btn-primary" onclick="closeLeadForm()">
                Entendido
            </button>
        </div>
    `;

  // Reset form state
  currentStep = 1;
  Object.keys(leadData).forEach((key) => delete leadData[key]);
}

// Make functions globally available
window.nextStep = nextStep;
window.previousStep = previousStep;
window.renderLeadForm = renderLeadForm;

// ==========================================
// EmailJS Integration
// ==========================================

function getEmailJSConfig() {
  // 1) Try global config (if provided by site main.js)
  if (typeof window !== "undefined" && window.EMAILJS_CONFIG) {
    return {
      serviceId:
        window.EMAILJS_CONFIG.serviceID || window.EMAILJS_CONFIG.serviceId,
      templateId:
        window.EMAILJS_CONFIG.templateID || window.EMAILJS_CONFIG.templateId,
      publicKey:
        window.EMAILJS_CONFIG.publicKey || window.EMAILJS_CONFIG.PUBLIC_KEY,
    };
  }

  // 2) Try meta tags in page
  const serviceMeta = document.querySelector('meta[name="emailjs-service-id"]');
  const templateMeta = document.querySelector(
    'meta[name="emailjs-template-id"]',
  );
  const publicMeta = document.querySelector('meta[name="emailjs-public-key"]');
  if (
    serviceMeta &&
    templateMeta &&
    publicMeta &&
    serviceMeta.content &&
    templateMeta.content &&
    publicMeta.content
  ) {
    return {
      serviceId: serviceMeta.content,
      templateId: templateMeta.content,
      publicKey: publicMeta.content,
    };
  }

  // 3) Try localStorage (manual dev config)
  const lsService = localStorage.getItem("emailjs_service_id");
  const lsTemplate = localStorage.getItem("emailjs_template_id");
  const lsPublic = localStorage.getItem("emailjs_public_key");
  if (lsService && lsTemplate && lsPublic) {
    return {
      serviceId: lsService,
      templateId: lsTemplate,
      publicKey: lsPublic,
    };
  }

  return null;
}

async function sendLeadViaEmailJS(data) {
  return new Promise((resolve, reject) => {
    if (typeof emailjs === "undefined") {
      return reject(new Error("EmailJS SDK não carregado"));
    }

    const cfg = getEmailJSConfig();
    if (!cfg || !cfg.serviceId || !cfg.templateId || !cfg.publicKey) {
      return reject(
        new Error(
          "Configuração do EmailJS ausente. Preencha as meta tags ou configure EMAILJS_CONFIG.",
        ),
      );
    }

    try {
      // Initialize (idempotent)
      emailjs.init(cfg.publicKey);

      // Map template params
      const params = {
        from_name: data.name || "",
        from_email: data.email || "",
        reply_to: data.email || "",
        company: data.company || "",
        phone: data.phone || "",
        company_size: data.size || "",
        overtime_spend: data.overtime || "",
        plan: data.plan || "",
        source: data.source || "wavetrack-landing",
        product: data.product || "wavetrack",
        product_slug: "wavetrack",
        subject: `[Wavetrack] Novo Lead - Plano: ${data.plan || "não informado"}`,
        page_url: typeof window !== "undefined" ? window.location.href : "",
        page_title: typeof document !== "undefined" ? document.title : "",
        timestamp: data.timestamp || new Date().toISOString(),
      };

      emailjs
        .send(cfg.serviceId, cfg.templateId, params, cfg.publicKey)
        .then(resolve)
        .catch(reject);
    } catch (e) {
      reject(e);
    }
  });
}

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    validateCurrentStep,
    saveStepData,
    submitLeadForm,
  };
}
