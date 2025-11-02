# Wavetrack - Landing Page

Landing page interativa para o SaaS Wavetrack, um sistema de auditoria inteligente de ponto via WiFi.

## 📋 Funcionalidades Implementadas

### ✅ Estrutura HTML Completa

- Header com navegação
- Hero section com stats animados
- Barra de social proof dinâmico
- 6 seções principais de features
- Mapa de calor de presença
- Slider de comparação antes/depois
- Quiz de diagnóstico (4 perguntas)
- Feed de alertas em tempo real
- Pricing com 3 planos
- Footer completo
- Modal de lead form multi-step
- Widget de chatbot

### 🎨 Design & Estilo

- **CSS moderno** com variáveis e design system
- **Responsivo** mobile-first (breakpoints: 480px, 768px)
- **Animações suaves** com scroll reveal, hover effects
- **Paleta profissional** para SaaS B2B:
  - Primary: #2563eb (Blue)
  - Secondary: #10b981 (Green)
  - Accent: #f59e0b (Orange)
  - Dark: #1e293b
- **Tipografia**: Inter (Google Fonts)
- **Efeitos**: Gradientes, shadows, transitions

### 🎯 Interatividade JavaScript

#### 1. Calculadora de ROI (`roi-calculator.js`)

- Inputs: funcionários, salário/hora, horas extras
- Cálculo em tempo real com debounce
- Animação de números com easing
- Formatação em R$ (Intl.NumberFormat)
- Assume 17% de fraude (média do mercado)
- Taxa de detecção: 85%

#### 2. Mapa de Calor (`heatmap.js`)

- Visualização semanal de presença
- Barras animadas com cores (danger/warning/primary)
- Tooltip com detalhes ao hover
- Alerta de dias com maior discrepância

#### 3. Slider de Comparação (`comparison.js`)

- Range slider 0-100
- Opacidade e escala dinâmicas
- Gradient no slider track
- Mostra métricas antes/depois

#### 4. Quiz de Diagnóstico (`quiz.js`)

- 4 perguntas multi-opção
- Cálculo de nível de risco (Baixo/Médio/Alto)
- Estimativa de economia personalizada
- Progress bar animado
- CTA contextual ao final

#### 5. Feed de Alertas (`alerts.js`)

- 4 tipos de alertas (discrepância, device, fraud, savings)
- Atualização automática a cada 12s
- Timestamp simulado
- Máximo de 10 alertas visíveis
- Pausa quando tab não está ativa (performance)

#### 6. Chatbot (`chatbot.js`)

- 8 cenários de resposta (pricing, howItWorks, savings, trial, lgpd, integration, fraud, support)
- Quick replies com botões
- Indicador de "digitando..."
- Detecção de keywords
- Enter para enviar mensagem

#### 7. Lead Form (`lead-form.js`)

- Multi-step (3 etapas)
- Validação em tempo real
- Progress bar
- Mensagens de erro
- Simulação de API call
- Tela de sucesso animada

#### 8. Analytics (`analytics.js`)

- Page view tracking
- Scroll depth (25%, 50%, 75%, 100%)
- Time on page (30s, 1min, 2min, 5min)
- CTA click tracking
- Exit intent detection
- Social proof ticker (atualiza a cada 20s)
- Notificações popup de novos cadastros
- Preparado para Google Analytics, Facebook Pixel, Mixpanel

### 📊 Tracking de Eventos

```javascript
// Eventos rastreados:
-page_view -
  scroll_depth -
  time_on_page -
  cta_clicked -
  exit_intent_detected -
  roi_calculated -
  heatmap_viewed -
  comparison_slider_moved -
  quiz_started -
  quiz_question_answered -
  quiz_completed -
  live_alert_generated -
  chat_message_sent -
  chatbot_opened -
  lead_form_opened -
  lead_form_step_completed -
  lead_submitted -
  social_proof_shown;
```

## 🗂️ Estrutura de Arquivos

```
saas/wavetrack/
├── index.html          # HTML principal
├── css/
│   └── style.css       # Estilos completos (~800 linhas)
└── js/
    ├── main.js         # Inicialização e utilitários
    ├── roi-calculator.js
    ├── heatmap.js
    ├── comparison.js
    ├── quiz.js
    ├── alerts.js
    ├── chatbot.js
    ├── lead-form.js
    └── analytics.js
```

## 🚀 Como Usar

