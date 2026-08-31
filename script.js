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

document.querySelectorAll('.audience-tab').forEach((tab) => {
  tab.addEventListener('click', () => {
    const audience = tab.dataset.audience;
    document.querySelectorAll('.audience-tab').forEach((item) => { item.classList.toggle('active', item === tab); item.setAttribute('aria-selected', item === tab ? 'true' : 'false'); });
    document.querySelectorAll('.pricing-panel').forEach((panel) => panel.classList.toggle('active', panel.dataset.panel === audience));
  });
});

const signalMap = {
  history: {title:'Clinical history → longitudinal layer', description:'Prior records and reported history are organised as time-aware evidence, preserving provenance rather than collapsing everything into one score.', layer:'history', confidence:'82%', summary:'Longitudinal evidence is being structured.'},
  voice: {title:'Voice → current-state layer', description:'Voice is treated as one contextual signal among many. The map shows how it can inform an observed-state representation with explicit uncertainty.', layer:'state', confidence:'71%', summary:'A current-state signal has been added.'},
  movement: {title:'Movement → current-state layer', description:'Movement observations can contribute to a temporal pattern while remaining separate from interpretation until reviewed.', layer:'state', confidence:'76%', summary:'Temporal movement evidence is connected.'},
  context: {title:'Context → life-context layer', description:'Environment and circumstances help explain why a pattern may appear, reducing the risk of reading a signal without its context.', layer:'context', confidence:'88%', summary:'Contextual factors are now represented.'},
  goals: {title:'Goals → intent layer', description:'The person’s priorities and preferences shape which recommendations are relevant, actionable and acceptable to them.', layer:'intent', confidence:'91%', summary:'Personal priorities are informing relevance.'},
  routine: {title:'Routine → life-context layer', description:'Daily rhythm links repeated observations to a person’s lived context and helps the twin focus on practical, reversible next steps.', layer:'context', confidence:'79%', summary:'Routine patterns are connected to context.'}
};
document.querySelectorAll('.input-node').forEach((node) => {
  const activate = () => {
    const data = signalMap[node.dataset.signal];
    document.querySelectorAll('.input-node').forEach((item) => item.classList.remove('selected'));
    node.classList.add('selected');
    document.querySelector('#mappingTitle').textContent = data.title;
    document.querySelector('#mappingDescription').textContent = data.description;
    document.querySelector('#patientTwinSummary').textContent = data.summary;
    document.querySelector('#reportPresentation').textContent = `The selected ${node.dataset.signal} signal is connected to the patient representation while remaining traceable to its source. Metria combines this evidence with other domains rather than treating one stream as a diagnosis. ${data.description}`;
    document.querySelector('#reportHypothesis').textContent = `This synthetic ${node.dataset.signal} pattern could motivate targeted review of related clinical and contextual contributors. It does not establish a diagnosis; corroboration and qualified human assessment are required.`;
    document.querySelector('#patientSignals').textContent = '1';
    document.querySelector('#patientConfidence').textContent = data.confidence;
    document.querySelector('#patientLayers').textContent = '1/6';
    document.querySelectorAll('.layer-item').forEach((item) => { const active = item.dataset.layer === data.layer; item.classList.toggle('mapped', active); if (active) item.querySelector('b').textContent = '✓'; });
  };
  node.addEventListener('click', activate);
  node.addEventListener('keydown', (event) => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); activate(); } });
});

