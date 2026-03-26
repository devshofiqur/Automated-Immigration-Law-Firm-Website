/* ═══════════════════════════════════════════════════════════
   MERIDIAN IMMIGRATION LAW — JavaScript
   Funnel Logic · Nav Scroll · Calculator · Animations
═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', function () {

  /* ── Navbar Scroll Effect ─────────────────────────────── */
  const nav = document.getElementById('mainNav');

  const handleNavScroll = () => {
    if (window.scrollY > 60) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleNavScroll, { passive: true });


  /* ── Back to Top Button ───────────────────────────────── */
  const backBtn = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      backBtn.classList.add('visible');
    } else {
      backBtn.classList.remove('visible');
    }
  }, { passive: true });


  /* ── Smooth Active Nav Links ──────────────────────────── */
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link[href^="#"]');

  const observerOptions = {
    root: null,
    rootMargin: '-40% 0px -40% 0px',
    threshold: 0,
  };

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((link) => {
          link.classList.remove('active');
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.classList.add('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => sectionObserver.observe(section));


  /* ── Scroll-Triggered Fade-In Animations ─────────────── */
  const animTargets = document.querySelectorAll(
    '.service-card, .testimonial-card, .step-item, .about-pillar, .faq-item'
  );

  const fadeObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
          }, (entry.target.dataset.delay || 0) * 80);
          fadeObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );

  animTargets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    el.dataset.delay = i % 4;
    fadeObserver.observe(el);
  });


  /* ── Price Calculator ─────────────────────────────────── */
  const calcTotal = document.getElementById('calcTotal');
  const packageRadios = document.querySelectorAll('input[name="package"]');
  const addonCheckboxes = document.querySelectorAll('.calc-addons input[type="checkbox"]');

  function updateCalculator() {
    let base = 0;
    let addons = 0;

    packageRadios.forEach((radio) => {
      if (radio.checked) base = parseInt(radio.value);
    });

    addonCheckboxes.forEach((checkbox) => {
      if (checkbox.checked) addons += parseInt(checkbox.value);
    });

    const total = base + addons;

    if (calcTotal) {
      calcTotal.style.transform = 'scale(1.1)';
      calcTotal.style.color = 'var(--gold-dark)';
      setTimeout(() => {
        calcTotal.textContent = '$' + total.toLocaleString();
        calcTotal.style.transform = 'scale(1)';
        calcTotal.style.color = 'var(--gold)';
      }, 150);
    }
  }

  packageRadios.forEach((r) => r.addEventListener('change', updateCalculator));
  addonCheckboxes.forEach((c) => c.addEventListener('change', updateCalculator));

  // Init
  updateCalculator();


  /* ── Onboarding Funnel Logic ──────────────────────────── */
  let currentStep = 1;
  const totalSteps = 6;

  window.goStep = function (step) {
    // Hide all panels
    document.querySelectorAll('.funnel-panel').forEach((panel) => {
      panel.classList.remove('active');
    });

    // Show target panel
    const targetPanel = document.getElementById('panel-' + step);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    currentStep = step;

    // Update progress indicators
    document.querySelectorAll('.funnel-step-indicator').forEach((indicator) => {
      const indicatorStep = parseInt(indicator.dataset.step);
      indicator.classList.remove('active', 'done');
      if (indicatorStep === step) {
        indicator.classList.add('active');
      } else if (indicatorStep < step) {
        indicator.classList.add('done');
      }
    });

    // Scroll to funnel top
    const funnelTop = document.getElementById('start');
    if (funnelTop) {
      funnelTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  window.submitCase = function () {
    // Basic validation
    const consentCheck = document.querySelector('.consent-check input[type="checkbox"]');
    if (consentCheck && !consentCheck.checked) {
      showNotification('Please authorize the payment to proceed.', 'warning');
      return;
    }

    // Hide all panels, show confirmation
    document.querySelectorAll('.funnel-panel').forEach((panel) => {
      panel.classList.remove('active');
    });

    const confirmPanel = document.getElementById('panel-confirm');
    if (confirmPanel) {
      confirmPanel.classList.add('active');
    }

    // Mark all steps done
    document.querySelectorAll('.funnel-step-indicator').forEach((indicator) => {
      indicator.classList.remove('active');
      indicator.classList.add('done');
    });

    // Scroll to confirmation
    const funnelTop = document.getElementById('start');
    if (funnelTop) {
      funnelTop.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showNotification('Case submitted! Check your email for confirmation.', 'success');
  };

  // Clickable progress indicators
  document.querySelectorAll('.funnel-step-indicator').forEach((indicator) => {
    indicator.addEventListener('click', () => {
      const step = parseInt(indicator.dataset.step);
      if (step <= currentStep) {
        goStep(step);
      }
    });
  });


  /* ── Card Number Formatting ───────────────────────────── */
  const cardInput = document.getElementById('cardNumber');
  if (cardInput) {
    cardInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '').substring(0, 16);
      let formatted = value.replace(/(.{4})/g, '$1 ').trim();
      e.target.value = formatted;
    });
  }


  /* ── Notification Toast ───────────────────────────────── */
  function showNotification(message, type = 'success') {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
      <div class="toast-inner toast-${type}">
        <i class="bi bi-${type === 'success' ? 'check-circle-fill' : 'exclamation-circle-fill'}"></i>
        <span>${message}</span>
      </div>
    `;

    document.body.appendChild(toast);

    // Animate in
    requestAnimationFrame(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      toast.style.transition = 'all 0.4s ease';
      requestAnimationFrame(() => {
        toast.style.opacity = '1';
        toast.style.transform = 'translateY(0)';
      });
    });

    // Auto-remove after 4s
    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(20px)';
      setTimeout(() => toast.remove(), 400);
    }, 4000);
  }

  // Inject toast styles
  const toastStyles = document.createElement('style');
  toastStyles.textContent = `
    .toast-notification {
      position: fixed;
      bottom: 100px;
      right: 32px;
      z-index: 9999;
    }
    .toast-inner {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px 24px;
      border-radius: 10px;
      font-family: var(--font-body);
      font-size: 0.88rem;
      font-weight: 500;
      box-shadow: 0 8px 32px rgba(0,0,0,0.15);
    }
    .toast-success { background: #0E0E0E; color: #FAF8F4; }
    .toast-success i { color: #B8942A; }
    .toast-warning { background: #fff8e1; color: #7b5800; border: 1px solid #f5c842; }
    .toast-warning i { color: #c0860e; }
  `;
  document.head.appendChild(toastStyles);


  /* ── Mobile nav close on link click ──────────────────── */
  document.querySelectorAll('.navbar-nav .nav-link').forEach((link) => {
    link.addEventListener('click', () => {
      const navMenu = document.getElementById('navMenu');
      const bsCollapse = bootstrap.Collapse.getInstance(navMenu);
      if (bsCollapse) bsCollapse.hide();
    });
  });


  /* ── Smooth CTA "#start" links ────────────────────────── */
  document.querySelectorAll('a[href="#start"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('start');
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });


  /* ── Section reveal animation ─────────────────────────── */
  const headerTargets = document.querySelectorAll('.section-header');

  const headerObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          headerObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  headerTargets.forEach((el) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(16px)';
    el.style.transition = 'opacity 0.7s ease, transform 0.7s ease';
    headerObserver.observe(el);
  });


  /* ── Floating cards parallax ──────────────────────────── */
  const floatCards = document.querySelectorAll('.hero-float-card');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    floatCards.forEach((card, i) => {
      const dir = i % 2 === 0 ? 1 : -1;
      card.style.transform = `translateY(${scrollY * 0.04 * dir}px)`;
    });
  }, { passive: true });


  /* ── FAQ: add analytics hook stubs ───────────────────── */
  document.querySelectorAll('.faq-button').forEach((btn) => {
    btn.addEventListener('click', () => {
      const q = btn.textContent.trim().substring(0, 40);
      // console.log(`[Analytics] FAQ opened: ${q}`);
    });
  });


  /* ── Intake: Service selector sync with order summary ── */
  document.querySelectorAll('input[name="service"]').forEach((radio) => {
    radio.addEventListener('change', function () {
      const serviceName = this.value === 'filed'
        ? 'Attorney-Filed Petition'
        : 'Attorney-Prepared Guidance';
      const servicePrice = this.value === 'filed' ? '$2,250' : '$1,250';

      const osRow = document.querySelector('.os-row:not(.os-total) span:first-child');
      const osPrice = document.querySelector('.os-row:not(.os-total) span:last-child');
      const osTotal = document.querySelector('.os-total span:last-child');

      if (osRow) osRow.textContent = serviceName;
      if (osPrice) osPrice.textContent = servicePrice;
      if (osTotal) osTotal.textContent = servicePrice;
    });
  });

});
