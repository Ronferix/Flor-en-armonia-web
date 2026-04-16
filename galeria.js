/* ─────────────────────────────────────────────────────────────
   Flor en Armonía — Galería
   ───────────────────────────────────────────────────────────── */

// ── EmailJS ────────────────────────────────────────────────────
const EMAILJS_PUBLIC_KEY  = 'e-opEFmAoFvxSQLeZ';
const EMAILJS_SERVICE_ID  = 'service_72bj7kn';
const EMAILJS_TEMPLATE_ID = 'template_rg1knyq';

try {
  emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
} catch (e) {
  console.warn('EmailJS no se pudo inicializar:', e);
}

// ══════════════════════════════════════════════════════════════
//  IMÁGENES DEL SLIDESHOW
//  Coloca tus archivos en /imagenes y lista sus nombres aquí.
// ══════════════════════════════════════════════════════════════
const IMAGENES = [
  'imagenes/1.png',
  'imagenes/2.png',
  'imagenes/3.png',
  'imagenes/4.png',
  'imagenes/5.png',
  'imagenes/6.png',
  'imagenes/7.png',
  'imagenes/8.png',
  'imagenes/9.png',
  'imagenes/10.png',
  'imagenes/11.png',
];
// ══════════════════════════════════════════════════════════════

// ══════════════════════════════════════════════════════════════
//  TESTIMONIOS
//  Agrega cada testimonio como: { texto: '...', nombre: '...' }
// ══════════════════════════════════════════════════════════════
const TESTIMONIOS = [
  // Se llenarán próximamente con los testimonios reales.
  // { texto: 'Texto del testimonio.', nombre: 'Nombre Cliente' },
];
// ══════════════════════════════════════════════════════════════


// ── Burger menu ────────────────────────────────────────────────
const burger     = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  });
});


// ── Slideshow ──────────────────────────────────────────────────
const track    = document.getElementById('slideshowTrack');
const dotsWrap = document.getElementById('slideshowDots');
const counter  = document.getElementById('slideshowCounter');
const prevBtn  = document.getElementById('prevBtn');
const nextBtn  = document.getElementById('nextBtn');

let current = 0;
let autoTimer;
const AUTOPLAY_INTERVAL = 5000;

if (IMAGENES.length === 0) {
  prevBtn.style.display = 'none';
  nextBtn.style.display = 'none';
  const empty = document.createElement('div');
  empty.className = 'slide slide--empty active';
  empty.innerHTML = `
    <svg viewBox="0 0 120 120" fill="none" width="100" height="100">
      <circle cx="60" cy="60" r="50" stroke="#C9A99A" stroke-width="0.8" opacity="0.4"/>
      <path d="M60 20 Q75 38 60 55 Q45 38 60 20Z" stroke="#9CAF88" stroke-width="1.2" fill="none" opacity="0.5"/>
      <path d="M60 55 Q75 72 60 89 Q45 72 60 55Z" stroke="#C9A99A" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M25 60 Q43 45 60 60 Q43 75 25 60Z" stroke="#9CAF88" stroke-width="1" fill="none" opacity="0.5"/>
      <path d="M95 60 Q77 45 60 60 Q77 75 95 60Z" stroke="#9CAF88" stroke-width="1" fill="none" opacity="0.5"/>
    </svg>
    <p>Las imágenes aparecerán aquí</p>`;
  track.appendChild(empty);

} else {
  IMAGENES.forEach((src, i) => {
    const slide = document.createElement('div');
    slide.className = 'slide' + (i === 0 ? ' active' : '');

    const bg = document.createElement('div');
    bg.className = 'slide__bg';
    bg.style.backgroundImage = `url(${src})`;
    slide.appendChild(bg);

    const img = document.createElement('img');
    img.src      = src;
    img.alt      = `Arreglo floral ${i + 1}`;
    img.loading  = i === 0 ? 'eager' : 'lazy';
    img.draggable = false;

    slide.appendChild(img);
    track.appendChild(slide);

    const dot = document.createElement('button');
    dot.className = 'slideshow__dot' + (i === 0 ? ' active' : '');
    dot.setAttribute('aria-label', `Slide ${i + 1}`);
    dot.addEventListener('click', () => goTo(i));
    dotsWrap.appendChild(dot);
  });

  const slides = Array.from(track.querySelectorAll('.slide'));
  const dots   = Array.from(dotsWrap.querySelectorAll('.slideshow__dot'));

  function updateCounter() {
    if (counter) counter.textContent = `${current + 1} / ${IMAGENES.length}`;
  }
  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = ((index % IMAGENES.length) + IMAGENES.length) % IMAGENES.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
    updateCounter();
    resetTimer();
  }
  function next() { goTo(current + 1); }
  function prev() { goTo(current - 1); }
  function resetTimer() {
    clearInterval(autoTimer);
    autoTimer = setInterval(next, AUTOPLAY_INTERVAL);
  }

  nextBtn.addEventListener('click', next);
  prevBtn.addEventListener('click', prev);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') next();
    if (e.key === 'ArrowLeft')  prev();
  });

  const slideshowEl = document.querySelector('.slideshow');
  let touchStartX = 0;
  slideshowEl.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  slideshowEl.addEventListener('touchend', (e) => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 48) diff > 0 ? next() : prev();
  }, { passive: true });

  slideshowEl.addEventListener('mouseenter', () => clearInterval(autoTimer));
  slideshowEl.addEventListener('mouseleave', resetTimer);

  updateCounter();
  resetTimer();
}


