// ===== original reveal + footer logic (kept intact) =====
// Run after DOM is parsed (use defer in HTML)
(function () {
  const cards = Array.from(document.querySelectorAll('.food-card'));
  if (!cards.length) return;

  const revealNow = (el) => {
    if (!el.classList.contains('show')) el.classList.add('show');
  };

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          revealNow(entry.target);
          observer.unobserve(entry.target);
        }
      }
    }, { root: null, rootMargin: '0px 0px -10% 0px', threshold: 0.15 });

    cards.forEach(card => io.observe(card));
  } else {
    // Fallback: simple scroll check
    const onScroll = () => {
      const trigger = window.innerHeight * 0.85;
      for (const card of cards) {
        if (card.classList.contains('show')) continue;
        const rect = card.getBoundingClientRect();
        if (rect.top < trigger) revealNow(card);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('load', onScroll);
    onScroll();
  }

  // Set footer year (mirrors Japan behavior without needing jQuery)
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
})();

// ===== Eaten feature + Video lazy-load for Thailand =====
document.addEventListener('DOMContentLoaded', function () {
  initEatenFeatureThailand();
  initVideoLazyLoad();
});

function initEatenFeatureThailand() {
  const cards = document.querySelectorAll('.container .food-card');
  const STORAGE_KEY = 'eatenFoodsThailand';
  let eaten = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  // Apply saved state and attach handlers
  cards.forEach(card => {
    const id = getFoodIdThailand(card);
    if (!id) return;

    if (eaten[id]) {
      card.classList.add('eaten');
      card.setAttribute('aria-pressed', 'true');
    } else {
      card.setAttribute('aria-pressed', 'false');
    }

    // keyboard + accessibility
    card.tabIndex = 0;
    card.setAttribute('role', 'button');

    // dblclick to toggle - but ignore dblclicks that originate inside a video-thumb
    card.addEventListener('dblclick', (e) => {
      if (e.target.closest('.video-thumb')) {
        // user double-clicked the video area — don't toggle eaten
        return;
      }
      toggleCard(card, id, eaten, STORAGE_KEY);
    });

    // keyboard toggle (Enter or Space)
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleCard(card, id, eaten, STORAGE_KEY);
      }
    });
  });

  // render list
  updateEatenListThailand();
}

function getFoodIdThailand(card) {
  // Title in this markup: .food-info h2
  const h = card.querySelector('.food-info h2');
  return h ? h.textContent.trim() : null;
}

function toggleCard(card, id, eatenObj, storageKey) {
  if (card.classList.contains('eaten')) {
    card.classList.remove('eaten');
    card.setAttribute('aria-pressed', 'false');
    delete eatenObj[id];
  } else {
    card.classList.add('eaten');
    card.setAttribute('aria-pressed', 'true');
    eatenObj[id] = { eaten: true, ts: Date.now() };
  }

  try {
    localStorage.setItem(storageKey, JSON.stringify(eatenObj));
  } catch (err) {
    console.warn('localStorage save failed:', err);
  }

  updateEatenListThailand();
}

function updateEatenListThailand() {
  const list = document.getElementById('eaten-list-th');
  if (!list) return;
  list.innerHTML = ''; // clear

  const STORAGE_KEY = 'eatenFoodsThailand';
  const eaten = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
  const cards = document.querySelectorAll('.container .food-card');

  // Map stored keys to visible names (defensive)
  const eatenItems = Object.keys(eaten).map(id => {
    const card = Array.from(cards).find(c => getFoodIdThailand(c) === id);
    return card ? getFoodIdThailand(card) : id;
  }).filter(Boolean);

  if (eatenItems.length === 0) {
    const li = document.createElement('li');
    li.className = 'list-group-item text-center';
    li.textContent = 'Not eaten yet';
    list.appendChild(li);
    return;
  }

  eatenItems.forEach(name => {
    const li = document.createElement('li');
    li.className = 'list-group-item list-group-item-action';
    li.textContent = name;
    li.addEventListener('click', () => {
      // scroll to the matching card
      const target = Array.from(document.querySelectorAll('main .food-card')).find(c => getFoodIdThailand(c) === name);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
    list.appendChild(li);
  });
}

/* ====== Video lazy-load (replace thumbnail with iframe on click) ====== */
function initVideoLazyLoad() {
  const thumbs = document.querySelectorAll('.video-thumb');
  thumbs.forEach(thumb => {
    // keyboard accessibility already set in HTML via tabindex/role
    thumb.addEventListener('click', (e) => {
      e.stopPropagation();
      loadIframeIntoThumb(thumb);
    });

    thumb.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadIframeIntoThumb(thumb);
      }
    });
  });
}

function loadIframeIntoThumb(thumb) {
  // don't re-create if already an iframe inside
  if (thumb.querySelector('iframe')) return;

  const vid = thumb.dataset.videoId;
  if (!vid) return;

  // Create iframe
  const iframe = document.createElement('iframe');
  iframe.src = `https://www.youtube.com/embed/${encodeURIComponent(vid)}?rel=0&modestbranding=1&autoplay=1`;
  iframe.width = '100%';
  iframe.height = '100%';
  iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
  iframe.allowFullscreen = true;
  iframe.title = thumb.getAttribute('aria-label') || 'YouTube video';

  // Clear thumb contents and insert iframe
  thumb.innerHTML = '';
  thumb.appendChild(iframe);
}

card.addEventListener('dblclick', (e) => {
  // Only prevent toggle if the actual click target is within video-thumb, not just the wrapper
  if (e.target.closest('.video-thumb') && !e.target.closest('.food-info')) {
    return;
  }
  toggleCard(card, id, eaten, STORAGE_KEY);
});