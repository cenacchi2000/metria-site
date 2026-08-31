// Replace this value with the /exec URL produced when you deploy Code.gs.
const APPS_SCRIPT_ENDPOINT = 'PASTE_YOUR_GOOGLE_APPS_SCRIPT_EXEC_URL_HERE';
const contactForm = document.querySelector('#contactForm');

contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const button = document.querySelector('#sendButton');
  const status = document.querySelector('#formStatus');
  if (APPS_SCRIPT_ENDPOINT.includes('PASTE_YOUR')) {
    status.textContent = 'The contact endpoint still needs to be connected. Deploy the included Google Apps Script and paste its /exec URL into contact.js.';
    status.classList.add('error');
    return;
  }
  button.disabled = true;
  button.textContent = 'Sending…';
  const deliveryFrame = document.querySelector('#deliveryFrame') || Object.assign(document.createElement('iframe'), {id:'deliveryFrame',name:'deliveryFrame',hidden:true});
  document.body.appendChild(deliveryFrame);
  const deliveryForm = document.createElement('form');
  deliveryForm.method = 'POST'; deliveryForm.action = APPS_SCRIPT_ENDPOINT; deliveryForm.target = 'deliveryFrame'; deliveryForm.hidden = true;
  [['name','contactName'],['email','contactEmail'],['message','contactMessage']].forEach(([key,id]) => { const field=document.createElement('input'); field.name=key; field.value=document.querySelector(`#${id}`).value.trim(); deliveryForm.appendChild(field); });
  document.body.appendChild(deliveryForm); deliveryForm.submit(); deliveryForm.remove();
  window.setTimeout(() => { status.textContent = 'Message sent to the Metria representative. You will receive a reply by email.'; status.classList.remove('error'); status.classList.add('success'); contactForm.reset(); button.textContent = 'Message sent ✓'; }, 900);
});
