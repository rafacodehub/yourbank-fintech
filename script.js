

(function(){
  function qs(s){ return document.querySelector(s); }
  function qsa(s){ return Array.from(document.querySelectorAll(s)); }

  const loginModal = qs('#loginModalFinal');
  const openAccountModal = qs('#openAccountModalFinal');
  const accountStepsModal = qs('#accountStepsModalFinal');

  const loginStepOne = qs('#loginStepOneFinal');
  const loginSms = qs('#loginSmsFinal');
  const loginText = qs('#loginTextFinal');
  const openAccountForm = qs('#openAccountFormFinal');
  const nextStep = qs('#nextStepFinal');
  const stepText = qs('#accountStepTextFinal');

  let currentStep = 0;
  const stepMessages = [
    'Dados pessoais recebidos. Avance para validação.',
    'Validação em andamento. Confirme para criar a conta.',
    'Conta criada com sucesso. Acesso liberado ao app.'
  ];

  function open(modal){
    if(!modal) return;
    modal.classList.add('active');
    modal.setAttribute('aria-hidden','false');
  }

  function close(modal){
    if(!modal) return;
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden','true');
  }

  function closeAll(){
    close(loginModal);
    close(openAccountModal);
    close(accountStepsModal);
  }

  function toast(message){
    const t = qs('#toast');
    if(!t){
      alert(message);
      return;
    }
    t.textContent = message;
    t.classList.add('active');
    clearTimeout(window.__modalFixToast);
    window.__modalFixToast = setTimeout(() => t.classList.remove('active'), 2200);
  }

  function resetLogin(){
    loginStepOne && (loginStepOne.style.display = 'grid');
    loginSms && loginSms.classList.remove('active');
    if(loginText) loginText.textContent = 'Digite seu CPF e senha para acessar sua área digital.';
    qsa('#loginSmsFinal input').forEach(i => i.value = '');
  }

  function resetSteps(){
    currentStep = 0;
    qsa('.step-final').forEach((el, i) => el.classList.toggle('active', i === 0));
    if(stepText) stepText.textContent = stepMessages[0];
    if(nextStep) nextStep.textContent = 'Avançar';
  }

  // Captura clique em Entrar, mesmo que o JS antigo tente fazer outra coisa
  document.addEventListener('click', function(e){
    const loginBtn = e.target.closest('.login, .login-trigger');
    if(loginBtn){
      e.preventDefault();
      e.stopPropagation();
      resetLogin();
      open(loginModal);
      return;
    }

    const openBtn = e.target.closest('.open-account-flow, .open-account, .account-btn');
    if(openBtn){
      e.preventDefault();
      e.stopPropagation();
      if(openAccountForm) openAccountForm.reset();
      open(openAccountModal);
      return;
    }

    if(e.target.matches('[data-close-bank-modal], .bank-modal-final')){
      closeAll();
    }
  }, true);

  if(loginStepOne){
    loginStepOne.addEventListener('submit', function(e){
      e.preventDefault();
      loginStepOne.style.display = 'none';
      loginSms && loginSms.classList.add('active');
      if(loginText) loginText.textContent = 'Foi enviado um código ao SMS cadastrado. Digite os 4 dígitos abaixo.';
      const first = qs('#loginSmsFinal input');
      first && first.focus();
      toast('SMS enviado ao número cadastrado!');
    });
  }

  qsa('#loginSmsFinal input').forEach((input, index, arr) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g,'').slice(0,1);
      if(input.value && arr[index+1]) arr[index+1].focus();
    });
    input.addEventListener('keydown', e => {
      if(e.key === 'Backspace' && !input.value && arr[index-1]) arr[index-1].focus();
    });
  });

  if(loginSms){
    loginSms.addEventListener('submit', function(e){
      e.preventDefault();
      const code = qsa('#loginSmsFinal input').map(i => i.value).join('');
      if(code.length < 4){
        toast('Digite os 4 dígitos do SMS.');
        return;
      }
      close(loginModal);
      toast('Acesso validado com sucesso!');
    });
  }

  if(openAccountForm){
    openAccountForm.addEventListener('submit', function(e){
      e.preventDefault();
      close(openAccountModal);
      resetSteps();
      open(accountStepsModal);
      toast('Dados recebidos com sucesso!');
    });
  }

  if(nextStep){
    nextStep.addEventListener('click', function(){
      const steps = qsa('.step-final');
      currentStep += 1;

      if(currentStep < steps.length){
        steps.forEach((el, i) => el.classList.toggle('active', i <= currentStep));
        if(stepText) stepText.textContent = stepMessages[currentStep];
        if(currentStep === steps.length - 1) nextStep.textContent = 'Finalizar';
      }else{
        close(accountStepsModal);
        toast('Conta criada com sucesso!');
      }
    });
  }

  document.addEventListener('keydown', function(e){
    if(e.key === 'Escape') closeAll();
  });
})();

