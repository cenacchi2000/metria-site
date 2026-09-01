(()=>{
const ACCOUNT_KEY="metriaLocalAccountV1",SESSION_KEY="metriaUnlocked";
const gate=document.querySelector("#accountGate"),accountStep=document.querySelector("#accountStep"),onboardStep=document.querySelector("#onboardStep"),message=document.querySelector("#accountMessage");
const email=document.querySelector("#accountEmail"),pass=document.querySelector("#accountPass");
const questions=[
 {title:"Identity",q:"What should your twin call you?",choices:[],key:"name"},
 {title:"Life structure",q:"Which description best fits your current stage?",choices:["Studying","Working","Caring for others","Retired","Between chapters"],key:"stage"},
 {title:"Home context",q:"Who usually shares your home environment?",choices:["I live alone","Partner or family","Housemates","It varies"],key:"home"},
 {title:"Rhythm signature",q:"How predictable is the shape of a normal week?",choices:["Highly structured","Structured with variation","Mostly variable","No usual week"],key:"rhythm"},
 {title:"Purpose load",q:"What currently carries the most responsibility?",choices:["Work or study","Caregiving","Health management","Relationships","A major transition"],key:"load"},
 {title:"Communication baseline",q:"When you feel like yourself, how talkative are you?",choices:["Very talkative","Moderately talkative","Brief and direct","It depends on context"],key:"speech"},
 {title:"Recovery rhythm",q:"When do you normally feel mentally sharpest?",choices:["Morning","Afternoon","Evening","No consistent time"],key:"sharp"},
 {title:"Mobility baseline",q:"How much walking is part of an ordinary day?",choices:["Under 15 minutes","15–45 minutes","45–90 minutes","Over 90 minutes"],key:"walking"},
 {title:"Interaction fluency",q:"How comfortable are typing, tapping and navigating your phone?",choices:["Effortless","Usually comfortable","Sometimes effortful","Often difficult"],key:"interaction"},
 {title:"Connection rhythm",q:"How often do meaningful conversations normally happen?",choices:["Several daily","About daily","A few weekly","Less than weekly"],key:"connection"},
 {title:"Environment",q:"Which environment affects you most strongly?",choices:["Noise","Light","Crowding","Temperature","None strongly"],key:"environment"},
 {title:"Change signature",q:"What is usually the first sign that your week is becoming harder?",choices:["Slower thinking","Less movement","Shorter communication","Routine disruption","Withdrawing from people"],key:"change"},
 {title:"Protective pattern",q:"What most reliably helps you return to baseline?",choices:["Sleep","Movement","Structure","Human connection","Quiet time"],key:"protective"},
 {title:"Twin purpose",q:"Which gradual change would be most useful to notice early?",choices:["Functional energy","Cognitive fluency","Social withdrawal","Mobility consistency","Recovery from demands"],key:"purpose"},
 {title:"Optional signals",q:"Allow short, in-app motion and interaction samples to strengthen your personal baseline?",choices:["Enable local signals","Answers only"],key:"signals"}
];
let account=JSON.parse(localStorage.getItem(ACCOUNT_KEY)||"null"),answers={},index=0,selected="";
const hash=async v=>{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(v));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")};
const persist=()=>localStorage.setItem(ACCOUNT_KEY,JSON.stringify(account));
function expose(){window.metriaProfile=account?.profile||{};window.dispatchEvent(new CustomEvent("metria:profile",{detail:window.metriaProfile}));const n=document.querySelector("#twinName");if(n)n.textContent=window.metriaProfile.name?window.metriaProfile.name+" · living evidence twin":""}
function unlock(){sessionStorage.setItem(SESSION_KEY,"1");gate.hidden=true;expose()}
function showOnboarding(){accountStep.hidden=true;onboardStep.hidden=false;index=0;answers=account.profile||{};render()}
function render(){const item=questions[index];document.querySelector("#onboardTitle").textContent=item.title;document.querySelector("#onboardQuestion").textContent=item.q;document.querySelector("#onboardBar").style.width=((index+1)/questions.length*100)+"%";const box=document.querySelector("#onboardChoices");box.innerHTML="";selected="";item.choices.forEach(v=>{const b=document.createElement("button");b.textContent=v;b.onclick=()=>{selected=v;box.querySelectorAll("button").forEach(x=>x.classList.remove("selected"));b.classList.add("selected")};box.appendChild(b)});const input=document.querySelector("#onboardAnswer");input.value="";input.hidden=item.choices.length>0;input.placeholder=item.key==="name"?"Your preferred name":"Optional detail";document.querySelector("#onboardNext").textContent=index===questions.length-1?"Create my twin":"Continue"}
async function requestMotion(){try{if(typeof DeviceMotionEvent?.requestPermission==="function")return await DeviceMotionEvent.requestPermission()==="granted";return "DeviceMotionEvent"in window}catch{return false}}
document.querySelector("#onboardNext").onclick=async()=>{const item=questions[index],typed=document.querySelector("#onboardAnswer").value.trim();answers[item.key]=typed||selected||"Skipped";if(item.key==="signals"&&selected==="Enable local signals")answers.motionEnabled=await requestMotion();if(index<questions.length-1){index++;render();return}account.profile={...answers,onboardedAt:new Date().toISOString(),baselineVersion:1};persist();unlock()};
document.querySelector("#signUp").onclick=async()=>{const e=email.value.trim().toLowerCase(),p=pass.value;if(!e||p.length<4){message.textContent="Enter an email and a passcode of at least four characters.";return}if(account&&account.email!==e){message.textContent="A different local profile already exists on this device.";return}account={email:e,passHash:await hash(p),profile:account?.profile||null,createdAt:new Date().toISOString()};persist();account.profile?unlock():showOnboarding()};
document.querySelector("#logIn").onclick=async()=>{if(!account){message.textContent="No local profile exists yet. Choose Sign up.";return}if(email.value.trim().toLowerCase()!==account.email||await hash(pass.value)!==account.passHash){message.textContent="Email or passcode does not match this device’s profile.";return}account.profile?unlock():showOnboarding()};
if(account&&sessionStorage.getItem(SESSION_KEY)==="1")unlock();
else if(account){email.value=account.email;message.textContent="Unlock the profile stored on this device."}
const behavior=JSON.parse(localStorage.getItem("metriaBehaviorV1")||'{"taps":[],"keys":[],"sessions":[]}');let lastTap=0,lastKey=0,started=Date.now();
addEventListener("pointerdown",()=>{const now=performance.now();if(lastTap)behavior.taps.push(Math.min(5000,now-lastTap));lastTap=now;if(behavior.taps.length>120)behavior.taps.shift()},{passive:true});
addEventListener("keydown",()=>{const now=performance.now();if(lastKey)behavior.keys.push(Math.min(5000,now-lastKey));lastKey=now;if(behavior.keys.length>120)behavior.keys.shift()});
addEventListener("pagehide",()=>{behavior.sessions.push(Math.round((Date.now()-started)/1000));if(behavior.sessions.length>30)behavior.sessions.shift();localStorage.setItem("metriaBehaviorV1",JSON.stringify(behavior))});
})();
