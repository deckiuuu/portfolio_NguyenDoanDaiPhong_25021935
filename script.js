/* =========================================
   SCRIPT.JS — PORTFOLIO INTERACTIONS
   ========================================= */

// ---- NAVBAR SCROLL ----
const navbar = document.getElementById('navbar');
const scrollTopBtn = document.getElementById('scroll-top');

window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
    scrollTopBtn.classList.add('visible');
  } else {
    navbar.classList.remove('scrolled');
    scrollTopBtn.classList.remove('visible');
  }
  updateActiveNavLink();
});

// ---- HAMBURGER MENU ----
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  const spans = hamburger.querySelectorAll('span');
  if (navLinks.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});

// Close menu when link clicked
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    const spans = hamburger.querySelectorAll('span');
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  });
});

// ---- ACTIVE NAV LINK ----
function updateActiveNavLink() {
  const sections = ['home', 'projects', 'summary'];
  const scrollPos = window.scrollY + 120;

  let current = 'home';
  for (const id of sections) {
    const el = document.getElementById(id);
    if (el && el.offsetTop <= scrollPos) {
      current = id;
    }
  }

  document.querySelectorAll('.nav-link').forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

// ---- PARTICLES ----
function createParticles() {
  const container = document.getElementById('particles');
  if (!container) return;
  const count = 40;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');
    p.style.left = Math.random() * 100 + '%';
    p.style.top = Math.random() * 100 + '%';
    p.style.animationDuration = (8 + Math.random() * 12) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    const size = 1 + Math.random() * 3;
    p.style.width = size + 'px';
    p.style.height = size + 'px';
    // Alternate colors
    const colors = ['#6ee7f7', '#a78bfa', '#f472b6', '#34d399'];
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    container.appendChild(p);
  }
}
createParticles();

// ---- COUNTING ANIMATION ----
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current) + (el.dataset.target === '100' ? '%' : '');
  }, 16);
}

// ---- INTERSECTION OBSERVER ----
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // If it's a stat number, start counting
      if (entry.target.classList.contains('stat-num')) {
        animateCounter(entry.target);
      }
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

// Observe reveal elements
document.querySelectorAll('.project-card, .glass-card, .learning-item, .timeline-item, .stat-num').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Observe stats
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.stat-num').forEach(num => {
        animateCounter(num);
      });
      statsObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.3 });

const statsBar = document.querySelector('.stats-bar');
if (statsBar) statsObserver.observe(statsBar);

// ---- MODAL ----
function showModal(type, content) {
  const overlay = document.getElementById('modal-overlay');
  const body = document.getElementById('modal-body');

  let html = '';

  if (type === 'pdf') {
    html = `
      <div class="modal-icon">📄</div>
      <div class="modal-title">${content}</div>
      <div class="modal-desc">
        <p>Tài liệu PDF này là sản phẩm cuối cùng của bài tập.<br/>
        Trong portfolio thực tế, bạn hãy thay thế bằng đường link tải file PDF thực của bạn.</p>
        <br/>
        <a href="#" class="btn-primary" style="display:inline-flex;margin:0 auto;" onclick="closeModal()">
          📥 Tải xuống PDF
        </a>
      </div>
    `;
  } else if (type === 'slide') {
    html = `
      <div class="modal-icon">📊</div>
      <div class="modal-title">${content}</div>
      <div class="modal-desc">
        <p>File slide thuyết trình của bài tập.<br/>
        Hãy chèn đường link Google Slides hoặc PowerPoint của bạn vào đây.</p>
        <br/>
        <a href="#" class="btn-primary" style="display:inline-flex;margin:0 auto;" onclick="closeModal()">
          🔗 Mở Slide
        </a>
      </div>
    `;
  } else if (type === 'video') {
    html = `
      <div class="modal-title">🎬 Video trình bày</div>
      <div style="margin:1rem 0;border-radius:12px;overflow:hidden;aspect-ratio:16/9;background:#000;">
        <iframe width="100%" height="100%" src="${content}" 
          frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen style="border:none;"></iframe>
      </div>
      <div class="modal-desc" style="font-size:0.82rem;">Thay thế URL bằng link YouTube video thực của bạn.</div>
    `;
  } else if (type === 'image') {
    html = `
      <div class="modal-icon">🖼️</div>
      <div class="modal-title">${content}</div>
      <div class="modal-desc">
        <p>Hình ảnh/Infographic sản phẩm của bài tập.<br/>
        Hãy thêm hình ảnh thực tế của bạn vào đây.</p>
      </div>
    `;
  }

  body.innerHTML = html;
  overlay.classList.add('active');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  document.getElementById('modal-overlay').classList.remove('active');
  document.body.style.overflow = '';
}

// Close modal with Escape key
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') closeModal();
});

// ---- SMOOTH HOVER on PROJECT CARDS ----
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 10;
    card.style.transform = `translateY(-4px) rotateX(${-y * 0.4}deg) rotateY(${x * 0.4}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ---- SKILL BARS ANIMATION ----
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.querySelectorAll('.skill-fill').forEach(fill => {
        fill.style.animation = 'none';
        void fill.offsetWidth; // reflow
        fill.style.animation = 'skill-grow 1.5s ease forwards';
      });
    }
  });
}, { threshold: 0.3 });

const learningsSection = document.querySelector('.learnings-section');
if (learningsSection) skillObserver.observe(learningsSection);

// ---- INIT: set initial scroll state ----
updateActiveNavLink();

console.log('%c✦ Portfolio Nguyễn Đoàn Đại Phong', 'font-size:16px;font-weight:bold;color:#6ee7f7;');
console.log('%cBuilt with ❤️ for Nhập môn CNS&AI', 'color:#a78bfa;');
