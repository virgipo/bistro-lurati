(() => {
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---- Lingua IT / EN / DE ---- */
  const LANGS = ['it', 'en', 'de'];
  const META = {
    it: {
      title: document.title,
      desc: $('meta[name="description"]').getAttribute('content')
    },
    en: {
      title: 'Bistró Lurati · Porlezza — Butchers since 1927',
      desc: 'Bistró Lurati, in the heart of Porlezza on Lake Lugano: a family-run bistro by a family of butchers since 1927. Selected meat, homemade pasta, seasonal dishes and private events.'
    },
    de: {
      title: 'Bistró Lurati · Porlezza — Metzger seit 1927',
      desc: 'Bistró Lurati im Herzen von Porlezza am Luganersee: ein Familienbistro einer Metzgerfamilie seit 1927. Ausgewähltes Fleisch, hausgemachte Pasta, saisonale Gerichte und private Events.'
    }
  };
  const translatable = $$('[data-en]');
  translatable.forEach(el => { el.dataset.it = el.innerHTML; });

  const setLang = (lang) => {
    if (!LANGS.includes(lang)) lang = 'it';
    translatable.forEach(el => { el.innerHTML = el.dataset[lang] || el.dataset.it; });
    document.documentElement.lang = lang;
    document.title = META[lang].title;
    $('meta[name="description"]').setAttribute('content', META[lang].desc);
    $$('.lang__btn').forEach(b => {
      const on = b.dataset.lang === lang;
      b.classList.toggle('is-active', on);
      b.setAttribute('aria-pressed', String(on));
    });
    try { localStorage.setItem('lang', lang); } catch (e) {}
  };
  $$('.lang__btn').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

  let initial = 'it';
  try {
    const q = new URLSearchParams(location.search).get('lang');
    const saved = localStorage.getItem('lang');
    const nav2 = (navigator.language || 'it').slice(0, 2).toLowerCase();
    if (LANGS.includes(q)) initial = q;
    else if (LANGS.includes(saved)) initial = saved;
    else if (nav2 === 'de') initial = 'de';
    else if (nav2 !== 'it') initial = 'en';
  } catch (e) {}
  if (initial !== 'it') setLang(initial);

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

  const y = $('#year');
  if (y) y.textContent = new Date().getFullYear();
})();

/* ---- Torna su: l'header è fisso, quindi scorriamo noi in cima ---- */
document.querySelectorAll('a[href="#top"]').forEach(a => a.addEventListener('click', e => {
  e.preventDefault();
  window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  history.replaceState(null, '', location.pathname + location.search);
}));
