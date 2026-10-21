document.addEventListener('DOMContentLoaded', () => {

  // ---------- Iconos Lucide ----------
  const refreshIcons = () => {
    if (window.lucide && typeof window.lucide.createIcons === 'function') {
      window.lucide.createIcons();
    }
  };
  refreshIcons();

  // ---------- Menú móvil ----------
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');
  const menuIcon = document.getElementById('menu-icon');

  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      const open = navLinks.classList.contains('active');
      menuToggle.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
      if (menuIcon) {
        menuIcon.setAttribute('data-lucide', open ? 'x' : 'menu');
        refreshIcons();
      }
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => navLinks.classList.remove('active'));
    });
  }

  // ---------- Simulador ----------
  const childButtons = document.querySelectorAll('.btn-group-children .btn-chip');
  const conditionSelect = document.getElementById('sim-condition');
  const simAmount = document.getElementById('sim-amount');
  const simHealth = document.getElementById('sim-health');
  const simEdu = document.getElementById('sim-edu');
  const simCare = document.getElementById('sim-care');

  const BASE_AMOUNT = 150000;
  const CHILD_FACTOR = { 1: 1, 2: 1.5, 3: 2, 4: 2.5 };
  const CONDITION_FACTOR = { embarazo: 1, primera_infancia: 1, escolar: 0.8 };

  const HEALTH = {
    embarazo: 'Plan Maternal + Pediatría 100%',
    primera_infancia: 'Controles pediátricos y vacunación 100%',
    escolar: 'Cobertura de salud escolar y adolescente 100%'
  };
  const EDU = {
    embarazo: 'Prioridad en vacante de jardín maternal',
    primera_infancia: 'Vacante garantizada + Kit inicial',
    escolar: 'Vacante garantizada + Kit escolar'
  };

  let selectedChildren = 1;

  function renderSimulation() {
    const condition = conditionSelect ? conditionSelect.value : 'embarazo';
    const amount = Math.round(
      BASE_AMOUNT * CHILD_FACTOR[selectedChildren] * CONDITION_FACTOR[condition] / 1000
    ) * 1000;

    if (simAmount) {
      simAmount.textContent = '$' + amount.toLocaleString('es-AR') + ' / mes';
    }
    if (simHealth) simHealth.textContent = HEALTH[condition];
    if (simEdu) {
      simEdu.textContent = selectedChildren >= 3
        ? EDU[condition] + ' + beca de apoyo escolar'
        : EDU[condition];
    }
    if (simCare) {
      simCare.textContent = selectedChildren >= 3
        ? 'Subsidio de servicios y canasta básica ampliada'
        : 'Subsidio de servicios y canasta básica';
    }
  }

  childButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      childButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedChildren = parseInt(btn.dataset.children, 10);
      renderSimulation();
    });
  });

  if (conditionSelect) conditionSelect.addEventListener('change', renderSimulation);
  renderSimulation();

  // ---------- Modal de pilares ----------
  const PILLARS = [
    {
      title: 'Incentivo Económico Directo',
      desc: 'Asistencia financiera mensual pensada para acompañar los gastos de crianza desde el embarazo hasta la finalización de la escolaridad obligatoria, con un monto que se ajusta a la cantidad de hijos y al contexto de cada hogar.',
      items: [
        'Transferencia monetaria mensual por hijo, con montos mayores para los primeros años de vida.',
        'Ajuste periódico por inflación para preservar el poder de compra del incentivo.',
        'Pago priorizado para hogares con ingresos informales o sin empleo registrado.',
        'Compatibilidad con otras asignaciones familiares ya vigentes, sin doble cobro de un mismo concepto.'
      ]
    },
    {
      title: 'Educación Pública de Calidad',
      desc: 'Garantía de acceso prioritario a jardines maternales, escuelas y espacios de cuidado, con foco en la primera infancia, período en el que la inversión tiene mayor impacto en el desarrollo de las personas.',
      items: [
        'Vacante garantizada en jardín maternal y nivel inicial para hijos de familias inscriptas en el programa.',
        'Extensión horaria de los espacios de cuidado para madres y padres que trabajan o estudian.',
        'Kit escolar anual con útiles, uniforme y materiales básicos.',
        'Apoyo pedagógico y becas para acompañar la permanencia en el sistema educativo.'
      ]
    },
    {
      title: 'Salud Pública Integral',
      desc: 'Cobertura médica continua que acompaña a la familia antes, durante y después del nacimiento, con controles periódicos, acceso a estudios y seguimiento del desarrollo infantil en el sistema público.',
      items: [
        'Controles prenatales, parto y puerperio sin costo para la persona gestante.',
        'Plan de controles pediátricos y calendario de vacunación completo.',
        'Seguimiento del desarrollo motor, cognitivo y del lenguaje en los primeros años.',
        'Acompañamiento en salud mental perinatal para madres y padres.'
      ]
    },
    {
      title: 'Cobertura Integral de Gastos',
      desc: 'Respaldo directo en bienes y servicios esenciales para que la crianza se pueda sostener con dignidad, reduciendo el peso de los gastos fijos del hogar en los primeros años de vida de cada hijo o hija.',
      items: [
        'Canasta básica de alimentos y productos de higiene para bebés y niños pequeños.',
        'Subsidio parcial en tarifas de servicios básicos (luz, gas y agua) para hogares con hijos.',
        'Acceso a indumentaria, calzado y elementos de abrigo a través de un esquema de entrega periódica.',
        'Priorización en programas de vivienda y mejora del hábitat para familias en crecimiento.'
      ]
    }
  ];

  const modal = document.getElementById('modal-pillar');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalDesc = document.getElementById('modal-desc');
  const modalList = document.getElementById('modal-list');
  const modalClose = document.getElementById('modal-close');
  const modalBtnClose = document.getElementById('modal-btn-close');

  function openModal(index) {
    const pillar = PILLARS[index];
    const card = document.querySelectorAll('.pillar-card')[index];
    if (!pillar || !modal) return;

    const img = card ? card.querySelector('img') : null;
    if (modalImg && img) {
      modalImg.src = img.src;
      modalImg.alt = img.alt;
    }
    modalTitle.textContent = pillar.title;
    modalDesc.textContent = pillar.desc;
    modalList.innerHTML = '';
    pillar.items.forEach(text => {
      const li = document.createElement('li');
      li.textContent = text;
      modalList.appendChild(li);
    });

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  document.querySelectorAll('.open-modal').forEach(btn => {
    btn.addEventListener('click', () => openModal(parseInt(btn.dataset.pillar, 10)));
  });
  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modalBtnClose) modalBtnClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', e => {
      if (e.target === modal) closeModal();
    });
  }
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });

  // ---------- Wizard de consulta ----------
  const steps = document.querySelectorAll('.wizard-step');
  const totalSteps = steps.length;
  const btnPrev = document.getElementById('btn-prev-step');
  const btnNext = document.getElementById('btn-next-step');
  const stepIndicator = document.getElementById('wizard-step-indicator');
  const percentIndicator = document.getElementById('wizard-percent-indicator');
  const progressBar = document.getElementById('wizard-progress-bar');
  const wizardForm = document.getElementById('wizard-form');
  const wizardResult = document.getElementById('wizard-result');
  const btnReset = document.getElementById('btn-reset-wizard');
  let currentStep = 1;

  function showStep(n) {
    currentStep = n;
    steps.forEach(step => {
      step.classList.toggle('active', parseInt(step.dataset.step, 10) === n);
    });

    const percent = Math.round((n / totalSteps) * 100);
    if (stepIndicator) stepIndicator.textContent = `Paso ${n} de ${totalSteps}`;
    if (percentIndicator) percentIndicator.textContent = `${percent}% completado`;
    if (progressBar) progressBar.style.width = percent + '%';

    if (btnPrev) btnPrev.style.display = n > 1 ? '' : 'none';
    if (btnNext) btnNext.textContent = n === totalSteps ? 'Ver resultado' : 'Siguiente';
  }

  function currentStepIsValid() {
    const activeStep = document.querySelector(`.wizard-step[data-step="${currentStep}"]`);
    const fields = activeStep.querySelectorAll('input, select');
    for (const field of fields) {
      if (!field.checkValidity()) {
        field.reportValidity();
        return false;
      }
    }
    return true;
  }

  function showResult() {
    if (wizardForm) wizardForm.style.display = 'none';
    if (wizardResult) {
      wizardResult.style.display = 'block';
      refreshIcons();
    }
  }

  function resetWizard() {
    if (wizardForm) {
      wizardForm.reset();
      wizardForm.style.display = '';
    }
    if (wizardResult) wizardResult.style.display = 'none';
    showStep(1);
  }

  if (btnNext) {
    btnNext.addEventListener('click', () => {
      if (!currentStepIsValid()) return;
      if (currentStep < totalSteps) {
        showStep(currentStep + 1);
      } else {
        showResult();
      }
    });
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', () => {
      if (currentStep > 1) showStep(currentStep - 1);
    });
  }

  if (btnReset) btnReset.addEventListener('click', resetWizard);

  if (wizardForm) {
    wizardForm.addEventListener('submit', e => {
      e.preventDefault();
      if (currentStepIsValid()) {
        if (currentStep < totalSteps) showStep(currentStep + 1);
        else showResult();
      }
    });
  }

  showStep(1);

  // ---------- Preguntas frecuentes ----------
  document.querySelectorAll('.faq-question').forEach(question => {
    question.addEventListener('click', () => {
      const item = question.closest('.faq-item');
      const isOpen = item.classList.contains('active');

      document.querySelectorAll('.faq-item.active').forEach(other => {
        if (other !== item) other.classList.remove('active');
      });

      item.classList.toggle('active', !isOpen);
      question.setAttribute('aria-expanded', String(!isOpen));
    });
  });
});
