/* ─────────────────────────────────────────────────────────────
   Flor en Armonía — Script
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

// ── Nav: aparece cuando el logo del hero sale del viewport ──
const nav = document.getElementById('nav');
const heroLogoWrap = document.querySelector('.hero__logo-wrap');

if (heroLogoWrap) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      nav.classList.toggle('scrolled', !entry.isIntersecting);
    });
  }, { threshold: 0 });
  navObserver.observe(heroLogoWrap);
} else {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 40);
  }, { passive: true });
}

// ── Mobile burger menu ─────────────────────────────────────
const burger = document.getElementById('burger');
const mobileMenu = document.getElementById('mobileMenu');

burger.addEventListener('click', () => {
  const isOpen = mobileMenu.classList.toggle('open');
  burger.classList.toggle('open', isOpen);
  burger.setAttribute('aria-expanded', isOpen);
});

// Close mobile menu on link click
document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    burger.classList.remove('open');
    burger.setAttribute('aria-expanded', false);
  });
});

// ── Reveal on scroll (IntersectionObserver) ────────────────
const revealEls = document.querySelectorAll('.reveal');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// ── Contact form ───────────────────────────────────────────
const form = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    // Simple validation
    const nombre   = form.nombre.value.trim();
    const telefono = form.telefono.value.trim();
    const intencion = form.intencion.value.trim();

    if (!nombre || !telefono || !intencion) {
      // Shake invalid fields
      [form.nombre, form.telefono, form.intencion].forEach(field => {
        if (!field.value.trim()) {
          const target = field.closest('.phone-input') || field;
          target.style.borderColor = '#C9A99A';
          field.addEventListener('input', () => {
            target.style.borderColor = '';
          }, { once: true });
        }
      });
      return;
    }

    // Construir número de WhatsApp (sin + ni espacios para wa.me)
    const ladaVal    = (form.lada?.value || '+52').replace('+', '');
    const telefonoWa = ladaVal + telefono.replace(/\D/g, '');

    if (typeof emailjs === 'undefined') {
      alert('Error de conexión con el servicio de correo. Verifica tu internet e intenta de nuevo.');
      return;
    }

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando...';

    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
      nombre,
      lada:        form.lada?.value || '+52',
      telefono,
      telefono_wa: telefonoWa,
      suscripcion: form.suscripcion.value || 'No especificada',
      intencion,
    })
    .then(() => {
      form.style.opacity = '0';
      form.style.transform = 'translateY(8px)';
      form.style.transition = 'opacity 0.4s, transform 0.4s';
      setTimeout(() => {
        form.style.display = 'none';
        formSuccess.classList.add('visible');
        formSuccess.style.opacity = '0';
        formSuccess.style.transform = 'translateY(12px)';
        formSuccess.style.transition = 'opacity 0.5s, transform 0.5s';
        requestAnimationFrame(() => {
          formSuccess.style.opacity = '1';
          formSuccess.style.transform = 'translateY(0)';
        });
      }, 420);
    })
    .catch((err) => {
      console.error('EmailJS error:', err);
      submitBtn.disabled = false;
      submitBtn.textContent = 'Enviar mi intención';
      alert('Hubo un problema al enviar. Por favor intenta de nuevo.');
    });
  });
}

// ── Mini slideshow "Nuestro trabajo" ──────────────────────
const trabajoSlides = document.querySelectorAll('.trabajo__slide');
const trabajoDots   = document.querySelectorAll('.trabajo__dot');
if (trabajoSlides.length) {
  let trabajoCurrent = 0;
  function trabajoGoTo(n) {
    trabajoSlides[trabajoCurrent].classList.remove('active');
    trabajoDots[trabajoCurrent].classList.remove('active');
    trabajoCurrent = (n + trabajoSlides.length) % trabajoSlides.length;
    trabajoSlides[trabajoCurrent].classList.add('active');
    trabajoDots[trabajoCurrent].classList.add('active');
  }
  trabajoDots.forEach((dot, i) => dot.addEventListener('click', () => trabajoGoTo(i)));
  setInterval(() => trabajoGoTo(trabajoCurrent + 1), 3500);
}

// ── Smooth anchor scroll with nav offset ──────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const navHeight = nav.offsetHeight;
    const top = target.getBoundingClientRect().top + window.scrollY - navHeight;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});
