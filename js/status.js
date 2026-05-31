/* ============================================================
   Thoth & Son — Status page client
   ─────────────────────────────────────────────────────────────
   Health checks reais via StatusPage.io API onde disponível,
   link para a página oficial quando não.
   Ícones via cdn.simpleicons.org (CC0); fallback para monograma
   inline SVG quando o serviço não tem ícone disponível.
   ============================================================ */
(function () {
  'use strict';

  // ── Configuração por serviço ────────────────────────────────
  // icon       : slug simpleicons.org (ou null para usar monograma)
  // monogram   : 2 letras para fallback estilizado
  // statusApi  : endpoint StatusPage.io v2 (opcional)
  // statusUrl  : página de status oficial (sempre exibida como link)
  const SERVICES = {
    'apple-music':      { icon: 'applemusic',    monogram: 'AM',
                          statusUrl: 'https://www.apple.com/support/systemstatus/' },
    'aws':              { icon: null,            monogram: 'AW',
                          statusUrl: 'https://health.aws.amazon.com/health/status' },
    'chatgpt':          { icon: null,            monogram: 'GP',
                          statusApi: 'https://status.openai.com/api/v2/status.json',
                          statusUrl: 'https://status.openai.com/' },
    'cloudflare':       { icon: 'cloudflare',    monogram: 'CF',
                          statusApi: 'https://www.cloudflarestatus.com/api/v2/status.json',
                          statusUrl: 'https://www.cloudflarestatus.com/' },
    'confluence':       { icon: 'confluence',    monogram: 'CO',
                          statusApi: 'https://status.atlassian.com/api/v2/status.json',
                          statusUrl: 'https://status.atlassian.com/' },
    'deepseek':         { icon: 'deepseek',      monogram: 'DS',
                          statusApi: 'https://status.deepseek.com/api/v2/status.json',
                          statusUrl: 'https://status.deepseek.com/' },
    'github':           { icon: 'github',        monogram: 'GH',
                          statusApi: 'https://www.githubstatus.com/api/v2/status.json',
                          statusUrl: 'https://www.githubstatus.com/' },
    'gmail':            { icon: 'gmail',         monogram: 'GM',
                          statusUrl: 'https://www.google.com/appsstatus/dashboard/' },
    'google-meet':      { icon: 'googlemeet',    monogram: 'GM',
                          statusUrl: 'https://www.google.com/appsstatus/dashboard/' },
    'jira':             { icon: 'jira',          monogram: 'JR',
                          statusApi: 'https://status.atlassian.com/api/v2/status.json',
                          statusUrl: 'https://status.atlassian.com/' },
    'linkedin':         { icon: null,            monogram: 'LI',
                          statusUrl: 'https://www.linkedin.com/help/linkedin' },
    'microsoft-teams':  { icon: null,            monogram: 'MT',
                          statusUrl: 'https://portal.office.com/servicestatus' },
    'miro':             { icon: 'miro',          monogram: 'MI',
                          statusApi: 'https://status.miro.com/api/v2/status.json',
                          statusUrl: 'https://status.miro.com/' },
    'slack':            { icon: null,            monogram: 'SL',
                          statusApi: 'https://status.slack.com/api/v2.0.0/current',
                          statusUrl: 'https://status.slack.com/' },
    'spotify':          { icon: 'spotify',       monogram: 'SP',
                          statusUrl: 'https://status.spotify.dev/' },
    'telegram':         { icon: 'telegram',      monogram: 'TG',
                          statusUrl: 'https://core.telegram.org/' },
    'whatsapp':         { icon: 'whatsapp',      monogram: 'WA',
                          statusUrl: 'https://www.facebook.com/business/help/whatsapp' },
    'youtube':          { icon: 'youtube',       monogram: 'YT',
                          statusUrl: 'https://www.google.com/appsstatus/dashboard/' },
  };

  // ── Helpers ─────────────────────────────────────────────────
  const cards = Array.from(document.querySelectorAll('.status-card[data-service]'));
  if (cards.length === 0) return;

  const timeEl     = document.getElementById('last-updated-time');
  const refreshBtn = document.getElementById('refresh-all');

  function mapIndicator(ind) {
    switch (ind) {
      case 'none':     return { cls: 'operational', label: 'Operacional' };
      case 'minor':    return { cls: 'degraded',    label: 'Degradado'   };
      case 'major':    return { cls: 'partial',     label: 'Parcial'     };
      case 'critical': return { cls: 'down',        label: 'Fora do ar'  };
      default:         return { cls: 'operational', label: 'Operacional' };
    }
  }

  function fmtTime(d) {
    return d.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit', second: '2-digit',
      timeZone: 'America/Sao_Paulo',
    }) + ' BRT';
  }

  // ── Monograma SVG (fallback estilizado on-brand) ─────────────
  function makeMonogram(letters) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'status-card-logo');
    svg.setAttribute('viewBox', '0 0 22 22');
    svg.setAttribute('width', '22');
    svg.setAttribute('height', '22');
    svg.setAttribute('aria-hidden', 'true');
    svg.innerHTML =
      '<rect x="0.6" y="0.6" width="20.8" height="20.8" fill="none" ' +
        'stroke="#C8A030" stroke-width="0.9" opacity="0.65"/>' +
      '<text x="11" y="11" text-anchor="middle" dominant-baseline="central" ' +
        'font-family="Cormorant SC, Georgia, serif" font-size="9" font-weight="400" ' +
        'fill="#C8A030" letter-spacing="0.5">' +
        letters +
      '</text>';
    return svg;
  }

  // ── Injeta logo (com fallback) e link em cada card ───────────
  function enrichCards() {
    cards.forEach((card) => {
      const slug = card.dataset.service;
      const cfg = SERVICES[slug];
      if (!cfg) return;

      if (!card.querySelector('.status-card-logo')) {
        if (cfg.icon) {
          // Tenta simpleicons; fallback para monograma se quebrar
          const img = document.createElement('img');
          img.className = 'status-card-logo';
          img.src = `https://cdn.simpleicons.org/${cfg.icon}/C8A030`;
          img.alt = '';
          img.loading = 'lazy';
          img.width = 22;
          img.height = 22;
          img.onerror = function () {
            const mono = makeMonogram(cfg.monogram || '··');
            this.replaceWith(mono);
          };
          card.insertBefore(img, card.firstChild);
        } else {
          // Sem ícone: vai direto pro monograma
          const mono = makeMonogram(cfg.monogram || '··');
          card.insertBefore(mono, card.firstChild);
        }
      }

      // Link para status oficial
      if (cfg.statusUrl && !card.querySelector('.status-card-link')) {
        const a = document.createElement('a');
        a.className = 'status-card-link';
        a.href = cfg.statusUrl;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.textContent = 'Status oficial ↗';
        card.appendChild(a);
      }
    });
  }

  // ── Check de um serviço ─────────────────────────────────────
  async function checkService(card) {
    const slug = card.dataset.service;
    const cfg = SERVICES[slug];
    const badge = document.getElementById('status-' + slug);
    const details = document.getElementById('details-' + slug);
    if (!cfg || !badge) return;

    if (cfg.statusApi) {
      const start = performance.now();
      try {
        const r = await fetch(cfg.statusApi, { cache: 'no-store' });
        const elapsed = Math.round(performance.now() - start);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const data = await r.json();

        const indicator = data?.status?.indicator
                      || data?.status?.description?.toLowerCase()
                      || 'none';
        const mapped = mapIndicator(indicator);
        badge.className = 'status-badge ' + mapped.cls;
        badge.textContent = mapped.label;
        if (details) {
          const desc = data?.status?.description || '';
          details.textContent = desc
            ? `${desc} · ${elapsed}ms`
            : `Resposta em ${elapsed}ms`;
        }
      } catch (err) {
        badge.className = 'status-badge degraded';
        badge.textContent = 'Indisponível';
        if (details) details.textContent = 'Não foi possível alcançar a API.';
      }
    } else {
      badge.className = 'status-badge manual';
      badge.textContent = 'Verificação manual';
      if (details) details.textContent = 'Consulte o link do status oficial.';
    }
  }

  async function updateAll() {
    if (timeEl) timeEl.textContent = '— verificando…';
    cards.forEach((c) => {
      const slug = c.dataset.service;
      const badge = document.getElementById('status-' + slug);
      if (badge) {
        badge.className = 'status-badge loading';
        badge.textContent = 'Verificando';
      }
    });

    for (let i = 0; i < cards.length; i++) {
      checkService(cards[i]);
      await new Promise((r) => setTimeout(r, 60));
    }

    setTimeout(() => {
      if (timeEl) timeEl.textContent = fmtTime(new Date());
    }, 1500);
  }

  enrichCards();
  if (refreshBtn) refreshBtn.addEventListener('click', updateAll);
  updateAll();
  setInterval(updateAll, 60_000);
})();
