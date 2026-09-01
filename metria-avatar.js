import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.180.0/build/three.module.js";

const TWIN_KEY="metriaTwinState",AVATAR_KEY="metriaAvatarProfileV2",REMINDER_KEY="metriaReminderSettings";
const readTwin=()=>JSON.parse(localStorage.getItem(TWIN_KEY)||'{"answers":[],"days":[],"speech":[],"face":0}');
let profile=JSON.parse(localStorage.getItem(AVATAR_KEY)||"null");
let reminders=JSON.parse(localStorage.getItem(REMINDER_KEY)||'{"enabled":false,"time":"09:00","lastSent":null}');
const canvas=document.querySelector("#avatar3d"),statusEl=document.querySelector("#avatarStatus"),progressEl=document.querySelector("#avatarProgress"),video=document.querySelector("#video");
let frames=[],renderer,scene,camera,head,drag=false,lastX=0,targetY=0;

function sampleColour(x,y,w,h,fallback){
  if(!video?.videoWidth)return fallback;
  const c=document.createElement("canvas");c.width=32;c.height=32;const ctx=c.getContext("2d",{willReadFrequently:true});
  try{ctx.drawImage(video,video.videoWidth*x,video.videoHeight*y,video.videoWidth*w,video.videoHeight*h,0,0,32,32);const d=ctx.getImageData(0,0,32,32).data;let r=0,g=0,b=0,n=0;
    for(let i=0;i<d.length;i+=4){const light=(d[i]+d[i+1]+d[i+2])/3;if(light>30&&light<240){r+=d[i];g+=d[i+1];b+=d[i+2];n++}}
    return n?"#"+[r/n,g/n,b/n].map(v=>Math.round(v).toString(16).padStart(2,"0")).join(""):fallback;
  }catch{return fallback}
}
const distance=(p,a,b)=>Math.hypot(p[a][0]-p[b][0],p[a][1]-p[b][1],(p[a][2]-p[b][2])*.55);
function averageFrames(){return frames[0].map((_,i)=>{let x=0,y=0,z=0;for(const f of frames){x+=f[i][0];y+=f[i][1];z+=f[i][2]}return[x/frames.length,y/frames.length,z/frames.length]})}
function buildProfile(p){
  const fw=distance(p,234,454),fh=distance(p,10,152)||.45;
  return{createdAt:new Date().toISOString(),skin:sampleColour(.38,.32,.24,.32,"#b9785d"),hair:sampleColour(.34,.1,.32,.2,"#211b20"),width:Math.max(.82,Math.min(1.2,fw/fh*1.42)),length:Math.max(.9,Math.min(1.17,fh/.48)),eyes:Math.max(.88,Math.min(1.13,distance(p,33,263)/fw*2.18)),mouth:Math.max(.84,Math.min(1.16,distance(p,61,291)/fw*2.7)),jaw:Math.max(.86,Math.min(1.13,distance(p,172,397)/fw*1.42))};
}
function physical(color,roughness=.48){return new THREE.MeshPhysicalMaterial({color,roughness,metalness:0,clearcoat:.22,clearcoatRoughness:.48})}
function denseHeadGeometry(p){
  const g=new THREE.SphereGeometry(1,255,191); // 49,152 vertices: dense full cranium prior
  const pos=g.attributes.position;
  for(let i=0;i<pos.count;i++){
    let x=pos.getX(i),y=pos.getY(i),z=pos.getZ(i);
    const front=Math.max(0,z),lower=Math.max(0,-y),jawTaper=1-lower*.18*(2-p.jaw);
    x*=.82*p.width*jawTaper;y*=1.08*p.length;z*=.84;
    if(front>.12){
      const nose=Math.exp(-(x*x/0.025+(y-.06)*(y-.06)/.075))*front;
      const brow=Math.exp(-(x*x/0.18+(y-.34)*(y-.34)/.035))*front;
      const leftEye=Math.exp(-((x+.255*p.eyes)**2/.016+(y-.25)**2/.011))*front;
      const rightEye=Math.exp(-((x-.255*p.eyes)**2/.016+(y-.25)**2/.011))*front;
      const philtrum=Math.exp(-(x*x/.012+(y+.08)**2/.025))*front;
      const lips=Math.exp(-(x*x/(.12*p.mouth)+(y+.23)**2/.008))*front;
      const chin=Math.exp(-(x*x/.12+(y+.55)**2/.05))*front;
      z+=nose*.31+brow*.035-(leftEye+rightEye)*.035-philtrum*.025+lips*.045+chin*.055;
      x*=1+Math.exp(-(y+.1)*(y+.1)/.3)*.025;
    }
    pos.setXYZ(i,x,y,z);
  }
  g.computeVertexNormals();return g;
}
function addMesh(parent,geometry,material,position=[0,0,0],scale=[1,1,1]){
  const m=new THREE.Mesh(geometry,material);m.position.set(...position);m.scale.set(...scale);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;
}
function makeSkinTexture(base){
  const c=document.createElement("canvas");c.width=512;c.height=512;const x=c.getContext("2d");
  const grad=x.createRadialGradient(230,190,20,256,270,340);grad.addColorStop(0,"#ffd7c4");grad.addColorStop(.45,base);grad.addColorStop(1,"#5e3540");x.fillStyle=grad;x.fillRect(0,0,512,512);
  x.globalAlpha=.055;for(let i=0;i<4500;i++){x.fillStyle=i%3?"#fff":"#6b2934";x.fillRect(Math.random()*512,Math.random()*512,1,1)}
  const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;return t;
}
function renderAvatar(p){
  if(!canvas||renderer)return;
  scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(31,1,.1,100);camera.position.set(0,.03,4.45);
  renderer=new THREE.WebGLRenderer({canvas,alpha:true,antialias:true,powerPreference:"high-performance"});renderer.setPixelRatio(Math.min(devicePixelRatio||1,2));renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.shadowMap.enabled=true;
  head=new THREE.Group();scene.add(head);
  const skinMat=physical(p.skin,.5);skinMat.map=makeSkinTexture(p.skin);skinMat.needsUpdate=true;
  addMesh(head,denseHeadGeometry(p),skinMat,[0,.16,0]);
  const earGeo=new THREE.TorusGeometry(.14,.055,28,72);for(const side of [-1,1]){const ear=addMesh(head,earGeo,skinMat,[side*.83*p.width,.18,-.015],[.78,1.45,.62]);ear.rotation.y=Math.PI/2}
  const eyeWhite=physical("#f5f0e9",.32),iris=physical("#526b70",.3),pupil=physical("#111217",.28);const eyeX=.245*p.eyes;
  for(const side of [-1,1]){addMesh(head,new THREE.SphereGeometry(.12,48,32),eyeWhite,[side*eyeX,.42,.78],[1.28,.62,.34]);addMesh(head,new THREE.SphereGeometry(.052,36,24),iris,[side*eyeX,.42,.855],[1,.95,.35]);addMesh(head,new THREE.SphereGeometry(.021,24,16),pupil,[side*eyeX,.42,.878],[1,1,.28])}
  const hair=physical(p.hair,.63);const scalp=new THREE.Mesh(new THREE.SphereGeometry(1.006,160,96,0,Math.PI*2,0,Math.PI*.48),hair);scalp.position.y=.17;scalp.scale.set(.83*p.width,1.09*p.length,.85);head.add(scalp);
  addMesh(head,new THREE.CylinderGeometry(.25,.31,.52,96),skinMat,[0,-.93,-.05]);
  addMesh(head,new THREE.SphereGeometry(1,128,64),physical("#3747ad",.58),[0,-1.52,-.18],[1.35,.48,.6]);
  const key=new THREE.DirectionalLight("#fff2e6",4.8);key.position.set(3,4,4);key.castShadow=true;scene.add(key);const fill=new THREE.DirectionalLight("#8aa5ff",3);fill.position.set(-3,1,3);scene.add(fill);const rim=new THREE.DirectionalLight("#d2a7ff",2.2);rim.position.set(1,2,-4);scene.add(rim);scene.add(new THREE.HemisphereLight("#dce8ff","#18131f",1.7));
  const resize=()=>{const b=canvas.getBoundingClientRect();renderer.setSize(Math.max(1,b.width),Math.max(1,b.height),false);camera.aspect=b.width/b.height;camera.updateProjectionMatrix()};resize();addEventListener("resize",resize);
  canvas.onpointerdown=e=>{drag=true;lastX=e.clientX;canvas.setPointerCapture(e.pointerId)};canvas.onpointermove=e=>{if(drag){targetY+=(e.clientX-lastX)*.012;lastX=e.clientX}};canvas.onpointerup=()=>drag=false;
  (function animate(){head.rotation.y+=(targetY-head.rotation.y)*.075;if(!drag)targetY+=.0015;renderer.render(scene,camera);requestAnimationFrame(animate)})();
  statusEl.textContent="Dense full-head visual twin ready";progressEl.textContent="49,152 vertices · drag to inspect the predicted cranium and ears";
}
window.addEventListener("metria:face-landmarks",event=>{
  if(profile||frames.length>=48||!event.detail?.length)return;frames.push(event.detail.map(p=>[p.x,p.y,p.z||0]));
  const pct=Math.round(frames.length/48*100);statusEl.textContent="Reconstructing your head · "+pct+"%";progressEl.textContent="Turn slightly left and right, then face forward";
  if(frames.length===48){profile=buildProfile(averageFrames());localStorage.setItem(AVATAR_KEY,JSON.stringify(profile));renderAvatar(profile);document.querySelector("#videoLabel").textContent="Scan complete · inspect your 3D result below"}
});
if(profile)renderAvatar(profile);