try {
const $ = (selector, parent = document) => parent.querySelector(selector)
const $$ = (selector, parent = document) => [...parent.querySelectorAll(selector)]

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

const loader = $('#premiumLoader')
window.addEventListener('load', () => {
  setTimeout(() => {
    loader?.classList.add('hide')
  }, 650)
})

const navbar = $('#navbar')
window.addEventListener('scroll', () => {
  navbar?.classList.toggle('scrolled', window.scrollY > 30)
})

const menuToggle = $('#menuToggle')
const navLinks = $('#navLinks')

menuToggle?.addEventListener('click', () => {
  navLinks?.classList.toggle('active')
})

$$('.nav-links a').forEach(link => {
  link.addEventListener('click', () => navLinks?.classList.remove('active'))
})

const reveals = $$('.reveal')

reveals.forEach((element, index) => {
  element.style.setProperty('--delay', `${Math.min(index * 45, 220)}ms`)
})

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if(entry.isIntersecting){
      entry.target.classList.add('active')
      revealObserver.unobserve(entry.target)
    }
  })
}, { threshold: 0.15 })

reveals.forEach(element => revealObserver.observe(element))

$$('.premium-card').forEach(card => {
  const baseRotate = Number(card.dataset.rotate || 0)

  card.addEventListener('mousemove', event => {
    if(prefersReducedMotion) return

    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top
    const rotateX = -(y - rect.height / 2) / 15
    const rotateY = (x - rect.width / 2) / 15

    card.style.transition = '.08s ease'
    card.style.transform = `
      perspective(1800px)
      rotateZ(${baseRotate}deg)
      rotateX(${rotateX}deg)
      rotateY(${rotateY}deg)
      scale(1.045)
    `

    const reflection = $('.card-reflection', card)
    if(reflection) reflection.style.left = `${x - 120}px`
  })

  card.addEventListener('mouseleave', () => {
    card.style.transition = '.55s ease'
    card.style.transform = `
      perspective(1800px)
      rotateZ(${baseRotate}deg)
      scale(1)
    `
  })
})

$$('.mini-card').forEach(mini => {
  mini.addEventListener('mousemove', event => {
    const rect = mini.getBoundingClientRect()
    const x = event.clientX - rect.left
    const reflection = $('.mini-reflection', mini)
    if(reflection) reflection.style.left = `${x - 70}px`
  })

  mini.addEventListener('mouseleave', () => {
    const reflection = $('.mini-reflection', mini)
    if(reflection) reflection.style.left = '-100px'
  })
})

const searchOverlay = $('#searchOverlay')
const searchBtn = $('#searchBtn')
const closeSearch = $('#closeSearch')

function openSearch(){
  searchOverlay?.classList.add('active')
  searchOverlay?.setAttribute('aria-hidden', 'false')
  $('input', searchOverlay)?.focus()
}

function closeSearchOverlay(){
  searchOverlay?.classList.remove('active')
  searchOverlay?.setAttribute('aria-hidden', 'true')
}

searchBtn?.addEventListener('click', openSearch)
closeSearch?.addEventListener('click', closeSearchOverlay)

searchOverlay?.addEventListener('click', event => {
  if(event.target === searchOverlay) closeSearchOverlay()
})

const modal = $('#videoModal')
const openModal = $('#openModal')
const closeModal = $('#closeModal')

function openVideoModal(){
  modal?.classList.add('active')
  modal?.setAttribute('aria-hidden', 'false')
}

function closeVideoModal(){
  modal?.classList.remove('active')
  modal?.setAttribute('aria-hidden', 'true')
}

