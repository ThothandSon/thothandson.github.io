/* ============================================================
   Thoth & Son — Instruments (HUD + crosshair)
   Auto-injeta em qualquer página. Carregado via default.html.
   ============================================================ */
(function () {
  'use strict';

  // ── DOM injection (HUD + crosshair) ─────────────────────────
  // Injeta os elementos no body se ainda não existirem
  function inject() {
    if (!document.querySelector('.hud')) {
      const hud = document.createElement('aside');
      hud.className = 'hud';
      hud.setAttribute('aria-hidden', 'true');
      hud.innerHTML = `
        <span class="hud-row"><span class="hud-key">LAT </span><span class="hud-val">−23.5505</span></span>
        <span class="hud-row"><span class="hud-key">LNG </span><span class="hud-val">−46.6333</span></span>
        <span class="hud-row"><span class="hud-key">X   </span><span class="hud-val hud-x">0000</span></span>
        <span class="hud-row"><span class="hud-key">Y   </span><span class="hud-val hud-y">0000</span></span>
        <span class="hud-row"><span class="hud-key">T   </span><span class="hud-val hud-time">00:00:00 BRT</span></span>
      `;
      document.body.appendChild(hud);
    }
    if (!document.querySelector('.crosshair')) {
      const cross = document.createElement('div');
      cross.className = 'crosshair';
      cross.setAttribute('aria-hidden', 'true');
      document.body.appendChild(cross);
    }
  }

  function init() {
    inject();

    const coordX  = document.querySelector('.hud-x');
    const coordY  = document.querySelector('.hud-y');
    const hudTime = document.querySelector('.hud-time');
    const cross   = document.querySelector('.crosshair');

    let lastX = 0, lastY = 0;

    // Mouse coords
    document.addEventListener('mousemove', (e) => {
      lastX = e.clientX;
      lastY = e.clientY;
      if (cross) {
        cross.style.transform =
          `translate(${e.clientX}px, ${e.clientY}px) translate(-50%, -50%)`;
      }
    });

    // Update HUD coords at 16fps
    if (coordX && coordY) {
      setInterval(() => {
        coordX.textContent = String(lastX).padStart(4, '0');
        coordY.textContent = String(lastY).padStart(4, '0');
      }, 60);
    }

    // Time ticker
    if (hudTime) {
      const tick = () => {
        const now = new Date();
        const t = now.toLocaleTimeString('pt-BR', {
          hour: '2-digit', minute: '2-digit', second: '2-digit',
          timeZone: 'America/Sao_Paulo',
        });
        hudTime.textContent = t + ' BRT';
      };
      tick();
      setInterval(tick, 1000);
    }

    // Crosshair: aparece sobre regiões marcadas com .has-crosshair (ou .hero/.page-hero)
    if (cross) {
      const zones = document.querySelectorAll('.hero, .page-hero, .has-crosshair');
      zones.forEach((zone) => {
        zone.addEventListener('mouseenter', () => cross.classList.add('visible'));
        zone.addEventListener('mouseleave', () => cross.classList.remove('visible'));
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
