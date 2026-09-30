/* Program networks: credibility strip under the hero chips.
   The section is built here from the list below. If no entry is confirmed,
   nothing is added to the page at all: no heading, no empty state. */
(function () {
  'use strict';

  // Set confirmed to true ONLY after the program has confirmed the role in writing
  // AND agreed to being named on this site. Text only: no logos, seals or images.
  var PROGRAM_NETWORKS = [
    { label: "Listed technical provider", org: "Hawaii Technology Development Corporation", confirmed: false },
    { label: "Expert reviewer, SBIR pre-submission panels", org: "Wisconsin Center for Technology Commercialization", confirmed: false },
    { label: "Referral resource, SBIR programs", org: "Arizona Commerce Authority", confirmed: false },
  ];

  var confirmed = PROGRAM_NETWORKS.filter(function (n) { return n.confirmed === true; });
  if (!confirmed.length) return;

  var heroGrid = document.querySelector('.hero__inner');
  if (!heroGrid) return;

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text) node.textContent = text;
    return node;
  }

  var section = el('section', 'networks reveal');
  section.setAttribute('aria-labelledby', 'networks-title');

  var strip = el('div', 'networks__strip glass');
  var eyebrow = el('p', 'eyebrow networks__eyebrow', '// PROGRAM NETWORKS');
  eyebrow.id = 'networks-title';
  strip.appendChild(eyebrow);

  var list = el('ul', 'networks__list');
  list.setAttribute('role', 'list');
  confirmed.forEach(function (n) {
    var item = el('li', 'network-chip');
    var dot = el('span', 'network-chip__dot');
    dot.setAttribute('aria-hidden', 'true');
    var text = el('span', 'network-chip__text');
    text.appendChild(el('span', 'network-chip__org', n.org));
    text.appendChild(el('span', 'network-chip__label', n.label));
    item.appendChild(dot);
    item.appendChild(text);
    list.appendChild(item);
  });
  strip.appendChild(list);
  section.appendChild(strip);

  // Joins the hero grid so it sits directly below the credibility chips on every
  // screen size (see .hero--networks in styles.css), above "The problem"
  heroGrid.appendChild(section);
  heroGrid.closest('.hero').classList.add('hero--networks');
})();
