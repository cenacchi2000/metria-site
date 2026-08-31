const menuButton = document.querySelector('.menu-button');
const navLinks = document.querySelector('.nav-links');
menuButton?.addEventListener('click', () => {
  navLinks.classList.toggle('mobile-open');
});

document.querySelectorAll('.nav-links a').forEach((link) => {
  link.addEventListener('click', () => navLinks.classList.remove('mobile-open'));
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    entry.target.classList.toggle('visible', entry.isIntersecting);
    if (entry.isIntersecting) observer.unobserve(entry.target);
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((element) => observer.observe(element));

const sidebar = document.querySelector('.app-sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
sidebarToggle?.addEventListener('click', () => {
  const collapsed = sidebar.classList.toggle('collapsed');
  sidebarToggle.setAttribute('aria-label', collapsed ? 'Expand sidebar' : 'Collapse sidebar');
});

document.querySelectorAll('.sidebar-link').forEach((link) => {
  link.addEventListener('click', () => {
    document.querySelectorAll('.sidebar-link').forEach((item) => item.classList.remove('active'));
    link.classList.add('active');
  });
});

const twinQuestions = [
  ['What would you like this twin to understand about you first?', ['My daily routine', 'My wellbeing goals', 'My environment']],
  ['How would you describe your current energy most days?', ['Steady', 'Variable', 'Low', 'Prefer not to say']],
  ['How consistent is your sleep routine?', ['Very consistent', 'Somewhat consistent', 'Still finding a rhythm']],
  ['Which area would you most like to improve?', ['Focus', 'Movement', 'Recovery', 'Stress management']],
  ['How active is a typical week for you?', ['Mostly sedentary', 'Lightly active', 'Regularly active', 'Highly active']],
  ['What kind of support feels most useful?', ['Clear structure', 'Gentle reminders', 'More context', 'Human guidance']],
  ['How would you describe your usual environment?', ['Calm', 'Busy', 'Changing', 'Prefer not to say']],
  ['What matters most when Metria makes a suggestion?', ['Explainability', 'Personalisation', 'Privacy', 'Actionability']],
  ['Would you like your twin to prioritise small daily changes?', ['Yes, keep it practical', 'Yes, but gently', 'Not right now']],
  ['What is one outcome you would like to move towards?', ['More clarity', 'Better routines', 'Earlier support', 'My own goal']]
];
let twinStep = 0;
let twinAnswers = [];
const chatMessages = document.querySelector('#chatMessages');
const quickReplies = document.querySelector('#quickReplies');
const chatForm = document.querySelector('#chatForm');
const chatInput = document.querySelector('#chatInput');
const progressBar = document.querySelector('#progressBar');
const progressValue = document.querySelector('#progressValue');
const answeredCount = document.querySelector('#answeredCount');
const twinStatus = document.querySelector('#twinStatus');
const twinPanel = document.querySelector('.twin-panel');
const recommendationBox = document.querySelector('#recommendationBox');

function addMessage(text, role='assistant') {
  const item = document.createElement('div');
  item.className = `chat-message ${role}`;
  item.innerHTML = `<span class="message-avatar">${role === 'assistant' ? 'M' : 'Y'}</span><div><p>${text}</p><span class="message-time">${role === 'assistant' ? 'Metria Assistant' : 'You'}</span></div>`;
  chatMessages.appendChild(item);
  chatMessages.scrollTop = chatMessages.scrollHeight;
}

function updateTwin(answer) {
  twinAnswers.push(answer);
  const mapped = Math.min(twinAnswers.length * 10, 100);
  progressBar.style.width = `${mapped}%`;
  progressValue.textContent = `${mapped}%`;
  answeredCount.textContent = mapped;
  twinPanel.classList.add('is-active');
  twinStatus.textContent = mapped >= 100 ? 'Twin ready' : 'Mapping signals';
  twinStatus.parentElement.classList.add('ready');
  const values = document.querySelectorAll('#twinDomains b');
  const labels = ['Mapping', 'Emerging', 'Observed', 'Defined'];
  values.forEach((value, index) => { value.textContent = labels[Math.min(Math.floor(twinAnswers.length / 3), 3)]; });
  const insights = ['Your twin is beginning to connect routine, goals and context.', 'A clearer pattern is emerging across your answers.', 'Metria can now prioritise small, explainable next steps.', 'Your demo twin is populated with 100 mapped signals.'];
  const recommendations = ['Start with one short daily check-in so the twin can learn what matters to you.', 'Compare your preferred routine with your actual routine before changing anything.', 'Choose one small, reversible experiment this week and review how it feels.', 'Review the mapped signals and confidence with a qualified professional before using them for health decisions.'];
  recommendationBox.querySelector('p').textContent = `${insights[Math.min(Math.floor(twinAnswers.length / 3), 3)]} ${recommendations[Math.min(Math.floor(twinAnswers.length / 3), 3)]}`;
}

function askNext() {
  if (twinStep >= twinQuestions.length) {
    addMessage('Your demonstration twin is now populated. The next step would be reviewing each signal, its source and its confidence before any decision is made.', 'assistant');
    quickReplies.innerHTML = '<button type="button" data-answer="Restart the demo">Restart the demo ↻</button><button type="button" data-answer="Talk to the Metria team">Talk to the Metria team ↗</button>';
    return;
  }
  const [question, options] = twinQuestions[twinStep];
  addMessage(question, 'assistant');
  quickReplies.innerHTML = options.map(option => `<button type="button" data-answer="${option}">${option}</button>`).join('');
  twinStep += 1;
}

function handleAnswer(answer) {
  if (answer === 'Start the guided intake' || answer === 'Show me an example twin') { addMessage(answer, 'user'); if (answer.includes('example')) { twinStep = 10; twinAnswers = Array.from({length: 10}, () => 'Example signal'); updateTwin('Example signal'); } askNext(); return; }
  if (answer === 'Restart the demo') { twinStep = 0; twinAnswers = []; progressBar.style.width = '0%'; progressValue.textContent = '0%'; answeredCount.textContent = '0'; twinStatus.textContent = 'Awaiting input'; twinStatus.parentElement.classList.remove('ready'); recommendationBox.querySelector('p').textContent = 'Complete the guided intake to generate an explainable, non-clinical summary.'; addMessage('The demo twin has been reset. Nothing was saved.', 'assistant'); askNext(); return; }
  addMessage(answer, 'user'); updateTwin(answer); askNext();
}

quickReplies?.addEventListener('click', (event) => { const button = event.target.closest('button'); if (button) handleAnswer(button.dataset.answer); });
chatForm?.addEventListener('submit', (event) => { event.preventDefault(); const value = chatInput.value.trim(); if (!value) return; chatInput.value = ''; handleAnswer(value); });

