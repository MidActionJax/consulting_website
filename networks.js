/* "Trusted by" panel under the hero chips.
   Built here from the list below. If no entry is confirmed, nothing is added to
   the page at all: no heading, no empty state.
     1 confirmed   one featured card beside the headline
     2 confirmed   two cards side by side
     3+ confirmed  a carousel: one card in focus, the others set back behind it */
(function () {
  'use strict';

  // Set confirmed to true ONLY after the program has confirmed the role in writing
  // AND agreed to being named on this site. Text only: no logos, seals or images.
  //   org:    the program's full name
  //   state:  two-letter state code (badge and background mark)
  //   role:   your role with the program, short
  //   detail: one line on what that role means
  var PROGRAM_NETWORKS = [
    {
      org: "Hawaii Technology Development Corporation", state: "HI",
      role: "Listed Technical Expert",
      detail: "Named on the list Hawaii founders use to find technical help for SBIR work.",
      confirmed: false,
    },
    {
      org: "Wisconsin Center for Technology Commercialization", state: "WI",
      role: "Expert Panel Reviewer",
      detail: "Sits on expert panels that pressure-test SBIR proposals before they're submitted.",
      confirmed: false,
    },
    {
      org: "Arizona Commerce Authority", state: "AZ",
      role: "Recommended Technical Expert",
      detail: "Arizona founders are pointed my way when their SBIR work needs a technical lead.",
      confirmed: false,
    },
  ];

  var confirmed = PROGRAM_NETWORKS.filter(function (n) { return n.confirmed === true; });
  if (!confirmed.length) return;

  var heroGrid = document.querySelector('.hero__inner');
  if (!heroGrid) return;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  function card(n, tag) {
    var c = el(tag || 'article', 'program-card glass');
    var mark = el('span', 'program-card__mark', n.state);
    mark.setAttribute('aria-hidden', 'true');
    c.appendChild(mark);
    var top = el('div', 'program-card__top');
    if (n.state) top.appendChild(el('span', 'program-card__state', n.state));
    c.appendChild(top);
    c.appendChild(el('h3', 'program-card__org', n.org));
    var role = el('p', 'program-card__role');
    role.appendChild(el('span', 'program-card__dot')).setAttribute('aria-hidden', 'true');
    role.appendChild(document.createTextNode(n.role));
    c.appendChild(role);
    if (n.detail) c.appendChild(el('p', 'program-card__detail', n.detail));
    return c;
  }

  /* ---------- Panel ---------- */
  var section = el('section', 'networks reveal');
  section.setAttribute('aria-labelledby', 'networks-title');

  var panel = el('div', 'networks__panel glass');
  panel.appendChild(el('span', 'networks__sheen')).setAttribute('aria-hidden', 'true');

  var intro = el('div', 'networks__intro');
  intro.appendChild(el('p', 'eyebrow networks__eyebrow', '// TRUSTED BY'));
  var title = el('h2', 'networks__title');
  title.id = 'networks-title';
  title.appendChild(document.createTextNode('The programs that back '));
  title.appendChild(el('span', 'text-grad', 'SBIR founders'));
  intro.appendChild(title);
  intro.appendChild(el('p', 'networks__lede',
    'The state programs that support SBIR and STTR companies bring me in when the technical side has to be right.'));
  var states = confirmed.map(function (n) { return n.state; }).filter(Boolean);
  if (states.length > 1) intro.appendChild(el('p', 'networks__states', states.join('  ·  ')));
  panel.appendChild(intro);

  var stage = el('div', 'networks__stage');
  panel.appendChild(stage);

  if (confirmed.length < 3) {
    stage.setAttribute('data-mode', confirmed.length === 1 ? 'single' : 'pair');
    var list = el('ul', 'networks__cards');
    list.setAttribute('role', 'list');
    confirmed.forEach(function (n) { list.appendChild(card(n, 'li')); });
    stage.appendChild(list);
  } else {
    stage.setAttribute('data-mode', 'carousel');
    buildCarousel(stage, confirmed);
  }

  section.appendChild(panel);

  // Joins the hero grid so it sits directly below the credibility chips on every
  // screen size (see .hero--networks in styles.css), above "The problem"
  heroGrid.appendChild(section);
  heroGrid.closest('.hero').classList.add('hero--networks');

  /* ---------- Carousel (3 or more) ---------- */
  function buildCarousel(host, items) {
    var n = items.length;
    var active = 0;
    var AUTO_MS = 5500;
    var timer = null;
    var hovering = false, focused = false, userPaused = reduceMotion, onScreen = true;

    var root = el('div', 'carousel');
    root.setAttribute('role', 'region');
    root.setAttribute('aria-roledescription', 'carousel');
    root.setAttribute('aria-label', 'Programs');

    var track = el('div', 'carousel__track');
    var slides = items.map(function (item, i) {
      var s = card(item);
      s.setAttribute('role', 'group');
      s.setAttribute('aria-roledescription', 'slide');
      s.setAttribute('aria-label', (i + 1) + ' of ' + n + ': ' + item.org);
      s.addEventListener('click', function () { if (i !== active) { go(i, true); } });
      track.appendChild(s);
      return s;
    });
    root.appendChild(track);

    var controls = el('div', 'carousel__controls');
    var prev = el('button', 'carousel__btn carousel__btn--prev');
    prev.type = 'button';
    prev.setAttribute('aria-label', 'Previous program');
    prev.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M12.5 4.5 7 10l5.5 5.5"/></svg>';
    var dots = el('div', 'carousel__dots');
    var dotButtons = items.map(function (item, i) {
      var d = el('button', 'carousel__dot');
      d.type = 'button';
      d.setAttribute('aria-label', 'Show ' + item.org);
      d.addEventListener('click', function () { go(i, true); });
      dots.appendChild(d);
      return d;
    });
    var next = el('button', 'carousel__btn carousel__btn--next');
    next.type = 'button';
    next.setAttribute('aria-label', 'Next program');
    next.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 4.5 13 10l-5.5 5.5"/></svg>';
    var pause = el('button', 'carousel__btn carousel__btn--pause');
    pause.type = 'button';
    controls.appendChild(prev);
    controls.appendChild(dots);
    controls.appendChild(next);
    controls.appendChild(pause);
    root.appendChild(controls);

    var status = el('p', 'sr-only');
    status.setAttribute('aria-live', 'polite');
    root.appendChild(status);
    host.appendChild(root);

    prev.addEventListener('click', function () { go(active - 1, true); });
    next.addEventListener('click', function () { go(active + 1, true); });
    pause.addEventListener('click', function () { userPaused = !userPaused; sync(); });

    root.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1, true); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1, true); }
    });
    root.addEventListener('mouseenter', function () { hovering = true; sync(); });
    root.addEventListener('mouseleave', function () { hovering = false; sync(); });
    root.addEventListener('focusin', function () { focused = true; sync(); });
    root.addEventListener('focusout', function (e) { if (!root.contains(e.relatedTarget)) { focused = false; sync(); } });
    document.addEventListener('visibilitychange', sync);
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(function (entries) { onScreen = entries[0].isIntersecting; sync(); }).observe(root);
    }

    // Swipe on touch screens
    var startX = null;
    track.addEventListener('pointerdown', function (e) { startX = e.clientX; });
    track.addEventListener('pointerup', function (e) {
      if (startX === null) return;
      var dx = e.clientX - startX;
      startX = null;
      if (Math.abs(dx) > 40) go(active + (dx < 0 ? 1 : -1), true);
    });

    function layout() {
      slides.forEach(function (s, i) {
        var d = i - active;
        if (d > n / 2) d -= n;
        if (d < -n / 2) d += n;
        s.style.setProperty('--d', d);
        s.setAttribute('data-pos', d === 0 ? 'center' : Math.abs(d) === 1 ? 'side' : 'hidden');
        if (Math.abs(d) > 1) s.setAttribute('aria-hidden', 'true'); else s.removeAttribute('aria-hidden');
      });
      dotButtons.forEach(function (d, i) {
        if (i === active) d.setAttribute('aria-current', 'true'); else d.removeAttribute('aria-current');
      });
    }
    function go(i, byUser) {
      active = (i % n + n) % n;
      layout();
      if (byUser) {
        status.textContent = 'Showing ' + (active + 1) + ' of ' + n + ': ' + items[active].org;
        restart();
      }
    }
    function running() {
      return !userPaused && !hovering && !focused && onScreen && !document.hidden;
    }
    function restart() {
      clearInterval(timer);
      timer = running() ? setInterval(function () { go(active + 1, false); }, AUTO_MS) : null;
    }
    var drawnPaused = null;
    function sync() {
      // Redraw the icon only when the state changes: swapping it on every focus
      // event removes the element under the pointer and the click gets dropped.
      if (drawnPaused !== userPaused) {
        drawnPaused = userPaused;
        pause.setAttribute('aria-label', userPaused ? 'Play carousel' : 'Pause carousel');
        pause.innerHTML = userPaused
          ? '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7 5v10l8-5z"/></svg>'
          : '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M7.5 5v10M12.5 5v10"/></svg>';
        pause.classList.toggle('is-paused', userPaused);
      }
      if (running() !== (timer !== null)) restart();
    }

    layout();
    sync();
  }
})();
