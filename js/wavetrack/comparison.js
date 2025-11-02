// ==========================================
// Comparison Slider - Before/After
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initComparisonSlider();
});

function initComparisonSlider() {
  const slider = document.getElementById("comparisonSlider");
  const content = document.getElementById("comparisonContent");

  if (!slider || !content) return;

  // Add event listener
  slider.addEventListener("input", (e) => {
    updateComparison(e.target.value);
    trackEvent("comparison_slider_moved", { value: e.target.value });
  });

  // Initial state
  updateComparison(slider.value);
}

function updateComparison(value) {
  const content = document.getElementById("comparisonContent");
  if (!content) return;

  const beforeSide = content.querySelector(".before");
  const afterSide = content.querySelector(".after");

  if (!beforeSide || !afterSide) return;

  // Calculate opacity based on slider value
  const beforeOpacity = 1 - value / 100;
  const afterOpacity = value / 100;

  // Apply visual effect
  beforeSide.style.opacity = Math.max(0.3, beforeOpacity);
  afterSide.style.opacity = Math.max(0.3, afterOpacity);

  // Add scale effect for emphasis
  const beforeScale = 1 - (value / 100) * 0.05;
  const afterScale = 0.95 + (value / 100) * 0.05;

  beforeSide.style.transform = `scale(${beforeScale})`;
  afterSide.style.transform = `scale(${afterScale})`;

  // Update slider background gradient
  const slider = document.getElementById("comparisonSlider");
  if (slider) {
    slider.style.background = `linear-gradient(to right,
            #ef4444 0%,
            #ef4444 ${value}%,
            #e2e8f0 ${value}%,
            #e2e8f0 100%)`;
  }
}

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    updateComparison,
  };
}