1. **Abrir localmente**: Basta abrir `index.html` no navegador
2. **GitHub Pages**: Já pronto para deploy (sem backend necessário)
3. **Personalizações**:
   - Cores: Editar variáveis CSS em `:root`
   - Textos: Diretamente no HTML
   - Analytics: Adicionar IDs de Google Analytics/Mixpanel em `analytics.js`
   - EmailJS: Configurar envio de leads conforme abaixo

### Configurando EmailJS (sem backend)

Esta página já inclui o SDK do EmailJS e integra o formulário de leads. Há três formas de configurar as credenciais:

1. Via meta tags (recomendado para esta página):

Adicione seus IDs no `index.html`:

```html
<meta name="emailjs-service-id" content="SEU_SERVICE_ID" />
<meta name="emailjs-template-id" content="SEU_TEMPLATE_ID" />
<meta name="emailjs-public-key" content="SUA_PUBLIC_KEY" />
```

2. Herdando do site (se usar layout Jekyll global):

Se esta página usar `layout: default`, o `js/main.js` da raiz expõe `window.EMAILJS_CONFIG` e a integração funcionará automaticamente.

3. Via localStorage (útil para testes locais):

No console do navegador:

```js
localStorage.setItem("emailjs_service_id", "SEU_SERVICE_ID");
localStorage.setItem("emailjs_template_id", "SEU_TEMPLATE_ID");
localStorage.setItem("emailjs_public_key", "SUA_PUBLIC_KEY");
```

Campos enviados ao template:

```json
{
  "from_name": "Nome do lead",
  "from_email": "Email",
  "reply_to": "Email para resposta",
  "company": "Empresa",
  "phone": "Telefone",
  "company_size": "Tamanho",
  "overtime_spend": "Gasto com horas extras",
  "plan": "Plano selecionado",
  "source": "wavetrack-landing",
  "product": "wavetrack",
  "product_slug": "wavetrack",
  "subject": "[Wavetrack] Novo Lead - Plano: ...",
  "page_url": "URL da página",
  "page_title": "Título da página",
  "timestamp": "ISO string"
}
```

## 🔧 Integrações Preparadas

### Backend/CRM (TODO)

```javascript
// Em lead-form.js, linha ~180
function submitLeadForm() {
  // Descomentar para enviar ao backend:
  // fetch('/api/leads', {
  //     method: 'POST',
  //     headers: { 'Content-Type': 'application/json' },
  //     body: JSON.stringify(leadData)
  // });
}
```

### Google Analytics

```javascript
// Já preparado em analytics.js
if (typeof gtag !== "undefined") {
  gtag("event", eventName, eventData);
}
```

### Facebook Pixel

```javascript
if (typeof fbq !== "undefined") {
  fbq("track", eventName, eventData);
}
```

## 📱 Responsividade

- **Desktop** (1200px+): Layout completo em 2-3 colunas
- **Tablet** (768px-1199px): Grid responsivo, 2 colunas
- **Mobile** (320px-767px): Coluna única, menu simplificado

## ⚡ Performance

- CSS puro (sem frameworks)
- JavaScript vanilla (sem jQuery)
- Lazy loading preparado (TODO)
- Debounce em eventos de scroll/input
- Otimizado para Lighthouse audit

## 🎯 Otimizações de Conversão

1. **Hero**: Proposta de valor clara + stats sociais
2. **ROI Calculator**: Engajamento interativo + valor concreto
3. **Social Proof**: Ticker + notificações popup
4. **Urgência**: Alertas em tempo real
5. **Prova**: Comparação antes/depois
6. **Qualificação**: Quiz para leads qualificados
7. **Multi-touch**: Chatbot sempre disponível
8. **Low friction**: Lead form multi-step
9. **Trust**: LGPD, certificações, casos de uso
10. **Exit intent**: (preparado para popup de retenção)

## 📈 Próximas Melhorias

- [ ] Integrar com backend real
- [ ] Adicionar lazy loading de imagens
- [ ] Implementar exit intent popup
- [ ] A/B testing de headlines
- [ ] Adicionar depoimentos em vídeo
- [ ] Integrar chat ao vivo (Intercom/Drift)
- [ ] Adicionar calculadora de ROI PDF download
- [ ] Implementar pixel de remarketing

## 🛠️ Tecnologias

- HTML5 semântico
- CSS3 (Grid, Flexbox, Custom Properties)
- JavaScript ES6+ (Classes, Arrow Functions, Template Literals)
- Google Fonts (Inter)
- Intersection Observer API
- LocalStorage para dados temporários

## 📄 Licença

© 2025 Wavetrack by Thoth & Son. Todos os direitos reservados.

---

**Desenvolvido por**: Lucas Rafaldini
**Data**: Outubro 2025
**Status**: ✅ Produção Ready
