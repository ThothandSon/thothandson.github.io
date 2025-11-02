// ==========================================
// ROI Calculator - Interactive Calculation
// ==========================================

document.addEventListener("DOMContentLoaded", () => {
  initROICalculator();
});

function initROICalculator() {
  const employeesInput = document.getElementById("employees");
  const hourlyRateInput = document.getElementById("hourly-rate");
  const extraHoursInput = document.getElementById("extra-hours");
  const resultsDiv = document.getElementById("calculatorResults");

  if (!employeesInput || !hourlyRateInput || !extraHoursInput || !resultsDiv) {
    return;
  }

  // Add input listeners with debounce
  const calculateDebounced = debounce(calculateROI, 300);

  [employeesInput, hourlyRateInput, extraHoursInput].forEach((input) => {
    input.addEventListener("input", calculateDebounced);
  });
}

function calculateROI() {
  const employees = parseInt(document.getElementById("employees")?.value) || 0;
  const hourlyRate =
    parseFloat(document.getElementById("hourly-rate")?.value) || 0;
  const extraHours =
    parseInt(document.getElementById("extra-hours")?.value) || 0;

  // Validation
  if (employees <= 0 || hourlyRate <= 0 || extraHours <= 0) {
    hideResults();
    return;
  }

  // Calculate fraud percentage (industry average: 15-20%)
  const fraudPercentage = 0.17; // 17% average

  // Calculate overtime cost
  const overtimeMultiplier = 1.5; // Hora extra = 50% a mais
  const totalOvertimeCost = extraHours * hourlyRate * overtimeMultiplier;

  // Calculate fraudulent overtime
  const fraudulentHours = extraHours * fraudPercentage;
  const fraudulentCost = fraudulentHours * hourlyRate * overtimeMultiplier;

  // Calculate savings (85% detection rate)
  const detectionRate = 0.85;
  const monthlySavings = fraudulentCost * detectionRate;
  const annualSavings = monthlySavings * 12;

  // Display results with animation
  displayResults(monthlySavings, annualSavings);

  // Track event
  trackEvent("roi_calculated", {
    employees,
    hourlyRate,
    extraHours,
    monthlySavings: Math.round(monthlySavings),
    annualSavings: Math.round(annualSavings),
  });
}

function displayResults(monthly, annual) {
  const resultsDiv = document.getElementById("calculatorResults");
  const monthlySpan = document.getElementById("monthlySavings");
  const annualSpan = document.getElementById("annualSavings");

  if (!resultsDiv || !monthlySpan || !annualSpan) return;

  // Format values
  const monthlyFormatted = formatCurrency(monthly);
  const annualFormatted = formatCurrency(annual);

  // Animate numbers
  animateValue(monthlySpan, 0, monthly, 1000, true);
  animateValue(annualSpan, 0, annual, 1500, true);

  // Show results with animation
  resultsDiv.classList.add("active");
}

function hideResults() {
  const resultsDiv = document.getElementById("calculatorResults");
  if (resultsDiv) {
    resultsDiv.classList.remove("active");
  }
}

function animateValue(element, start, end, duration, isCurrency = false) {
  const startTime = performance.now();

  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Easing function (easeOutCubic)
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (end - start) * eased;

    if (isCurrency) {
      element.textContent = formatCurrency(current);
    } else {
      element.textContent = Math.floor(current);
    }

    if (progress < 1) {
      requestAnimationFrame(update);
    }
  }

  requestAnimationFrame(update);
}

// ==========================================
// Savings Breakdown Tooltip (Optional)
// ==========================================

function showBreakdown() {
  const employees = parseInt(document.getElementById("employees")?.value) || 0;
  const hourlyRate =
    parseFloat(document.getElementById("hourly-rate")?.value) || 0;
  const extraHours =
    parseInt(document.getElementById("extra-hours")?.value) || 0;

  const fraudPercentage = 0.17;
  const overtimeMultiplier = 1.5;

  const fraudulentHours = extraHours * fraudPercentage;
  const detectedHours = fraudulentHours * 0.85;
  const costPerFraudulentHour = hourlyRate * overtimeMultiplier;

  return {
    totalExtraHours: extraHours,
    estimatedFraudulentHours: Math.round(fraudulentHours),
    detectedFraudulentHours: Math.round(detectedHours),
    costPerFraudulentHour: formatCurrency(costPerFraudulentHour),
    detectionRate: "85%",
    industryAverageFraud: "17%",
  };
}

// Export for testing
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    calculateROI,
    animateValue,
    showBreakdown,
  };
}
