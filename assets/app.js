(function () {
  "use strict";

  var currency = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2
  });

  function safeNumber(value) {
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function computeProgressiveTax(taxableIncome, brackets) {
    if (taxableIncome <= 0) return 0;
    var remaining = taxableIncome;
    var lowerLimit = 0;
    var total = 0;

    for (var i = 0; i < brackets.length; i++) {
      var bracket = brackets[i];
      var upperLimit = bracket.upTo;
      var taxableAtThisRate = upperLimit === null
        ? remaining
        : Math.min(remaining, upperLimit - lowerLimit);

      if (taxableAtThisRate <= 0) {
        if (upperLimit !== null) lowerLimit = upperLimit;
        continue;
      }

      total += taxableAtThisRate * bracket.rate;
      remaining -= taxableAtThisRate;
      if (remaining <= 0) break;
      if (upperLimit !== null) lowerLimit = upperLimit;
    }

    return total;
  }

  function computeFica(wagesSubjectToFica) {
    var cfg = window.SITE_CONFIG.federalTaxData.fica;
    var ssWages = Math.min(wagesSubjectToFica, cfg.socialSecurityWageBase);
    var socialSecurityTax = ssWages * cfg.socialSecurityRate;
    var medicareTax = wagesSubjectToFica * cfg.medicareRate;
    var additionalMedicareTax = 0;
    if (wagesSubjectToFica > cfg.additionalMedicareThreshold) {
      additionalMedicareTax = (wagesSubjectToFica - cfg.additionalMedicareThreshold) * cfg.additionalMedicareRate;
    }
    return {
      socialSecurity: socialSecurityTax,
      medicare: medicareTax,
      additionalMedicare: additionalMedicareTax,
      total: socialSecurityTax + medicareTax + additionalMedicareTax
    };
  }

  function annualizeHealth(monthlyHealth) {
    return Math.max(0, monthlyHealth) * 12;
  }

  function payPeriodsFor(code) {
    switch (code) {
      case "weekly": return 52;
      case "biweekly": return 26;
      case "semimonthly": return 24;
      case "monthly": return 12;
      default: return 26;
    }
  }

  function labelFor(code) {
    switch (code) {
      case "weekly": return "Estimated net pay per week";
      case "biweekly": return "Estimated net pay per bi-weekly paycheck";
      case "semimonthly": return "Estimated net pay per semi-monthly paycheck";
      case "monthly": return "Estimated net pay per month";
      default: return "Estimated net pay per paycheck";
    }
  }

  function calculate() {
    var grossSalary = safeNumber(document.getElementById("grossSalary").value);
    var filingStatus = document.getElementById("filingStatus").value;
    var retirementPct = safeNumber(document.getElementById("retirementPct").value);
    var monthlyHealth = safeNumber(document.getElementById("monthlyHealth").value);
    var otherPretax = safeNumber(document.getElementById("otherPretax").value);
    var otherPosttax = safeNumber(document.getElementById("otherPosttax").value);
    var payFrequency = document.getElementById("payFrequency").value;

    var cfg = window.SITE_CONFIG.federalTaxData;
    var stdDeduction = cfg.standardDeduction[filingStatus] || cfg.standardDeduction.single;
    var brackets = cfg.brackets[filingStatus] || cfg.brackets.single;

    // Pre-tax deductions
    var retirement = grossSalary * (retirementPct / 100);
    var healthInsurance = annualizeHealth(monthlyHealth);
    var totalPretax = retirement + healthInsurance + otherPretax;

    // Taxable income
    var adjustedGross = grossSalary - totalPretax;
    var taxableIncome = Math.max(0, adjustedGross - stdDeduction);

    // Federal tax
    var federalTax = computeProgressiveTax(taxableIncome, brackets);

    // FICA (on gross, not taxable)
    var fica = computeFica(grossSalary);

    // Total deductions
    var totalDeductions = totalPretax + federalTax + fica.total + otherPosttax;

    // Net
    var netAnnual = grossSalary - totalDeductions;
    var periods = payPeriodsFor(payFrequency);
    var netPerPaycheck = netAnnual / periods;
    var netMonthly = netAnnual / 12;

    // Populate results
    var values = {
      grossSalary: grossSalary,
      retirementContribution: retirement,
      healthInsurance: healthInsurance,
      otherPretax: otherPretax,
      totalPretax: totalPretax,
      taxableIncome: taxableIncome,
      federalTax: federalTax,
      socialSecurityTax: fica.socialSecurity,
      medicareTax: fica.medicare,
      additionalMedicareTax: fica.additionalMedicare,
      totalFica: fica.total,
      otherPosttax: otherPosttax,
      netAnnual: netAnnual,
      netMonthly: netMonthly
    };

    Object.keys(values).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) el.textContent = currency.format(values[id]);
    });

    document.getElementById("perPaycheckLabel").textContent = labelFor(payFrequency);
    var ppEl = document.getElementById("netPerPaycheck");
    if (ppEl) ppEl.textContent = currency.format(netPerPaycheck);
    document.getElementById("exampleTaxYear").textContent = window.SITE_CONFIG.taxYearLabel;
  }

  document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("salaryForm");
    if (form) {
      form.addEventListener("submit", function (e) {
        e.preventDefault();
        calculate();
      });
    }
  });
})();
