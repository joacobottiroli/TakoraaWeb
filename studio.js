(() => {
  const root = document.documentElement;
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  const motionButton = document.querySelector('.motion-toggle');
  const scene = document.querySelector('.playground');
  const revealItems = [...document.querySelectorAll('.reveal')];
  let savedMotion = null;

  try {
    savedMotion = window.localStorage.getItem('takoraa-motion');
  } catch {
    // The site remains usable when storage is unavailable.
  }

  const motionEnabled = () => root.dataset.motion === 'on';
  const resetScene = () => {
    if (!scene) return;
    for (const [name, value] of Object.entries({ '--mx': '0px', '--my': '0px', '--rx': '0deg', '--ry': '0deg' })) {
      scene.style.setProperty(name, value);
    }
  };

  const setMotion = (enabled, persist = false) => {
    root.dataset.motion = enabled ? 'on' : 'off';
    const label = enabled ? 'Pausar animaciones' : 'Activar animaciones';
    motionButton?.setAttribute('aria-label', label);
    motionButton?.setAttribute('title', label);
    if (!enabled) {
      resetScene();
      revealItems.forEach((item) => item.classList.add('is-visible'));
    }
    if (persist) {
      try {
        window.localStorage.setItem('takoraa-motion', root.dataset.motion);
      } catch {
        // A blocked preference store must not interrupt an interaction.
      }
    }
  };

  setMotion(!reducedMotion.matches && savedMotion !== 'off');
  if (motionButton) {
    motionButton.addEventListener('click', () => setMotion(!motionEnabled(), true));
    motionButton.hidden = false;
  }
  reducedMotion.addEventListener('change', (event) => {
    if (event.matches) setMotion(false);
  });

  const menuButton = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#site-nav');
  if (menuButton && navigation) {
    const mobileViewport = window.matchMedia('(max-width: 760px)');
    const closeMenu = ({ restoreFocus = false } = {}) => {
      menuButton.setAttribute('aria-expanded', 'false');
      navigation.hidden = mobileViewport.matches;
      if (restoreFocus) menuButton.focus();
    };
    const syncNavigation = () => {
      const focusWasInNavigation = navigation.contains(document.activeElement);
      menuButton.hidden = !mobileViewport.matches;
      closeMenu({ restoreFocus: mobileViewport.matches && focusWasInNavigation });
      if (!mobileViewport.matches && document.activeElement === menuButton) {
        navigation.querySelector('a')?.focus();
      }
    };
    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      navigation.hidden = isOpen;
    });
    navigation.addEventListener('click', (event) => {
      const link = event.target.closest('a');
      if (!link || !mobileViewport.matches) return;
      closeMenu();
      document.querySelector(link.hash)?.focus({ preventScroll: true });
    });
    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true') {
        closeMenu({ restoreFocus: true });
      }
    });
    document.addEventListener('click', (event) => {
      if (mobileViewport.matches && !event.target.closest('.site-header')) {
        closeMenu({ restoreFocus: navigation.contains(document.activeElement) });
      }
    });
    mobileViewport.addEventListener('change', syncNavigation);
    syncNavigation();
  }

  if (scene) {
    const demoControls = scene.querySelector('.demo-controls');
    const demoButtons = [...scene.querySelectorAll('[data-demo]')];
    const panels = [...scene.querySelectorAll('.demo-panel')];
    demoButtons.forEach((button) => {
      button.addEventListener('click', () => {
        demoButtons.forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
        scene.dataset.demo = button.dataset.demo;
        panels.forEach((panel) => { panel.hidden = panel.id !== button.getAttribute('aria-controls'); });
      });
    });
    if (demoControls) demoControls.hidden = false;

    const shuffleButton = scene.querySelector('.shuffle-scene');
    if (shuffleButton) {
      shuffleButton.addEventListener('click', () => {
        scene.dataset.layout = String((Number(scene.dataset.layout) + 1) % 3);
      });
      shuffleButton.hidden = false;
    }
    const flowerButton = scene.querySelector('.flower-toy');
    if (flowerButton) {
      let flowerTurn = 0;
      flowerButton.addEventListener('click', () => {
        flowerTurn += 225;
        scene.style.setProperty('--flower-turn', flowerTurn + 'deg');
      });
      flowerButton.hidden = false;
    }

    const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    let pointerFrame = 0;
    let pointerX = 0;
    let pointerY = 0;
    scene.addEventListener('pointermove', (event) => {
      if (!motionEnabled() || !precisePointer.matches || event.pointerType === 'touch') return;
      const bounds = scene.getBoundingClientRect();
      pointerX = Math.max(-1, Math.min(1, (event.clientX - bounds.left) / bounds.width * 2 - 1));
      pointerY = Math.max(-1, Math.min(1, (event.clientY - bounds.top) / bounds.height * 2 - 1));
      if (pointerFrame) return;
      pointerFrame = requestAnimationFrame(() => {
        pointerFrame = 0;
        if (!motionEnabled()) return;
        scene.style.setProperty('--mx', (pointerX * 7).toFixed(2) + 'px');
        scene.style.setProperty('--my', (pointerY * 5).toFixed(2) + 'px');
        scene.style.setProperty('--rx', (-pointerY * 2).toFixed(2) + 'deg');
        scene.style.setProperty('--ry', (pointerX * 2).toFixed(2) + 'deg');
      });
    });
    scene.addEventListener('pointerleave', () => {
      cancelAnimationFrame(pointerFrame);
      pointerFrame = 0;
      resetScene();
    });
  }

  const ticker = document.querySelector('.ticker');
  const tickerTrack = ticker?.querySelector('.ticker-track');
  const tickerCycle = tickerTrack?.firstElementChild;
  if (tickerCycle) {
    const fitTicker = () => {
      const cycleWidth = tickerCycle.getBoundingClientRect().width;
      if (!cycleWidth) return;
      // Keep a full viewport of text after the cycle that is sliding out.
      const copies = Math.max(2, Math.ceil(ticker.clientWidth / cycleWidth) + 1);
      while (tickerTrack.children.length < copies) tickerTrack.append(tickerCycle.cloneNode(true));
      while (tickerTrack.children.length > copies) tickerTrack.lastElementChild.remove();
      tickerTrack.style.setProperty('--ticker-step', cycleWidth + 'px');
      tickerTrack.style.setProperty('--ticker-duration', cycleWidth / 45 + 's');
      tickerTrack.dataset.loopReady = '';
    };
    document.fonts.ready.then(fitTicker);
    if ('ResizeObserver' in window) new ResizeObserver(fitTicker).observe(ticker);
    else window.addEventListener('resize', fitTicker);
  }

  const services = {
    apps: { title: 'Apps', description: 'Software a medida para empresas y profesionales.', icon: 'app', color: '#8268ff' },
    portales: { title: 'Portales', description: 'Portales a medida para empresas y profesionales.', icon: 'portal', color: '#20d4bf' },
    dashboards: { title: 'Dashboards', description: 'Un dashboard de métricas entregado con el MVP.', icon: 'chart', color: '#e4ddfa' },
    agentes: { title: 'Agentes', description: 'La IA acelera el trabajo. El criterio es humano y no se delega.', icon: 'agent', color: '#d96491' },
    automatizaciones: { title: 'Automatizaciones', description: 'Automatizaciones a medida para empresas y profesionales.', icon: 'flow', color: '#081120', ink: '#f7f6f2' },
    integraciones: { title: 'Integraciones', description: 'Integraciones a medida para empresas y profesionales.', icon: 'connect', color: '#bce9e2' },
    mantenimiento: { title: 'Mantenimiento', description: 'Operación y mantenimiento desde el mes siguiente a la entrega.', icon: 'support', color: '#e8a24c' },
  };
  const servicePreview = document.querySelector('#service-preview');
  const serviceButtons = [...document.querySelectorAll('button[data-service]')];
  let serviceTimer = 0;
  if (servicePreview) {
    serviceButtons.forEach((button, index) => {
      button.disabled = false;
      button.addEventListener('click', () => {
        const service = services[button.dataset.service];
        if (!service || servicePreview.dataset.service === button.dataset.service) return;
        serviceButtons.forEach((option) => option.setAttribute('aria-pressed', String(option === button)));
        servicePreview.dataset.service = button.dataset.service;
        servicePreview.style.setProperty('--plate', service.color);
        servicePreview.style.setProperty('--plate-ink', service.ink || '#081120');
        servicePreview.querySelector('h3').textContent = service.title;
        servicePreview.querySelector('.service-preview-bottom p').textContent = service.description;
        servicePreview.querySelector('.service-position').textContent = String(index + 1).padStart(2, '0') + ' / 07';
        servicePreview.querySelectorAll('.service-sculpture use').forEach((icon) => icon.setAttribute('href', '#icon-' + service.icon));
        servicePreview.querySelector('.service-preview-bottom a').setAttribute('aria-label', 'Hablar sobre ' + service.title.toLowerCase());
        clearTimeout(serviceTimer);
        servicePreview.classList.remove('is-changing');
        if (motionEnabled()) {
          // Restart only this short, user-triggered transition.
          void servicePreview.offsetWidth;
          servicePreview.classList.add('is-changing');
          serviceTimer = window.setTimeout(() => servicePreview.classList.remove('is-changing'), 660);
        }
      });
    });
  }

  const track = document.querySelector('#principles-track');
  const carouselControls = document.querySelector('.carousel-controls');
  if (track && carouselControls) {
    const cards = [...track.querySelectorAll('.principle')];
    const previousButton = carouselControls.querySelector('.carousel-prev');
    const nextButton = carouselControls.querySelector('.carousel-next');
    let carouselFrame = 0;

    const maximumScroll = () => Math.max(0, track.scrollWidth - track.clientWidth);
    const stepSize = () => cards.length > 1 ? cards[1].offsetLeft - cards[0].offsetLeft : 1;
    const syncCarousel = () => {
      const maximum = maximumScroll();
      const atEnd = track.scrollLeft >= maximum - 3;
      previousButton.disabled = track.scrollLeft < 3;
      nextButton.disabled = atEnd;
    };
    const scrollToPosition = (position) => {
      track.scrollTo({ left: Math.max(0, Math.min(maximumScroll(), position)), behavior: motionEnabled() ? 'smooth' : 'instant' });
    };
    const advance = (direction) => scrollToPosition(track.scrollLeft + direction * stepSize());
    previousButton.addEventListener('click', () => advance(-1));
    nextButton.addEventListener('click', () => advance(1));

    let dragPointerId = null;
    let dragStartX = 0;
    let dragStartScroll = 0;
    const finishDrag = (event) => {
      if (dragPointerId === null || (event.pointerId !== undefined && event.pointerId !== dragPointerId)) return;
      const pointerId = dragPointerId;
      dragPointerId = null;
      track.classList.remove('is-dragging');
      if (track.hasPointerCapture(pointerId)) track.releasePointerCapture(pointerId);
      syncCarousel();
    };
    track.addEventListener('pointerdown', (event) => {
      if (event.pointerType !== 'mouse' || event.button !== 0 || dragPointerId !== null) return;
      if (event.target.closest('a, button, input, textarea, select, [contenteditable]')) return;
      event.preventDefault();
      dragPointerId = event.pointerId;
      dragStartX = event.clientX;
      dragStartScroll = track.scrollLeft;
      track.classList.add('is-dragging');
      track.scrollTo({ left: dragStartScroll, behavior: 'instant' });
      track.setPointerCapture(event.pointerId);
      track.focus({ preventScroll: true });
    });
    track.addEventListener('pointermove', (event) => {
      if (event.pointerId !== dragPointerId) return;
      event.preventDefault();
      track.scrollLeft = dragStartScroll - (event.clientX - dragStartX);
    });
    track.addEventListener('pointerup', finishDrag);
    track.addEventListener('pointercancel', finishDrag);
    track.addEventListener('lostpointercapture', finishDrag);
    window.addEventListener('blur', finishDrag);
    track.addEventListener('dragstart', (event) => event.preventDefault());
    track.classList.add('is-draggable');

    track.addEventListener('scroll', () => {
      if (carouselFrame) return;
      carouselFrame = requestAnimationFrame(() => {
        carouselFrame = 0;
        syncCarousel();
      });
    }, { passive: true });
    track.addEventListener('keydown', (event) => {
      if (event.target !== track) return;
      if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
      event.preventDefault();
      if (event.key === 'Home') scrollToPosition(0);
      else if (event.key === 'End') scrollToPosition(maximumScroll());
      else advance(event.key === 'ArrowRight' ? 1 : -1);
    });
    if ('ResizeObserver' in window) new ResizeObserver(syncCarousel).observe(track);
    else window.addEventListener('resize', syncCarousel);
    carouselControls.hidden = false;
    syncCarousel();
  }

  if ('IntersectionObserver' in window && motionEnabled()) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px 0px' });
    revealItems.forEach((item) => {
      if (item.getBoundingClientRect().top < window.innerHeight - 35) return;
      item.classList.add('will-reveal');
      revealObserver.observe(item);
    });
  }

  const previousSections = {
    '#top': '#inicio',
    '#platform': '#servicios',
    '#how-it-works': '#como-trabajamos',
    '#developers': '#contacto',
  };
  const restorePreviousLink = () => {
    const destination = previousSections[window.location.hash];
    if (!destination) return;
    window.history.replaceState(null, '', destination);
    document.querySelector(destination)?.scrollIntoView();
  };
  window.addEventListener('hashchange', restorePreviousLink);
  restorePreviousLink();
})();
