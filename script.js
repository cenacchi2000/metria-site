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

document.querySelectorAll('a').forEach((link) => {
  if (link.textContent.includes('Discover our vision')) link.href = 'vision.html';
});

const twinQuestions = [
  ['What is your age range?', ['18–29', '30–44', '45–64', '65+', 'Prefer not to say']],
  ['What pronouns should the twin use?', ['She/her', 'He/him', 'They/them', 'Prefer not to say']],
  ['What is your main goal for this twin?', ['Understand my wellbeing', 'Prepare for a clinical conversation', 'Improve daily routines', 'Track change over time']],
  ['How would you describe your energy most days?', ['Steady', 'Variable', 'Often low', 'Prefer not to say']],
  ['How consistent is your sleep schedule?', ['Very consistent', 'Somewhat consistent', 'Irregular', 'Prefer not to say']],
  ['How many hours do you usually sleep?', ['Less than 5', '5–6', '7–8', 'More than 8', 'Prefer not to say']],
  ['How refreshed do you feel on waking?', ['Very refreshed', 'Mostly refreshed', 'Sometimes tired', 'Usually exhausted']],
  ['How often do you wake during the night?', ['Rarely', 'Sometimes', 'Often', 'Prefer not to say']],
  ['How would you describe your daytime alertness?', ['Stable', 'Afternoon dip', 'Frequently tired', 'Variable']],
  ['How active are you in a typical week?', ['Mostly sedentary', 'Lightly active', 'Regularly active', 'Highly active']],
  ['How much time do you spend sitting?', ['Under 4 hours', '4–7 hours', '8–10 hours', 'Over 10 hours']],
  ['How often do you walk for at least 20 minutes?', ['Most days', 'A few times weekly', 'Rarely', 'Never']],
  ['What movement would you like to improve?', ['Strength', 'Mobility', 'Cardio fitness', 'Consistency']],
  ['How would you describe your appetite?', ['Stable', 'Variable', 'Lower than usual', 'Higher than usual']],
  ['How regular are your meals?', ['Very regular', 'Mostly regular', 'Irregular', 'Prefer not to say']],
  ['How would you describe your hydration?', ['Consistent', 'Could improve', 'Often forget', 'Prefer not to say']],
  ['How would you describe your mood recently?', ['Positive', 'Mostly steady', 'Variable', 'Low', 'Prefer not to say']],
  ['How often do you feel stressed?', ['Rarely', 'Sometimes', 'Often', 'Almost constantly']],
  ['How easy is it to focus?', ['Easy', 'Usually manageable', 'Difficult', 'Very difficult']],
  ['How often do you feel anxious or worried?', ['Rarely', 'Sometimes', 'Often', 'Prefer not to say']],
  ['How connected do you feel to other people?', ['Very connected', 'Somewhat connected', 'Isolated at times', 'Prefer not to say']],
  ['What support is available to you?', ['Strong support', 'Some support', 'Limited support', 'Prefer not to say']],
  ['How would you describe your home environment?', ['Calm', 'Busy', 'Changing', 'Prefer not to say']],
  ['How would you describe your work or study load?', ['Light', 'Manageable', 'Heavy', 'Changing']],
  ['How often does work affect your wellbeing?', ['Rarely', 'Sometimes', 'Often', 'Prefer not to say']],
  ['How predictable is your daily routine?', ['Very predictable', 'Somewhat predictable', 'Unpredictable', 'Prefer not to say']],
  ['How often do you travel across time zones?', ['Never', 'Occasionally', 'Often', 'Prefer not to say']],
  ['Do you use caffeine?', ['No', '1 serving daily', '2–3 servings daily', 'More than 3']],
  ['Do you use nicotine?', ['No', 'Occasionally', 'Regularly', 'Prefer not to say']],
  ['Do you drink alcohol?', ['No', 'Occasionally', 'Weekly', 'Often', 'Prefer not to say']],
  ['Are you taking any prescribed medication?', ['No', 'Yes, stable', 'Yes, changing', 'Prefer not to say']],
  ['Do you have any relevant health history to discuss with a clinician?', ['No known history', 'Yes, stable history', 'Yes, changing history', 'Prefer not to say']],
  ['Have you noticed a recent change in your health?', ['No change', 'Small change', 'Clear change', 'Prefer not to say']],
  ['How long has the main pattern been present?', ['Days', 'Weeks', 'Months', 'Longer than a year']],
  ['What tends to make the pattern better?', ['Rest', 'Movement', 'Social support', 'I am not sure']],
  ['What tends to make it worse?', ['Poor sleep', 'Stress', 'Workload', 'I am not sure']],
  ['What outcome matters most to you?', ['More energy', 'Better sleep', 'More focus', 'More stability']],
  ['What kind of recommendation would you accept?', ['A small daily experiment', 'A weekly review', 'A clinician discussion', 'More information first']],
  ['How much explanation do you want?', ['Brief', 'Moderate detail', 'Full evidence trace']],
  ['Should the twin ask before making an inference?', ['Always', 'For sensitive topics', 'Only when confidence is low']],
  ['What should happen when evidence conflicts?', ['Ask me', 'Show both possibilities', 'Defer to a clinician']],
  ['Who should be able to see this twin?', ['Only me', 'Me and my clinician', 'A care team after consent']],
  ['What would make this twin useful?', ['Earlier support', 'Clearer conversations', 'Better self-management', 'Research insight']],
  ['Would you like to add a guided video conversation?', ['Yes, I consent', 'Not now', 'I want to learn more first']]
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
if (answeredCount) answeredCount.nextSibling.textContent = ' of 45 questions mapped';
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
  const mapped = Math.min(Math.round((twinAnswers.length / twinQuestions.length) * 100), 100);
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
  const corpus = twinAnswers.join(' ').toLowerCase();
  const analysis = corpus.includes('irregular') || corpus.includes('often tired') || corpus.includes('low')
    ? 'Priority pattern: recovery and energy. Start with a consistent sleep window, a short daily movement check-in, and review persistent changes with a qualified clinician.'
    : corpus.includes('stress') || corpus.includes('anxious') || corpus.includes('heavy')
      ? 'Priority pattern: load and context. Track when stress changes sleep, mood or focus, then choose one reversible support action and review the evidence.'
      : 'Emerging pattern: stable context with opportunities for personalised prevention. Keep collecting time-stamped observations before drawing stronger conclusions.';
  recommendationBox.querySelector('p').textContent = analysis;
  const score = Math.min(96, 48 + Math.round(mapped * .42));
  ['headScore','chestScore','bodyScore'].forEach((id, index) => { const node = document.querySelector(`#${id}`); if (node) node.textContent = `${Math.min(99, score + index * 3)}%`; });
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
  if (answer === 'Start the guided intake' || answer === 'Show me an example twin') { addMessage(answer, 'user'); if (answer.includes('example')) { twinStep = twinQuestions.length; twinAnswers = Array.from({length: twinQuestions.length}, () => 'Example signal'); updateTwin('Example signal'); } askNext(); return; }
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

// Optional multimodal capture. The camera stream stays in this browser tab and is
// never uploaded by the static demo.
const startRecording = document.querySelector('#startRecording');
const stopRecording = document.querySelector('#stopRecording');
const videoPreview = document.querySelector('#videoPreview');
const videoPlaceholder = document.querySelector('#videoPlaceholder');
let twinMediaStream;
let twinRecorder;
startRecording?.addEventListener('click', async () => {
  try {
    twinMediaStream = await navigator.mediaDevices.getUserMedia({video:true, audio:true});
    videoPreview.srcObject = twinMediaStream;
    videoPreview.parentElement.classList.add('recording');
    videoPlaceholder.textContent = 'Recording locally…';
    twinRecorder = new MediaRecorder(twinMediaStream);
    twinRecorder.start(); startRecording.disabled = true; stopRecording.disabled = false;
    addMessage('Video conversation started. Answer the next questions naturally, then stop when you are finished.', 'assistant');
  } catch (error) {
    videoPlaceholder.textContent = 'Camera permission was not granted';
  }
});
stopRecording?.addEventListener('click', () => {
  if (twinRecorder && twinRecorder.state !== 'inactive') twinRecorder.stop();
  twinMediaStream?.getTracks().forEach((track) => track.stop());
  videoPreview.srcObject = null; videoPreview.parentElement.classList.remove('recording');
  videoPlaceholder.textContent = 'Video evidence captured locally';
  startRecording.disabled = false; stopRecording.disabled = true;
  updateTwin('Guided video conversation');
  addMessage('The local video capture has been added as a multimodal evidence event. It was not uploaded or saved.', 'assistant');
});

// Local face reconstruction. The camera is opt-in; MediaPipe landmarks are processed
// in this tab only and are rendered as a stylised mesh rather than an identity model.
const faceVideo = document.querySelector('#faceVideo');
const faceCanvas = document.querySelector('#faceCanvas');
const startFaceTwin = document.querySelector('#startFaceTwin');
const stopFaceTwin = document.querySelector('#stopFaceTwin');
const faceStatus = document.querySelector('#faceStatus');
const facePlaceholder = document.querySelector('#facePlaceholder');
let faceStream;
let faceLandmarker;
let faceFrame;
let faceRecorder;

function drawFaceMesh(landmarks) {
  if (!faceCanvas || !faceVideo) return;
  const width = faceCanvas.clientWidth || 320;
  const height = faceCanvas.clientHeight || 220;
  const ratio = window.devicePixelRatio || 1;
  if (faceCanvas.width !== width * ratio || faceCanvas.height !== height * ratio) {
    faceCanvas.width = width * ratio; faceCanvas.height = height * ratio;
  }
  const ctx = faceCanvas.getContext('2d'); ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
  ctx.clearRect(0, 0, width, height);
  if (!landmarks) return;
  const scale = Math.min(width, height) * .86;
  const cx = width / 2; const cy = height / 2 + 5;
  const points = landmarks.map((point) => {
    const depth = Math.max(-.18, Math.min(.18, point.z || 0));
    return {x: cx + (point.x - .5) * scale * (1 - depth), y: cy + (point.y - .5) * scale * (1 - depth), z: depth};
  });
  const visible = [10, 21, 54, 67, 103, 127, 132, 145, 152, 172, 176, 234, 263, 323, 356, 361, 365, 378, 397, 454];
  const links = [[10,152],[54,132],[132,176],[176,152],[152,365],[365,454],[454,263],[263,10],[21,54],[21,67],[67,103],[103,10],[21,234],[234,145],[145,172],[172,152],[10,323],[323,356],[356,397],[397,365],[10,21],[10,263]];
  const glow = ctx.createRadialGradient(cx, cy, 8, cx, cy, scale * .48); glow.addColorStop(0, '#ffaaa588'); glow.addColorStop(.55, '#8273df44'); glow.addColorStop(1, '#8273df00');
  ctx.fillStyle = glow; ctx.fillRect(0, 0, width, height);
  ctx.strokeStyle = '#b9f36caa'; ctx.lineWidth = 1.1;
  links.forEach(([a,b]) => { if (!points[a] || !points[b]) return; ctx.beginPath(); ctx.moveTo(points[a].x, points[a].y); ctx.lineTo(points[b].x, points[b].y); ctx.stroke(); });
  visible.forEach((index, order) => { const point = points[index]; if (!point) return; ctx.beginPath(); ctx.fillStyle = order % 4 === 0 ? '#ffaaa5' : '#b9f36c'; ctx.shadowColor = ctx.fillStyle; ctx.shadowBlur = 8; ctx.arc(point.x, point.y, order % 4 === 0 ? 2.8 : 2.1, 0, Math.PI * 2); ctx.fill(); ctx.shadowBlur = 0; });
  const nose = points[1] || points[4];
  if (nose) { const tilt = Math.max(-12, Math.min(12, (nose.x - cx) * .12)); faceCanvas.style.setProperty('--face-tilt', `${tilt}deg`); }
}

async function loadFaceLandmarker() {
  if (faceLandmarker) return faceLandmarker;
  faceStatus.textContent = 'Loading mesh';
  const vision = await import('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/+esm');
  const fileset = await vision.FilesetResolver.forVisionTasks('https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm');
  faceLandmarker = await vision.FaceLandmarker.createFromOptions(fileset, {baseOptions:{modelAssetPath:'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',delegate:'GPU'},runningMode:'VIDEO',numFaces:1,outputFaceBlendshapes:false,outputFacialTransformationMatrixes:false});
  return faceLandmarker;
}

function trackFace() {
  if (!faceStream || !faceLandmarker || !faceVideo || faceVideo.readyState < 2) { faceFrame = requestAnimationFrame(trackFace); return; }
  const result = faceLandmarker.detectForVideo(faceVideo, performance.now());
  const landmarks = result.faceLandmarks?.[0];
  drawFaceMesh(landmarks);
  faceStatus.textContent = landmarks ? 'Live mesh' : 'Looking for face';
  facePlaceholder.textContent = landmarks ? 'Landmarks tracked locally' : 'Move into view to begin reconstruction';
  faceFrame = requestAnimationFrame(trackFace);
}

startFaceTwin?.addEventListener('click', async () => {
  if (!navigator.mediaDevices?.getUserMedia) { faceStatus.textContent = 'Camera unavailable'; facePlaceholder.textContent = 'Use HTTPS and a camera-enabled browser'; return; }
  try {
    startFaceTwin.disabled = true;
    faceStream = await navigator.mediaDevices.getUserMedia({video:{facingMode:'user',width:{ideal:640},height:{ideal:480}},audio:false});
    faceVideo.srcObject = faceStream; faceVideo.classList.add('active');
    if (window.MediaRecorder) { faceRecorder = new MediaRecorder(faceStream); faceRecorder.ondataavailable = () => {}; faceRecorder.start(); }
    await faceVideo.play(); await loadFaceLandmarker();
    stopFaceTwin.disabled = false; faceStatus.textContent = 'Live mesh';
    updateTwin('Local face reconstruction');
    addMessage('Your live facial landmark mesh is informing the visual twin locally. No camera frames are uploaded or saved.', 'assistant');
    trackFace();
  } catch (error) {
    faceStatus.textContent = 'Camera unavailable'; facePlaceholder.textContent = 'Camera permission was not granted or the mesh could not load'; startFaceTwin.disabled = false;
    faceStream?.getTracks().forEach((track) => track.stop()); faceStream = null;
  }
});
stopFaceTwin?.addEventListener('click', () => {
  if (faceRecorder && faceRecorder.state !== 'inactive') faceRecorder.stop(); faceRecorder = null;
  faceStream?.getTracks().forEach((track) => track.stop()); faceStream = null; faceVideo.srcObject = null; faceVideo.classList.remove('active');
  if (faceFrame) cancelAnimationFrame(faceFrame); faceFrame = null; faceCanvas?.getContext('2d')?.clearRect(0, 0, faceCanvas.width, faceCanvas.height);
  startFaceTwin.disabled = false; stopFaceTwin.disabled = true; faceStatus.textContent = 'Camera off'; facePlaceholder.textContent = 'Start the camera to create a live face mesh';
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
