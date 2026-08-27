(() => {
  'use strict';

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const body = document.body;
  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  /* Short, skippable boot sequence. It is shown once per browser session. */
  const bootScreen = document.querySelector('[data-boot-screen]');
  const bootProgress = document.querySelector('[data-boot-progress]');
  const bootPercent = document.querySelector('[data-boot-percent]');
  const hasBooted = sessionStorage.getItem('portfolio-booted') === 'true';
  let bootTimer;

  const finishBoot = () => {
    window.clearInterval(bootTimer);
    sessionStorage.setItem('portfolio-booted', 'true');
    bootScreen?.classList.add('is-done');
    body.classList.remove('is-booting');
    window.setTimeout(() => bootScreen?.setAttribute('hidden', ''), 600);
  };

  if (!bootScreen || reduceMotion || hasBooted) {
    bootScreen?.setAttribute('hidden', '');
  } else {
    body.classList.add('is-booting');
    let progress = 0;
    bootTimer = window.setInterval(() => {
      progress = Math.min(100, progress + Math.ceil(Math.random() * 13));
      if (bootProgress) bootProgress.style.width = `${progress}%`;
      if (bootPercent) bootPercent.textContent = `${progress}%`;
      if (progress >= 100) window.setTimeout(finishBoot, 180);
    }, 90);
    document.querySelector('[data-skip-boot]')?.addEventListener('click', finishBoot);
  }

  /* Header and compact navigation. */
  const header = document.querySelector('[data-header]');
  const nav = document.querySelector('[data-nav]');
  const menuToggle = document.querySelector('[data-menu-toggle]');
  const setMenu = (open) => {
    if (!nav || !menuToggle) return;
    nav.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', String(open));
  };
  menuToggle?.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      setMenu(false);
      closeAssistant();
    }
  });

  const sections = [...document.querySelectorAll('[data-section]')];
  const sectionLinks = [...document.querySelectorAll('.primary-nav a[href^="#"], [data-rail-link], .mobile-dock a[href^="#"]')];
  const railProgress = document.querySelector('[data-rail-progress]');

  const updateScrollUI = () => {
    const y = window.scrollY;
    const maxScroll = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    header?.classList.toggle('is-scrolled', y > 24);
    if (railProgress) railProgress.style.height = `${(y / maxScroll) * 100}%`;
  };
  window.addEventListener('scroll', updateScrollUI, { passive: true });
  updateScrollUI();

  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      const current = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (!current) return;
      sectionLinks.forEach((link) => {
        const active = link.getAttribute('href') === `#${current.target.id}`;
        link.classList.toggle('is-active', active);
        if (active) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
      });
    }, { threshold: [0.18, 0.42, 0.68], rootMargin: '-18% 0px -52%' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  /* Scroll reveals and counters. */
  const revealElements = [...document.querySelectorAll('.reveal')];
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealElements.forEach((element) => element.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const siblings = [...entry.target.parentElement.children].filter((item) => item.classList.contains('reveal'));
        entry.target.style.transitionDelay = `${Math.min(siblings.indexOf(entry.target) * 70, 280)}ms`;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -48px' });
    revealElements.forEach((element) => revealObserver.observe(element));
  }

  const counters = document.querySelectorAll('[data-counter]');
  const runCounter = (node) => {
    const target = Number(node.dataset.counter);
    const started = performance.now();
    const tick = (now) => {
      const ratio = clamp((now - started) / 900, 0, 1);
      const eased = 1 - Math.pow(1 - ratio, 3);
      node.textContent = String(Math.round(target * eased)).padStart(2, '0');
      if (ratio < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (reduceMotion || !('IntersectionObserver' in window)) counters.forEach(runCounter);
  else {
    const counterObserver = new IntersectionObserver((entries, observer) => entries.forEach((entry) => {
      if (entry.isIntersecting) { runCounter(entry.target); observer.unobserve(entry.target); }
    }), { threshold: .7 });
    counters.forEach((counter) => counterObserver.observe(counter));
  }

  /* Cursor light, gentle tilt, and magnetic buttons on fine pointers only. */
  const cursorLight = document.querySelector('[data-cursor-light]');
  if (finePointer && !reduceMotion && cursorLight) {
    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight / 2;
    let currentX = targetX;
    let currentY = targetY;
    window.addEventListener('pointermove', (event) => { targetX = event.clientX; targetY = event.clientY; }, { passive: true });
    const renderCursor = () => {
      currentX += (targetX - currentX) * .14;
      currentY += (targetY - currentY) * .14;
      cursorLight.style.transform = `translate(${currentX - 210}px, ${currentY - 210}px)`;
      requestAnimationFrame(renderCursor);
    };
    requestAnimationFrame(renderCursor);

    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const bounds = card.getBoundingClientRect();
        const rx = ((event.clientY - bounds.top) / bounds.height - .5) * -3.5;
        const ry = ((event.clientX - bounds.left) / bounds.width - .5) * 4;
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });

    document.querySelectorAll('.magnetic').forEach((button) => {
      button.addEventListener('pointermove', (event) => {
        const bounds = button.getBoundingClientRect();
        button.style.transform = `translate(${(event.clientX - bounds.left - bounds.width / 2) * .08}px, ${(event.clientY - bounds.top - bounds.height / 2) * .12}px)`;
      });
      button.addEventListener('pointerleave', () => { button.style.transform = ''; });
    });
  }

  /* Draggable skill constellation plus an accessible keyboard fallback. */
  const constellation = document.querySelector('[data-constellation]');
  const constellationTrack = document.querySelector('[data-constellation-track]');
  const skillButtons = [...document.querySelectorAll('[data-skill]')];
  const skillTitle = document.querySelector('[data-skill-title]');
  const skillCopy = document.querySelector('[data-skill-copy]');
  const skillIcon = document.querySelector('[data-skill-icon]');
  const inspectorLogo = document.querySelector('[data-inspector-logo]');
  const inspectorFallback = document.querySelector('[data-inspector-fallback]');
  const skillIndex = document.querySelector('[data-skill-index]');
  let mapX = 0;
  let mapY = 0;
  let mapRotation = 0;
  let dragStart = null;

  const renderMap = () => {
    if (!constellationTrack) return;
    constellationTrack.style.setProperty('--map-x', `${mapX}px`);
    constellationTrack.style.setProperty('--map-y', `${mapY}px`);
    constellationTrack.style.setProperty('--map-r', `${mapRotation}deg`);
  };
  constellation?.addEventListener('pointerdown', (event) => {
    if (event.target.closest('button')) return;
    dragStart = { x: event.clientX, y: event.clientY, mapX, mapY };
    constellation.setPointerCapture(event.pointerId);
  });
  constellation?.addEventListener('pointermove', (event) => {
    if (!dragStart) return;
    mapX = clamp(dragStart.mapX + event.clientX - dragStart.x, -70, 70);
    mapY = clamp(dragStart.mapY + event.clientY - dragStart.y, -55, 55);
    mapRotation = mapX * .025;
    renderMap();
  });
  constellation?.addEventListener('pointerup', () => { dragStart = null; });
  constellation?.addEventListener('pointercancel', () => { dragStart = null; });
  constellation?.addEventListener('keydown', (event) => {
    const directions = { ArrowLeft: [-12, 0], ArrowRight: [12, 0], ArrowUp: [0, -12], ArrowDown: [0, 12] };
    if (!directions[event.key]) return;
    event.preventDefault();
    mapX = clamp(mapX + directions[event.key][0], -70, 70);
    mapY = clamp(mapY + directions[event.key][1], -55, 55);
    mapRotation = mapX * .025;
    renderMap();
  });

  document.querySelectorAll('[data-logo-image]').forEach((image) => {
    const showFallback = () => image.closest('.skill-logo')?.classList.add('has-missing-logo');
    const showImage = () => image.closest('.skill-logo')?.classList.remove('has-missing-logo');
    image.addEventListener('error', showFallback);
    image.addEventListener('load', showImage);
    if (image.complete) {
      if (image.naturalWidth > 0) showImage();
      else showFallback();
    }
  });

  const setInspectorLogo = (source, fallback, label) => {
    if (!inspectorLogo || !inspectorFallback || !skillIcon) return;
    skillIcon.classList.remove('has-missing-logo');
    inspectorFallback.textContent = fallback;
    inspectorLogo.alt = `${label} logo`;
    inspectorLogo.src = source;
  };
  inspectorLogo?.addEventListener('error', () => skillIcon?.classList.add('has-missing-logo'));
  inspectorLogo?.addEventListener('load', () => skillIcon?.classList.remove('has-missing-logo'));

  skillButtons.forEach((button, index) => button.addEventListener('click', () => {
    skillButtons.forEach((item) => item.classList.remove('is-active'));
    button.classList.add('is-active');
    if (skillTitle) skillTitle.textContent = button.dataset.skill;
    if (skillCopy) skillCopy.textContent = button.dataset.copy;
    setInspectorLogo(button.dataset.logo, button.dataset.fallback || 'JA', button.dataset.skill);
    if (skillIndex) skillIndex.textContent = String(index + 1).padStart(2, '0');
  }));

  document.querySelectorAll('[data-skill-filter]').forEach((filterButton) => filterButton.addEventListener('click', () => {
    const filter = filterButton.dataset.skillFilter;
    document.querySelectorAll('[data-skill-filter]').forEach((item) => {
      const active = item === filterButton;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    skillButtons.forEach((skill) => skill.classList.toggle('is-dimmed', filter !== 'all' && skill.dataset.category !== filter));
  }));

  /* Horizontal experience history. Past sits left; the current entry opens on the right. */
  const timelineViewport = document.querySelector('[data-timeline-scroll]');
  const timelineProgress = document.querySelector('[data-timeline-progress]');
  const timelineStatus = document.querySelector('[data-timeline-status]');
  const timelineItems = [...document.querySelectorAll('.timeline-item')];
  const timelineButtons = [...document.querySelectorAll('[data-timeline-direction]')];

  const updateTimeline = () => {
    if (!timelineViewport) return;
    const maxScroll = Math.max(1, timelineViewport.scrollWidth - timelineViewport.clientWidth);
    const ratio = clamp(timelineViewport.scrollLeft / maxScroll, 0, 1);
    if (timelineProgress) timelineProgress.style.width = `${ratio * 100}%`;
    const index = Math.round(ratio * Math.max(0, timelineItems.length - 1));
    const item = timelineItems[index];
    const date = item?.querySelector('.timeline-date')?.childNodes[0]?.textContent.trim() || 'PRESENT';
    if (timelineStatus) timelineStatus.textContent = `${item?.matches('[data-current-experience]') ? 'PRESENT' : date} / ${String(index + 1).padStart(2, '0')}`;
    timelineButtons.forEach((button) => {
      const direction = Number(button.dataset.timelineDirection);
      button.disabled = direction < 0 ? ratio <= .01 : ratio >= .99;
    });
  };

  const openTimelineAtPresent = () => {
    if (!timelineViewport) return;
    timelineViewport.scrollLeft = timelineViewport.scrollWidth;
    updateTimeline();
  };

  timelineViewport?.addEventListener('scroll', updateTimeline, { passive: true });
  timelineButtons.forEach((button) => button.addEventListener('click', () => {
    const direction = Number(button.dataset.timelineDirection);
    timelineViewport?.scrollBy({ left: direction * Math.max(320, timelineViewport.clientWidth * .72), behavior: reduceMotion ? 'auto' : 'smooth' });
  }));
  window.addEventListener('resize', updateTimeline, { passive: true });
  requestAnimationFrame(() => requestAnimationFrame(openTimelineAtPresent));
  window.addEventListener('load', () => window.setTimeout(openTimelineAtPresent, 80), { once: true });
  window.addEventListener('pageshow', (event) => {
    if (event.persisted) openTimelineAtPresent();
  });

  /* Project filters and repository search. */
  const filterButtons = document.querySelectorAll('[data-filter]');
  const projectCards = document.querySelectorAll('.project-card[data-category]');
  const projectCount = document.querySelector('[data-project-count]');
  filterButtons.forEach((button) => button.addEventListener('click', () => {
    const filter = button.dataset.filter;
    let visibleCount = 0;
    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle('is-active', active);
      item.setAttribute('aria-pressed', String(active));
    });
    projectCards.forEach((card) => {
      const visible = filter === 'all' || card.dataset.category.split(' ').includes(filter);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });
    if (projectCount) projectCount.textContent = visibleCount;
  }));

  /* Public GitHub repositories. No token is used or exposed. */
  const githubUsername = 'Jafaga';
  const githubRepoList = document.querySelector('[data-repo-list]');
  const githubRepoCount = document.querySelector('[data-github-count]');
  const githubStatus = document.querySelector('[data-github-status]');
  const repoSearch = document.querySelector('[data-repo-search]');
  const githubCacheKey = `portfolio-repositories-${githubUsername.toLowerCase()}-v1`;
  const languageColors = {
    JavaScript: '#f1e05a', TypeScript: '#3178c6', Python: '#3572a5', Java: '#b07219',
    HTML: '#e34c26', CSS: '#563d7c', 'C++': '#f34b7d', Shell: '#89e051', Jupyter: '#da5b0b'
  };

  const filterRepositoryLinks = () => {
    const query = repoSearch?.value.trim().toLowerCase() || '';
    const links = [...document.querySelectorAll('[data-repo-name]')];
    let matches = 0;
    links.forEach((link) => {
      const match = link.dataset.repoName.toLowerCase().includes(query);
      link.hidden = Boolean(query) && !match;
      link.classList.toggle('is-match', Boolean(query) && match);
      if (match) matches += 1;
    });
    githubRepoList?.querySelector('.repo-empty')?.remove();
    if (query && matches === 0 && githubRepoList) {
      const empty = document.createElement('p');
      empty.className = 'repo-empty';
      empty.textContent = `No repository matches “${repoSearch.value.trim()}”.`;
      githubRepoList.append(empty);
    }
  };
  repoSearch?.addEventListener('input', filterRepositoryLinks);

  const relativeUpdate = (isoDate) => {
    const days = Math.max(0, Math.round((Date.now() - new Date(isoDate).getTime()) / 86400000));
    if (days === 0) return 'updated today';
    if (days < 30) return `updated ${days}d ago`;
    const months = Math.round(days / 30);
    if (months < 12) return `updated ${months}mo ago`;
    return `updated ${Math.round(months / 12)}y ago`;
  };

  const renderGitHubRepositories = (repositories, source = 'live') => {
    if (!githubRepoList || !Array.isArray(repositories) || repositories.length === 0) return;
    const visibleRepositories = repositories.filter((repo) => !repo.archived).slice(0, 12);
    const fragment = document.createDocumentFragment();
    visibleRepositories.forEach((repo) => {
      const link = document.createElement('a');
      link.href = repo.html_url;
      link.target = '_blank';
      link.rel = 'noreferrer';
      link.dataset.repoName = repo.name;
      link.setAttribute('aria-label', `Open ${repo.name} on GitHub`);

      const title = document.createElement('strong');
      title.textContent = repo.name;
      const external = document.createElement('small');
      external.textContent = '↗';
      title.append(' ', external);

      const meta = document.createElement('span');
      const dot = document.createElement('i');
      dot.className = 'dot';
      dot.style.setProperty('--repo-color', languageColors[repo.language] || '#8b8b86');
      const language = repo.language || 'Repository';
      const stars = repo.stargazers_count ? ` · ★ ${repo.stargazers_count}` : '';
      meta.append(dot, `${language} · ${relativeUpdate(repo.updated_at)}${stars}`);
      link.append(title, meta);
      fragment.append(link);
    });
    githubRepoList.replaceChildren(fragment);
    if (githubRepoCount) githubRepoCount.textContent = String(visibleRepositories.length);
    if (githubStatus) {
      githubStatus.className = 'repo-sync is-connected';
      githubStatus.innerHTML = `<i></i> ${source === 'cache' ? 'Cached from' : 'Live from'} @${githubUsername}`;
    }
    filterRepositoryLinks();
  };

  const loadGitHubRepositories = async () => {
    try {
      const cached = JSON.parse(sessionStorage.getItem(githubCacheKey) || 'null');
      if (cached?.savedAt && Date.now() - cached.savedAt < 900000 && Array.isArray(cached.repositories)) {
        renderGitHubRepositories(cached.repositories, 'cache');
        return;
      }
    } catch (_) { /* Storage can be unavailable in privacy-focused browsers. */ }

    try {
      const endpoint = `https://api.github.com/users/${githubUsername}/repos?type=owner&sort=updated&per_page=100`;
      const response = await fetch(endpoint, { headers: { Accept: 'application/vnd.github+json' } });
      if (!response.ok) throw new Error(`GitHub responded with ${response.status}`);
      const repositories = await response.json();
      renderGitHubRepositories(repositories);
      try { sessionStorage.setItem(githubCacheKey, JSON.stringify({ savedAt: Date.now(), repositories })); } catch (_) { /* Optional cache. */ }
    } catch (_) {
      if (githubStatus) {
        githubStatus.className = 'repo-sync is-fallback';
        githubStatus.innerHTML = '<i></i> Saved links · GitHub unavailable';
      }
    }
  };
  loadGitHubRepositories();

  /* Contact form: GitHub Pages friendly mail-app fallback. */
  const contactForm = document.querySelector('[data-contact-form]');
  const formStatus = document.querySelector('[data-form-status]');
  contactForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) return;
    const data = new FormData(contactForm);
    const subject = encodeURIComponent(String(data.get('subject')));
    const message = `Hi Justine,\n\n${data.get('message')}\n\n— ${data.get('name')}\n${data.get('email')}`;
    if (formStatus) formStatus.textContent = 'Opening a prepared email…';
    window.location.href = `mailto:afagajus@hawaii.edu?subject=${subject}&body=${encodeURIComponent(message)}`;
  });

  /* Private, offline portfolio assistant. */
  const assistant = document.querySelector('[data-assistant]');
  const assistantLauncher = document.querySelector('[data-assistant-launcher]');
  const assistantLog = document.querySelector('[data-assistant-log]');
  const assistantForm = document.querySelector('[data-assistant-form]');
  const assistantInput = document.querySelector('[data-assistant-input]');
  const assistantResponses = {
    projects: {
      label: 'Show me Justine’s projects.',
      text: 'Justine currently highlights nine projects. Her newest builds include a Python Expense Tracker, an interactive Kanto Pokédex, Python Pac-Man, Outer Rim Run, and Learn Ilokano, alongside earlier software, research, community, and leadership work.',
      action: { label: 'Jump to projects →', href: '#projects' }
    },
    writing: {
      label: 'Open Justine’s journal.',
      text: 'The journal is Justine’s space for personal writing about learning, community, identity, service, curiosity, and life beyond code. Each featured entry opens as a complete reading page.',
      action: { label: 'Explore the journal →', href: '#writing' }
    },
    skills: {
      label: 'What are her skills?',
      text: 'Her current toolkit includes Python, Java, C++, JavaScript, HTML/CSS, Git and GitHub, Prisma, Vercel, and macOS/CLI workflows. She is also exploring AI, hardware, and connected software systems.',
      action: { label: 'Explore the skill map →', href: '#skills' }
    },
    experience: {
      label: 'Tell me about her experience.',
      text: 'Justine is an M.S. Computer Science candidate, expected to graduate in Spring 2028, and a current Learning Design and Technology graduate assistant with ITEC. Her experience also spans department web design, student ambassadorship, Timpuyog leadership, the TIDES program, retail, hospitality, and community-focused student work.',
      action: { label: 'View the timeline →', href: '#experience' }
    },
    contact: {
      label: 'How can I connect?',
      text: 'You can email Justine at afagajus@hawaii.edu, visit her GitHub or LinkedIn, or use the contact form to prepare an email. This assistant does not send or save messages.',
      action: { label: 'Open contact options →', href: '#contact' }
    },
    resume: {
      label: 'Where is her résumé?',
      text: 'Her résumé is included as a downloadable PDF in this portfolio.',
      action: { label: 'Open résumé PDF →', href: 'assets/resume/AfagaJustine_resume_OFFICIAL.pdf', newTab: true }
    },
    about: {
      label: 'Tell me about Justine.',
      text: 'Justine Afaga is a Computer Science graduate student in Honolulu who cares about practical, people-centered technology. She approaches learning through curiosity, steady iteration, clear communication, and community.',
      action: { label: 'Read her profile →', href: '#about' }
    },
    fallback: {
      text: 'I’m a focused portfolio guide, so I work best with questions about Justine’s projects, skills, experience, résumé, background, or contact information. Try one of those topics.',
      action: null
    }
  };

  function setAssistant(open) {
    if (!assistant || !assistantLauncher) return;
    assistant.classList.toggle('is-open', open);
    assistant.setAttribute('aria-hidden', String(!open));
    assistantLauncher.setAttribute('aria-expanded', String(open));
    if (open) window.setTimeout(() => assistantInput?.focus(), 180);
  }
  function closeAssistant() { setAssistant(false); }
  assistantLauncher?.addEventListener('click', () => setAssistant(!assistant?.classList.contains('is-open')));
  document.querySelector('[data-assistant-close]')?.addEventListener('click', closeAssistant);

  const addChatMessage = (kind, text, action) => {
    if (!assistantLog) return;
    const message = document.createElement('div');
    message.className = `chat-message is-${kind}`;
    const avatar = document.createElement('span');
    avatar.textContent = kind === 'bot' ? 'JA' : 'YOU';
    const bubble = document.createElement('div');
    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    bubble.append(paragraph);
    if (action) {
      const link = document.createElement('a');
      link.href = action.href;
      link.textContent = action.label;
      if (action.newTab) {
        link.target = '_blank';
        link.rel = 'noreferrer';
      }
      link.addEventListener('click', () => {
        if (action.href.startsWith('#')) closeAssistant();
      });
      bubble.append(link);
    }
    message.append(avatar, bubble);
    assistantLog.append(message);
    assistantLog.scrollTop = assistantLog.scrollHeight;
  };

  const addTyping = () => {
    const typing = document.createElement('div');
    typing.className = 'chat-message is-bot is-typing';
    typing.innerHTML = '<span>JA</span><div><p>thinking<span class="terminal-caret">_</span></p></div>';
    assistantLog?.append(typing);
    if (assistantLog) assistantLog.scrollTop = assistantLog.scrollHeight;
    return typing;
  };

  const replyTo = (key, userText) => {
    const response = assistantResponses[key] || assistantResponses.fallback;
    addChatMessage('user', userText || response.label || 'Tell me more.', null);
    const typing = addTyping();
    window.setTimeout(() => {
      typing.remove();
      addChatMessage('bot', response.text, response.action);
    }, reduceMotion ? 0 : 420);
  };

  const classifyQuestion = (value) => {
    const question = value.toLowerCase();
    if (/project|work|build|portfolio|jam|password|cookie|kūlia|kulia|expense|pok[eé]dex|pokemon|pac.?man|outer rim|ilokano|game/.test(question)) return 'projects';
    if (/writing|journal|blog|essay|thought|reflection|life/.test(question)) return 'writing';
    if (/skill|stack|language|technology|tech|python|java|css|code/.test(question)) return 'skills';
    if (/experience|job|work history|education|school|university|college/.test(question)) return 'experience';
    if (/contact|email|connect|hire|linkedin|github|reach/.test(question)) return 'contact';
    if (/resume|résumé|cv/.test(question)) return 'resume';
    if (/about|who|background|justine/.test(question)) return 'about';
    return 'fallback';
  };

  document.querySelectorAll('[data-assistant-prompt]').forEach((button) => button.addEventListener('click', () => {
    replyTo(button.dataset.assistantPrompt, button.textContent.trim());
  }));
  assistantForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const value = assistantInput?.value.trim();
    if (!value) return;
    assistantInput.value = '';
    replyTo(classifyQuestion(value), value);
  });

  document.querySelectorAll('[data-year]').forEach((node) => { node.textContent = new Date().getFullYear(); });
})();
