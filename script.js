/* ===== OrbitX: navbar loader + navbar logic + hero video ===== */

// 1) navbar.html ko har page me load karo
async function loadNavbar() {
  const placeholder = document.getElementById('navbar-placeholder');
  if (!placeholder) return;

  try {
    const res = await fetch('navbar.html');
    if (!res.ok) throw new Error('navbar.html not found');
    placeholder.innerHTML = await res.text();
  } catch (err) {
    // file:// se kholne par yahi error aata hai: VS Code me "Go Live" se kholo
    console.error('navbar.html load nahi hua (Live Server se kholo):', err);
    return;
  }
  initNavbar();               // navbar aane ke BAAD hi JS chalao
  markActiveLink();
}

// 2) current page ka link highlight (aria-current)
function markActiveLink() {
  const current = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('#navMenu a').forEach(a => {
    if (a.getAttribute('href') === current) a.setAttribute('aria-current', 'page');
  });
}

// 3) navbar ka behaviour (dropdown, hamburger, scroll)
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const menu = document.getElementById('navMenu');
  const items = document.querySelectorAll('.has-dropdown');
  const desktop = window.matchMedia('(min-width: 1025px)');
  let closeTimer;

  if (!navbar || !hamburger || !menu) {
    console.error('navbar.html me id="navbar", id="hamburger" ya id="navMenu" nahi mila');
    return;
  }

  function setOpen(item, state) {
    item.classList.toggle('open', state);
    item.querySelector('.nav-link').setAttribute('aria-expanded', state);
  }
  function closeAll(except) {
    items.forEach(i => { if (i !== except) setOpen(i, false); });
  }
  function fitDropdown(item) {
    const dd = item.querySelector('.dropdown');
    dd.classList.remove('align-right');
    if (desktop.matches && dd.getBoundingClientRect().right > window.innerWidth - 16) {
      dd.classList.add('align-right');
    }
  }

  items.forEach(item => {
    const btn = item.querySelector('.nav-link');
    item.addEventListener('mouseenter', () => {
      if (!desktop.matches) return;
      clearTimeout(closeTimer);
      closeAll(item);
      fitDropdown(item);
      setOpen(item, true);
    });
    item.addEventListener('mouseleave', () => {
      if (!desktop.matches) return;
      closeTimer = setTimeout(() => setOpen(item, false), 120);
    });
    btn.addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');
      closeAll(item);
      fitDropdown(item);
      setOpen(item, willOpen);
    });
  });

  function toggleMenu(force) {
    const open = typeof force === 'boolean' ? force : !menu.classList.contains('open');
    menu.classList.toggle('open', open);
    hamburger.classList.toggle('active', open);
    hamburger.setAttribute('aria-expanded', open);
    hamburger.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
    document.body.style.overflow = open ? 'hidden' : '';
    if (!open) closeAll();
  }
  hamburger.addEventListener('click', () => toggleMenu());

  document.addEventListener('click', e => {
    if (!e.target.closest('.has-dropdown')) closeAll();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') { closeAll(); toggleMenu(false); }
  });
  desktop.addEventListener('change', () => { toggleMenu(false); closeAll(); });

  // neeche scroll = navbar hide, upar scroll = navbar show; scroll > 40px par background
  let lastY = window.scrollY;
  const onScroll = () => {
    const y = window.scrollY;
    navbar.classList.toggle('scrolled', y > 40);

    if (menu.classList.contains('open')) { lastY = y; return; } // mobile menu khula ho to hide mat karo
    if (Math.abs(y - lastY) < 6) return;                        // chhote jhatke ignore

    if (y > lastY && y > 120) {
      navbar.classList.add('nav-hidden');
      closeAll();
    } else {
      navbar.classList.remove('nav-hidden');
    }
    lastY = y;
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// 4) hero video (sirf un pages par jahan video ho)
function initHeroVideo() {
  const video = document.getElementById('heroVideo');
  if (!video) return;
  // video ka path galat ho to video hata do, poster/background dikhta rahe
  const source = video.querySelector('source');
  if (source) source.addEventListener('error', () => video.remove());
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (reduceMotion.matches) {
    video.removeAttribute('autoplay');
    video.pause();
  } else {
    const p = video.play();
    if (p && p.catch) p.catch(() => {});
  }
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) video.pause();
    else if (!reduceMotion.matches) video.play().catch(() => {});
  });
}

// 5) feature images: section ka size image ki asli width/height se set hota hai (crop nahi hoti)
function initFeatureImages() {
  document.querySelectorAll('.feature').forEach(section => {
    const img = section.querySelector('.feature-img');
    if (!img) return;
    const apply = () => {
      if (!img.naturalWidth) return;
      section.style.setProperty('--w', img.naturalWidth);
      section.style.setProperty('--h', img.naturalHeight);
      section.style.setProperty('--img', 'url("' + (img.currentSrc || img.src) + '")');
      img.setAttribute('width', img.naturalWidth);
      img.setAttribute('height', img.naturalHeight);
    };
    if (img.complete) apply();
    else img.addEventListener('load', apply);
  });
}

// 6) footer.html ko har page ke end me load karo (placeholder na ho to apne aap bana leta hai)
async function loadFooter() {
  var ph = document.getElementById('footer-placeholder');
  if (!ph) {
    ph = document.createElement('div');
    ph.id = 'footer-placeholder';
    var main = document.querySelector('main');
    if (main) main.insertAdjacentElement('afterend', ph);
    else document.body.appendChild(ph);
  }
  try {
    var res = await fetch('footer.html');
    if (!res.ok) throw new Error('footer.html not found');
    ph.innerHTML = await res.text();
  } catch (err) {
    console.error('footer.html load nahi hua (Live Server se kholo):', err);
  }
}

loadNavbar();
loadFooter();
initHeroVideo();
initFeatureImages();