openModal?.addEventListener('click', openVideoModal)
closeModal?.addEventListener('click', closeVideoModal)

modal?.addEventListener('click', event => {
  if(event.target === modal) closeVideoModal()
})

document.addEventListener('keydown', event => {
  if(event.key === 'Escape'){
    closeSearchOverlay()
    closeVideoModal()
  }
})

const spendRange = $('#spendRange')
const spendValue = $('#spendValue')
const cashbackValue = $('#cashbackValue')
const balanceValue = $('#balanceValue')
const limitText = $('#limitText')
const limitBar = $('#limitBar')

function moneyBR(value){
  return value.toLocaleString('pt-BR', {
    style:'currency',
    currency:'BRL'
  })
}

function updateCashback(){
  if(!spendRange || !spendValue || !cashbackValue) return

  const spend = Number(spendRange.value)
  const cashback = spend * 0.02
  const percent = Math.min(96, Math.round((spend / 12000) * 100))

  spendValue.textContent = moneyBR(spend)
  cashbackValue.textContent = moneyBR(cashback)

  if(balanceValue) balanceValue.textContent = moneyBR(8420.90 + cashback)
  if(limitText) limitText.textContent = `${percent}%`
  if(limitBar) limitBar.style.width = `${percent}%`
}

spendRange?.addEventListener('input', updateCashback)
updateCashback()

const toast = $('#toast')

function showToast(message = 'Solicitação iniciada com sucesso!'){
  if(!toast) return

  toast.textContent = message
  toast.classList.add('active')

  clearTimeout(window.__toastTimer)
  window.__toastTimer = setTimeout(() => {
    toast.classList.remove('active')
  }, 2400)
}

$$('.request-card').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault()
    showToast('Solicitação iniciada com sucesso!')
  })
})

const chooseCards = $$('.choose-card')

chooseCards.forEach((card, index) => {
  card.addEventListener('click', () => {
    chooseCards.forEach(item => item.classList.remove('selected'))
    card.classList.add('selected')
  })

  if(index === 1) card.classList.add('selected')
})

$$('.quick-actions button').forEach(button => {
  button.addEventListener('click', () => {
    if(prefersReducedMotion) return

    button.animate([
      { transform:'scale(1)' },
      { transform:'scale(.92)' },
      { transform:'scale(1)' }
    ], {
      duration:260,
      easing:'ease-out'
    })
  })
})

const counters = $$('.credibility-strip strong')
let counterStarted = false

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if(entry.isIntersecting && !counterStarted){
      counterStarted = true

      const firstCounter = counters[0]
      if(firstCounter){
        animateNumber(firstCounter, 999, '+', ' mil')
      }

      counterObserver.disconnect()
    }
  })
}, { threshold: 0.5 })

const credibility = $('.credibility-strip')
if(credibility) counterObserver.observe(credibility)

function animateNumber(element, target, prefix = '', suffix = ''){
  let current = 0

  function step(){
    current += Math.ceil((target - current) / 10)

    if(current < target){
      element.textContent = `${prefix}${current}${suffix}`
      requestAnimationFrame(step)
    }else{
      element.textContent = `${prefix}${target}${suffix}`
    }
  }

  step()
}

document.querySelectorAll('.security-card').forEach(card => {
  card.addEventListener('mousemove', event => {
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    card.style.setProperty('--mx', `${x}px`)
    card.style.setProperty('--my', `${y}px`)
  })
})

const heroVisualPremium = document.querySelector('.hero-visual')

window.addEventListener('scroll', () => {
  if(!heroVisualPremium) return

  const scroll = window.scrollY
  const move = Math.min(scroll * 0.035, 18)

  heroVisualPremium.style.transform = `translateY(${move}px)`
})

document.querySelectorAll('[data-glow-card]').forEach(card => {
  card.addEventListener('mousemove', event => {
    const rect = card.getBoundingClientRect()
    const x = event.clientX - rect.left
    const y = event.clientY - rect.top

    card.style.setProperty('--mx', `${x}px`)
    card.style.setProperty('--my', `${y}px`)
  })
})

const scoreNumber = document.getElementById('scoreNumber')
const scoreBar = document.getElementById('scoreBar')
const scoreUp = document.getElementById('scoreUp')
const scoreDown = document.getElementById('scoreDown')
let currentScore = 742

