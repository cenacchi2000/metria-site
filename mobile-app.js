(() => {
const questions=[
["Sleep","How restorative did your sleep feel?","sleep",["Very restorative","Okay","Poor","Prefer not to say"]],
["Sleep","What time did you roughly go to bed?","sleep",["Before 10pm","10pm–midnight","After midnight","Prefer not to say"]],
["Sleep","How often did you wake during the night?","sleep",["Never","Once","Several times","Prefer not to say"]],
["Energy","How would you describe your energy right now?","body",["High","Steady","Low","Prefer not to say"]],
["Mood","What best describes your mood today?","mind",["Positive","Neutral","Flat","Prefer not to say"]],
["Stress","How demanding has today felt?","mind",["Light","Moderate","Heavy","Prefer not to say"]],
["Focus","How easy was it to focus?","mind",["Easy","Mixed","Difficult","Prefer not to say"]],
["Body","How comfortable does your body feel?","body",["Comfortable","Some tension","Uncomfortable","Prefer not to say"]],
["Movement","How much intentional movement did you do?","body",["A lot","Some","Very little","Prefer not to say"]],
["Routine","How predictable was your routine?","rhythm",["Very predictable","Somewhat","Unpredictable","Prefer not to say"]],
["Food","How satisfied were you with your meals?","body",["Satisfied","Mixed","Not satisfied","Prefer not to say"]],
["Hydration","How well hydrated do you feel?","body",["Well","Mostly","Not well","Prefer not to say"]],
["Environment","How supportive is your current environment?","context",["Very supportive","Mixed","Difficult","Prefer not to say"]],
["Work","How manageable were your main tasks?","context",["Manageable","Mixed","Overwhelming","Prefer not to say"]],
["Connection","How connected did you feel to others?","context",["Connected","Somewhat","Isolated","Prefer not to say"]],
["Calm","Did you have time to reset today?","mind",["Yes, enough","A little","Not yet","Prefer not to say"]],
["Motivation","How motivated do you feel?","mind",["Motivated","Mixed","Low","Prefer not to say"]],
["Memory","How clear did your memory feel?","mind",["Clear","Usual","Foggy","Prefer not to say"]],
["Breathing","How comfortable was your breathing during activity?","body",["Comfortable","Mixed","Difficult","Prefer not to say"]],
["Pain","Did discomfort affect your day?","body",["Not at all","A little","A lot","Prefer not to say"]],
["Screen time","How balanced did screen time feel?","rhythm",["Balanced","Mixed","Too much","Prefer not to say"]],
["Outdoor time","Did you spend time outdoors?","environment",["Yes","A little","No","Prefer not to say"]],
["Caffeine","How did caffeine affect you?","body",["Helpful","No effect","Unhelpful","Prefer not to say"]],
["Alcohol","Would you like to record alcohol use?","body",["None","Some","Prefer not to say"]],
["Medication","Would you like to note whether medication affected today?","context",["No change","Possibly","Prefer not to say"]],
["Noise","How distracting was your environment?","environment",["Not distracting","Somewhat","Very distracting","Prefer not to say"]],
["Light","How comfortable was the lighting around you?","environment",["Comfortable","Mixed","Uncomfortable","Prefer not to say"]],
["Temperature","How comfortable was the temperature?","environment",["Comfortable","Mixed","Uncomfortable","Prefer not to say"]],
["Social load","How tiring were social interactions?","context",["Not tiring","Somewhat","Very tiring","Prefer not to say"]],
["Meaning","Did today feel aligned with what matters to you?","mind",["Yes","Partly","Not really","Prefer not to say"]],
["Goal","What matters most tomorrow?","goal",["Energy","Focus","Rest","Connection"]],
["Barrier","What most got in the way today?","context",["Time","Energy","Stress","Nothing major"]],
["Support","What kind of support would help?","goal",["Structure","Encouragement","Information","Human conversation"]],
["Confidence","How confident are you about tomorrow?","mind",["Confident","Unsure","Not confident","Prefer not to say"]],
["Recovery","How recovered do you feel from recent demands?","sleep",["Recovered","Partly","Not recovered","Prefer not to say"]],
["Consistency","How consistent has this week felt?","rhythm",["Consistent","Mixed","Unsteady","Prefer not to say"]],
["Change","What changed most since yesterday?","context",["Sleep","Mood","Workload","Nothing notable"]],
["Priority","What should the twin watch gently over time?","goal",["Sleep","Energy","Mood","Routine"]],
["Reflection","What are you proud of today?","mind",["A choice","An effort","A connection","Prefer not to say"]],
["Plan","What is one realistic next step?","goal",["Rest","Move","Plan","Connect"]],
["Safety","Do you feel safe and supported right now?","context",["Yes","Somewhat","Prefer not to say"]],
["Consent","May Metria use this answer in your local trend summary?","context",["Yes","No","Prefer not to say"]],
["Privacy","Would you like to review or delete local data?","context",["Review","Delete","Later"]],
["Feedback","How useful was today’s check-in?","goal",["Useful","Unsure","Not useful","Prefer not to say"]],
["Next","Would you like another check-in tomorrow?","goal",["Yes","Remind me later","No"]]
];
const state=JSON.parse(localStorage.getItem("metriaTwinState")||'{"answers":[],"days":[],"speech":[],"face":0}');
const $=s=>document.querySelector(s);
const save=()=>localStorage.setItem("metriaTwinState",JSON.stringify(state));
const idx=(new Date().getDate()-1)%questions.length, q=questions[idx];
$("#qTitle").textContent=q[0]; $("#qMeta").textContent="Question "+(idx+1)+" of "+questions.length+" · local daily signal"; $("#question").textContent=q[1];
const analysis=()=>{const total=state.answers.length;$("#signals").textContent=Math.min(100,total);$("#days").textContent=new Set(state.days).size;$("#progress").style.width=Math.min(100,total/45*100)+"%";$("#twinState").textContent=total?"Twin updated with today’s evidence":"Awaiting today’s signal";$("#consistency").textContent=total>3?Math.min(99,55+total*2)+"%":"—";const recent=state.answers.slice(-5).map(x=>x.text).join(" · ");$("#recommendation").innerHTML="<strong>Pattern summary</strong><br>"+(recent?"Recent signals: "+recent+". Metria will look for repeated changes across days, not isolated answers.":"Complete check-ins to identify repeated patterns.")};
const choose=t=>{state.answers.push({date:new Date().toISOString(),question:q[1],text:t,domain:q[2]});state.days.push(new Date().toISOString().slice(0,10));save();$("#analysis").textContent="Mapped locally: "+t+". This is a self-reported signal, not a diagnosis.";analysis();};
q[3].forEach(t=>{const b=document.createElement("button");b.textContent=t;b.onclick=()=>choose(t);$("#choices").appendChild(b)});
$("#answerForm").onsubmit=e=>{e.preventDefault();const v=$("#answer").value.trim();if(v){choose(v);$("#answer").value=""}};
document.querySelectorAll("[data-prompt]").forEach(b=>b.onclick=()=>{$("#chatInput").value=b.dataset.prompt;$("#chatInput").focus()});
$("#chatForm").onsubmit=e=>{e.preventDefault();const v=$("#chatInput").value.trim();if(!v)return;$("#chatInput").value="";const log=$("#chatlog"),u=document.createElement("div");u.className="bubble you";u.textContent=v;log.appendChild(u);state.answers.push({date:new Date().toISOString(),question:"conversation",text:v,domain:"conversation"});save();const a=document.createElement("div");a.className="bubble";a.textContent="I mapped that to your local context. I’ll compare it with future check-ins and show the evidence behind any emerging pattern.";log.appendChild(a);analysis();log.scrollTop=log.scrollHeight};
let installEvent;
const installButton=$("#install");
const isIOS=/iphone|ipad|ipod/i.test(navigator.userAgent)&&!window.MSStream;
const isStandalone=window.navigator.standalone===true||window.matchMedia("(display-mode: standalone)").matches;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installEvent=e;if(installButton){installButton.style.display="block";installButton.textContent="Install Metria on this device"}});
if(isIOS&&!isStandalone&&installButton){installButton.style.display="block";installButton.textContent="Add Metria to Home Screen";}
if(isStandalone&&installButton){installButton.style.display="none";}
if(installButton)installButton.onclick=async()=>{
 if(installEvent){await installEvent.prompt();installEvent=null;installButton.style.display="none";return;}
 if(isIOS){alert("To install Metria on iPhone: tap the Share button in Safari, choose Add to Home Screen, then tap Add.");return;}
 alert("Use your browser menu and choose Install app or Add to Home screen.");
};
if("serviceWorker"in navigator)navigator.serviceWorker.register("sw.js").catch(()=>{});
let recognition=null;if("SpeechRecognition"in window||"webkitSpeechRecognition"in window){const R=window.SpeechRecognition||window.webkitSpeechRecognition;recognition=new R();recognition.lang="en-AU";recognition.interimResults=false;recognition.onresult=e=>{$("#chatInput").value=e.results[0][0].transcript};recognition.onend=()=>$("#speech").textContent="Start speech input";}$("#speech").onclick=()=>{if(!recognition){$("#speech").textContent="Speech input unavailable";return}$("#speech").textContent="Listening…";recognition.start()};
let stream=null,landmarker=null;const video=$("#video"),canvas=$("#mesh"),box=$("#videoBox");
const draw=pts=>{const r=Math.min(devicePixelRatio||1,2),w=canvas.clientWidth,h=canvas.clientHeight;canvas.width=w*r;canvas.height=h*r;const c=canvas.getContext("2d");c.setTransform(r,0,0,r,0,0);c.clearRect(0,0,w,h);if(!pts)return;const minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x)),minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y)),s=Math.min(w/(maxX-minX+.12),h/(maxY-minY+.12)),cx=(minX+maxX)/2,cy=(minY+maxY)/2,p=pts.map(x=>({x:w/2+(x.x-cx)*s,y:h/2+(x.y-cy)*s,z:x.z||0}));c.strokeStyle="rgba(185,243,108,.55)";c.lineWidth=1;for(let i=0;i<p.length;i+=5){for(let j=i+5;j<p.length;j+=5){const dx=p[i].x-p[j].x,dy=p[i].y-p[j].y;if(dx*dx+dy*dy<Math.pow(Math.min(w,h)*.1,2)){c.beginPath();c.moveTo(p[i].x,p[i].y);c.lineTo(p[j].x,p[j].y);c.stroke()}}}p.forEach((x,i)=>{c.fillStyle=i%9?"#b9f36c":"#ffaaa5";c.beginPath();c.arc(x.x,x.y,1.2,0,7);c.fill()})};
const loop=()=>{if(!stream)return;if(landmarker&&video.readyState>=2){const out=landmarker.detectForVideo(video,performance.now());draw(out.faceLandmarks?.[0])}requestAnimationFrame(loop)};
$("#camera").onclick=async()=>{if(stream)return;try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:"user",width:{ideal:640},height:{ideal:480}},audio:false});video.srcObject=stream;video.classList.add("active");$("#videoLabel").textContent="Camera active · local landmark mesh";$("#camera").disabled=true;$("#cameraStop").disabled=false;const v=await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/vision_bundle.mjs"),f=await v.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.22/wasm");landmarker=await v.FaceLandmarker.createFromOptions(f,{baseOptions:{modelAssetPath:"https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",delegate:"GPU"},runningMode:"VIDEO",numFaces:1});state.face++;save();analysis();loop()}catch(e){stream?.getTracks().forEach(t=>t.stop());stream=null;$("#videoLabel").textContent="Camera unavailable · check site permission"}};
$("#cameraStop").onclick=()=>{stream?.getTracks().forEach(t=>t.stop());stream=null;video.srcObject=null;video.classList.remove("active");$("#camera").disabled=false;$("#cameraStop").disabled=true;$("#videoLabel").textContent="Camera off · nothing is captured until you opt in";const c=canvas.getContext("2d");c.clearRect(0,0,canvas.width,canvas.height)};
analysis();
})();