import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const TWIN_KEY="metriaTwinState",AVATAR_KEY="metriaAvatarProfile",REMINDER_KEY="metriaReminderSettings";
const readTwin=()=>JSON.parse(localStorage.getItem(TWIN_KEY)||'{"answers":[],"days":[],"speech":[],"face":0}');
let avatarProfile=JSON.parse(localStorage.getItem(AVATAR_KEY)||"null");
let reminders=JSON.parse(localStorage.getItem(REMINDER_KEY)||'{"enabled":false,"time":"09:00","lastSent":null}');
const saveAvatar=()=>localStorage.setItem(AVATAR_KEY,JSON.stringify(avatarProfile));
const saveReminders=()=>localStorage.setItem(REMINDER_KEY,JSON.stringify(reminders));
const canvas=document.querySelector("#avatar3d");
const avatarStatus=document.querySelector("#avatarStatus");
const avatarProgress=document.querySelector("#avatarProgress");
const video=document.querySelector("#video");
const notifyButton=document.querySelector("#enableNotifications");
const notifyTime=document.querySelector("#notificationTime");
const notifyStatus=document.querySelector("#notificationStatus");
let frames=[],scene,camera,renderer,avatarGroup,dragging=false,lastX=0,targetRotation=0;

function colourSample(x,y,w,h,fallback){
  if(!video?.videoWidth)return fallback;
  const c=document.createElement("canvas");c.width=24;c.height=24;
  const ctx=c.getContext("2d",{willReadFrequently:true});
  try{
    ctx.drawImage(video,video.videoWidth*x,video.videoHeight*y,video.videoWidth*w,video.videoHeight*h,0,0,24,24);
    const d=ctx.getImageData(0,0,24,24).data;let r=0,g=0,b=0,n=0;
    for(let i=0;i<d.length;i+=4){const v=(d[i]+d[i+1]+d[i+2])/3;if(v>35&&v<235){r+=d[i];g+=d[i+1];b+=d[i+2];n++}}
    return n?"#"+[r/n,g/n,b/n].map(v=>Math.round(v).toString(16).padStart(2,"0")).join(""):fallback;
  }catch{return fallback}
}
const dist=(p,a,b)=>Math.hypot(p[a][0]-p[b][0],p[a][1]-p[b][1],(p[a][2]-p[b][2])*.6);
function averageFrames(){
  const count=frames.length,points=frames[0].length;
  return Array.from({length:points},(_,i)=>{
    let x=0,y=0,z=0;for(const frame of frames){x+=frame[i][0];y+=frame[i][1];z+=frame[i][2]}
    return [x/count,y/count,z/count];
  });
}
function profileFrom(points){
  const faceWidth=dist(points,234,454),faceHeight=dist(points,10,152)||.45;
  return {
    createdAt:new Date().toISOString(),
    skin:colourSample(.38,.34,.24,.28,"#c98968"),
    hair:colourSample(.34,.16,.32,.18,"#241a25"),
    width:Math.max(.82,Math.min(1.18,faceWidth/faceHeight*1.42)),
    length:Math.max(.9,Math.min(1.14,faceHeight/.48)),
    eyes:Math.max(.88,Math.min(1.14,dist(points,33,263)/faceWidth*2.18)),
    mouth:Math.max(.82,Math.min(1.18,dist(points,61,291)/faceWidth*2.7)),
    jaw:Math.max(.86,Math.min(1.12,dist(points,172,397)/faceWidth*1.42))
  };
}
function material(color,roughness=.48,metalness=.02){
  return new THREE.MeshPhysicalMaterial({color,roughness,metalness,clearcoat:.35,clearcoatRoughness:.35});
}
function mesh(geometry,mat,position=[0,0,0],scale=[1,1,1]){
  const m=new THREE.Mesh(geometry,mat);m.position.set(...position);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;avatarGroup.add(m);return m;
}
function renderAvatar(profile){
  if(!canvas)return;
  if(renderer)return
  scene=new THREE.Scene();
  camera=new THREE.PerspectiveCamera(34,1,.1,100);camera.position.set(0,.05,5.3);
  renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"high-performance"});
  renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
  avatarGroup=new THREE.Group();scene.add(avatarGroup);
  const skin=material(profile.skin),hair=material(profile.hair,.55),white=material("#f5f7ff",.28),iris=material("#445e78",.24),dark=material("#111525",.38),shirt=material("#5867e8",.42);
  mesh(new THREE.SphereGeometry(1,64,64),skin,[0,.35,0],[.86*profile.width,1.12*profile.length,.82]);
  mesh(new THREE.SphereGeometry(1.015,64,32,0,Math.PI*2,0,Math.PI*.47),hair,[0,.39,-.005],[.88*profile.width,1.15*profile.length,.84]);
  mesh(new THREE.SphereGeometry(.16,32,24),skin,[-.84*profile.width,.34,0],[.42,.8,.36]);
  mesh(new THREE.SphereGeometry(.16,32,24),skin,[.84*profile.width,.34,0],[.42,.8,.36]);
  const eyeX=.31*profile.eyes;
  for(const side of [-1,1]){
    mesh(new THREE.SphereGeometry(.155,32,24),white,[side*eyeX,.49,.76],[1.18,.58,.32]);
    mesh(new THREE.SphereGeometry(.072,24,20),iris,[side*eyeX,.49,.875],[1,.95,.42]);
    mesh(new THREE.SphereGeometry(.027,18,14),dark,[side*eyeX,.49,.91],[1,1,.5]);
    const brow=mesh(new THREE.CapsuleGeometry(.035,.22,8,16),hair,[side*eyeX,.68,.79],[1,1,1]);
    brow.rotation.z=side*.08;
  }
  const nose=mesh(new THREE.ConeGeometry(.105,.37,32),skin,[0,.18,.91],[1,1,1]);nose.rotation.x=Math.PI/2;
  const mouthCurve=new THREE.QuadraticBezierCurve3(new THREE.Vector3(-.24*profile.mouth,-.18,.82),new THREE.Vector3(0,-.25,.89),new THREE.Vector3(.24*profile.mouth,-.18,.82));
  mesh(new THREE.TubeGeometry(mouthCurve,32,.027,12,false),material("#8f3f52",.38));
  mesh(new THREE.CylinderGeometry(.3,.36,.58,48),skin,[0,-1.03,-.05],[1,1,1]);
  mesh(new THREE.SphereGeometry(1,48,32),shirt,[0,-1.64,-.18],[1.52*profile.jaw,.56,.64]);
  const rim=new THREE.DirectionalLight("#7288ff",3.2);rim.position.set(-3,2,3);scene.add(rim);
  const key=new THREE.DirectionalLight("#fff4e9",4.5);key.position.set(3,4,4);key.castShadow=true;scene.add(key);
  scene.add(new THREE.HemisphereLight("#dce9ff","#20182f",2.1));
  avatarGroup.rotation.x=-.03;
  const resize=()=>{const box=canvas.getBoundingClientRect(),w=Math.max(1,box.width),h=Math.max(1,box.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix()};resize();addEventListener("resize",resize);
  canvas.addEventListener("pointerdown",e=>{dragging=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)});
  canvas.addEventListener("pointermove",e=>{if(dragging){targetRotation+=(e.clientX-lastX)*.012;lastX=e.clientX}});
  canvas.addEventListener("pointerup",()=>dragging=false);
  const animate=()=>{if(!renderer)return;avatarGroup.rotation.y+=(targetRotation-avatarGroup.rotation.y)*.08;if(!dragging)targetRotation+=.002;renderer.render(scene,camera);requestAnimationFrame(animate)};animate();
  avatarStatus.textContent="Your locally generated 3D twin";
  avatarProgress.textContent="Drag to rotate · built from a multi-frame scan";
  canvas.closest(".avatar-stage")?.classList.add("ready");
}
window.addEventListener("metria:face-landmarks",event=>{
  if(avatarProfile||frames.length>=36)return;
  const landmarks=event.detail;if(!landmarks?.length)return;
  frames.push(landmarks.map(p=>[p.x,p.y,p.z||0]));
  const pct=Math.round(frames.length/36*100);
  avatarStatus.textContent="Building your 3D twin · "+pct+"%";
  avatarProgress.textContent="Keep your face centred and turn slightly left and right";
  if(frames.length===36){
    avatarProfile=profileFrom(averageFrames());saveAvatar();renderAvatar(avatarProfile);
    document.querySelector("#videoLabel").textContent="3D twin generated locally · camera may be stopped";
  }
});
if(avatarProfile)renderAvatar(avatarProfile);

