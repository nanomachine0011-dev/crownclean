const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector(".nav-links");

// WhatsApp Business auto-replies cannot be configured from this static site.
// Set them manually in the WhatsApp Business app:
// Greeting: "Hi [wave emoji] thanks for contacting DepositReady Clean.
// Are you looking for end of tenancy, Airbnb or regular home cleaning?"
// Quick replies: End of tenancy clean; Airbnb turnover; Regular cleaning; Get a quote.

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

const currentPage = window.location.pathname.split("/").pop() || "index.html";
document.querySelectorAll(".nav-links a").forEach((link) => {
  const href = link.getAttribute("href");
  if (href === currentPage || (currentPage === "" && href === "index.html")) {
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

      console.log("sending request");

      const res = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      console.log("response:", res);

      if (res.ok === true) {
        if (success) success.classList.add("visible");
        form.reset();
      } else {
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
