/* "Selected by SBIR programs": a client-wall style band under the hero chips.
   Built here from the list below. If no entry is confirmed, nothing is added
   to the page at all: no heading, no empty state. */
(function () {
  'use strict';

  // Set confirmed to true ONLY after the program has confirmed the role in writing
  // AND agreed to being named on this site. Text only: no logos, seals or images.
  //   org:   the program's full name, shown large
  //   state: two-letter state code, shown in a small badge above the name
  //   label: your role with that program
  var PROGRAM_NETWORKS = [
    { org: "Hawaii Technology Development Corporation", state: "HI", label: "Listed technical provider", confirmed: false },
    { org: "Wisconsin Center for Technology Commercialization", state: "WI", label: "Expert panel reviewer", confirmed: false },
    { org: "Arizona Commerce Authority", state: "AZ", label: "SBIR referral resource", confirmed: false },
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
  section.style.setProperty('--n', Math.min(confirmed.length, 4));

  var band = el('div', 'networks__band glass');
  band.appendChild(el('span', 'networks__sheen')).setAttribute('aria-hidden', 'true');

  var eyebrow = el('p', 'networks__eyebrow', '// SELECTED BY SBIR PROGRAMS');
  eyebrow.id = 'networks-title';
  band.appendChild(eyebrow);

  var row = el('ul', 'networks__row');
  row.setAttribute('role', 'list');
  confirmed.forEach(function (n) {
    var item = el('li', 'network');
    if (n.state) item.appendChild(el('span', 'network__state', n.state));
    item.appendChild(el('span', 'network__org', n.org));
    var role = el('span', 'network__role');
    role.appendChild(el('span', 'network__dot')).setAttribute('aria-hidden', 'true');
    role.appendChild(document.createTextNode(n.label));
    item.appendChild(role);
    row.appendChild(item);
  });
  band.appendChild(row);
  section.appendChild(band);

  // Joins the hero grid so it sits directly below the credibility chips on every
  // screen size (see .hero--networks in styles.css), above "The problem"
  heroGrid.appendChild(section);
  heroGrid.closest('.hero').classList.add('hero--networks');
})();
