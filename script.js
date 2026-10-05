document.addEventListener('DOMContentLoaded', () => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* -----------------------------------------------------
     Menú móvil
  ----------------------------------------------------- */
  const navToggle = document.getElementById('navToggle');
  const siteNav = document.getElementById('siteNav');

  navToggle.addEventListener('click', () => {
    const isOpen = siteNav.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  siteNav.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      siteNav.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });

  /* -----------------------------------------------------
     Conteo del "1982" en el hero (único momento animado)
  ----------------------------------------------------- */
  const heroCount = document.getElementById('heroCount');
  const target = parseInt(heroCount.dataset.target, 10);

  if (reduceMotion) {
    heroCount.textContent = target;
  } else {
    let current = 0;
    const duration = 1400;
    const start = performance.now();

    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      current = Math.round(eased * target);
      heroCount.textContent = current;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* -----------------------------------------------------
     Modal de la galería
  ----------------------------------------------------- */
  function openModal(modal) {
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) closeBtn.focus();
    document.body.style.overflow = 'hidden';
  }

  function closeModal(modal) {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.modal').forEach(modal => {
    modal.querySelectorAll('[data-close]').forEach(el => {
      el.addEventListener('click', () => closeModal(modal));
    });
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) closeModal(modal);
    });
  });

  const galleryModal = document.getElementById('galleryModal');
  const modalImage = document.getElementById('modalImage');
  const modalCaption = document.getElementById('modalCaption');

  document.querySelectorAll('.gallery-item').forEach(item => {
    item.addEventListener('click', () => {
      const caption = item.dataset.caption || '';
      modalImage.src = item.dataset.full;
      modalImage.alt = caption;
      modalCaption.textContent = caption;
      openModal(galleryModal);
    });
  });

  /* -----------------------------------------------------
     Línea de tiempo: flechas + revelado al hacer scroll
  ----------------------------------------------------- */
  const scroller = document.getElementById('timelineScroller');
  const prevBtn = document.getElementById('timelinePrev');
  const nextBtn = document.getElementById('timelineNext');

  function scrollByCard(direction) {
    const card = scroller.querySelector('.timeline-item');
    if (!card) return;
    const gap = 24; // debe coincidir con el gap del CSS
    const distance = card.offsetWidth + gap;
    scroller.scrollBy({ left: direction * distance, behavior: reduceMotion ? 'auto' : 'smooth' });
  }

  prevBtn.addEventListener('click', () => scrollByCard(-1));
  nextBtn.addEventListener('click', () => scrollByCard(1));

  const timelineItems = document.querySelectorAll('.timeline-item');
  if ('IntersectionObserver' in window && !reduceMotion) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });
    timelineItems.forEach(item => observer.observe(item));
  } else {
    timelineItems.forEach(item => item.classList.add('is-visible'));
  }

});
