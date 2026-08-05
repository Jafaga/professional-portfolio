(() => {
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const setMenu = (open) => {
    if (!nav || !menuToggle) return;
    nav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  };

  menuToggle?.addEventListener('click', () => {
    setMenu(!nav.classList.contains('is-open'));
  });

  nav?.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });
  document.querySelectorAll('a[href="#top"]').forEach((link) => {
    link.addEventListener('click', () => setMenu(false));
  });

  window.addEventListener('scroll', () => {
    header?.classList.toggle('is-scrolled', window.scrollY > 24);
  }, { passive: true });

  const reveals = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    reveals.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
    reveals.forEach((element) => revealObserver.observe(element));
  }

  const navLinks = [...document.querySelectorAll('.primary-nav a[href^="#"]')];
  const sections = navLinks
    .map((link) => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!visible) return;
      navLinks.forEach((link) => {
        link.classList.toggle('is-active', link.getAttribute('href') === `#${visible.target.id}`);
      });
    }, { threshold: [0.2, 0.45], rootMargin: '-20% 0px -55%' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const skillButtons = document.querySelectorAll('[data-skill]');
  const skillTitle = document.querySelector('[data-skill-title]');
  const skillCopy = document.querySelector('[data-skill-copy]');
  skillButtons.forEach((button) => {
    button.addEventListener('click', () => {
      skillButtons.forEach((item) => item.classList.remove('is-active'));
      button.classList.add('is-active');
      if (skillTitle) skillTitle.textContent = button.dataset.skill;
      if (skillCopy) skillCopy.textContent = button.dataset.level;
    });
  });

  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('[data-category]');
  const projectCount = document.querySelector('[data-project-count]');
  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      let visibleCount = 0;
      filterButtons.forEach((item) => {
        const isActive = item === button;
        item.classList.toggle('is-active', isActive);
        item.setAttribute('aria-pressed', String(isActive));
      });
      projectCards.forEach((card) => {
        const categories = card.dataset.category.split(' ');
        const visible = filter === 'all' || categories.includes(filter);
        card.hidden = !visible;
        if (visible) visibleCount += 1;
      });
      if (projectCount) projectCount.textContent = visibleCount;
    });
  });

  document.querySelectorAll('[data-dialog]').forEach((button) => {
    button.addEventListener('click', () => {
      const dialog = document.getElementById(button.dataset.dialog);
      if (dialog?.showModal) dialog.showModal();
    });
  });

  document.querySelectorAll('.project-dialog').forEach((dialog) => {
    dialog.querySelector('[data-close]')?.addEventListener('click', () => dialog.close());
    dialog.addEventListener('click', (event) => {
      const bounds = dialog.getBoundingClientRect();
      const outside = event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom;
      if (outside) dialog.close();
    });
  });

  const contactForm = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(data.get('subject'));
    const body = encodeURIComponent(`Hi Justine,\n\n${data.get('message')}\n\n— ${data.get('name')}\n${data.get('email')}`);
    if (formStatus) formStatus.textContent = 'Opening a prepared email…';
    window.location.href = `mailto:afagajus@hawaii.edu?subject=${subject}&body=${body}`;
  });

  document.querySelectorAll('[data-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
})();
