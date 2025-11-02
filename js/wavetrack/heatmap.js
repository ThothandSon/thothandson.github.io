// ==========================================
// Heatmap - Presence Visualization
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initHeatmap();
});

function initHeatmap() {
  const container = document.getElementById("heatmapContainer");
  if (!container) return;

  // Generate heatmap data
  const heatmapData = generateHeatmapData();

  // Render heatmap
  renderHeatmap(container, heatmapData);

  // Track view
  trackEvent("heatmap_viewed");
}

function generateHeatmapData() {
  // Simulated weekly presence data
  return [
    { day: "Segunda-feira", presence: 85, discrepancy: 15, color: "danger" },
    { day: "Terça-feira", presence: 92, discrepancy: 8, color: "warning" },
    { day: "Quarta-feira", presence: 88, discrepancy: 12, color: "warning" },
    { day: "Quinta-feira", presence: 94, discrepancy: 6, color: "primary" },
    { day: "Sexta-feira", presence: 78, discrepancy: 22, color: "danger" },
  ];
}

function renderHeatmap(container, data) {
  const gridHTML = `
        <div class="heatmap-grid">
            ${data
              .map(
                (item) => `
                <div class="heatmap-row">
                    <div class="heatmap-label">${item.day}</div>
                    <div class="heatmap-bar-container"
                         data-tooltip="Presença: ${item.presence}% | Discrepância: ${item.discrepancy}%">
                        <div class="heatmap-bar ${item.color}"
                             style="width: 0%"
                             data-width="${item.presence}%">
                            ${item.presence}%
                        </div>
                    </div>
                </div>
            `,
              )
              .join("")}
        </div>
        <div style="margin-top: 1.5rem; padding: 1rem; background: rgba(239, 68, 68, 0.1); border-radius: 8px; border-left: 4px solid #ef4444;">
            <strong>⚠️ Alerta:</strong> Segunda e Sexta-feira apresentam maior discrepância entre ponto marcado e presença real.
        </div>
    `;

  container.innerHTML = gridHTML;

  // Animate bars after render
  setTimeout(() => {
    animateHeatmapBars();
  }, 100);
}

function animateHeatmapBars() {
  const bars = document.querySelectorAll(".heatmap-bar");

  bars.forEach((bar, index) => {
    setTimeout(() => {
      const targetWidth = bar.dataset.width;
      bar.style.width = targetWidth;
    }, index * 100);
  });
}

// Add tooltip functionality
document.addEventListener("mouseover", (e) => {
  if (e.target.classList.contains("heatmap-bar-container")) {
    showTooltip(e);
  }
});

document.addEventListener("mouseout", (e) => {
  if (e.target.classList.contains("heatmap-bar-container")) {
    hideTooltip();
  }
});

function showTooltip(event) {
  const tooltip = event.target.dataset.tooltip;
  if (!tooltip) return;

  // Create tooltip element
  const tooltipEl = document.createElement("div");
  tooltipEl.className = "heatmap-tooltip";
  tooltipEl.textContent = tooltip;
  tooltipEl.style.cssText = `
        position: fixed;
        background: rgba(30, 41, 59, 0.95);
        color: white;
        padding: 0.5rem 1rem;
        border-radius: 6px;
        font-size: 0.875rem;
        pointer-events: none;
        z-index: 1000;
        white-space: nowrap;
    `;

  document.body.appendChild(tooltipEl);

  // Position tooltip
  const updatePosition = (e) => {
    tooltipEl.style.left = e.clientX + 10 + "px";
    tooltipEl.style.top = e.clientY - 30 + "px";
  };

  updatePosition(event);
  event.target.addEventListener("mousemove", updatePosition);
}

function hideTooltip() {
  const tooltip = document.querySelector(".heatmap-tooltip");
  if (tooltip) {
    tooltip.remove();
  }
}

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    generateHeatmapData,
    renderHeatmap,
  };
}