function updateScore(value){
  currentScore = Math.max(300, Math.min(980, currentScore + value))

  if(scoreNumber) scoreNumber.textContent = currentScore
  if(scoreBar) scoreBar.style.width = `${Math.min(100, Math.max(8, currentScore / 10))}%`
}

scoreUp?.addEventListener('click', () => updateScore(18))
scoreDown?.addEventListener('click', () => updateScore(-14))

const cardOptions = {
  pink:{
    title:'Your Pink',
    text:'Design premium, cashback especial e benefícios para quem gosta de estilo.',
    benefits:['Design exclusivo','Cashback especial','Uso global']
  },
  black:{
    title:'Your Black',
    text:'Cashback elevado, atendimento premium e benefícios para quem busca exclusividade.',
    benefits:['Até 2% cashback','Benefícios viagem','Atendimento premium']
  },
  purple:{
    title:'Your Purple',
    text:'Controle completo para o dia a dia com uma experiência digital moderna.',
    benefits:['Pix ilimitado','Cartão virtual','Controle de gastos']
  }
}

const compareTitle = document.getElementById('compareTitle')
const compareText = document.getElementById('compareText')
const compareBenefits = document.getElementById('compareBenefits')

document.querySelectorAll('[data-card-option]').forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll('[data-card-option]').forEach(btn => btn.classList.remove('active'))
    button.classList.add('active')

    const data = cardOptions[button.dataset.cardOption]
    if(!data) return

    if(compareTitle) compareTitle.textContent = data.title
    if(compareText) compareText.textContent = data.text
    if(compareBenefits){
      compareBenefits.innerHTML = data.benefits.map(item => `<li>${item}</li>`).join('')
    }
  })
})

const aiAnswers = {
  economia:'Sugestão: defina um teto semanal de gastos e direcione o cashback para uma reserva automática.',
  investir:'Perfil moderado detectado: combine renda fixa com fundos para equilibrar segurança e crescimento.',
  cartao:'Para maior benefício, o Your Black combina cashback, controle e experiência premium.'
}

const aiAnswer = document.getElementById('aiAnswer')

document.querySelectorAll('[data-ai]').forEach(button => {
  button.addEventListener('click', () => {
    const answer = aiAnswers[button.dataset.ai]
    if(aiAnswer && answer) aiAnswer.textContent = answer
  })
})

const accountFlowModal = document.getElementById('accountFlowModal')
const openAccountFlow = document.getElementById('openAccountFlow')
const closeAccountFlow = document.getElementById('closeAccountFlow')

function openFlow(){
  accountFlowModal?.classList.add('active')
  accountFlowModal?.setAttribute('aria-hidden', 'false')
}

function closeFlow(){
  accountFlowModal?.classList.remove('active')
  accountFlowModal?.setAttribute('aria-hidden', 'true')
}

openAccountFlow?.addEventListener('click', openFlow)
closeAccountFlow?.addEventListener('click', closeFlow)

accountFlowModal?.addEventListener('click', event => {
  if(event.target === accountFlowModal) closeFlow()
})

document.querySelector('.account-form')?.addEventListener('submit', event => {
  event.preventDefault()
  closeFlow()

  const toast = document.getElementById('toast')
  if(toast){
    toast.textContent = 'Simulação enviada com sucesso!'
    toast.classList.add('active')
    clearTimeout(window.__flowToastTimer)
    window.__flowToastTimer = setTimeout(() => toast.classList.remove('active'), 2400)
  }
})

function applyCardTheme(theme){
  if(!theme) return

  document.body.setAttribute('data-theme', theme)
  document.body.classList.add('theme-changing')

  clearTimeout(window.__themeChangingTimer)
  window.__themeChangingTimer = setTimeout(() => {
    document.body.classList.remove('theme-changing')
  }, 700)
}

