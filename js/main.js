document.addEventListener('DOMContentLoaded', () => {
  // Abrir y cerrar menú móvil
  const btnMenuToggle = document.getElementById('btn-menu-toggle');
  const mainNav = document.getElementById('main-nav');

  if (btnMenuToggle && mainNav) {
    btnMenuToggle.addEventListener('click', () => {
      mainNav.classList.toggle('header__nav--open');
      btnMenuToggle.classList.toggle('header__toggle--active');
      document.body.classList.toggle('has-menu-open');
    });

    mainNav.querySelectorAll('.header__link').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('header__nav--open');
        btnMenuToggle.classList.remove('header__toggle--active');
        document.body.classList.remove('has-menu-open');
      });
    });
  }

  // Mostrar notificación flotante
  const toastEl = document.getElementById('toast');
  const toastMsgEl = document.getElementById('toast-message');
  let toastTimer = null;

  function showToast(message) {
    if (!toastEl || !toastMsgEl) return;
    toastMsgEl.textContent = message;
    toastEl.classList.add('toast--visible');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toastEl.classList.remove('toast--visible');
    }, 2800);
  }

  // Formatear números y gestionar contadores en localStorage
  function formatNumber(num) {
    return num.toLocaleString('en-US');
  }

  function getCounter(key, fallback) {
    const saved = localStorage.getItem(key);
    return saved !== null ? parseInt(saved, 10) : fallback;
  }

  function saveCounter(key, val) {
    localStorage.setItem(key, val);
  }

  // Enlazar botones de contador (velas y caricias)
  function initCounterButton(btnId, countId, defaultKey, defaultVal, toastMsg, onClickExtra) {
    const btn = document.getElementById(btnId);
    const countEl = document.getElementById(countId);
    if (!btn || !countEl) return;

    const key = btn.dataset.counterKey || defaultKey;
    const initial = parseInt(btn.dataset.initial || defaultVal, 10);
    let current = getCounter(key, initial);
    countEl.textContent = formatNumber(current);

    btn.addEventListener('click', () => {
      current++;
      saveCounter(key, current);
      countEl.textContent = formatNumber(current);
      if (onClickExtra) onClickExtra();
      showToast(toastMsg);
    });
  }

  // Inicializar contadores de inicio, galería y memoria
  initCounterButton(
    'btn-caricias',
    'caricias-count',
    'bruno_caricias',
    116800,
    '🐾 Has enviado una caricia al cielo para Bruno'
  );

  const homeCandleIconEl = document.getElementById('home-candle-icon');
  initCounterButton(
    'btn-home-candle',
    'home-candle-count',
    'bruno_luces_inicio',
    482,
    '✨ Has encendido una luz en el parque nacional para Bruno',
    () => {
      if (homeCandleIconEl) homeCandleIconEl.classList.add('is-lit');
    }
  );

  initCounterButton(
    'btn-gallery-candle',
    'gallery-candle-count',
    'bruno_velas_galeria',
    142,
    '🕯 Vela encendida en la galería de recuerdos de Bruno'
  );

  initCounterButton(
    'btn-memorial-candle',
    'memorial-candle-count',
    'bruno_velas_memoria',
    1248,
    '🕯 Has encendido una vela eterna en memoria de Bruno'
  );

  // Filtrar elementos por categoría
  const filterButtons = document.querySelectorAll('.filter-bar__btn[data-filter]');
  const filterableItems = document.querySelectorAll('[data-category]');

  if (filterButtons.length && filterableItems.length) {
    filterButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const category = btn.dataset.filter;
        const activeClass = btn.dataset.activeClass || 'filter-bar__btn--active-orange';

        filterButtons.forEach((otherBtn) => {
          otherBtn.classList.remove(
            'filter-bar__btn--active-brown',
            'filter-bar__btn--active-orange'
          );
        });

        btn.classList.add(activeClass);

        filterableItems.forEach((item) => {
          item.hidden = category !== 'all' && item.dataset.category !== category;
        });
      });
    });
  }

  // Sumar huellitas y guardar favoritos en historias
  document.querySelectorAll('.timeline__paw-btn').forEach((btn) => {
    const countEl = btn.querySelector('.js-paw-count');
    if (!countEl) return;

    const key = btn.dataset.counterKey || 'bruno_paw';
    const initial = parseInt(btn.dataset.initial || '42', 10);
    let current = getCounter(key, initial);
    countEl.textContent = formatNumber(current);

    btn.addEventListener('click', () => {
      current++;
      saveCounter(key, current);
      countEl.textContent = formatNumber(current);
      showToast('🐾 Huellita añadida a esta historia de Bruno');
    });
  });

  const btnSaveFavorites = document.getElementById('btn-save-favorites');
  const saveFavoritesLabel = document.getElementById('save-favorites-label');

  if (btnSaveFavorites && saveFavoritesLabel) {
    let isSaved = getCounter('bruno_fav_stories', 0) === 1;

    function renderFavState() {
      btnSaveFavorites.classList.toggle('is-active', isSaved);
      saveFavoritesLabel.textContent = isSaved
        ? 'Guardado en favoritos familiares ✓'
        : 'Guardar en favoritos familiares';
    }

    renderFavState();

    btnSaveFavorites.addEventListener('click', () => {
      isSaved = !isSaved;
      saveCounter('bruno_fav_stories', isSaved ? 1 : 0);
      renderFavState();
      showToast(
        isSaved
          ? '♥ Historias guardadas en tus favoritos familiares'
          : 'Eliminado de favoritos familiares'
      );
    });
  }

  // Marcar favoritos en galería y dedicatorias
  const btnFeaturedLike = document.getElementById('btn-featured-like');
  if (btnFeaturedLike) {
    btnFeaturedLike.addEventListener('click', () => {
      const isLiked = btnFeaturedLike.classList.toggle('is-liked');
      showToast(
        isLiked
          ? '♥ Has marcado "Paz eterna en mi mirada" como favorito'
          : 'Quitado de favoritos'
      );
    });
  }

  document.querySelectorAll('.js-dedication-fav').forEach((btn) => {
    btn.addEventListener('click', () => {
      const active = btn.classList.toggle('is-active');
      showToast(active ? '♥ Gracias por honrar esta dedicatoria' : 'Reacción retirada');
    });
  });
});
