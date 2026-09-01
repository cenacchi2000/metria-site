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
$("#chatForm").onsubmit=e=>{e.preventDefault();const v=$("#chatInput").value.trim();if(!v)return;$("#chatInput").value="";const log=$("#chatlog"),u=document.createElement("div");u.className="bubble you";u.textContent=v;log.appendChild(u);state.answers.push({date:new Date().toISOString(),question:"conversation",text:v,domain:"conversation"});save();const a=document.createElement("div");a.className="bubble";const name=window.metriaProfile?.name;a.textContent=(name?name+", I":"I")+" mapped that to your context. I’ll compare it with future check-ins and explain sustained change from your own baseline.";log.appendChild(a);if("speechSynthesis"in window){speechSynthesis.cancel();const utterance=new SpeechSynthesisUtterance(a.textContent);utterance.lang="en-AU";utterance.rate=.96;window.metriaTwinSpeaking=true;utterance.onend=()=>window.metriaTwinSpeaking=false;speechSynthesis.speak(utterance)}analysis();log.scrollTop=log.scrollHeight};
let installEvent;
const installButton=$("#install");
const ua=navigator.userAgent;
const isIOS=/iphone|ipad|ipod/i.test(ua)&&!window.MSStream;
const isIOSChrome=isIOS&&/crios/i.test(ua);
const isIOSFirefox=isIOS&&/fxios/i.test(ua);
const isStandalone=window.navigator.standalone===true||window.matchMedia("(display-mode: standalone)").matches;
window.addEventListener("beforeinstallprompt",e=>{e.preventDefault();installEvent=e;if(installButton){installButton.style.display="block";installButton.textContent="Install Metria on this device"}});
if(isIOS&&!isStandalone&&installButton){installButton.style.display="block";installButton.textContent="Add Metria to Home Screen";}
if(isStandalone&&installButton){installButton.style.display="none";}
if(installButton)installButton.onclick=async()=>{
 if(installEvent){await installEvent.prompt();installEvent=null;installButton.style.display="none";return;}
 if(isIOSChrome){alert("To install Metria in Chrome on iPhone: open Chrome’s menu, choose Share, select Add to Home Screen, then tap Add.");return;}
 if(isIOSFirefox){alert("To install Metria in Firefox on iPhone: open the browser share menu, choose Add to Home Screen, then tap Add.");return;}
 if(isIOS){alert("To install Metria in Safari: tap Share, choose Add to Home Screen, then tap Add.");return;}
 alert("Use your browser menu and choose Install app or Add to Home screen.");
};
if("serviceWorker"in navigator){
 let refreshing=false;
 navigator.serviceWorker.addEventListener("controllerchange",()=>{
  if(refreshing)return;
  refreshing=true;
  window.location.reload();
 });
 navigator.serviceWorker.register("sw.js",{updateViaCache:"none"}).then(reg=>{
  reg.update().catch(()=>{});
  const check=()=>reg.update().catch(()=>{});
  document.addEventListener("visibilitychange",()=>{if(document.visibilityState==="visible")check()});
  window.setInterval(check,15*60*1000);
 }).catch(()=>{});
}
let recognition=null;if("SpeechRecognition"in window||"webkitSpeechRecognition"in window){const R=window.SpeechRecognition||window.webkitSpeechRecognition;recognition=new R();recognition.lang="en-AU";recognition.interimResults=false;recognition.onresult=e=>{$("#chatInput").value=e.results[0][0].transcript};recognition.onend=()=>$("#speech").textContent="Start speech input";}$("#speech").onclick=()=>{if(!recognition){$("#speech").textContent="Speech input unavailable";return}$("#speech").textContent="Listening…";recognition.start()};
let stream=null,landmarker=null,lastTime=-1,scanFrames=[],frozenPoints=JSON.parse(localStorage.getItem("metriaFaceGeometryV1")||"null"),idleFrame=0;
const video=$("#video"),canvas=$("#mesh"),box=$("#videoBox");
const drawFallback=()=>drawTwin(frozenPoints,false);
function drawTwin(raw,live=true){
 const ratio=Math.min(devicePixelRatio||1,2),w=canvas.clientWidth||320,h=canvas.clientHeight||240;canvas.width=w*ratio;canvas.height=h*ratio;const c=canvas.getContext("2d");c.setTransform(ratio,0,0,ratio,0,0);c.clearRect(0,0,w,h);
 const cx=w/2,cy=h*.48,rx=Math.min(w*.27,126),ry=rx*1.28,phase=performance.now()/1000,yaw=live?0:(phase*.16%(Math.PI*2)),breath=1+Math.sin(phase*1.35)*.009;
 c.strokeStyle="rgba(185,243,108,.52)";c.fillStyle="#b9f36c";c.lineWidth=Math.max(.55,w/620);c.shadowColor="#b9f36c";c.shadowBlur=4;
 for(let lat=-7;lat<=7;lat++){let previous=null;for(let lon=0;lon<=40;lon++){const u=lon/40*Math.PI*2+yaw,v=lat/8*Math.PI/2,x3=Math.cos(v)*Math.sin(u),z3=Math.cos(v)*Math.cos(u),y3=Math.sin(v),perspective=1/(1.18-z3*.12),pt={x:cx+x3*rx*breath*perspective,y:cy+y3*ry*breath*perspective,z:z3};if(previous){c.globalAlpha=.18+.34*(z3+1)/2;c.beginPath();c.moveTo(previous.x,previous.y);c.lineTo(pt.x,pt.y);c.stroke()}previous=pt;if(lon%4===0){c.beginPath();c.arc(pt.x,pt.y,.85,0,7);c.fill()}}}
 for(let lon=0;lon<18;lon++){let previous=null;for(let lat=-9;lat<=9;lat++){const u=lon/18*Math.PI*2+yaw,v=lat/18*Math.PI,x3=Math.cos(v)*Math.sin(u),z3=Math.cos(v)*Math.cos(u),y3=Math.sin(v),perspective=1/(1.18-z3*.12),pt={x:cx+x3*rx*breath*perspective,y:cy+y3*ry*breath*perspective,z:z3};if(previous){c.globalAlpha=.16+.3*(z3+1)/2;c.beginPath();c.moveTo(previous.x,previous.y);c.lineTo(pt.x,pt.y);c.stroke()}previous=pt}}
 for(const side of [-1,1]){const earX=cx+side*rx*.91*Math.cos(yaw);c.globalAlpha=.48;c.beginPath();c.ellipse(earX,cy+.04*ry,rx*.105*Math.max(.28,Math.abs(Math.cos(yaw))),ry*.17,0,0,Math.PI*2);c.stroke();c.beginPath();c.ellipse(earX,cy+.04*ry,rx*.045*Math.max(.28,Math.abs(Math.cos(yaw))),ry*.09,0,0,Math.PI*2);c.stroke()}
 c.globalAlpha=1;
 if(raw?.length&&Math.cos(yaw)>.05){const pts=raw.map(p=>Array.isArray(p)?{x:p[0],y:p[1],z:p[2]||0}:p),minX=Math.min(...pts.map(p=>p.x)),maxX=Math.max(...pts.map(p=>p.x)),minY=Math.min(...pts.map(p=>p.y)),maxY=Math.max(...pts.map(p=>p.y)),mx=(minX+maxX)/2,my=(minY+maxY)/2,blink=.96+.04*Math.abs(Math.sin(phase*.72)),speak=window.metriaTwinSpeaking?Math.abs(Math.sin(phase*9))*.035:0,mapped=pts.map((p,i)=>{let nx=(p.x-mx)/(maxX-minX||1),ny=(p.y-my)/(maxY-minY||1);if((i>=61&&i<=91)||(i>=291&&i<=321))ny+=speak;return{x:cx+nx*rx*1.38*Math.cos(yaw),y:cy+ny*ry*1.55*blink,z:p.z||0}});
  c.globalAlpha=Math.min(1,Math.max(.2,Math.cos(yaw)));for(let i=0;i<mapped.length;i+=3)for(let j=i+3;j<mapped.length;j+=3){const dx=mapped[i].x-mapped[j].x,dy=mapped[i].y-mapped[j].y;if(dx*dx+dy*dy<Math.pow(Math.min(w,h)*.075,2)){c.beginPath();c.moveTo(mapped[i].x,mapped[i].y);c.lineTo(mapped[j].x,mapped[j].y);c.stroke()}}mapped.forEach((p,i)=>{if(i%2)return;c.beginPath();c.arc(p.x,p.y,1.05,0,7);c.fill()})}
 c.globalAlpha=1;c.shadowBlur=0;
}
const draw=pts=>{if(!pts?.length){drawFallback();return}drawTwin(pts,true);scanFrames.push(pts.map(p=>[+p.x.toFixed(4),+p.y.toFixed(4),+(p.z||0).toFixed(4)]));if(scanFrames.length>36)scanFrames.shift();if(scanFrames.length===36){frozenPoints=scanFrames[18];localStorage.setItem("metriaFaceGeometryV1",JSON.stringify(frozenPoints));$("#videoLabel").style.display="none"}};
function idleLoop(){if(!stream){drawTwin(frozenPoints,false);idleFrame=requestAnimationFrame(idleLoop)}}if(frozenPoints)idleLoop();
const loop=()=>{
 if(!stream)return;
 if(video.readyState>=2&&video.currentTime!==lastTime){
  lastTime=video.currentTime;
  if(landmarker){try{const out=landmarker.detectForVideo(video,performance.now()),landmarks=out.faceLandmarks?.[0];draw(landmarks);if(landmarks)window.dispatchEvent(new CustomEvent("metria:face-landmarks",{detail:landmarks}));$("#videoLabel").textContent=landmarks?"Camera active · scanning for your 3D twin":"Camera active · looking for a face"}catch(e){drawFallback();$("#videoLabel").textContent="Camera active · local mesh renderer"}}else{drawFallback();$("#videoLabel").textContent="Camera active · preparing local mesh"}
 }
 requestAnimationFrame(loop);
};
const loadLandmarker=async()=>{
 const v=await import("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision/vision_bundle.mjs");
 const f=await v.FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm");
 const options={runningMode:"VIDEO",numFaces:1,outputFaceBlendshapes:false,outputFacialTransformationMatrixes:true};
 try{return await v.FaceLandmarker.createFromOptions(f,{baseOptions:{modelAssetPath:"https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",delegate:"GPU"},...options})}
 catch(gpuError){return await v.FaceLandmarker.createFromOptions(f,{baseOptions:{modelAssetPath:"https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task",delegate:"CPU"},...options})}
};
$("#camera").onclick=async()=>{
 if(stream)return;
 cancelAnimationFrame(idleFrame);$("#videoLabel").style.display="grid";
 if(!navigator.mediaDevices?.getUserMedia){$("#videoLabel").textContent="Camera unavailable · use HTTPS and enable camera access";return}
 $("#camera").disabled=true;$("#videoLabel").textContent="Requesting camera access…";
 try{
  try{stream=await navigator.mediaDevices.getUserMedia({video:{facingMode:{ideal:"user"},width:{ideal:640},height:{ideal:480}},audio:false})}
  catch(firstError){stream=await navigator.mediaDevices.getUserMedia({video:true,audio:false})}
  video.srcObject=stream;video.classList.add("active");await video.play();$("#cameraStop").disabled=false;state.face++;save();analysis();loop();
  $("#videoLabel").textContent="Camera active · preparing local mesh";
  try{landmarker=await loadLandmarker();$("#videoLabel").textContent="Camera active · 478-point local mesh ready"}catch(modelError){landmarker=null;$("#videoLabel").textContent="Camera active · visual mesh renderer ready"}
 }catch(e){stream?.getTracks().forEach(t=>t.stop());stream=null;$("#camera").disabled=false;$("#videoLabel").textContent=e?.name==="NotAllowedError"?"Camera blocked · enable it in iPhone settings":"Camera unavailable · try closing other camera apps"}
};
$("#cameraStop").onclick=()=>{
 stream?.getTracks().forEach(t=>t.stop());stream=null;landmarker=null;video.srcObject=null;video.classList.remove("active");$("#camera").disabled=false;$("#cameraStop").disabled=true;$("#videoLabel").style.display=frozenPoints?"none":"grid";$("#videoLabel").textContent=frozenPoints?"":"Camera off · scan again when ready";cancelAnimationFrame(idleFrame);idleLoop()
};
analysis();
})();