function dailyCopy(){
  const answers=(readTwin().answers||[]).slice(-7);
  if(!answers.length)return{title:"Your Metria check-in is ready",body:"Add a 60-second signal for sleep, energy, mood and routine."};
  const domains=[...new Set(answers.map(a=>a.domain).filter(Boolean))].slice(0,3);
  return{title:"Your daily Metria update",body:"Review your recent "+(domains.length?domains.join(", "):"wellness")+" pattern and add today's signal."};
}
async function showDailyNotification(){
  if(!("serviceWorker"in navigator)||!("Notification"in window)||Notification.permission!=="granted")return;
  const reg=await navigator.serviceWorker.ready,copy=dailyCopy();
  await reg.showNotification(copy.title,{body:copy.body,icon:"icon.svg?v=2",badge:"icon.svg?v=2",tag:"metria-daily",renotify:false,data:{url:"app.html#daily"}});
  if("setAppBadge"in navigator)navigator.setAppBadge(1).catch(()=>{});
  reminders.lastSent=new Date().toISOString().slice(0,10);saveReminders();
}
function nextDue(time){
  const [h,m]=time.split(":").map(Number),d=new Date();d.setHours(h,m,0,0);if(d<=new Date())d.setDate(d.getDate()+1);return d;
}
let reminderTimer;
async function scheduleReminder(){
  clearTimeout(reminderTimer);
  if(!reminders?.enabled)return;
  const due=nextDue(reminders.time||"09:00");
  notifyStatus.textContent="Next reminder: "+due.toLocaleString([],{weekday:"short",hour:"2-digit",minute:"2-digit"});
  reminderTimer=setTimeout(async()=>{await showDailyNotification();scheduleReminder()},Math.min(due-Date.now(),2147483647));
  try{
    const reg=await navigator.serviceWorker.ready;
    if("periodicSync"in reg){await reg.periodicSync.register("metria-daily",{minInterval:24*60*60*1000})}else{notifyStatus.textContent="Reminder enabled. On iPhone, open Metria daily to guarantee delivery; background push requires a connected push service."}
  }catch{}
}
if(reminders?.time)notifyTime.value=reminders.time;
if(reminders?.enabled){notifyButton.textContent="Daily reminders enabled";scheduleReminder()}
notifyTime.addEventListener("change",()=>{reminders={...(reminders||{}),time:notifyTime.value};saveReminders();scheduleReminder()});
notifyButton.addEventListener("click",async()=>{
  if(!("Notification"in window)){notifyStatus.textContent="Notifications require an installed, supported PWA.";return}
  const permission=await Notification.requestPermission();
  if(permission!=="granted"){notifyStatus.textContent="Notifications are blocked in device settings.";return}
  reminders={enabled:true,time:notifyTime.value||"09:00",lastSent:reminders?.lastSent||null};saveReminders();
  notifyButton.textContent="Daily reminders enabled";
  notifyStatus.textContent="Notifications enabled. Metria will keep lock-screen text privacy-safe.";
  await showDailyNotification();scheduleReminder();
});
document.addEventListener("visibilitychange",()=>{
  if(document.visibilityState!=="visible"||!reminders?.enabled)return;
  const today=new Date().toISOString().slice(0,10),[h,m]=(reminders.time||"09:00").split(":").map(Number),now=new Date();
  if(reminders.lastSent!==today&&(now.getHours()>h||(now.getHours()===h&&now.getMinutes()>=m)))showDailyNotification();
  if("clearAppBadge"in navigator)navigator.clearAppBadge().catch(()=>{});
});
