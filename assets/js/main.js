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

document.querySelectorAll("[data-review-carousel]").forEach((carousel) => {
  const track = carousel.querySelector("[data-review-track]");
  const seenReviews = new Set();
  const cards = Array.from(carousel.querySelectorAll(".google-review-card")).filter((card) => {
    const reviewer = card.querySelector("strong")?.textContent.trim().toLowerCase() || "";
    const reviewText = card.querySelector("p")?.textContent.trim().replace(/\s+/g, " ").toLowerCase() || "";
    const reviewKey = `${reviewer}|${reviewText}`;

    if (seenReviews.has(reviewKey)) {
      card.remove();
      return false;
    }

    seenReviews.add(reviewKey);
    return true;
  });
  const previousButton = carousel.querySelector("[data-review-prev]");
  const nextButton = carousel.querySelector("[data-review-next]");
  const autoSlideInterval = 4500;
  const manualPauseDuration = autoSlideInterval * 2;
  let currentIndex = 0;
  let autoSlideTimer = 0;
  let manualPauseTimer = 0;
  let isPointerPaused = false;
  let isFocusPaused = false;
  let isManualPaused = false;

  if (!track || cards.length === 0 || !previousButton || !nextButton) return;

  function getVisibleCount() {
    const value = Number.parseInt(
      getComputedStyle(carousel).getPropertyValue("--reviews-visible"),
      10
    );

    return Number.isNaN(value) ? 1 : value;
  }

  function getMaxStartIndex() {
    const visibleCount = getVisibleCount();
    return Math.max(0, Math.floor((cards.length - 1) / visibleCount) * visibleCount);
  }

  function getGroupStart(index) {
    const visibleCount = getVisibleCount();
    return Math.min(Math.floor(Math.max(index, 0) / visibleCount) * visibleCount, getMaxStartIndex());
  }

  function getSlideDistance() {
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function updateCarousel(snapToGroup = false) {
    const maxIndex = getMaxStartIndex();
    currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);
    if (snapToGroup) currentIndex = getGroupStart(currentIndex);
    track.style.transform = `translateX(-${currentIndex * getSlideDistance()}px)`;
    previousButton.disabled = maxIndex === 0;
    nextButton.disabled = maxIndex === 0;
  }

  function stopAutoSlide() {
    window.clearInterval(autoSlideTimer);
    autoSlideTimer = 0;
  }

  function startAutoSlide() {
    const maxIndex = getMaxStartIndex();

    stopAutoSlide();
    if (maxIndex === 0 || isPointerPaused || isFocusPaused || isManualPaused) return;

    autoSlideTimer = window.setInterval(() => {
      currentIndex = currentIndex >= maxIndex ? 0 : Math.min(getGroupStart(currentIndex) + getVisibleCount(), maxIndex);
      updateCarousel();
    }, autoSlideInterval);
  }

  function pauseAfterManualMove() {
    isManualPaused = true;
    stopAutoSlide();
    window.clearTimeout(manualPauseTimer);
    manualPauseTimer = window.setTimeout(() => {
      isManualPaused = false;
      startAutoSlide();
    }, manualPauseDuration);
  }

  previousButton.addEventListener("click", () => {
    const maxIndex = getMaxStartIndex();
    currentIndex = currentIndex <= 0 ? maxIndex : Math.max(getGroupStart(currentIndex) - getVisibleCount(), 0);
    updateCarousel();
    pauseAfterManualMove();
  });

  nextButton.addEventListener("click", () => {
    const maxIndex = getMaxStartIndex();
    currentIndex = currentIndex >= maxIndex ? 0 : Math.min(getGroupStart(currentIndex) + getVisibleCount(), maxIndex);
    updateCarousel();
    pauseAfterManualMove();
  });

  carousel.addEventListener("mouseenter", () => {
    isPointerPaused = true;
    stopAutoSlide();
  });

  carousel.addEventListener("mouseleave", () => {
    isPointerPaused = false;
    startAutoSlide();
  });

  carousel.addEventListener("focusin", () => {
    isFocusPaused = true;
    stopAutoSlide();
  });

  carousel.addEventListener("focusout", () => {
    isFocusPaused = false;
    startAutoSlide();
  });

  window.addEventListener("resize", () => {
    updateCarousel(true);
    startAutoSlide();
  });

  updateCarousel();
  startAutoSlide();
});

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
