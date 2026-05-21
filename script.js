/**
 * KAMIL STUDIO — script.js
 * Features:
 *  1. Navbar scroll effect
 *  2. Hamburger menu (mobile)
 *  3. Active nav link on scroll
 *  4. Scroll-triggered fade animations
 *  5. Audio autoplay + mute/unmute
 *  6. Footer year auto-update
 */

/* ============================================================
   1. FOOTER — Auto Year
   ============================================================ */
document.getElementById('year').textContent = new Date().getFullYear();


/* ============================================================
   2. NAVBAR — Scroll Effect
   ============================================================ */
const navbar = document.getElementById('navbar');

function handleNavbarScroll() {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}

window.addEventListener('scroll', handleNavbarScroll, { passive: true });


/* ============================================================
   3. HAMBURGER MENU (Mobile)
   ============================================================ */
const hamburger  = document.getElementById('hamburger');
const navLinks   = document.getElementById('nav-links');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Tutup menu saat link diklik
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});


/* ============================================================
   4. ACTIVE NAV LINK — Berdasarkan posisi scroll
   ============================================================ */
const sections  = document.querySelectorAll('section[id]');
const allLinks  = document.querySelectorAll('.nav-link');

function setActiveLink() {
  let current = '';
  const scrollY = window.scrollY;

  sections.forEach(section => {
    const sectionTop    = section.offsetTop - 100;
    const sectionHeight = section.offsetHeight;

    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
      current = section.getAttribute('id');
    }
  });

  allLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === '#' + current) {
      link.classList.add('active');
    }
  });
}

window.addEventListener('scroll', setActiveLink, { passive: true });


/* ============================================================
   5. SCROLL ANIMATION — Intersection Observer (Fade In)
   ============================================================ */
const animatedEls = document.querySelectorAll('.fade-up, .fade-left, .fade-right');

const observerOptions = {
  threshold: 0.15,       // Tampil saat 15% elemen masuk viewport
  rootMargin: '0px 0px -40px 0px'
};

const scrollObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      // Opsional: stop observing setelah animasi berjalan
      scrollObserver.unobserve(entry.target);
    }
  });
}, observerOptions);

animatedEls.forEach(el => scrollObserver.observe(el));


/* ============================================================
   6. AUDIO AUTOPLAY + MUTE/UNMUTE
   ============================================================ */
const audio     = document.getElementById('bg-audio');
const audioBtn  = document.getElementById('audio-btn');
const audioIcon = document.getElementById('audio-icon');

// Set volume awal (0 = mute, 1 = full)
audio.volume = 0.35;

// --- Fungsi play/mute ---
function playAudio() {
  audio.play().catch(() => {
    // Browser memblokir autoplay — tombol sudah tersedia untuk user
    console.log('Autoplay diblokir browser. Tekan tombol musik untuk memutar.');
  });
}

function updateAudioUI(isMuted) {
  if (isMuted) {
    audioIcon.textContent  = '♪';
    audioBtn.querySelector('.audio-label').textContent = 'MUSIC';
    audioBtn.classList.add('muted');
  } else {
    audioIcon.textContent  = '♫';
    audioBtn.querySelector('.audio-label').textContent = 'MUSIC ON';
    audioBtn.classList.remove('muted');
  }
}

// Coba autoplay saat halaman dimuat
window.addEventListener('load', () => {
  // Strategi: coba play diam-diam, update UI sesuai hasilnya
  audio.play()
    .then(() => {
      updateAudioUI(false); // Berhasil play
    })
    .catch(() => {
      updateAudioUI(true);  // Gagal — tunggu interaksi user
    });
});

// Tombol mute/unmute
audioBtn.addEventListener('click', () => {
  if (audio.paused) {
    // Kalau belum play, mulai play
    audio.play().then(() => {
      updateAudioUI(false);
    });
  } else {
    // Toggle mute
    audio.muted = !audio.muted;
    updateAudioUI(audio.muted);
  }
});

// Autoplay saat user pertama kali berinteraksi dengan halaman
// (solusi untuk browser yang blokir autoplay sebelum interaksi)
let interactionStarted = false;

function startOnInteraction() {
  if (!interactionStarted && audio.paused) {
    interactionStarted = true;
    audio.play().then(() => {
      updateAudioUI(false);
    }).catch(() => {});
  }
}

document.addEventListener('click',     startOnInteraction, { once: true });
document.addEventListener('scroll',    startOnInteraction, { once: true, passive: true });
document.addEventListener('touchstart',startOnInteraction, { once: true });


/* ============================================================
   7. SMOOTH SCROLL — untuk browser lama yang tidak support
   ============================================================ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
