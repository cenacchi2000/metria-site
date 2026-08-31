const contactForm = document.querySelector('#contactForm');
contactForm?.addEventListener('submit', (event) => {
  event.preventDefault();
  const name = document.querySelector('#contactName').value.trim();
  const email = document.querySelector('#contactEmail').value.trim();
  const message = document.querySelector('#contactMessage').value.trim();
  const subject = `Metria conversation from ${name}`;
  const body = `Hi Metria team,\n\nMy name is ${name}.\nMy email is ${email}.\n\n${message}\n\nI understand this is an exploratory conversation and have not included confidential medical information.`;
  const gmail = `https://mail.google.com/mail/?view=cm&fs=1&to=hello%40metria.ai&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  window.open(gmail, '_blank', 'noopener');
});