document.querySelectorAll('.choose-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.choose-card').forEach(item => item.classList.remove('selected'))
    card.classList.add('selected')

    const theme = card.dataset.themeCard
      || (card.innerText.toLowerCase().includes('pink') ? 'pink'
      : card.innerText.toLowerCase().includes('black') ? 'black'
      : 'purple')

    applyCardTheme(theme)
  })

  const button = card.querySelector('.request-card')
  if(button){
    button.addEventListener('click', event => {
      event.preventDefault()
      event.stopPropagation()

      document.querySelectorAll('.choose-card').forEach(item => item.classList.remove('selected'))
      card.classList.add('selected')

      const theme = card.dataset.themeCard
        || (card.innerText.toLowerCase().includes('pink') ? 'pink'
        : card.innerText.toLowerCase().includes('black') ? 'black'
        : 'purple')

      applyCardTheme(theme)

      const toast = document.getElementById('toast')
      if(toast){
        toast.textContent = `Tema ${theme.toUpperCase()} aplicado ao cartão`
        toast.classList.add('active')
        clearTimeout(window.__themeToastTimer)
        window.__themeToastTimer = setTimeout(() => toast.classList.remove('active'), 2200)
      }
    })
  }
})

document.querySelectorAll('.plan-card').forEach(card => {
  card.addEventListener('click', () => {
    document.querySelectorAll('.plan-card').forEach(item => item.classList.remove('active'))
    card.classList.add('active')

    const theme = card.dataset.themeCard
      || (card.innerText.toLowerCase().includes('pink') ? 'pink'
      : card.innerText.toLowerCase().includes('black') ? 'black'
      : 'purple')

    applyCardTheme(theme)
  })
})

document.querySelectorAll('[data-card-option]').forEach(button => {
  button.addEventListener('click', () => {
    const option = button.dataset.cardOption
    if(['pink','black','purple'].includes(option)){
      applyCardTheme(option)
    }
  })
})

// Busca compacta no cabeçalho: evita abrir o modal antigo.
document.querySelector('.nav-search')?.addEventListener('submit', event => {
  event.preventDefault()
})

const headerSearchForm = document.querySelector('.nav-search')
const headerSearchInput = document.querySelector('.nav-search input')

if(headerSearchForm && headerSearchInput){
  headerSearchForm.addEventListener('click', event => {
    if(!headerSearchForm.classList.contains('active')){
      event.preventDefault()
      headerSearchForm.classList.add('active')
      setTimeout(() => headerSearchInput.focus(), 80)
    }
  })

  headerSearchInput.addEventListener('click', event => {
    event.stopPropagation()
  })

  document.addEventListener('click', event => {
    const clickedInsideSearch = headerSearchForm.contains(event.target)

    if(!clickedInsideSearch){
      headerSearchForm.classList.remove('active')
      headerSearchInput.blur()
    }
  })

  headerSearchForm.addEventListener('submit', event => {
    event.preventDefault()
    headerSearchForm.classList.remove('active')
    headerSearchInput.blur()
  })

  document.addEventListener('keydown', event => {
    if(event.key === 'Escape'){
      headerSearchForm.classList.remove('active')
      headerSearchInput.blur()
    }
  })
}

document.querySelectorAll('.account-actions button').forEach(button => {
  button.addEventListener('click', () => {
    if(typeof showToast === 'function'){
      showToast('Ação simulada no app Your Bank')
    }
  })
})

const loginModalFinal = document.getElementById('loginModal')
const closeLoginModalFinal = document.getElementById('closeLoginModal')
const loginCpfFormFinal = document.getElementById('loginCpfForm')
const smsCodeFormFinal = document.getElementById('smsCodeForm')
const loginModalTextFinal = document.getElementById('loginModalText')

function resetLoginFlowFinal(){
  loginCpfFormFinal?.classList.remove('hidden')
  smsCodeFormFinal?.classList.remove('active')

  if(loginModalTextFinal){
    loginModalTextFinal.textContent = 'Digite seu CPF e senha para acessar sua área digital.'
  }

  document.querySelectorAll('#smsCodeForm input').forEach(input => input.value = '')
}

document.querySelectorAll('.login-trigger').forEach(button => {
  button.addEventListener('click', () => {
    resetLoginFlowFinal()
    loginModalFinal?.classList.add('active')
    loginModalFinal?.setAttribute('aria-hidden', 'false')
  })
})

closeLoginModalFinal?.addEventListener('click', () => {
  loginModalFinal?.classList.remove('active')
  loginModalFinal?.setAttribute('aria-hidden', 'true')
})

