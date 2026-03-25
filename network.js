window.FORBIDDEN_DOMAINS = ['tokentodollarmargin.com'];
window.NETWORK_LINKS = [
  {
    domain: '1099vsw2calc.com',
    name: '1099vsW2Calc.com',
    url: 'https://1099vsw2calc.com/',
    description: '1099 vs W-2 take-home comparison calculator',
    live: true
  },
  {
    domain: 'quarterlytaxcalc.com',
    name: 'QuarterlyTaxCalc.com',
    url: 'https://quarterlytaxcalc.com/',
    description: 'Quarterly estimated tax calculator',
    live: true
  },
  {
    domain: 'freelanceratecalc.com',
    name: 'FreelanceRateCalc.com',
    url: 'https://freelanceratecalc.com/',
    description: 'Freelance rate after-tax calculator',
    live: true
  },
  {
    domain: 'bonustaxcalc.com',
    name: 'BonusTaxCalc.com',
    url: 'https://bonustaxcalc.com/',
    description: 'Bonus tax withholding calculator',
    live: true
  },
  {
    domain: 'calc-hq.com',
    name: 'Calc-HQ.com',
    url: 'https://calc-hq.com/',
    description: 'Financial calculator hub and methodology reference',
    live: true
  }
];

(function () {
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getRelatedSites(currentDomain) {
    const forbidden = Array.isArray(window.FORBIDDEN_DOMAINS) ? window.FORBIDDEN_DOMAINS : [];
    const links = Array.isArray(window.NETWORK_LINKS) ? window.NETWORK_LINKS : [];

    return links.filter(function (site) {
      return Boolean(site)
        && site.live === true
        && typeof site.domain === 'string'
        && site.domain !== currentDomain
        && !forbidden.includes(site.domain);
    });
  }

  window.renderSiteHeader = function renderSiteHeader() {
  var headerTargets = document.querySelectorAll('[data-site-header-nav]');
  if (!headerTargets.length) return;

  var path = window.location.pathname || "/";
  var current = "/";
  if (path.indexOf("/about.html") !== -1) current = "/about.html";
  else if (path.indexOf("/faq.html") !== -1) current = "/faq.html";
  else if (path.indexOf("/privacy.html") !== -1) current = "/privacy.html";
  else if (path.indexOf("/legal.html") !== -1) current = "/legal.html";
  else if (path.indexOf("/contact.html") !== -1) current = "/contact.html";

  function link(href, label) {
    var active = href === current;
    return '<a' + (active ? ' class="active" aria-current="page"' : '') + ' href="' + href + '">' + label + '</a>';
  }

  var navHtml = [
    '<nav class="header-nav" aria-label="Primary">',
    link("/", "Home"),
    link("/about.html", "About"),
    link("/faq.html", "FAQ"),
    link("/privacy.html", "Privacy"),
    link("/legal.html", "Legal"),
    link("/contact.html", "Contact"),
    '</nav>'
  ].join('');

  for (var i = 0; i < headerTargets.length; i++) {
    headerTargets[i].innerHTML = navHtml;
  }
};

window.renderFooter = function renderFooter(currentDomain) {
    const footerMount = document.getElementById('site-footer');
    if (!footerMount || !window.SITE_CONFIG) return;

    const relatedSites = getRelatedSites(currentDomain);
    const relatedMarkup = relatedSites.length
      ? '<div class="footer-related"><h2>Related tools</h2><ul>' + relatedSites.map(function (site) {
          return '<li><a href="' + escapeHtml(site.url) + '">' + escapeHtml(site.name) + '</a></li>';
        }).join('') + '</ul></div>'
      : '';

    footerMount.innerHTML = [
      relatedMarkup,
      '<div class="footer-meta">',
      '<p>&copy; 2026 ' + escapeHtml(window.SITE_CONFIG.siteName) + '</p>',
      '<p><a href="mailto:' + escapeHtml(window.SITE_CONFIG.partnershipsEmail) + '">' + escapeHtml(window.SITE_CONFIG.partnershipsEmail) + '</a></p>',
      '</div>'
    ].join('');
  };
})();
