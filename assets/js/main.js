const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector(".nav-links");

// WhatsApp Business auto-replies cannot be configured from this static site.
// Set them manually in the WhatsApp Business app:
// Greeting: "Hi 👋 thanks for contacting DepositReady Clean.
// Are you looking for end of tenancy, Airbnb or regular home cleaning?"
// Quick replies: End of tenancy clean; Airbnb turnover; Regular cleaning; Get a price.

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
    }
  });
}

function normalizePath(value) {
  const url = new URL(value, window.location.origin);
  let path = url.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");

  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  return path || "/";
}

const currentPage = normalizePath(window.location.pathname);
const servicePages = new Set([
  "/airbnb-cleaning",
  "/carpet-cleaning",
  "/deep-cleaning",
  "/end-of-tenancy-cleaning",
  "/end-of-tenancy-cleaning-birmingham",
  "/regular-cleaning",
]);
document.querySelectorAll(".nav-links a").forEach((link) => {
  const href = normalizePath(link.getAttribute("href"));
  const isServiceChild = href === "/services" && servicePages.has(currentPage);

  if (href === currentPage || isServiceChild) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

const revealItems = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("visible"));
}

const GOOGLE_ADS_CONVERSION_ID = "AW-18139524774";
const GOOGLE_ADS_LEAD_FORM_CONVERSION_LABEL = "HbBlCK-bvKccEKbdzMlD";
const GOOGLE_ADS_LEAD_FORM_SEND_TO = `${GOOGLE_ADS_CONVERSION_ID}/${GOOGLE_ADS_LEAD_FORM_CONVERSION_LABEL}`;

function trackLeadFormConversion() {
  if (typeof window.gtag !== "function") return;

  window.gtag("event", "conversion", {
    send_to: GOOGLE_ADS_LEAD_FORM_SEND_TO,
    value: 1.0,
    currency: "GBP",
  });
}

document.querySelectorAll("[data-form]").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const success = form.querySelector(".form-success");
    const error = form.querySelector(".form-error");
    const submitButton = form.querySelector('button[type="submit"]');

    if (success) success.classList.remove("visible");
    if (error) error.classList.remove("visible");

    if (!form.checkValidity()) {
      form.reportValidity();
      return;
    }

    const formData = new FormData(form);
    const fields = Object.fromEntries(formData.entries());
    const payload = {
      name: String(fields.name || "").trim(),
      phone: String(fields.phone || "").trim(),
      message: String(fields.message || "").trim(),
      source: form.dataset.source || document.title,
      fields,
    };

    if (!payload.name || !payload.phone || !payload.message) {
      if (error) error.classList.add("visible");
      return;
    }

    try {
      form.classList.add("is-sending");
      if (submitButton) submitButton.disabled = true;

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok === true) {
        trackLeadFormConversion();
        if (success) success.classList.add("visible");
        form.reset();
      } else {
        const data = await res.json().catch(() => ({}));
        if (error) error.classList.add("visible");
        console.error("contact form error:", data);
      }
    } catch (err) {
      if (error) error.classList.add("visible");
      console.error("contact form request failed:", err);
    } finally {
      form.classList.remove("is-sending");
      if (submitButton) submitButton.disabled = false;
    }
  });
});