loginModalFinal?.addEventListener('click', event => {
  if(event.target === loginModalFinal){
    loginModalFinal.classList.remove('active')
    loginModalFinal.setAttribute('aria-hidden', 'true')
  }
})

loginCpfFormFinal?.addEventListener('submit', event => {
  event.preventDefault()

  loginCpfFormFinal.classList.add('hidden')
  smsCodeFormFinal?.classList.add('active')

  if(loginModalTextFinal){
    loginModalTextFinal.textContent = 'Enviamos um SMS com um código de 4 dígitos. Digite abaixo para continuar.'
  }

  document.querySelector('#smsCodeForm input')?.focus()

  if(typeof showToast === 'function'){
    showToast('SMS enviado para validação!')
  }
})

document.querySelectorAll('#smsCodeForm input').forEach((input, index, inputs) => {
  input.addEventListener('input', () => {
    input.value = input.value.replace(/\D/g, '').slice(0, 1)

    if(input.value && inputs[index + 1]){
      inputs[index + 1].focus()
    }
  })

  input.addEventListener('keydown', event => {
    if(event.key === 'Backspace' && !input.value && inputs[index - 1]){
      inputs[index - 1].focus()
    }
  })
})

smsCodeFormFinal?.addEventListener('submit', event => {
  event.preventDefault()

  const code = [...document.querySelectorAll('#smsCodeForm input')]
    .map(input => input.value)
    .join('')

  if(code.length < 4){
    if(typeof showToast === 'function') showToast('Digite os 4 dígitos do SMS.')
    return
  }

  loginModalFinal?.classList.remove('active')
  loginModalFinal?.setAttribute('aria-hidden', 'true')

  if(typeof showToast === 'function'){
    showToast('Acesso validado com sucesso!')
  }
})

document.querySelector('.resend-code')?.addEventListener('click', () => {
  if(typeof showToast === 'function'){
    showToast('Novo SMS enviado!')
  }
})

const accountStepsModalFinal = document.getElementById('accountStepsModal')
const closeAccountStepsFinal = document.getElementById('closeAccountSteps')
const nextAccountStepFinal = document.getElementById('nextAccountStep')
const accountStepDescription = document.getElementById('accountStepDescription')
let accountStepIndexFinal = 0

const stepDescriptionsFinal = [
  'Comece preenchendo seus dados pessoais.',
  'Agora faremos uma validação rápida de segurança.',
  'Pronto! Sua conta foi criada e o acesso ao app foi liberado.'
]

function resetAccountStepsFinal(){
  accountStepIndexFinal = 0

  document.querySelectorAll('.account-step').forEach((step, index) => {
    step.classList.toggle('active', index === 0)
  })

  if(nextAccountStepFinal) nextAccountStepFinal.textContent = 'Continuar'
  if(accountStepDescription) accountStepDescription.textContent = stepDescriptionsFinal[0]
}

document.querySelectorAll('.open-account-flow').forEach(button => {
  button.addEventListener('click', event => {
    event.preventDefault()
    resetAccountStepsFinal()
    accountStepsModalFinal?.classList.add('active')
    accountStepsModalFinal?.setAttribute('aria-hidden', 'false')
  })
})

closeAccountStepsFinal?.addEventListener('click', () => {
  accountStepsModalFinal?.classList.remove('active')
  accountStepsModalFinal?.setAttribute('aria-hidden', 'true')
})

accountStepsModalFinal?.addEventListener('click', event => {
  if(event.target === accountStepsModalFinal){
    accountStepsModalFinal.classList.remove('active')
    accountStepsModalFinal.setAttribute('aria-hidden', 'true')
  }
})

nextAccountStepFinal?.addEventListener('click', () => {
  const steps = document.querySelectorAll('.account-step')
  accountStepIndexFinal++

  if(accountStepIndexFinal < steps.length){
    steps.forEach((step, index) => {
      step.classList.toggle('active', index <= accountStepIndexFinal)
    })

    if(accountStepDescription){
      accountStepDescription.textContent = stepDescriptionsFinal[accountStepIndexFinal]
    }

    if(accountStepIndexFinal === steps.length - 1){
      nextAccountStepFinal.textContent = 'Finalizar abertura'
    }
  }else{
    accountStepsModalFinal?.classList.remove('active')
    accountStepsModalFinal?.setAttribute('aria-hidden', 'true')

    if(typeof showToast === 'function'){
      showToast('Conta criada com sucesso!')
    }
  }
})

