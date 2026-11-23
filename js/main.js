(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Nav: solid on scroll + mobile toggle ---- */
  const nav = $('.nav');
  const fab = $('.fab');
  const hero = $('.hero');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-solid', y > 60);
    if (fab && hero) fab.classList.toggle('is-visible', y > hero.offsetHeight * 0.7);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const toggle = $('.nav__toggle');
  const mobile = $('#mobileNav');
  const setMenu = (open) => {
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Chiudi menù' : 'Apri menù');
    mobile.hidden = !open;
    nav.classList.toggle('is-open', open);
  };
  toggle.addEventListener('click', () => setMenu(mobile.hidden));
  $$('a', mobile).forEach(a => a.addEventListener('click', () => setMenu(false)));

  /* ---- Current section highlight ---- */
  const links = $$('.nav__links a');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          links.forEach(l => l.classList.toggle('is-current', l.getAttribute('href') === '#' + e.target.id));
        }
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---- Reveal on scroll ---- */
  const reveals = $$('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          const siblings = $$('.reveal', e.target.parentElement);
          const i = Math.max(0, siblings.indexOf(e.target));
          e.target.style.transitionDelay = Math.min(i * 90, 360) + 'ms';
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ---- Dry-aging selector ---- */
  const ages = [
    { t: 'Fresca e succosa', d: 'Sapore pulito, fibra tenera, il gusto più vicino alla carne appena tagliata. Perfetta per tartare e carpacci.' },
    { t: 'Equilibrio', d: 'La carne si fa più morbida e il sapore si concentra. Il punto d’incontro ideale tra succosità e carattere.' },
    { t: 'Note di nocciola', d: 'Compaiono aromi tostati e di frutta secca, la consistenza diventa quasi burrosa. Per chi ama la bistecca.' },
    { t: 'Per intenditori', d: 'Profumi intensi, quasi di formaggio stagionato: una carne da gustare con calma, per palati curiosi.' }
  ];
  const tabs = $$('.aging__tabs button');
  const fill = $('.aging__fill');
  const panel = $('.aging__panel');
  const title = $('.aging__title');
  const desc = $('.aging__desc');
  tabs.forEach((btn, i) => {
    btn.addEventListener('click', () => {
      tabs.forEach(b => b.setAttribute('aria-selected', String(b === btn)));
      fill.style.width = ((i + 1) / tabs.length * 100) + '%';
      title.textContent = ages[i].t;
      desc.textContent = ages[i].d;
      panel.classList.remove('is-swapping');
      void panel.offsetWidth;
      panel.classList.add('is-swapping');
    });
  });

  /* ---- Menu filter ---- */
  const chips = $$('.chip');
  const dishes = $$('.dish');
  const applyFilter = (f) => {
    chips.forEach(c => c.classList.toggle('is-active', c.dataset.filter === f));
    dishes.forEach(d => {
      const tags = (d.dataset.tags || '').split(' ');
      d.classList.toggle('is-dim', f !== 'all' && !tags.includes(f));
    });
  };
  chips.forEach(c => c.addEventListener('click', () => applyFilter(c.dataset.filter)));
  const vegLink = $('[data-veg-link]');
  if (vegLink) vegLink.addEventListener('click', () => applyFilter('veg'));

  /* ---- Subtle parallax on quote band ---- */
  const band = $('.band');
  const bandMedia = $('.band__media');
  if (band && bandMedia && !reduce) {
    const par = () => {
      const r = band.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) return;
      const p = (r.top + r.height / 2 - window.innerHeight / 2) / window.innerHeight;
      bandMedia.style.transform = `translate3d(0, ${p * -60}px, 0)`;
    };
    window.addEventListener('scroll', par, { passive: true });
    par();
  }

  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
