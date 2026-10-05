/* Jaxon Doolittle, Technical Consulting: interactions */
(function () {
  'use strict';

  /* ---------- Config ---------- */
  // Number of states whose SBIR support programs share my contact with companies.
  // Shown in the referral strip under the hero. Also update the fallback "4" in index.html.
  var REFERRAL_STATE_COUNT = 4;

  var root = document.documentElement;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var prefersReduced = reduceMotion.matches;
  var hasIO = 'IntersectionObserver' in window;

  /* ---------- Scroll state: nav + aurora shift + progress ---------- */
  var header = document.querySelector('.site-header');
  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      var y = window.scrollY || window.pageYOffset;
      var max = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
      root.style.setProperty('--p', Math.min(1, Math.max(0, y / max)).toFixed(4));
      if (header) header.classList.toggle('scrolled', y > 12);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector('.nav__toggle');
  var menu = document.getElementById('mobile-menu');
  function setMenu(open) {
    if (!toggle || !menu) return;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    menu.hidden = !open;
  }
  if (toggle && menu) {
    toggle.addEventListener('click', function () {
      setMenu(toggle.getAttribute('aria-expanded') !== 'true');
    });
    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) setMenu(false);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
        setMenu(false);
        toggle.focus();
      }
    });
    window.matchMedia('(min-width: 920px)').addEventListener('change', function (mq) {
      if (mq.matches) setMenu(false);
    });
  }

  /* ---------- Active nav link ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav__links a'));
  if (hasIO && navLinks.length) {
    var byId = {};
    navLinks.forEach(function (a) { byId[a.getAttribute('href').slice(1)] = a; });
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = byId[entry.target.id];
        if (!link) return;
        if (entry.isIntersecting) {
          navLinks.forEach(function (a) { a.classList.remove('active'); });
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    Object.keys(byId).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) spy.observe(el);
    });
  }

  /* ---------- Card spotlight (cursor-following) ---------- */
  document.querySelectorAll('.card').forEach(function (card) {
    card.addEventListener('pointermove', function (e) {
      var r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- Stagger delays (80ms between siblings) ---------- */
  document.querySelectorAll('[data-stagger]').forEach(function (group) {
    Array.prototype.forEach.call(group.children, function (child, i) {
      child.style.setProperty('--d', (i * 80) + 'ms');
    });
  });

  /* ---------- Count-up ---------- */
  function countUp(el) {
    var target = parseFloat(el.getAttribute('data-count'));
    var decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
    var suffix = el.getAttribute('data-suffix') || '';
    var duration = 1200;
    var start = null;
    function frame(t) {
      if (start === null) start = t;
      var k = Math.min(1, (t - start) / duration);
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = (target * eased).toFixed(decimals) + suffix;
      if (k < 1) requestAnimationFrame(frame);
    }
    el.textContent = (0).toFixed(decimals) + suffix;
    requestAnimationFrame(frame);
  }

  /* ---------- Reveals ---------- */
  var reveals = document.querySelectorAll('.reveal');
  function reveal(el) {
    el.classList.add('in');
    if (el.classList.contains('card')) {
      var delay = parseInt(el.style.getPropertyValue('--d') || '0', 10);
      setTimeout(function () { el.classList.add('settled'); }, 850 + delay);
    }
    if (!prefersReduced) {
      el.querySelectorAll('[data-count]').forEach(countUp);
    }
  }
  if (prefersReduced || !hasIO) {
    reveals.forEach(function (el) { el.classList.add('in', 'settled'); });
  } else {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          reveal(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    reveals.forEach(function (el) { io.observe(el); });
  }

  /* ---------- Hero log: sequential lines ---------- */
  var lines = document.querySelectorAll('.terminal .t-line');
  if (prefersReduced) {
    lines.forEach(function (l) { l.classList.add('on'); });
  } else {
    var delays = [500, 1000, 1350, 1700, 2500, 3300, 3800];
    lines.forEach(function (l, i) {
      setTimeout(function () { l.classList.add('on'); }, delays[i] || 500 + i * 400);
    });
  }

  /* ---------- Referral strip count ---------- */
  var referral = document.querySelector('.referral');
  if (referral) {
    if (!(REFERRAL_STATE_COUNT >= 1)) {
      referral.hidden = true;
    } else {
      document.querySelectorAll('[data-referral-count]').forEach(function (n) { n.textContent = String(REFERRAL_STATE_COUNT); });
      document.querySelectorAll('[data-referral-unit]').forEach(function (n) { n.textContent = REFERRAL_STATE_COUNT === 1 ? 'state' : 'states'; });
    }
  }

  /* ---------- Contact form ----------
     Posts to Formspree so the email address never appears in the page. Until a
     form ID is set in the form's action, it falls back to opening the visitor's
     mail app, with the address assembled here at click time (scrapers don't run JS). */
  var form = document.getElementById('contact-form');
  var sent = document.getElementById('form-sent');
  function inbox() { return ['jaxonjdoolittle', 'gmail.com'].join('@'); }

  // Links like "Talk about your proposal" pre-select a topic
  document.querySelectorAll('a[href="#contact"]').forEach(function (a) {
    a.addEventListener('click', function () {
      if (!form) return;
      var topic = a.getAttribute('data-topic');
      if (topic) form.elements.topic.value = topic;
    });
  });

  if (form) {
    var statusEl = form.querySelector('.form-status');
    var submitBtn = form.querySelector('button[type="submit"]');
    var submitLabel = submitBtn.querySelector('.btn__label');
    var configured = !/YOUR_FORM_ID/.test(form.getAttribute('action'));

    var setStatus = function (msg, kind) {
      statusEl.textContent = msg;
      statusEl.className = 'form-status form-field--full' + (kind ? ' form-status--' + kind : '');
    };
    var mailtoFallback = function () {
      var f = form.elements;
      var body = f.message.value + '\n\n' + f.name.value +
        (f.organization.value ? ', ' + f.organization.value : '') + '\n' + f.email.value;
      window.location.href = 'mailto:' + inbox() +
        '?subject=' + encodeURIComponent('Website inquiry: ' + f.topic.value) +
        '&body=' + encodeURIComponent(body);
    };
    var showSent = function () {
      form.hidden = true;
      sent.hidden = false;
      sent.focus();
    };

    // The browser's own validation stops the submit before our handler runs,
    // so mark the form and explain from its invalid event instead.
    form.addEventListener('invalid', function () {
      form.classList.add('was-validated');
      setStatus('Please fill in your name, a valid email and a message.', 'error');
    }, true);
    form.addEventListener('input', function () {
      if (form.classList.contains('was-validated') && form.checkValidity()) setStatus('', '');
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!form.checkValidity()) {
        form.classList.add('was-validated');
        var bad = form.querySelector(':invalid');
        if (bad) bad.focus();
        setStatus('Please fill in your name, a valid email and a message.', 'error');
        return;
      }
      var f = form.elements;
      f._subject.value = 'Website inquiry: ' + f.topic.value + ' (' + f.name.value + ')';

      if (!configured) {
        setStatus('Opening your email app with this message filled in.', '');
        mailtoFallback();
        return;
      }

      submitBtn.disabled = true;
      submitLabel.textContent = 'Sending...';
      setStatus('', '');
      fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' }
      }).then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        form.reset();
        showSent();
      }).catch(function () {
        setStatus('', 'error');
        statusEl.appendChild(document.createTextNode("That didn't go through. Try again in a minute, or "));
        var link = document.createElement('a');
        link.href = '#';
        link.textContent = 'send it from your email app';
        link.addEventListener('click', function (ev) { ev.preventDefault(); mailtoFallback(); });
        statusEl.appendChild(link);
        statusEl.appendChild(document.createTextNode('.'));
      }).then(function () {
        submitBtn.disabled = false;
        submitLabel.textContent = 'Send message';
      });
    });
  }

  /* ---------- One pager: hide the download links until the PDF is uploaded ---------- */
  var onePagers = document.querySelectorAll('[data-onepager]');
  if (onePagers.length && /^https?:$/.test(location.protocol) && window.fetch) {
    fetch(onePagers[0].getAttribute('href'), { method: 'HEAD', cache: 'no-store' }).then(function (res) {
      if (res.ok) return;
      onePagers.forEach(function (a) {
        var li = a.parentElement && a.parentElement.tagName === 'LI' ? a.parentElement : null;
        (li || a).hidden = true;
      });
    }, function () { /* network error: leave the links alone */ });
  }

  /* ---------- Adaptive quality ----------
     1s after the page has fully loaded, count frames for two 1-second windows.
     If both come in under 45fps, switch to lite mode and remember it for 7 days.
     ?full in the URL forces full mode and skips the check. */
  var FORCE_FULL = /[?&]full(?:[=&]|$)/.test(location.search);
  var PERF_KEY = 'perf-mode';
  var LITE_MS = 7 * 24 * 60 * 60 * 1000;
  var MIN_FPS = 45;

  function isLite() { return root.classList.contains('lite'); }
  function enableLite() {
    if (isLite()) return;
    root.classList.add('lite');
    try {
      localStorage.setItem(PERF_KEY, JSON.stringify({ mode: 'lite', until: Date.now() + LITE_MS }));
    } catch (e) {}
    document.dispatchEvent(new CustomEvent('perfmodechange'));
  }
  function measureFps() {
    if (document.hidden) {
      // rAF doesn't run in a background tab, so wait until the page is visible again
      document.addEventListener('visibilitychange', function retry() {
        if (document.hidden) return;
        document.removeEventListener('visibilitychange', retry);
        setTimeout(measureFps, 1000);
      });
      return;
    }
    var windows = [], frames = 0, windowStart = 0, aborted = false;
    function onHide() { if (document.hidden) aborted = true; }
    document.addEventListener('visibilitychange', onHide);
    function finish() {
      document.removeEventListener('visibilitychange', onHide);
      if (aborted) { measureFps(); return; }
      root.setAttribute('data-fps', windows.map(function (f) { return Math.round(f); }).join(','));
      if (windows[0] < MIN_FPS && windows[1] < MIN_FPS) enableLite();
    }
    function tick(t) {
      if (aborted) { finish(); return; }
      if (!windowStart) { windowStart = t; requestAnimationFrame(tick); return; }
      frames++;
      if (t - windowStart >= 1000) {
        windows.push(frames * 1000 / (t - windowStart));
        frames = 0;
        windowStart = t;
      }
      if (windows.length < 2) requestAnimationFrame(tick); else finish();
    }
    requestAnimationFrame(tick);
  }
  if (FORCE_FULL) {
    root.classList.remove('lite');
  } else if (!isLite()) {
    var scheduleMeasure = function () { setTimeout(measureFps, 1000); };
    if (document.readyState === 'complete') scheduleMeasure();
    else window.addEventListener('load', scheduleMeasure);
  }

  /* ---------- Hero particle field (solar wind) ---------- */
  var canvas = document.querySelector('.hero__particles');
  if (canvas && !prefersReduced && canvas.getContext) {
    var ctx = canvas.getContext('2d');
    var hero = canvas.parentElement;
    var particles = [];
    var W = 0, H = 0, dpr = 1, lite = false;
    var running = false, visible = true, rafId = 0, last = 0;
    var LINK = 110;
    var FRAME = 1000 / 60;

    function pickColor() {
      var r = Math.random();
      if (r < 0.58) return [241, 245, 255];
      if (r < 0.9) return [61, 220, 208];
      if (r < 0.96) return [206, 0, 255];
      return [222, 35, 158];
    }
    function makeParticle(anyX) {
      return {
        x: anyX ? Math.random() * W : -10,
        y: Math.random() * H,
        vx: 0.18 + Math.random() * 0.42,
        vy: (Math.random() - 0.5) * 0.08,
        r: 1 + Math.random(),
        a: 0.25 + Math.random() * 0.45,
        c: pickColor()
      };
    }
    function resize() {
      var rect = hero.getBoundingClientRect();
      lite = isLite();
      dpr = lite ? 1 : Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.round(W * dpr);
      canvas.height = Math.round(H * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      var count = W < 700 ? 34 : W < 1100 ? 52 : 70;
      if (lite) count = Math.min(count, 25);
      particles.length = 0;
      for (var i = 0; i < count; i++) particles.push(makeParticle(true));
    }
    function draw() {
      ctx.clearRect(0, 0, W, H);
      var n = particles.length, i, j, p, q, dx, dy, d2, alpha;
      for (i = 0; i < n; i++) {
        p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        if (p.x > W + 10) { particles[i] = makeParticle(false); continue; }
        if (p.y < -10) p.y = H + 10;
        if (p.y > H + 10) p.y = -10;
      }
      ctx.lineWidth = 0.6;
      for (i = 0; i < n && !lite; i++) {
        p = particles[i];
        for (j = i + 1; j < n; j++) {
          q = particles[j];
          dx = p.x - q.x; dy = p.y - q.y;
          d2 = dx * dx + dy * dy;
          if (d2 < LINK * LINK) {
            alpha = (1 - Math.sqrt(d2) / LINK) * 0.16;
            ctx.strokeStyle = 'rgba(61,220,208,' + alpha.toFixed(3) + ')';
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.stroke();
          }
        }
      }
      for (i = 0; i < n; i++) {
        p = particles[i];
        ctx.fillStyle = 'rgba(' + p.c[0] + ',' + p.c[1] + ',' + p.c[2] + ',' + p.a + ')';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    function loop(t) {
      if (!running) return;
      rafId = requestAnimationFrame(loop);
      // Cap at 60fps on high-refresh screens. Carrying the remainder keeps the
      // cadence at a true 60 (a plain "last = t" lets 144Hz screens run at 72).
      var elapsed = t - last;
      if (elapsed < FRAME - 0.5) return;
      last = elapsed > FRAME * 4 ? t : t - (elapsed % FRAME);
      draw();
    }
    function start() {
      if (running || !visible || document.hidden) return;
      running = true;
      last = 0;
      rafId = requestAnimationFrame(loop);
    }
    function stop() {
      running = false;
      cancelAnimationFrame(rafId);
    }

    resize();
    var resizeTimer;
    window.addEventListener('resize', function () {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(resize, 150);
    }, { passive: true });
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });
    document.addEventListener('perfmodechange', resize);
    if (hasIO) {
      new IntersectionObserver(function (entries) {
        visible = entries[0].isIntersecting;
        if (visible) start(); else stop();
      }).observe(hero);
    }
    start();
  }
})();
