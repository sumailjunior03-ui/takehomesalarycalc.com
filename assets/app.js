(function () {
  const currency = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2
  });

  function safeNumber(value) {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : 0;
  }

  function computeProgressiveTax(taxableIncome, brackets) {
    if (taxableIncome <= 0) return 0;
    let remaining = taxableIncome;
    let lowerLimit = 0;
    let total = 0;

    for (const bracket of brackets) {
      const upperLimit = bracket.upTo;
      const taxableAtThisRate = upperLimit === null
        ? remaining
        : Math.min(remaining, upperLimit - lowerLimit);

      if (taxableAtThisRate <= 0) {
        lowerLimit = upperLimit === null ? lowerLimit : upperLimit;
        continue;
      }

      total += taxableAtThisRate * bracket.rate;
      remaining -= taxableAtThisRate;
      if (remaining <= 0) break;
      lowerLimit = upperLimit;
    }

    return total;
  }

  function computeFica(wagesSubjectToFica) {
    const { socialSecurityRate, socialSecurityWageBase, medicareRate } = window.SITE_CONFIG.federalTaxData.fica;
    const socialSecurityTax = Math.min(wagesSubjectToFica, socialSecurityWageBase) * socialSecurityRate;
    const medicareTax = wagesSubjectToFica * medicareRate;
    return socialSecurityTax + medicareTax;
  }

  function annualizeHealth(monthlyHealth) {
    return Math.max(0, monthlyHealth) * 12;
  }

  function payPeriodsFor(code) {
    switch (code) {
      case 'weekly': return 52;
      case 'biweekly': return 26;
      case 'semimonthly': return 24;
      case 'monthly': return 12;
      default: return 26;
    }
  }

  function labelFor(code) {
    switch (code) {
      case 'weekly': return 'Estimated net pay per week';
      case 'biweekly': return 'Estimated net pay per bi-weekly paycheck';
      case 'semimonthly': return 'Estimated net pay per semi-monthly paycheck';
      case 'monthly': return 'Estimated net pay per month';
      default: return 'Estimated net pay per paycheck';
    }
  }

  function updateResults() {
    const grossSalary = Math.max(0, safeNumber(document.getElementById('annualSalary').value));
    const filingStatus = document.getElementById('filingStatus').value;
    const payFrequency = document.getElementById('payFrequency').value;
    const retirementPercent = Math.max(0, safeNumber(document.getElementById('retirementPercent').value));
    const monthlyHealth = Math.max(0, safeNumber(document.getElementById('monthlyHealth').value));
    const otherPretaxAnnual = Math.max(0, safeNumber(document.getElementById('otherPretaxAnnual').value));
    const postTaxPerPaycheck = Math.max(0, safeNumber(document.getElementById('postTaxPerPaycheck').value));

    const payPeriods = payPeriodsFor(payFrequency);
    const retirementAnnual = grossSalary * (retirementPercent / 100);
    const healthAnnual = annualizeHealth(monthlyHealth);
    const totalPretaxDeductions = retirementAnnual + healthAnnual + otherPretaxAnnual;

    const deduction = window.SITE_CONFIG.federalTaxData.standardDeduction[filingStatus];
    const brackets = window.SITE_CONFIG.federalTaxData.brackets[filingStatus];

    const federalTaxableWages = Math.max(0, grossSalary - totalPretaxDeductions);
    const taxableIncome = Math.max(0, federalTaxableWages - deduction);
    const federalTax = computeProgressiveTax(taxableIncome, brackets);

    const ficaWages = Math.max(0, grossSalary - healthAnnual - otherPretaxAnnual);
    const ficaTax = computeFica(ficaWages);

    const postTaxAnnual = postTaxPerPaycheck * payPeriods;
    const totalWithholdingAndDeductions = federalTax + ficaTax + totalPretaxDeductions + postTaxAnnual;
    const netAnnual = Math.max(0, grossSalary - totalWithholdingAndDeductions);
    const netPerPaycheck = netAnnual / payPeriods;

    const values = {
      estimatedFederalTax: federalTax,
      estimatedFica: ficaTax,
      estimatedRetirement: retirementAnnual,
      estimatedHealthInsurance: healthAnnual,
      estimatedOtherPretax: otherPretaxAnnual,
      estimatedPostTax: postTaxAnnual,
      estimatedNetAnnual: netAnnual,
      estimatedNetMonthly: netAnnual / 12,
      estimatedNetPerPaycheck: netPerPaycheck
    };

    Object.entries(values).forEach(([id, value]) => {
      document.getElementById(id).textContent = currency.format(value);
    });

    document.getElementById('perPaycheckLabel').textContent = labelFor(payFrequency);
    document.getElementById('exampleTaxYear').textContent = window.SITE_CONFIG.taxYearLabel;
  }

  function setDynamicMeta() {
    const titleNodes = document.querySelectorAll('[data-site-title]');
    titleNodes.forEach(node => {
      node.textContent = window.SITE_CONFIG.title;
    });
    const yearNodes = document.querySelectorAll('[data-tax-year-label]');
    yearNodes.forEach(node => {
      node.textContent = window.SITE_CONFIG.taxYearLabel;
    });
    const emailNodes = document.querySelectorAll('[data-partnerships-email]');
    emailNodes.forEach(node => {
      node.textContent = window.SITE_CONFIG.partnershipsEmail;
      if (node.tagName === 'A') {
        node.href = 'mailto:' + window.SITE_CONFIG.partnershipsEmail;
      }
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setDynamicMeta();

    const form = document.getElementById('calculatorForm');
    if (form) {
      form.addEventListener('input', updateResults);
      form.addEventListener('submit', function (event) {
        event.preventDefault();
        updateResults();
      });
      updateResults();
    }
  });
})();
