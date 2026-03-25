"use strict";
/* footer.js — site header and footer renderer (framework requirement).
   Depends on: config.js (window.SITE_CONFIG), network.js (window.renderFooter, window.renderSiteHeader)
   Renders on every page via DOMContentLoaded.
   Related Tools cluster is driven dynamically from NETWORK_LINKS in network.js:
     - excludes current domain (SITE_CONFIG.domain)
     - excludes forbidden domains (FORBIDDEN_DOMAINS in network.js)
     - calc-hq.com hub link rendered in footer Resources area, outside the Related Tools cluster
   No related tool links are hardcoded in HTML. */
(function () {
  document.addEventListener("DOMContentLoaded", function () {
    if (typeof window.renderSiteHeader === "function") {
      window.renderSiteHeader();
    }
    if (typeof window.renderFooter === "function") {
      window.renderFooter(window.SITE_CONFIG ? window.SITE_CONFIG.domain : "");
    }
  });
})();
