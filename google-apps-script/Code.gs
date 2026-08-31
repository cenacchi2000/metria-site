/**
 * Metria contact endpoint. Deploy this script as a Web app from the
 * Google account that should receive the messages.
 */
const RECIPIENT = 'filo.cenacchi@gmail.com';

function doPost(e) {
  const data = e && e.parameter ? e.parameter : {};
  const name = String(data.name || 'Website visitor').slice(0, 200);
  const email = String(data.email || '').slice(0, 320);
  const message = String(data.message || '').slice(0, 10000);
  if (!email || !message) return json({ok:false, error:'Missing email or message'});
  MailApp.sendEmail({
    to: RECIPIENT,
    replyTo: email,
    subject: `Metria conversation from ${name}`,
    htmlBody: `<p><strong>From:</strong> ${escapeHtml(name)}</p><p><strong>Email:</strong> ${escapeHtml(email)}</p><hr><p>${escapeHtml(message).replace(/\n/g, '<br>')}</p><p><em>Sent through the Metria website.</em></p>`,
    body: `From: ${name}\nEmail: ${email}\n\n${message}\n\nSent through the Metria website.`
  });
  return json({ok:true});
}

function escapeHtml(value) {
  return value.replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
}

function json(payload) {
  return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON);
}
