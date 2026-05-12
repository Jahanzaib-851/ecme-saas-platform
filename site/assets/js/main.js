// Back to top
const backBtn = document.getElementById('backToTop');
if (backBtn) {
  window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 300);
  });
  backBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
}

// Mobile menu
const mobileBtn = document.getElementById('mobileMenuBtn');
const mainNav = document.getElementById('mainNav');
if (mobileBtn && mainNav) {
  mobileBtn.addEventListener('click', () => mainNav.classList.toggle('open'));
}

// Search — prevent empty submit
document.querySelectorAll('.search-form').forEach(form => {
  form.addEventListener('submit', e => {
    const input = form.querySelector('input');
    if (!input || !input.value.trim()) e.preventDefault();
  });
});

// Smooth hover for cards
document.querySelectorAll('.post-card, .vlog-card, .mini-card').forEach(card => {
  card.addEventListener('mouseenter', () => card.style.willChange = 'transform');
  card.addEventListener('mouseleave', () => card.style.willChange = 'auto');
});

// Screenshot lightbox (simple)
document.querySelectorAll('.screenshot-item img').forEach(img => {
  img.addEventListener('click', () => {
    const overlay = document.createElement('div');
    overlay.style.cssText = `position:fixed;inset:0;background:rgba(0,0,0,.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer;`;
    const big = document.createElement('img');
    big.src = img.src;
    big.style.cssText = `max-width:90vw;max-height:90vh;border-radius:6px;box-shadow:0 0 60px rgba(0,0,0,.8);`;
    overlay.appendChild(big);
    overlay.addEventListener('click', () => overlay.remove());
    document.body.appendChild(overlay);
  });
});

// Active nav link
const currentPage = window.location.pathname.split('/').pop() || 'index.html';
document.querySelectorAll('.main-nav a').forEach(link => {
  if (link.getAttribute('href') === currentPage) link.classList.add('active');
});