// ── Formulario de contacto ─────────────────────────────────────
const formGaleria   = document.getElementById('contactFormGaleria');
const successGaleria = document.getElementById('formSuccessGaleria');

if (formGaleria) {
  formGaleria.addEventListener('submit', (e) => {
    e.preventDefault();
    const nombre    = formGaleria.nombre.value.trim();
    const telefono  = formGaleria.telefono.value.trim();
    const intencion = formGaleria.intencion.value.trim();

    if (!nombre || !telefono || !intencion) {
      [formGaleria.nombre, formGaleria.telefono, formGaleria.intencion].forEach(field => {
        if (!field.value.trim()) {
          const target = field.closest('.phone-input') || field;
          target.style.borderColor = '#C9A99A';
          field.addEventListener('input', () => { target.style.borderColor = ''; }, { once: true });
        }
      });
      return;
    }

    const ladaVal    = (formGaleria.lada?.value || '+52').replace('+', '');
    const telefonoWa = ladaVal + telefono.replace(/\D/g, '');

    const submitBtn = formGaleria.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      nombre,
      lada:        formGaleria.lada?.value || '+52',
      telefono,
      telefono_wa: telefonoWa,
      suscripcion: formGaleria.suscripcion.value || 'No especificada',
      intencion,
    })
    .then(() => {
      formGaleria.style.opacity = '0';
      formGaleria.style.transform = 'translateY(8px)';
      formGaleria.style.transition = 'opacity 0.4s, transform 0.4s';
      setTimeout(() => {
        formGaleria.style.display = 'none';
        successGaleria.classList.add('visible');
        successGaleria.style.opacity = '0';
        successGaleria.style.transform = 'translateY(12px)';
        successGaleria.style.transition = 'opacity 0.5s, transform 0.5s';
        requestAnimationFrame(() => {
          successGaleria.style.opacity = '1';
          successGaleria.style.transform = 'translateY(0)';
        });
      }, 420);
    })
    .catch(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mi intención';
      alert('Hubo un problema al enviar. Por favor intenta de nuevo.');
    });
  });
}


// ── Testimonios (marquee continuo) ─────────────────────────────
const testimoniosInner = document.getElementById('testimoniosInner');

if (testimoniosInner) {
  if (TESTIMONIOS.length === 0) {
    // Placeholder hasta recibir testimonios reales
    const section = testimoniosInner.closest('.testimonios-section');
    const placeholder = document.createElement('div');
    placeholder.className = 'testimonios__placeholder';
    placeholder.innerHTML = `
      <svg viewBox="0 0 40 32" fill="none" width="40" height="32">
        <path d="M0 20 C0 10 6 4 18 0 L20 4 C14 6 11 10 11 14 L16 14 L16 32 L0 32 Z" fill="#C9A99A" opacity="0.25"/>
        <path d="M22 20 C22 10 28 4 40 0 L42 4 C36 6 33 10 33 14 L38 14 L38 32 L22 32 Z" fill="#C9A99A" opacity="0.25"/>
      </svg>
      <p>Los testimonios de nuestros clientes<br/>aparecerán aquí próximamente.</p>`;
    section.querySelector('.testimonios__marquee-wrap').replaceWith(placeholder);
  } else {
    // Calcular copias para llenar >2× el viewport
    const CARD_W   = 334; // 320px + 14px gap
    const setWidth = TESTIMONIOS.length * CARD_W;
    const copies   = Math.max(2, Math.ceil((window.innerWidth * 2.5) / setWidth));
    const total    = copies * 2;

    for (let c = 0; c < total; c++) {
      TESTIMONIOS.forEach(({ texto, nombre }) => {
        const card = document.createElement('div');
        card.className = 'testimonio__card';
        card.innerHTML = `
          <svg class="testimonio__quote" viewBox="0 0 40 32" fill="none" width="28" height="22">
            <path d="M0 20 C0 10 6 4 18 0 L20 4 C14 6 11 10 11 14 L16 14 L16 32 L0 32 Z" fill="currentColor"/>
            <path d="M22 20 C22 10 28 4 40 0 L42 4 C36 6 33 10 33 14 L38 14 L38 32 L22 32 Z" fill="currentColor"/>
          </svg>
          <p class="testimonio__text">${texto}</p>
          <span class="testimonio__name">— ${nombre}</span>`;
        testimoniosInner.appendChild(card);
      });
    }

    const duration = Math.max(24, TESTIMONIOS.length * 6 * copies);
    testimoniosInner.style.setProperty('--testimonio-dur', `${duration}s`);
    testimoniosInner.parentElement.style.setProperty('--testimonio-dur', `${duration}s`);
  }
}
