(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Nav: sfondo allo scroll + menu mobile ---- */
  const nav = $('.nav');
  const fab = $('.fab');
  const hero = $('.hero');
  const onScroll = () => {
    const y = window.scrollY;
    nav.classList.toggle('is-solid', y > 80);
    if (fab && hero) fab.classList.toggle('is-visible', y > hero.offsetHeight - window.innerHeight * 0.3);
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

  /* ---- Sezione corrente nel menu ---- */
  const links = $$('.nav__links a');
  const sections = links.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) links.forEach(l => l.classList.toggle('is-current', l.getAttribute('href') === '#' + e.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* ---- Comparsa allo scroll ---- */
  const reveals = $$('.reveal');
  if (!('IntersectionObserver' in window) || reduce) {
    reveals.forEach(el => el.classList.add('is-in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const siblings = $$(':scope > .reveal', e.target.parentElement);
        const i = Math.max(0, siblings.indexOf(e.target));
        e.target.style.transitionDelay = Math.min(i * 80, 320) + 'ms';
        e.target.classList.add('is-in');
        io.unobserve(e.target);
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    reveals.forEach(el => io.observe(el));
  }

  /* ---- Frollatura ---- */
  const ages = [
    { t: 'Fresca e succosa', d: 'Sapore pulito e fibra tenera: il gusto più vicino alla carne appena tagliata. Ideale per battute e carpacci.' },
    { t: 'Equilibrio', d: 'La carne diventa più morbida e il sapore si concentra: il punto d’incontro tra succosità e carattere.' },
    { t: 'Note di nocciola', d: 'Compaiono aromi tostati e di frutta secca, la consistenza si fa quasi burrosa. Per chi ama la bistecca.' },
    { t: 'Per intenditori', d: 'Profumi intensi e profondi: una carne da gustare con calma, per palati curiosi.' }
  ];
  const tabs = $$('.aging__tabs button');
  const fill = $('.aging__fill');
  const panel = $('.aging__panel');
  tabs.forEach((btn, i) => btn.addEventListener('click', () => {
    tabs.forEach(b => b.setAttribute('aria-selected', String(b === btn)));
    fill.style.width = ((i + 1) / tabs.length * 100) + '%';
    $('.aging__title').textContent = ages[i].t;
    $('.aging__desc').textContent = ages[i].d;
    panel.classList.remove('is-swapping'); void panel.offsetWidth; panel.classList.add('is-swapping');
  }));

  /* ---- Menù: anteprima foto al passaggio ---- */
  const preview = $('.menu__previewimg');
  const dishes = $$('.dish');
  let current = preview ? preview.getAttribute('src') : '';
  const show = (dish) => {
    dishes.forEach(d => d.classList.toggle('is-active', d === dish));
    const src = dish.dataset.img;
    if (!preview || !src || src === current) return;
    current = src;
    preview.classList.add('is-fading');
    const img = new Image();
    img.onload = () => { preview.src = src; preview.classList.remove('is-fading'); };
    img.src = src;
  };
  dishes.forEach(d => d.addEventListener('mouseenter', () => show(d)));

  /* ---- Menù: filtro ---- */
  const chips = $$('.chip');
  const applyFilter = (f) => {
    chips.forEach(c => c.classList.toggle('is-active', c.dataset.filter === f));
    dishes.forEach(d => {
      const tags = (d.dataset.tags || '').split(' ');
      d.classList.toggle('is-dim', f !== 'all' && !tags.includes(f));
    });
    const first = dishes.find(d => !d.classList.contains('is-dim'));
    if (first) show(first);
  };
  chips.forEach(c => c.addEventListener('click', () => applyFilter(c.dataset.filter)));
  const vegLink = $('[data-veg-link]');
  if (vegLink) vegLink.addEventListener('click', () => applyFilter('veg'));

  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();
