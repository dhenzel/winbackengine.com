/**
 * WinbackEngine UTM Parameter Capture & Persistence
 *
 * Captures UTM parameters from the landing URL, persists them in sessionStorage
 * (and a first-touch cookie for cross-session attribution), then:
 *   1. Appends them to all GHL booking widget links so GHL forms receive them
 *   2. Pushes them into dataLayer for GTM/GA4 custom dimensions
 *   3. Exposes window.weUTM for other scripts (e.g. lead scoring, form handlers)
 *
 * Load this script BEFORE gtm-events.js so UTM data is available when events fire.
 */
(function () {
  'use strict';

  var UTM_KEYS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
  var SESSION_KEY = 'wb_utm';
  var COOKIE_NAME = 'wb_utm_first';
  var COOKIE_DAYS = 90;

  // ---------------------------------------------------------------------------
  // 1. Parse UTM params from current URL
  // ---------------------------------------------------------------------------
  function parseUTMFromURL() {
    var params = {};
    try {
      var sp = new URLSearchParams(window.location.search);
      for (var i = 0; i < UTM_KEYS.length; i++) {
        var val = sp.get(UTM_KEYS[i]);
        if (val) params[UTM_KEYS[i]] = val;
      }
    } catch (e) { /* old browser fallback — skip */ }
    return params;
  }

  // ---------------------------------------------------------------------------
  // 2. Session storage helpers
  // ---------------------------------------------------------------------------
  function saveSession(obj) {
    try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(obj)); } catch (e) {}
  }

  function loadSession() {
    try {
      var raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) { return null; }
  }

  // ---------------------------------------------------------------------------
  // 3. First-touch cookie (survives session close for 90 days)
  // ---------------------------------------------------------------------------
  function setCookie(obj) {
    var expires = new Date(Date.now() + COOKIE_DAYS * 864e5).toUTCString();
    document.cookie = COOKIE_NAME + '=' + encodeURIComponent(JSON.stringify(obj)) +
      ';expires=' + expires + ';path=/;SameSite=Lax';
  }

  function getCookie() {
    var match = document.cookie.match(new RegExp('(?:^|; )' + COOKIE_NAME + '=([^;]*)'));
    if (!match) return null;
    try { return JSON.parse(decodeURIComponent(match[1])); } catch (e) { return null; }
  }

  // ---------------------------------------------------------------------------
  // 4. Resolve current UTM context (URL > session > first-touch cookie)
  // ---------------------------------------------------------------------------
  var urlUTM = parseUTMFromURL();
  var hasURLUTM = Object.keys(urlUTM).length > 0;

  // If URL has UTM params, they win — update both stores
  if (hasURLUTM) {
    saveSession(urlUTM);
    if (!getCookie()) setCookie(urlUTM); // only set first-touch once
  }

  // Resolve effective UTM: session (latest touch) → cookie (first touch) → empty
  var utm = loadSession() || getCookie() || {};

  // Expose globally for other scripts
  window.weUTM = utm;

  // ---------------------------------------------------------------------------
  // 5. Push UTM to dataLayer (for GTM/GA4 user properties / custom dimensions)
  // ---------------------------------------------------------------------------
  window.dataLayer = window.dataLayer || [];
  if (Object.keys(utm).length > 0) {
    window.dataLayer.push({
      event: 'utm_captured',
      utm_source: utm.utm_source || '',
      utm_medium: utm.utm_medium || '',
      utm_campaign: utm.utm_campaign || '',
      utm_term: utm.utm_term || '',
      utm_content: utm.utm_content || '',
      utm_first_touch: !hasURLUTM && !!getCookie() // true if we're using the cookie fallback
    });
  }

  // ---------------------------------------------------------------------------
  // 6. Decorate GHL booking links with UTM params
  // ---------------------------------------------------------------------------
  function buildUTMQuery() {
    var parts = [];
    for (var i = 0; i < UTM_KEYS.length; i++) {
      if (utm[UTM_KEYS[i]]) {
        parts.push(UTM_KEYS[i] + '=' + encodeURIComponent(utm[UTM_KEYS[i]]));
      }
    }
    return parts.join('&');
  }

  function decorateLinks() {
    if (Object.keys(utm).length === 0) return;
    var q = buildUTMQuery();
    if (!q) return;

    var links = document.querySelectorAll('a[href*="leadconnectorhq.com/widget/booking"]');
    for (var i = 0; i < links.length; i++) {
      var href = links[i].getAttribute('href');
      if (href.indexOf('utm_') !== -1) continue; // already decorated
      links[i].setAttribute('href', href + (href.indexOf('?') !== -1 ? '&' : '?') + q);
    }
  }

  // Run on DOM ready and also observe for dynamically added links
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', decorateLinks);
  } else {
    decorateLinks();
  }

  // Re-decorate when new nodes are added (e.g. SPA navigation, widget injection)
  if (typeof MutationObserver !== 'undefined') {
    var observer = new MutationObserver(function (mutations) {
      for (var i = 0; i < mutations.length; i++) {
        if (mutations[i].addedNodes.length) { decorateLinks(); return; }
      }
    });
    observer.observe(document.body || document.documentElement, { childList: true, subtree: true });
  }

  // ---------------------------------------------------------------------------
  // 7. Intercept form submissions to inject hidden UTM fields
  // ---------------------------------------------------------------------------
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (!form || form.tagName !== 'FORM') return;
    for (var i = 0; i < UTM_KEYS.length; i++) {
      if (utm[UTM_KEYS[i]] && !form.querySelector('input[name="' + UTM_KEYS[i] + '"]')) {
        var hidden = document.createElement('input');
        hidden.type = 'hidden';
        hidden.name = UTM_KEYS[i];
        hidden.value = utm[UTM_KEYS[i]];
        form.appendChild(hidden);
      }
    }
  }, true); // capture phase so fields are added before the form actually submits

})();