document.addEventListener('keydown', event => {
  if(event.key === 'Escape'){
    loginModalFinal?.classList.remove('active')
    accountStepsModalFinal?.classList.remove('active')
  }
})

;(function(){
  const loginModal = document.getElementById('loginModal')
  const accountOpenModal = document.getElementById('accountOpenModal')
  const accountStepsModal = document.getElementById('accountStepsModal')

  const loginCpfForm = document.getElementById('loginCpfForm')
  const smsCodeForm = document.getElementById('smsCodeForm')
  const loginModalText = document.getElementById('loginModalText')

  const openAccountForm = document.getElementById('openAccountForm')
  const nextAccountStep = document.getElementById('nextAccountStep')
  const accountStepDescription = document.getElementById('accountStepDescription')

  let accountStepIndex = 0

  function openModal(modal){
    modal?.classList.add('active')
    modal?.setAttribute('aria-hidden', 'false')
  }

  function closeModal(modal){
    modal?.classList.remove('active')
    modal?.setAttribute('aria-hidden', 'true')
  }

  function toastMessage(message){
    if(typeof showToast === 'function'){
      showToast(message)
      return
    }

    const toast = document.getElementById('toast')
    if(toast){
      toast.textContent = message
      toast.classList.add('active')
      setTimeout(() => toast.classList.remove('active'), 2200)
    }
  }

  function resetLogin(){
    loginCpfForm?.classList.remove('hidden')
    smsCodeForm?.classList.remove('active')

    if(loginModalText){
      loginModalText.textContent = 'Digite seu CPF e senha para acessar sua área digital.'
    }

    document.querySelectorAll('#smsCodeForm input').forEach(input => input.value = '')
  }

  document.querySelectorAll('.login-trigger, .login').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault()
      event.stopPropagation()
      resetLogin()
      openModal(loginModal)
    }, true)
  })

  loginCpfForm?.addEventListener('submit', event => {
    event.preventDefault()
    loginCpfForm.classList.add('hidden')
    smsCodeForm?.classList.add('active')

    if(loginModalText){
      loginModalText.textContent = 'Foi enviado um código ao SMS cadastrado. Digite os 4 dígitos abaixo.'
    }

    document.querySelector('#smsCodeForm input')?.focus()
    toastMessage('SMS enviado para o número cadastrado!')
  })

  document.querySelectorAll('#smsCodeForm input').forEach((input, index, inputs) => {
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 1)

      if(input.value && inputs[index + 1]){
        inputs[index + 1].focus()
      }
    })

    input.addEventListener('keydown', event => {
      if(event.key === 'Backspace' && !input.value && inputs[index - 1]){
        inputs[index - 1].focus()
      }
    })
  })

  smsCodeForm?.addEventListener('submit', event => {
    event.preventDefault()

    const code = [...document.querySelectorAll('#smsCodeForm input')]
      .map(input => input.value)
      .join('')

    if(code.length < 4){
      toastMessage('Digite os 4 dígitos do SMS.')
      return
    }

    closeModal(loginModal)
    toastMessage('Acesso validado com sucesso!')
  })

  document.querySelector('.resend-code')?.addEventListener('click', () => {
    toastMessage('Novo SMS enviado!')
  })

  document.querySelectorAll('.open-account-flow, .open-account, .account-btn').forEach(button => {
    button.addEventListener('click', event => {
      event.preventDefault()
      event.stopPropagation()
      openAccountForm?.reset()
      openModal(accountOpenModal)
    }, true)
  })

  openAccountForm?.addEventListener('submit', event => {
    event.preventDefault()
    closeModal(accountOpenModal)
    resetAccountSteps()
    openModal(accountStepsModal)
    toastMessage('Dados recebidos com sucesso!')
  })

  const stepDescriptions = [
    'Dados pessoais recebidos. Avance para validação.',
    'Validação em andamento. Confirme para criar a conta.',
    'Conta criada com sucesso. Acesso liberado ao app.'
  ]

  function resetAccountSteps(){
    accountStepIndex = 0

    document.querySelectorAll('.account-step').forEach((step, index) => {
      step.classList.toggle('active', index === 0)
    })

    if(nextAccountStep) nextAccountStep.textContent = 'Avançar'
    if(accountStepDescription) accountStepDescription.textContent = stepDescriptions[0]
  }

  nextAccountStep?.addEventListener('click', () => {
    const steps = document.querySelectorAll('.account-step')
    accountStepIndex++

    if(accountStepIndex < steps.length){
      steps.forEach((step, index) => {
        step.classList.toggle('active', index <= accountStepIndex)
      })

      if(accountStepDescription){
        accountStepDescription.textContent = stepDescriptions[accountStepIndex]
      }

      if(accountStepIndex === steps.length - 1){
        nextAccountStep.textContent = 'Finalizar'
      }
    }else{
      closeModal(accountStepsModal)
      toastMessage('Conta criada com sucesso!')
    }
  })

  document.querySelectorAll('#closeLoginModal, #closeAccountOpenModal, #closeAccountSteps').forEach(button => {
    button.addEventListener('click', () => {
      closeModal(loginModal)
      closeModal(accountOpenModal)
      closeModal(accountStepsModal)
    })
  })

  ;[loginModal, accountOpenModal, accountStepsModal].forEach(modal => {
    modal?.addEventListener('click', event => {
      if(event.target === modal){
        closeModal(modal)
      }
    })
  })

  document.addEventListener('keydown', event => {
    if(event.key === 'Escape'){
      closeModal(loginModal)
      closeModal(accountOpenModal)
      closeModal(accountStepsModal)
    }
  })
})()

} catch(error) {
  console.warn('Script original interrompido, mas os modais continuam funcionando:', error)
}


