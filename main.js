// JS estático para navegação, formulários, abas e ícones
(function () {
  // Inicializa ícones Lucide se disponíveis
  if (window.lucide && typeof window.lucide.createIcons === 'function') {
    window.lucide.createIcons();
  }

  // Mobile menu toggle
  const menuToggle = document.getElementById('menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      mobileNav.classList.toggle('hidden');
    });
  }

  // Newsletter mock submission (header)
  const newsletterForm = document.getElementById('newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterForm.querySelector('input[type="email"]');
      const email = input ? input.value.trim() : '';
      if (!email) return;
      alert('Obrigado! Vamos te enviar materiais em breve.');
      input.value = '';
    });
  }

  // Newsletter mock submission (footer)
  const newsletterFormFooter = document.getElementById('newsletter-form-footer');
  if (newsletterFormFooter) {
    newsletterFormFooter.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = newsletterFormFooter.querySelector('input[type="email"]');
      const email = input ? input.value.trim() : '';
      if (!email) return;
      alert('Inscrição recebida!');
      input.value = '';
    });
  }

  // Portfolio modal interactions (para portfolio.html)
  const modalTriggers = document.querySelectorAll('[data-modal]');
  modalTriggers.forEach((btn) => {
    btn.addEventListener('click', () => {
      const target = btn.getAttribute('data-modal');
      const modal = target ? document.getElementById(target) : null;
      if (modal) modal.classList.remove('hidden');
    });
  });
  const closeModals = document.querySelectorAll('[data-close-modal]');
  closeModals.forEach((btn) => {
    btn.addEventListener('click', () => {
      const modal = btn.closest('.modal');
      if (modal) modal.classList.add('hidden');
    });
  });

  // FAQ acordeões: baseado na estrutura .faq-item
  const faqItems = document.querySelectorAll('.faq-item');
  faqItems.forEach((item) => {
    const questionBtn = item.querySelector('.faq-item__question');
    if (!questionBtn) return;
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      // Fecha todos
      faqItems.forEach((it) => it.classList.remove('active'));
      // Abre o atual se não estava aberto
      if (!isActive) item.classList.add('active');
    });
  });

  // Portfólio: sem abas na Home (usando filtros MixItUp em grid único)

  // Botão WhatsApp flutuante
  const whatsappBtn = document.getElementById('whatsapp-btn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      window.open('https://wa.me/5511999999999?text=Olá! Gostaria de conversar sobre meu projeto.', '_blank');
    });
  }

  // Contact form submission (static)
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = new FormData(contactForm);
      // Simulate success
      await new Promise((r) => setTimeout(r, 500));
      alert('Mensagem enviada! Entraremos em contato em breve.');
      contactForm.reset();
    });
  }

  // Swiper Testimonials
  function initializeTestimonialsSwiper() {
    const container = document.querySelector('.testimonialsSwiper');
    if (!container || typeof Swiper === 'undefined') return;

    new Swiper('.testimonialsSwiper', {
      slidesPerView: 2,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
         reverseDirection: true,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        0: {
          slidesPerView: 1,
          spaceBetween: 20,
        },
        640: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
      },
    });
  }

  initializeTestimonialsSwiper();

  // MixItUp Portfolio: instância única e controle explícito pelos filtros
  let portfolioMixer = null;
  if (typeof mixitup !== 'undefined') {
    try {
      const containerEl = document.querySelector('.work-container');
      if (containerEl) {
        portfolioMixer = mixitup(containerEl, {
          selectors: { target: '.work-card' },
          animation: { duration: 300 },
        });
      }
    } catch (e) {
      console.warn('MixItUp não inicializado:', e);
    }
  }

  // Troca de ativo nos filtros
  const linkWork = document.querySelectorAll('.work-item');
  function activeWork(e) {
    linkWork.forEach((l) => l.classList.remove('active-work'));
    this.classList.add('active-work');
    const filter = this.getAttribute('data-filter');
    if (portfolioMixer && filter) {
      portfolioMixer.filter(filter);
    }
  }
  linkWork.forEach((l) => l.addEventListener('click', activeWork));

  // Portfolio Popup
  document.addEventListener('click', (e) => {
    if (e.target.classList && e.target.classList.contains('work-button')) {
      togglePortfolioPopup();
      portfolioItemDetails(e.target.parentElement);
    }
  });

  function togglePortfolioPopup() {
    const popup = document.querySelector('.portfolio-popup');
    if (popup) popup.classList.toggle('open');
  }

  const popupClose = document.querySelector('.portfolio-popup-close');
  if (popupClose) popupClose.addEventListener('click', togglePortfolioPopup);

  function portfolioItemDetails(portfolioItem) {
    const thumbImg = document.querySelector('.pp-thumbnail img');
    const subtitleSpan = document.querySelector('.portfolio-popup-subtitle span');
    const bodyContainer = document.querySelector('.portfolio-popup-body');
    if (!portfolioItem || !thumbImg || !subtitleSpan || !bodyContainer) return;
    const src = portfolioItem.querySelector('.work-img')?.src;
    const title = portfolioItem.querySelector('.work-title')?.innerHTML;
    const details = portfolioItem.querySelector('.portfolio-item-details')?.innerHTML;
    if (src) thumbImg.src = src;
    if (title) subtitleSpan.innerHTML = title;
    if (details) bodyContainer.innerHTML = details;
  }

  /*=============== PORTFOLIO SCROLL PREVIEW ===============*/
