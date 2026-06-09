(() => {
  const prefersReducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Reveal on scroll
  const revealEls = Array.from(document.querySelectorAll('.reveal'));
  if (!prefersReducedMotion && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add('is-visible');
            io.unobserve(e.target);
          }
        }
      },
      { threshold: 0.14 }
    );
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // Active nav highlight based on section in view
  const navLinks = Array.from(document.querySelectorAll('nav a[href^="#"]'));
  const sections = navLinks
    .map((a) => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if (navLinks.length && sections.length) {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        // pick the most visible intersecting section
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (b.intersectionRatio || 0) - (a.intersectionRatio || 0))[0];
        if (!visible) return;
        const id = visible.target.id;
        navLinks.forEach((a) => {
          const isActive = a.getAttribute('href') === `#${id}`;
          a.classList.toggle('is-active', isActive);
        });
      },
      { threshold: [0.15, 0.33, 0.5, 0.66] }
    );
    sections.forEach((s) => sectionObserver.observe(s));
  }

  // Subtle hero motion with pointer 
  const hero = document.getElementById('hero');
  if (hero && !prefersReducedMotion) {
    const photoWrap = hero.querySelector('.js-hero-photo');
    const max = 10; // pixels

    const onMove = (ev) => {
      const rect = hero.getBoundingClientRect();
      const x = (ev.clientX - rect.left) / rect.width; // 0..1
      const y = (ev.clientY - rect.top) / rect.height; // 0..1
      const dx = (x - 0.5) * 2;
      const dy = (y - 0.5) * 2;

      if (photoWrap) {
        photoWrap.style.transform = `translate(${dx * max * 0.4}px, ${dy * max * 0.25}px)`;
      }
      hero.style.setProperty('--mx', String(x));
      hero.style.setProperty('--my', String(y));
    };

    const onLeave = () => {
      if (photoWrap) photoWrap.style.transform = 'translate(0px, 0px)';
    };

    hero.addEventListener('pointermove', onMove);
    hero.addEventListener('pointerleave', onLeave);
  }
})();