/* =========================================================
   ASSISTENTE IA FLUTUANTE
   ========================================================= */
(function(){
  const btn = document.getElementById('aiFloatingBtn');
  const widget = document.getElementById('aiChatWidget');
  const close = document.getElementById('aiChatClose');
  const body = widget ? widget.querySelector('.ai-chat-body') : null;

  if(!btn || !widget) return;

  function toggleAI(){
    widget.classList.toggle('active');
    widget.setAttribute('aria-hidden', widget.classList.contains('active') ? 'false' : 'true');
  }

  btn.addEventListener('click', toggleAI);

  close?.addEventListener('click', () => {
    widget.classList.remove('active');
    widget.setAttribute('aria-hidden', 'true');
  });

  widget.querySelectorAll('[data-ai-answer]').forEach(button => {
    button.addEventListener('click', () => {
      const user = document.createElement('div');
      user.className = 'ai-message user';
      user.textContent = button.textContent;

      const bot = document.createElement('div');
      bot.className = 'ai-message bot';
      bot.textContent = button.getAttribute('data-ai-answer');

      body.appendChild(user);
      body.appendChild(bot);
      body.scrollTop = body.scrollHeight;
    });
  });
})();


/* =========================================================
   REALCE SUAVE DOS CARROSSÉIS MOBILE
   ========================================================= */
(function(){
  const carousels = document.querySelectorAll('.choose-grid, .banking-panel-grid, .testimonial-grid, .feature-grid, .security-grid');

  function updateCarouselItems(carousel){
    const rect = carousel.getBoundingClientRect();
    const center = rect.left + rect.width / 2;

    carousel.querySelectorAll('.choose-card, .account-overview-card, .transactions-card, .security-status-card, .testimonial, .feature, .security-card').forEach(item => {
      const itemRect = item.getBoundingClientRect();
      const itemCenter = itemRect.left + itemRect.width / 2;
      const distance = Math.abs(center - itemCenter);
      const max = rect.width / 1.15;
      const ratio = Math.max(0, 1 - distance / max);

      const scale = 0.965 + ratio * 0.035;
      const opacity = 0.72 + ratio * 0.28;

      item.style.transform = `scale(${scale})`;
      item.style.opacity = opacity;
    });
  }

  carousels.forEach(carousel => {
    let raf = null;

    const run = () => {
      if(raf) cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => updateCarouselItems(carousel));
    };

    carousel.addEventListener('scroll', run, { passive:true });
    window.addEventListener('resize', run);
    run();
  });
})();