// Twin Studio: a transparent, browser-only semantic mapper. It is intentionally not
// presented as a medical diagnosis or a generative clinical model.
const studioForm = document.querySelector('#studioForm');
const studioInput = document.querySelector('#studioInput');
const studioMessages = document.querySelector('#studioMessages');
const studioState = { signals: 0, domains: {mind:0, body:0, rhythm:0, context:0} };
const escapeHTML = (value) => String(value).replace(/[&<>"']/g, (char) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
function studioMessage(text, role='assistant') {
  const item = document.createElement('div'); item.className = `studio-message ${role}`;
  const avatar = document.createElement('span'); avatar.className = 'studio-avatar'; avatar.textContent = role === 'assistant' ? 'M' : 'Y';
  const bubble = document.createElement('p'); bubble.textContent = text; item.append(avatar, bubble); studioMessages.appendChild(item); studioMessages.scrollTop = studioMessages.scrollHeight;
}
function mapStudioText(raw) {
  const text = raw.toLowerCase();
  const rules = [
    {domain:'rhythm', words:['sleep','rest','bed','wake','tired','energy','routine','lunch'], label:'Sleep & rhythm'},
    {domain:'body', words:['pain','walk','movement','exercise','active','heart','breath','food','weight','symptom'], label:'Body & movement'},
    {domain:'mind', words:['mood','stress','anxiety','focus','memory','worry','calm','sad'], label:'Mind & mood'},
    {domain:'context', words:['work','home','family','environment','support','medication','goal','prefer'], label:'Life context'}
  ];
  const hits = rules.filter((rule) => rule.words.some((word) => text.includes(word)));
  const chosen = hits.length ? hits : [rules[3]];
  chosen.forEach((rule) => { studioState.domains[rule.domain] += 1; });
  studioState.signals += Math.min(25, Math.max(1, Math.round(raw.trim().split(/\s+/).length / 3)));
  const total = Math.min(100, Object.values(studioState.domains).reduce((sum, value) => sum + value, 0) * 12 + studioState.signals);
  const confidence = Math.min(92, 54 + chosen.length * 8 + Math.min(20, studioState.signals));
  document.querySelector('#studioCompleteness').textContent = `${total}%`;
  document.querySelector('#studioBar').style.width = `${total}%`;
  document.querySelector('#studioSignals').textContent = studioState.signals;
  document.querySelector('#studioConfidence').textContent = `${confidence}% mapping confidence`;
  document.querySelector('#studioTwinTitle').textContent = total > 70 ? 'Context model forming' : 'Context received';
  document.querySelector('#studioReady').textContent = total > 70 ? 'MODEL READY' : 'MAPPING LIVE';
  document.querySelector('#studioReady').classList.add('ready');
  document.querySelector('#brainScore').textContent = `${Math.min(99, 45 + studioState.domains.mind * 12)}%`;
  document.querySelector('#heartScore').textContent = `${Math.min(99, 45 + studioState.domains.body * 12)}%`;
  document.querySelector('#gutScore').textContent = `${Math.min(99, 45 + studioState.domains.rhythm * 12)}%`;
  document.querySelectorAll('[data-studio-domain]').forEach((card) => { const domain = card.dataset.studioDomain; const count = studioState.domains[domain]; card.classList.toggle('mapped', count > 0); card.querySelector('b').textContent = count ? `${count} evidence ${count === 1 ? 'thread' : 'threads'}` : 'Unmapped'; });
  const names = chosen.map((rule) => rule.label.toLowerCase()).join(' + ');
  document.querySelector('#studioRecommendation').textContent = `Mapped ${names}. Next: corroborate this self-reported pattern with timestamps, source quality and a qualified human review before making any health decision.`;
  return `I mapped this to ${names}. I found ${studioState.signals} structured signal${studioState.signals === 1 ? '' : 's'} so far. The twin updated, but this is an illustrative representation—not a diagnosis. What context would help confirm or challenge this pattern?`;
}
studioForm?.addEventListener('submit', (event) => { event.preventDefault(); const value = studioInput.value.trim(); if (!value) return; studioInput.value = ''; studioMessage(value, 'user'); window.setTimeout(() => studioMessage(mapStudioText(value)), 180); });
document.querySelectorAll('[data-studio-prompt]').forEach((button) => button.addEventListener('click', () => { studioInput.value = button.dataset.studioPrompt; studioInput.focus(); }));
document.querySelector('#studioReset')?.addEventListener('click', () => { studioState.signals = 0; Object.keys(studioState.domains).forEach((key) => { studioState.domains[key] = 0; }); studioMessages.innerHTML = ''; document.querySelector('#studioCompleteness').textContent = '0%'; document.querySelector('#studioBar').style.width = '0%'; document.querySelector('#studioSignals').textContent = '0'; document.querySelector('#studioConfidence').textContent = 'confidence pending'; document.querySelector('#studioTwinTitle').textContent = 'Awaiting context'; document.querySelector('#studioReady').textContent = 'EMPTY MODEL'; document.querySelector('#studioReady').classList.remove('ready'); document.querySelectorAll('[data-studio-domain]').forEach((card) => { card.classList.remove('mapped'); card.querySelector('b').textContent = 'Unmapped'; }); studioMessage('The local twin was reset. Nothing was saved. Tell me a signal whenever you are ready.'); });