function initScrollPreview() {
  const workCards = document.querySelectorAll('.work-card');
  const BASE_WIDTH = 1440; // largura de referência para sites (mais nítido)

  function applyScale(card, iframe) {
    const preview = card.querySelector('.work-preview');
    if (!preview || !iframe) return;

    const previewWidth = preview.clientWidth;
    const previewHeight = preview.clientHeight;
    const scale = Math.max(0.4, Math.min(1, previewWidth / BASE_WIDTH));

    // Define dimensões base do iframe para permitir "scroll" visual
    const iframeWidth = BASE_WIDTH;
    // Em vez de altura fixa enorme, limita por múltiplos da área visível para evitar branco
    const visibleHeightInIframeSpace = Math.round(previewHeight / scale);
    const iframeHeight = Math.round(visibleHeightInIframeSpace * 2.0); // ~2x da área visível (reduz risco de branco)

    iframe.style.width = iframeWidth + 'px';
    iframe.style.height = iframeHeight + 'px';
    // Centraliza horizontalmente com translateX(-50%)
    // calcula quanto podemos "descer" antes de acabar a área visível
    const SAFE_MARGIN = Math.round(visibleHeightInIframeSpace * 0.25); // margem extra para evitar branco
    let maxTranslate = Math.max(0, iframeHeight - visibleHeightInIframeSpace - SAFE_MARGIN);
    // Evita overshoot: limita por um múltiplo da área visível
    const HARD_CAP = Math.round(visibleHeightInIframeSpace * 1.4); // limite rígido ainda mais conservador
    maxTranslate = Math.min(maxTranslate, HARD_CAP);
    // Limita adicionalmente a um percentual da área visível para evitar overshoot
    const PERCENT_CAP = Math.round(visibleHeightInIframeSpace * 0.8);
    maxTranslate = Math.min(maxTranslate, PERCENT_CAP);

    // Posição de repouso: centro do conteúdo
    // Posição de repouso: centro do conteúdo visível
    const restTranslate = 0; // posição inicial: topo
    iframe.style.transform = `translateX(-50%) translateY(-${restTranslate}px) scale(${scale})`;
    iframe.style.left = '50%';

    iframe.dataset.maxTranslate = String(maxTranslate);
    iframe.dataset.scale = String(scale);
    iframe.dataset.restTranslate = String(restTranslate);
  }

  workCards.forEach(card => {
    const iframe = card.querySelector('.work-iframe');
    if (!iframe) return;

    applyScale(card, iframe);

    // Hover in/out com transição suave
    card.addEventListener('mouseenter', () => {
      const maxTranslate = Number(iframe.dataset.maxTranslate || 600);
      const scale = Number(iframe.dataset.scale || 0.6);
      const restTranslate = Number(iframe.dataset.restTranslate || 0);
      const targetTranslate = Math.round(maxTranslate); // vai até o fundo seguro
      iframe.style.transition = 'transform 5s ease-in-out'; // igual ao modelo
      iframe.style.transform = `translateX(-50%) translateY(-${targetTranslate}px) scale(${scale})`;
    });

    card.addEventListener('mouseleave', () => {
      const scale = Number(iframe.dataset.scale || 0.6);
      const restTranslate = Number(iframe.dataset.restTranslate || 0);
      iframe.style.transition = 'transform 3s ease-in-out'; // retorno um pouco mais suave
      iframe.style.transform = `translateX(-50%) translateY(-${restTranslate}px) scale(${scale})`;
    });

    // recalc em resize
    window.addEventListener('resize', () => applyScale(card, iframe));
  });
}

  // Inicializa após o carregamento da página
  document.addEventListener('DOMContentLoaded', initScrollPreview);
})();