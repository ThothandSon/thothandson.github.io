/* ============================================================
   Thoth & Son — Status page client
   ─────────────────────────────────────────────────────────────
   Três níveis de verificação, do mais para o menos detalhado:

     1. statusApi  — fetch real à API pública (StatusPage.io etc).
                     Retorna estado + descrição + latência.
     2. pingUrl    — fetch no-cors ao domínio. Sabemos se responde
                     mas não temos detalhes. "Acessível / Inacessível".
     3. (nenhum)   — só link para a página oficial. "Manual".

   Ícones via cdn.simpleicons.org; monograma SVG inline como fallback
   quando o ícone não existe ou foi removido (trademark issues).
   ============================================================ */
(function () {
  'use strict';

  // ── Configuração por serviço ────────────────────────────────
  const SERVICES = {
    'apple-music':      { icon: 'applemusic',    monogram: 'AM',
                          pingUrl:   'https://www.apple.com/apple-music/',
                          statusUrl: 'https://www.apple.com/support/systemstatus/' },
    'aws':              { icon: null,            monogram: 'AW',
                          pingUrl:   'https://aws.amazon.com/',
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
                          pingUrl:   'https://www.deepseek.com/',
                          statusUrl: 'https://status.deepseek.com/' },
    'github':           { icon: 'github',        monogram: 'GH',
                          statusApi: 'https://www.githubstatus.com/api/v2/status.json',
                          statusUrl: 'https://www.githubstatus.com/' },
    'gmail':            { icon: 'gmail',         monogram: 'GM',
                          pingUrl:   'https://mail.google.com/',
                          statusUrl: 'https://www.google.com/appsstatus/dashboard/' },
    'google-meet':      { icon: 'googlemeet',    monogram: 'GM',
                          pingUrl:   'https://meet.google.com/',
                          statusUrl: 'https://www.google.com/appsstatus/dashboard/' },
    'jira':             { icon: 'jira',          monogram: 'JR',
                          statusApi: 'https://status.atlassian.com/api/v2/status.json',
                          statusUrl: 'https://status.atlassian.com/' },
    'linkedin':         { icon: null,            monogram: 'LI',
                          pingUrl:   'https://www.linkedin.com/',
                          statusUrl: 'https://www.linkedin.com/help/linkedin' },
    'microsoft-teams':  { icon: null,            monogram: 'MT',
                          pingUrl:   'https://teams.microsoft.com/',
                          statusUrl: 'https://portal.office.com/servicestatus' },
    'miro':             { icon: 'miro',          monogram: 'MI',
                          statusApi: 'https://status.miro.com/api/v2/status.json',
                          statusUrl: 'https://status.miro.com/' },
    'slack':            { icon: null,            monogram: 'SL',
                          statusApi: 'https://slack-status.com/api/v2.0.0/current',
                          statusUrl: 'https://slack-status.com/' },
    'spotify':          { icon: 'spotify',       monogram: 'SP',
                          pingUrl:   'https://www.spotify.com/',
                          statusUrl: 'https://status.spotify.dev/' },
    'telegram':         { icon: 'telegram',      monogram: 'TG',
                          pingUrl:   'https://telegram.org/',
                          statusUrl: 'https://core.telegram.org/' },
    'whatsapp':         { icon: 'whatsapp',      monogram: 'WA',
                          pingUrl:   'https://www.whatsapp.com/',
                          statusUrl: 'https://www.facebook.com/business/help/whatsapp' },
    'youtube':          { icon: 'youtube',       monogram: 'YT',
                          pingUrl:   'https://www.youtube.com/',
                          statusUrl: 'https://www.google.com/appsstatus/dashboard/' },
  };

  const cards = Array.from(document.querySelectorAll('.status-card[data-service]'));
  if (cards.length === 0) return;

  const timeEl     = document.getElementById('last-updated-time');
  const refreshBtn = document.getElementById('refresh-all');

  // ── Mapeamentos de indicadores ──────────────────────────────
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

  // ── Monograma SVG (fallback de ícone) ───────────────────────
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

  function enrichCards() {
    cards.forEach((card) => {
      const slug = card.dataset.service;
      const cfg = SERVICES[slug];
      if (!cfg) return;

      if (!card.querySelector('.status-card-logo')) {
        if (cfg.icon) {
          const img = document.createElement('img');
          img.className = 'status-card-logo';
          img.src = `https://cdn.simpleicons.org/${cfg.icon}/C8A030`;
          img.alt = '';
          img.loading = 'lazy';
          img.width = 22;
          img.height = 22;
          img.onerror = function () {
            this.replaceWith(makeMonogram(cfg.monogram || '··'));
          };
          card.insertBefore(img, card.firstChild);
        } else {
          card.insertBefore(makeMonogram(cfg.monogram || '··'), card.firstChild);
        }
      }

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

  // ── Check via API real (StatusPage.io v2 / Slack) ───────────
  async function checkApi(cfg, slug, badge, details) {
    const start = performance.now();
    try {
      const r = await fetch(cfg.statusApi, { cache: 'no-store' });
      const elapsed = Math.round(performance.now() - start);
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const data = await r.json();

      // Slack tem formato próprio
      if (slug === 'slack') {
        const incidents = data?.active_incidents || [];
        const slackOk = (data?.status === 'ok') && incidents.length === 0;
        if (slackOk) {
          badge.className = 'status-badge operational';
          badge.textContent = 'Operacional';
          if (details) details.textContent = `Sem incidentes ativos · ${elapsed}ms`;
        } else {
          // Pega severidade do incidente mais grave
          const sev = incidents.some((i) => i.type === 'outage') ? 'partial'
                    : incidents.some((i) => i.type === 'incident') ? 'degraded'
                    : 'degraded';
          const sevLabel = sev === 'partial' ? 'Parcial' : 'Degradado';
          badge.className = 'status-badge ' + sev;
          badge.textContent = sevLabel;
          if (details) {
            const t = incidents[0]?.title || 'incidente ativo';
            details.textContent = `${t} · ${elapsed}ms`;
          }
        }
        return;
      }

      // StatusPage.io v2 padrão
      const indicator = data?.status?.indicator || 'none';
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
      badge.className = 'status-badge down';
      badge.textContent = 'API indisponível';
      if (details) details.textContent = 'Não foi possível alcançar a API de status.';
    }
  }

  // ── Check via ping no-cors (reachability) ───────────────────
  async function checkPing(cfg, badge, details) {
    const start = performance.now();
    try {
      // mode: no-cors evita preflight; resposta é opaca mas resolve se a rede chegou
      const ctrl = new AbortController();
      const timeout = setTimeout(() => ctrl.abort(), 6000);
      await fetch(cfg.pingUrl, {
        method: 'GET',
        mode: 'no-cors',
        cache: 'no-store',
        signal: ctrl.signal,
        redirect: 'follow',
      });
      clearTimeout(timeout);
      const elapsed = Math.round(performance.now() - start);
      badge.className = 'status-badge reachable';
      badge.textContent = 'Acessível';
      if (details) details.textContent = `Servidor respondeu em ${elapsed}ms`;
    } catch (err) {
      badge.className = 'status-badge down';
      badge.textContent = 'Inacessível';
      if (details) details.textContent = 'Servidor não respondeu (timeout ou bloqueado).';
    }
  }

  // ── Dispatcher ──────────────────────────────────────────────
  async function checkService(card) {
    const slug = card.dataset.service;
    const cfg = SERVICES[slug];
    const badge = document.getElementById('status-' + slug);
    const details = document.getElementById('details-' + slug);
    if (!cfg || !badge) return;

    if (cfg.statusApi) {
      await checkApi(cfg, slug, badge, details);
    } else if (cfg.pingUrl) {
      await checkPing(cfg, badge, details);
    } else {
      badge.className = 'status-badge manual';
      badge.textContent = 'Verificação manual';
      if (details) details.textContent = 'Consulte o link do status oficial.';
    }
  }

  // ── Update orchestration ───────────────────────────────────
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

    // Escalonamento de 60ms entre disparos
    for (let i = 0; i < cards.length; i++) {
      checkService(cards[i]);
      await new Promise((r) => setTimeout(r, 60));
    }

    // Espera pelos últimos resolvedores antes de marcar o timestamp
    setTimeout(() => {
      if (timeEl) timeEl.textContent = fmtTime(new Date());
    }, 7000);
  }

  enrichCards();
  if (refreshBtn) refreshBtn.addEventListener('click', updateAll);
  updateAll();
  setInterval(updateAll, 60_000);
})();
