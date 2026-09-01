const REMINDER_KEY="metriaReminderSettings";
let reminders=JSON.parse(localStorage.getItem(REMINDER_KEY)||'{"enabled":false,"time":"09:00","lastSent":null}');
const button=document.querySelector("#enableNotifications"),time=document.querySelector("#notificationTime"),status=document.querySelector("#notificationStatus");
const save=()=>localStorage.setItem(REMINDER_KEY,JSON.stringify(reminders));
function copy(){return{title:"Your Metria baseline check-in",body:"Add a short signal and review whether your personal pattern is changing."}}
async function notify(){if(!("serviceWorker"in navigator)||!("Notification"in window)||Notification.permission!=="granted")return;const reg=await navigator.serviceWorker.ready,c=copy();await reg.showNotification(c.title,{body:c.body,icon:"icon.svg?v=2",badge:"icon.svg?v=2",tag:"metria-daily",data:{url:"app.html#daily"}});reminders.lastSent=new Date().toISOString().slice(0,10);save()}
function nextDue(value){const[h,m]=value.split(":").map(Number),d=new Date();d.setHours(h,m,0,0);if(d<=new Date())d.setDate(d.getDate()+1);return d}
let timer;function schedule(){clearTimeout(timer);if(!reminders.enabled)return;const due=nextDue(reminders.time||"09:00");status.textContent="Next reminder: "+due.toLocaleString([],{weekday:"short",hour:"2-digit",minute:"2-digit"});timer=setTimeout(async()=>{await notify();schedule()},Math.min(due-Date.now(),2147483647))}
if(reminders.time)time.value=reminders.time;if(reminders.enabled){button.textContent="Reminders enabled";schedule()}
time.onchange=()=>{reminders.time=time.value;save();schedule()};
button.onclick=async()=>{if(!("Notification"in window)){status.textContent="Install Metria to enable notifications.";return}if(await Notification.requestPermission()!=="granted"){status.textContent="Notifications are blocked in device settings.";return}reminders={enabled:true,time:time.value||"09:00",lastSent:reminders.lastSent||null};save();button.textContent="Reminders enabled";await notify();schedule()};
