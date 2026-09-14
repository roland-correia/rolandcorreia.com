// Footer year — avoids hand-editing a copyright date every January
document.getElementById("year").textContent = new Date().getFullYear();

// Email is assembled here instead of written as mailto:user@domain in the
// HTML source — keeps it off simple scrapers that regex raw HTML for an
// "@" pattern, without adding a contact form or any backend. Not proof
// against a targeted attacker reading this file, just against mass
// harvesting bots, which is the actual threat for a public portfolio.
const emailCard = document.getElementById("email-card");
if (emailCard) {
  const user = emailCard.dataset.mailtoUser;
  const domain = emailCard.dataset.mailtoDomain;
  const address = `${user}@${domain}`;
  emailCard.href = `mailto:${address}`;
  document.getElementById("email-value").textContent = address;
}