const notifyButton=document.querySelector("#enableNotifications"),notifyTime=document.querySelector("#notificationTime"),notifyStatus=document.querySelector("#notificationStatus");
const saveReminders=()=>localStorage.setItem(REMINDER_KEY,JSON.stringify(reminders));
function dailyCopy(){const a=(readTwin().answers||[]).slice(-7);const domains=[...new Set(a.map(v=>v.domain).filter(Boolean))].slice(0,3);return{title:"Your Metria check-in is ready",body:a.length?"Review your recent "+domains.join(", ")+" pattern and add today’s signal.":"Add a 60-second signal for sleep, energy, mood and routine."}}
async function showNotification(){if(!("serviceWorker"in navigator)||!("Notification"in window)||Notification.permission!=="granted")return;const reg=await navigator.serviceWorker.ready,c=dailyCopy();await reg.showNotification(c.title,{body:c.body,icon:"icon.svg?v=2",badge:"icon.svg?v=2",tag:"metria-daily",data:{url:"app.html#daily"}});reminders.lastSent=new Date().toISOString().slice(0,10);saveReminders()}
function nextDue(time){const[h,m]=time.split(":").map(Number),d=new Date();d.setHours(h,m,0,0);if(d<=new Date())d.setDate(d.getDate()+1);return d}
let timer;async function schedule(){clearTimeout(timer);if(!reminders.enabled)return;const due=nextDue(reminders.time||"09:00");notifyStatus.textContent="Next reminder: "+due.toLocaleString([],{weekday:"short",hour:"2-digit",minute:"2-digit"});timer=setTimeout(async()=>{await showNotification();schedule()},Math.min(due-Date.now(),2147483647))}
if(reminders.time)notifyTime.value=reminders.time;if(reminders.enabled){notifyButton.textContent="Reminders enabled";schedule()}
notifyTime.onchange=()=>{reminders.time=notifyTime.value;saveReminders();schedule()};
notifyButton.onclick=async()=>{if(!("Notification"in window)){notifyStatus.textContent="Install Metria to enable notifications.";return}if(await Notification.requestPermission()!=="granted"){notifyStatus.textContent="Notifications are blocked in device settings.";return}reminders={enabled:true,time:notifyTime.value||"09:00",lastSent:reminders.lastSent||null};saveReminders();notifyButton.textContent="Reminders enabled";await showNotification();schedule()};

