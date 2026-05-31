/* ============================================================
   Thoth & Son — Status page client
   ─────────────────────────────────────────────────────────────
   Health checks reais via StatusPage.io API onde disponível,
   link para a página oficial quando não.
   Sem fakes — se não tem como verificar de verdade, marcamos
   como "manual" e damos o link.
   Logos via cdn.simpleicons.org (CC0).
   ============================================================ */
(function () {
  'use strict';

  // ── Configuração por serviço ────────────────────────────────
  // statusApi  : endpoint v2 do StatusPage.io (CORS aberto) — opcional
  // statusUrl  : página de status oficial (sempre exibida como link)
  // icon       : slug do simpleicons.org (ou null para usar fallback)
  const SERVICES = {
    'apple-music':      { icon: 'applemusic',         statusUrl: 'https://www.apple.com/support/systemstatus/' },
    'aws':              { icon: 'amazonaws',          statusUrl: 'https://health.aws.amazon.com/health/status' },
    'chatgpt':          { icon: 'openai',             statusApi: 'https://status.openai.com/api/v2/status.json',
                                                      statusUrl: 'https://status.openai.com/' },
    'cloudflare':       { icon: 'cloudflare',         statusApi: 'https://www.cloudflarestatus.com/api/v2/status.json',
                                                      statusUrl: 'https://www.cloudflarestatus.com/' },
    'confluence':       { icon: 'confluence',         statusApi: 'https://status.atlassian.com/api/v2/status.json',
                                                      statusUrl: 'https://status.atlassian.com/' },
    'deepseek':         { icon: null,                 statusApi: 'https://status.deepseek.com/api/v2/status.json',
                                                      statusUrl: 'https://status.deepseek.com/' },
    'github':           { icon: 'github',             statusApi: 'https://www.githubstatus.com/api/v2/status.json',
                                                      statusUrl: 'https://www.githubstatus.com/' },
    'gmail':            { icon: 'gmail',              statusUrl: 'https://www.google.com/appsstatus/dashboard/' },
    'google-meet':      { icon: 'googlemeet',         statusUrl: 'https://www.google.com/appsstatus/dashboard/' },
    'jira':             { icon: 'jira',               statusApi: 'https://status.atlassian.com/api/v2/status.json',
                                                      statusUrl: 'https://status.atlassian.com/' },
    'linkedin':         { icon: 'linkedin',           statusUrl: 'https://www.linkedin.com/help/linkedin' },
    'microsoft-teams':  { icon: 'microsoftteams',     statusUrl: 'https://portal.office.com/servicestatus' },
    'miro':             { icon: 'miro',               statusApi: 'https://status.miro.com/api/v2/status.json',
                                                      statusUrl: 'https://status.miro.com/' },
    'slack':            { icon: 'slack',              statusApi: 'https://status.slack.com/api/v2.0.0/current',
                                                      statusUrl: 'https://status.slack.com/' },
    'spotify':          { icon: 'spotify',            statusUrl: 'https://status.spotify.dev/' },
    'telegram':         { icon: 'telegram',           statusUrl: 'https://core.telegram.org/' },
    'whatsapp':         { icon: 'whatsapp',           statusUrl: 'https://www.facebook.com/business/help/whatsapp' },
    'youtube':          { icon: 'youtube',            statusUrl: 'https://www.google.com/appsstatus/dashboard/' },
  };

  // ── Helpers ─────────────────────────────────────────────────
  const cards = Array.from(document.querySelectorAll('.status-card[data-service]'));
  if (cards.length === 0) return;

  const timeEl     = document.getElementById('last-updated-time');
  const refreshBtn = document.getElementById('refresh-all');

  // Mapeia o indicador do StatusPage.io para nossa nomenclatura
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

  // ── Injeta logo e link de status em cada card ───────────────
  function enrichCards() {
    cards.forEach((card) => {
      const slug = card.dataset.service;
      const cfg = SERVICES[slug];
      if (!cfg) return;

      // Logo (no canto superior esquerdo, antes do nome)
      if (cfg.icon && !card.querySelector('.status-card-logo')) {
        const img = document.createElement('img');
        img.className = 'status-card-logo';
        img.src = `https://cdn.simpleicons.org/${cfg.icon}/C8A030`;
        img.alt = '';
        img.loading = 'lazy';
        img.width = 22;
        img.height = 22;
        card.insertBefore(img, card.firstChild);
      }

      // Link para status oficial (footer do card)
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
      // Health check real via StatusPage.io
      const start = performance.now();
      try {
        const r = await fetch(cfg.statusApi, { cache: 'no-store' });
        const elapsed = Math.round(performance.now() - start);
        if (!r.ok) throw new Error('HTTP ' + r.status);
        const data = await r.json();

        // StatusPage.io v2 e v2.0.0 (Slack) divergem ligeiramente
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
      // Sem API pública: indica como "manual" e linka pro status oficial
      badge.className = 'status-badge manual';
      badge.textContent = 'Verificação manual';
      if (details) details.textContent = 'Consulte o link do status oficial.';
    }
  }

  // ── Loop principal ──────────────────────────────────────────
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

    // Escalonamento de 60ms entre requests — visual de instrumento operando
    for (let i = 0; i < cards.length; i++) {
      checkService(cards[i]);
      await new Promise((r) => setTimeout(r, 60));
    }

    // Aguarda mais um pouco para garantir que os últimos resolveram
    setTimeout(() => {
      if (timeEl) timeEl.textContent = fmtTime(new Date());
    }, 1500);
  }

  enrichCards();
  if (refreshBtn) refreshBtn.addEventListener('click', updateAll);
  updateAll();
  setInterval(updateAll, 60_000);
})();
