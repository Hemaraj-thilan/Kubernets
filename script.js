// Replace this link with your shared doc URL if needed
const SHARED_DOC_URL = "https://share.google/nteB4RYpGPDXZMHsM";

// Buttons: open the document in a new tab (or new window)
document.getElementById("openDoc").addEventListener("click", () => {
  window.open(SHARED_DOC_URL, "_blank", "noopener,noreferrer");
});

document.getElementById("downloadDoc").addEventListener("click", () => {
  window.open(SHARED_DOC_URL, "_blank", "noopener,noreferrer,width=900,height=700");
});

// Form handling
const form = document.getElementById("contactForm");
const feedback = document.getElementById("formFeedback");
const savedConfirmation = document.getElementById("savedConfirmation");
const clearBtn = document.getElementById("clearBtn");

// Utility: simple phone validation
function isValidPhone(phone) {
  const cleaned = phone.replace(/[ \-\(\)]/g, "");
  return /^[+0-9]{7,15}$/.test(cleaned);
}

function showSavedConfirmation(data) {
  savedConfirmation.style.display = "block";
  savedConfirmation.textContent = `Appointment requested for ${data.name} on ${data.date} at ${data.time}. We'll contact via ${data.email}.`;
}

// Load last-saved appointment (if any)
(function loadSaved() {
  try {
    const saved = localStorage.getItem("advocate_last_appointment");
    if (saved) {
      const parsed = JSON.parse(saved);
      showSavedConfirmation(parsed);
    }
  } catch (e) {
    console.warn("Could not read saved appointment", e);
  }
})();

form.addEventListener("submit", (ev) => {
  ev.preventDefault();
  feedback.textContent = "";

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const phone = document.getElementById("phone").value.trim();
  const date = document.getElementById("date").value;
  const time = document.getElementById("time").value;
  const message = document.getElementById("message").value.trim();

  // Basic validation
  if (!name || !email || !phone || !date || !time) {
    feedback.textContent = "Please fill all required fields (name, email, phone, date & time).";
    return;
  }
  if (!isValidPhone(phone)) {
    feedback.textContent = "Please enter a valid phone number (digits, + allowed).";
    return;
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    feedback.textContent = "Please enter a valid email address.";
    return;
  }

  // Compose appointment object
  const appointment = {
    name, email, phone, date, time, message, createdAt: new Date().toISOString()
  };

  // Save locally
  try {
    localStorage.setItem("advocate_last_appointment", JSON.stringify(appointment));
  } catch (e) {
    console.warn("localStorage set failed", e);
  }

  // Show confirmation and clear form
  showSavedConfirmation(appointment);
  feedback.textContent = "Appointment request saved locally.";
  form.reset();
});

clearBtn.addEventListener("click", () => {
  form.reset();
  feedback.textContent = "";
});

// Accessibility: click avatar to open doc
document.querySelector(".avatar").addEventListener("click", () => {
  window.open(SHARED_DOC_URL, "_blank", "noopener,noreferrer");
});
