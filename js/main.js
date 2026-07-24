/* =========================================================
   JUST ENJOY EVENTS — SHARED SITE SCRIPT
   Handles: mobile nav, FAQ accordion, portfolio filters,
   scroll reveal animation, and form submissions (demo only).
   ========================================================= */

document.addEventListener('DOMContentLoaded', function () {

  /* ---- Mobile nav toggle ---- */
  var navToggle = document.querySelector('.nav-toggle');
  var navLinks = document.querySelector('.nav-links');
  var siteHeader = document.querySelector('.site-header');

  /* Measure the header's real rendered height (it can grow if the logo
     wraps onto 2 lines on a narrow screen) and store it as a CSS variable,
     so the mobile menu always starts exactly below the header instead of
     assuming a fixed pixel value. Re-measures on resize/orientation change. */
  function setHeaderHeightVar() {
    if (siteHeader) {
      document.documentElement.style.setProperty('--header-h', siteHeader.offsetHeight + 'px');
    }
  }
  setHeaderHeightVar();
  window.addEventListener('resize', setHeaderHeightVar);
  window.addEventListener('orientationchange', setHeaderHeightVar);

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', function () {
      setHeaderHeightVar(); // re-measure right before opening, just in case
      navLinks.classList.toggle('open');
      document.body.classList.toggle('nav-open', navLinks.classList.contains('open'));
    });
    navLinks.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', function () {
        navLinks.classList.remove('open');
        document.body.classList.remove('nav-open');
      });
    });
  }

  window.addEventListener('scroll', function() {
    if(window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classicList.remove('scrolled');
    }
  }
  );
  /* ---- FAQ accordion ---- */
  document.querySelectorAll('.accordion-item').forEach(function (item) {
    var q = item.querySelector('.accordion-q');
    if (!q) return;
    q.addEventListener('click', function () {
      var wasOpen = item.classList.contains('open');
      item.parentElement.querySelectorAll('.accordion-item').forEach(function (i) {
        i.classList.remove('open');
      });
      if (!wasOpen) item.classList.add('open');
    });
  });

  /* ---- Portfolio filters ---- */
  var filterBtns = document.querySelectorAll('.filter-btn');
  var portfolioItems = document.querySelectorAll('.portfolio-item');
  filterBtns.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filterBtns.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var cat = btn.getAttribute('data-filter');
      portfolioItems.forEach(function (item) {
        if (cat === 'all' || item.getAttribute('data-category') === cat) {
          item.classList.remove('hidden');
        } else {
          item.classList.add('hidden');
        }
      });
    });
  });

  /* ---- Demo form handler (no backend connected yet) ----
     Shows a success message only — nothing is actually sent anywhere.
     Used automatically as a fallback if a Google Form isn't configured. */
  document.querySelectorAll('form[data-demo-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      showSuccess(form);
      form.reset();
    });
  });

  /* ---- Google Forms handler ----
     Sends each field to a connected Google Form using its "entry.XXXX"
     field IDs. See README.md "Connecting the forms to Google Forms" for
     how to get data-google-action and each field's data-entry value.
     Google Forms doesn't allow reading the response (no CORS), so we
     fire the request in "no-cors" mode and just trust it went through —
     this is the standard approach for this kind of integration. */
  document.querySelectorAll('form[data-google-form]').forEach(function (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();

      var actionUrl = form.getAttribute('data-google-action');
      if (!actionUrl || actionUrl.indexOf('REPLACE_WITH') === 0) {
        alert('This form isn\'t connected to Google Forms yet. See README.md for setup steps.');
        return;
      }

      var payload = new FormData();

      // Regular single-value fields (short answer, dropdown, etc.)
      var fields = form.querySelectorAll('[data-entry]');
      fields.forEach(function (field) {
        var entryId = field.getAttribute('data-entry');
        if (entryId && entryId.indexOf('REPLACE_') === -1) {
          payload.append(entryId, field.value);
        }
      });

      // Google Forms "Date" questions split into 3 hidden fields
      // (year/month/day) instead of one entry id. An <input type="date">
      // gives a value like "2026-07-22" — split it into the 3 pieces here.
      var dateFields = form.querySelectorAll('[data-entry-year]');
      dateFields.forEach(function (field) {
        var parts = (field.value || '').split('-'); // [YYYY, MM, DD]
        if (parts.length === 3) {
          payload.append(field.getAttribute('data-entry-year'), parts[0]);
          payload.append(field.getAttribute('data-entry-month'), parts[1]);
          payload.append(field.getAttribute('data-entry-day'), parts[2]);
        }
      });

      fetch(actionUrl, {
        method: 'POST',
        mode: 'no-cors',
        body: payload
      }).then(function () {
        showSuccess(form);
        form.reset();
      }).catch(function () {
        // no-cors responses are always "opaque", so this only fires on
        // real network failures (e.g. offline, wrong URL)
        alert('Something went wrong sending this — please check your connection and try again.');
      });
    });
  });

  function showSuccess(form) {
    var successBox = form.parentElement.querySelector('.form-success');
    if (successBox) {
      successBox.classList.add('show');
      successBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  /* ---- Scroll reveal ---- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---- Set active nav link based on current page ---- */
  var current = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach(function (link) {
    var href = link.getAttribute('href');
    if (href === current) link.classList.add('active');
  });

});
