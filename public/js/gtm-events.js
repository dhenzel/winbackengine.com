/**
 * WinbackEngine GTM Custom Event Tracking
 *
 * This script pushes custom events to the dataLayer for Google Tag Manager.
 * GTM picks these up and fires the corresponding GA4 event tags.
 *
 * Events tracked:
 *   - scroll_depth (25%, 50%, 75%, 100%)
 *   - cta_click (all CTA buttons/links)
 *   - roi_calculator_complete (ROI calculator form submission)
 *   - lead_magnet_download (lead magnet link clicks)
 *   - contact_form_submit (contact/booking form submissions)
 *   - outbound_link_click (links to external domains)
 */
(function () {
  'use strict';

  window.dataLayer = window.dataLayer || [];

  // ---------------------------------------------------------------------------
  // 1. Scroll Depth Tracking (25 / 50 / 75 / 100%)
  // ---------------------------------------------------------------------------
  var scrollThresholds = [25, 50, 75, 100];
  var scrollFired = {};

  function getScrollPercent() {
    var docHeight = Math.max(
      document.body.scrollHeight,
      document.documentElement.scrollHeight
    );
    var winHeight = window.innerHeight;
    var scrollTop = window.scrollY || document.documentElement.scrollTop;
    if (docHeight <= winHeight) return 100;
    return Math.round((scrollTop / (docHeight - winHeight)) * 100);
  }

  function checkScroll() {
    var pct = getScrollPercent();
    for (var i = 0; i < scrollThresholds.length; i++) {
      var t = scrollThresholds[i];
      if (pct >= t && !scrollFired[t]) {
        scrollFired[t] = true;
        window.dataLayer.push({
          event: 'scroll_depth',
          scroll_threshold: t,
          page_path: location.pathname
        });
      }
    }
  }

  var scrollTimer;
  window.addEventListener('scroll', function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(checkScroll, 150);
  }, { passive: true });

  // ---------------------------------------------------------------------------
  // 2. CTA Click Tracking
  // ---------------------------------------------------------------------------
  // Matches booking links and any element with data-track-cta
  function isCTA(el) {
    if (!el) return false;
    var href = el.getAttribute('href') || '';
    if (href.indexOf('leadconnectorhq.com/widget/booking') !== -1) return true;
    if (el.hasAttribute('data-track-cta')) return true;
    // Match buttons/links with common CTA text
    var text = (el.textContent || '').trim().toLowerCase();
    if (
      text.indexOf('book') === 0 ||
      text.indexOf('get started') === 0 ||
      text.indexOf('schedule') === 0 ||
      text.indexOf('free audit') !== -1 ||
      text.indexOf('reactivation audit') !== -1
    ) {
      return true;
    }
    return false;
  }

  document.addEventListener('click', function (e) {
    var el = e.target.closest('a, button');
    if (el && isCTA(el)) {
      window.dataLayer.push({
        event: 'cta_click',
        cta_text: (el.textContent || '').trim().substring(0, 100),
        cta_url: el.getAttribute('href') || '',
        page_path: location.pathname
      });
    }
  });

  // ---------------------------------------------------------------------------
  // 3. ROI Calculator Completion
  // ---------------------------------------------------------------------------
  // The ROI calculator page fires this when the user completes a calculation.
  // Listen for the custom event or detect the calculate button click.
  document.addEventListener('click', function (e) {
    var el = e.target.closest('button, [data-track-roi-calc]');
    if (!el) return;
    var text = (el.textContent || '').trim().toLowerCase();
    if (
      el.hasAttribute('data-track-roi-calc') ||
      text.indexOf('calculate') !== -1
    ) {
      // Only fire on the ROI calculator page
      if (location.pathname.indexOf('roi-calculator') !== -1) {
        window.dataLayer.push({
          event: 'roi_calculator_complete',
          page_path: location.pathname
        });
      }
    }
  });

  // ---------------------------------------------------------------------------
  // 4. Lead Magnet Downloads
  // ---------------------------------------------------------------------------
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a');
    if (!el) return;
    var href = el.getAttribute('href') || '';
    // Match PDF/document downloads or elements marked as lead magnets
    if (
      el.hasAttribute('data-track-lead-magnet') ||
      /\.(pdf|xlsx?|docx?|csv|zip)(\?|$)/i.test(href)
    ) {
      window.dataLayer.push({
        event: 'lead_magnet_download',
        file_url: href,
        link_text: (el.textContent || '').trim().substring(0, 100),
        page_path: location.pathname
      });
    }
  });

  // ---------------------------------------------------------------------------
  // 5. Contact Form Submissions
  // ---------------------------------------------------------------------------
  // Detect form submissions and LeadConnector widget interactions
  document.addEventListener('submit', function (e) {
    var form = e.target;
    if (form && form.tagName === 'FORM') {
      window.dataLayer.push({
        event: 'contact_form_submit',
        form_id: form.id || form.getAttribute('name') || 'unknown',
        page_path: location.pathname
      });
    }
  });

  // Also expose a global for the LeadConnector chat widget callback
  window.weTrackFormSubmit = function (formId) {
    window.dataLayer.push({
      event: 'contact_form_submit',
      form_id: formId || 'leadconnector_widget',
      page_path: location.pathname
    });
  };

  // ---------------------------------------------------------------------------
  // 6. Outbound Link Clicks
  // ---------------------------------------------------------------------------
  document.addEventListener('click', function (e) {
    var el = e.target.closest('a');
    if (!el) return;
    var href = el.getAttribute('href') || '';
    if (!href || href.charAt(0) === '/' || href.charAt(0) === '#') return;
    try {
      var url = new URL(href, location.href);
      if (url.hostname && url.hostname !== location.hostname) {
        window.dataLayer.push({
          event: 'outbound_link_click',
          outbound_url: href,
          link_text: (el.textContent || '').trim().substring(0, 100),
          page_path: location.pathname
        });
      }
    } catch (err) {
      // invalid URL, skip
    }
  });
})();
