const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector(".nav-links");
const commercialDropdowns = Array.from(document.querySelectorAll(".nav-dropdown"));
const mobileNavQuery = window.matchMedia("(max-width: 820px)");

if (window.location.protocol === "file:") {
  const routeMap = new Map([
    ["/", "index.html"],
    ["/services", "services.html"],
    ["/prices", "prices.html"],
    ["/locations", "locations.html"],
    ["/end-of-tenancy-cleaning", "end-of-tenancy-cleaning.html"],
    ["/deep-cleaning", "deep-cleaning.html"],
    ["/after-builders-cleaning", "after-builders-cleaning.html"],
    ["/carpet-cleaning", "carpet-cleaning.html"],
    ["/airbnb-turnover-cleaning", "airbnb-turnover-cleaning.html"],
    ["/commercial-cleaning", "commercial-cleaning.html"],
    ["/office-cleaning", "office-cleaning.html"],
    ["/end-of-tenancy-cleaning-birmingham", "end-of-tenancy-cleaning-birmingham.html"],
    ["/after-builders-cleaning-birmingham", "after-builders-cleaning-birmingham.html"],
    ["/deep-cleaning-birmingham", "deep-cleaning-birmingham.html"],
    ["/carpet-cleaning-birmingham", "carpet-cleaning-birmingham.html"],
    ["/airbnb-cleaning-birmingham", "airbnb-cleaning-birmingham.html"],
    ["/commercial-cleaning-birmingham", "commercial-cleaning-birmingham.html"],
    ["/office-cleaning-birmingham", "office-cleaning-birmingham.html"],
    ["/communal-area-cleaning-birmingham", "communal-area-cleaning-birmingham.html"],
    ["/retail-cleaning-birmingham", "retail-cleaning-birmingham.html"],
    ["/commercial-deep-cleaning-birmingham", "commercial-deep-cleaning-birmingham.html"],
    ["/religious-facility-cleaning-birmingham", "religious-facility-cleaning-birmingham.html"],
    ["/healthcare-cleaning-birmingham", "healthcare-cleaning-birmingham.html"],
    ["/school-cleaning-birmingham", "school-cleaning-birmingham.html"],
    ["/gym-cleaning-birmingham", "gym-cleaning-birmingham.html"],
    ["/restaurant-cleaning-birmingham", "restaurant-cleaning-birmingham.html"],
    ["/commercial-carpet-cleaning-birmingham", "commercial-carpet-cleaning-birmingham.html"],
    ["/cleaning-services-birmingham", "cleaning-services-birmingham.html"],
    ["/cleaning-services-edgbaston", "cleaning-services-edgbaston.html"],
    ["/cleaning-services-harborne", "cleaning-services-harborne.html"],
    ["/cleaning-services-moseley", "cleaning-services-moseley.html"],
    ["/cleaning-services-kings-heath", "cleaning-services-kings-heath.html"],
    ["/cleaning-services-solihull", "cleaning-services-solihull.html"],
    ["/cleaning-services-sutton-coldfield", "cleaning-services-sutton-coldfield.html"],
    ["/cleaning-services-birmingham-city-centre", "cleaning-services-birmingham-city-centre.html"],
    ["/cleaning-services-selly-oak", "cleaning-services-selly-oak.html"],
    ["/cleaning-services-small-heath", "cleaning-services-small-heath.html"],
    ["/airbnb-cleaning", "airbnb-cleaning.html"],
    ["/regular-cleaning", "regular-cleaning.html"],
    ["/about", "about.html"],
    ["/contact", "contact.html"],
    ["/privacy", "privacy/index.html"],
  ]);
  const siteRoot = new URL(window.location.href);
  siteRoot.pathname = siteRoot.pathname.replace(/(?:privacy\/)?[^/]*$/, "");
  siteRoot.search = "";
  siteRoot.hash = "";

  document.querySelectorAll('a[href^="/"]').forEach((link) => {
    const target = new URL(link.getAttribute("href"), "https://www.depositreadyclean.co.uk");
    const localPath = routeMap.get(target.pathname);

    if (localPath) {
      const localUrl = new URL(localPath, siteRoot.href);
      localUrl.hash = target.hash;
      link.setAttribute("href", localUrl.href);
    }
  });
}

// WhatsApp Business auto-replies cannot be configured from this static site.
// Set them manually in the WhatsApp Business app:
// Greeting: "Hi 👋 thanks for contacting DepositReady Clean.
// Are you looking for end of tenancy, Airbnb or regular home cleaning?"
// Quick replies: End of tenancy clean; Airbnb turnover; Regular cleaning; Get a price.

function setCommercialDropdownOpen(dropdown, isOpen) {
  dropdown.classList.toggle("is-open", isOpen);
  dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", String(isOpen));
}

function closeCommercialDropdowns(exceptDropdown = null) {
  commercialDropdowns.forEach((dropdown) => {
    if (dropdown !== exceptDropdown) {
      setCommercialDropdownOpen(dropdown, false);
    }
  });
}

commercialDropdowns.forEach((dropdown, index) => {
  const toggle = dropdown.querySelector(".nav-dropdown-toggle");
  const menu = dropdown.querySelector(".nav-dropdown-menu");

  if (!toggle || !menu) return;

  if (!menu.id) {
    menu.id = `commercial-menu-${index + 1}`;
  }

  toggle.setAttribute("aria-haspopup", "true");
  toggle.setAttribute("aria-controls", menu.id);
  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", (event) => {
    if (!mobileNavQuery.matches) return;

    event.preventDefault();
    const isOpen = !dropdown.classList.contains("is-open");
    closeCommercialDropdowns(dropdown);
    setCommercialDropdownOpen(dropdown, isOpen);

    if (!isOpen) {
      toggle.blur();
    }
  });
});

mobileNavQuery.addEventListener("change", () => closeCommercialDropdowns());

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));

    if (!isOpen) {
      closeCommercialDropdowns();
    }
  });

  navLinks.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (link && !(mobileNavQuery.matches && link.classList.contains("nav-dropdown-toggle"))) {
      body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      closeCommercialDropdowns();
    }
  });
}

function normalizePath(value) {
  const url = new URL(value, window.location.href);
  let path = url.pathname.replace(/\/index\.html$/, "/").replace(/\.html$/, "");

  if (path.length > 1 && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  return path || "/";
}

const currentPage = normalizePath(window.location.pathname);
const additionalCommercialLinks = [
  ["/commercial-cleaning", "Commercial Cleaning"],
  ["/office-cleaning", "Office Cleaning"],
  ["/commercial-cleaning-birmingham", "Commercial Cleaning Birmingham"],
  ["/office-cleaning-birmingham", "Office Cleaning Birmingham"],
  ["/communal-area-cleaning-birmingham", "Communal Area Cleaning"],
  ["/retail-cleaning-birmingham", "Retail Cleaning"],
  ["/commercial-deep-cleaning-birmingham", "Commercial Deep Cleaning"],
  ["/religious-facility-cleaning-birmingham", "Religious Facility Cleaning"],
  ["/healthcare-cleaning-birmingham", "Healthcare Cleaning"],
  ["/school-cleaning-birmingham", "School Cleaning"],
  ["/gym-cleaning-birmingham", "Gym Cleaning"],
  ["/restaurant-cleaning-birmingham", "Restaurant Cleaning"],
  ["/commercial-carpet-cleaning-birmingham", "Commercial Carpet Cleaning"],
];

document.querySelectorAll(".nav-dropdown-menu").forEach((menu) => {
  additionalCommercialLinks.forEach(([href, label]) => {
    if (menu.querySelector(`a[href="${href}"]`)) return;

    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    menu.appendChild(link);
  });
});

const servicePages = new Set([
  "/end-of-tenancy-cleaning",
  "/deep-cleaning",
  "/after-builders-cleaning",
  "/carpet-cleaning",
  "/airbnb-turnover-cleaning",
  "/commercial-cleaning",
  "/office-cleaning",
  "/end-of-tenancy-cleaning-birmingham",
  "/after-builders-cleaning-birmingham",
  "/deep-cleaning-birmingham",
  "/carpet-cleaning-birmingham",
  "/airbnb-cleaning-birmingham",
  "/regular-cleaning",
  "/airbnb-cleaning",
]);
const commercialPages = new Set([
  "/commercial-cleaning",
  "/office-cleaning",
  "/commercial-cleaning-birmingham",
  "/office-cleaning-birmingham",
  "/communal-area-cleaning-birmingham",
  "/retail-cleaning-birmingham",
  "/commercial-deep-cleaning-birmingham",
  "/religious-facility-cleaning-birmingham",
  "/healthcare-cleaning-birmingham",
  "/school-cleaning-birmingham",
  "/gym-cleaning-birmingham",
  "/restaurant-cleaning-birmingham",
  "/commercial-carpet-cleaning-birmingham",
]);
document.querySelectorAll(".nav-links a").forEach((link) => {
  const url = new URL(link.getAttribute("href"), window.location.href);
  const href = normalizePath(url.pathname);
  const hasHash = Boolean(url.hash);
  const hashMatches = hasHash && href === currentPage && url.hash === window.location.hash;
  const isServiceChild = !hasHash && href === "/services" && servicePages.has(currentPage);
  const isCommercialChild = !hasHash && href === "/commercial-cleaning" && commercialPages.has(currentPage);

  if ((!hasHash && href === currentPage) || hashMatches || isServiceChild || isCommercialChild) {
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
  const dotsContainer = carousel.querySelector("[data-review-dots]");
  const autoSlideInterval = 4500;
  const manualPauseDuration = autoSlideInterval * 2;
  let currentIndex = 0;
  let autoSlideTimer = 0;
  let manualPauseTimer = 0;
  let isPointerPaused = false;
  let isFocusPaused = false;
  let isManualPaused = false;
  let dotButtons = [];
  let touchStartX = 0;
  let touchStartY = 0;

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

  function getPageStarts() {
    const visibleCount = getVisibleCount();
    const maxIndex = getMaxStartIndex();
    const starts = [];

    for (let index = 0; index <= maxIndex; index += visibleCount) {
      starts.push(index);
    }

    return starts;
  }

  function getSlideDistance() {
    const gap = Number.parseFloat(getComputedStyle(track).columnGap) || 0;
    return cards[0].getBoundingClientRect().width + gap;
  }

  function updateDots() {
    if (!dotsContainer) return;

    const activeIndex = getGroupStart(currentIndex);
    dotButtons.forEach((button) => {
      const isActive = Number.parseInt(button.dataset.reviewIndex, 10) === activeIndex;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-current", isActive ? "true" : "false");
    });
  }

  function updateCarousel(snapToGroup = false) {
    const maxIndex = getMaxStartIndex();
    currentIndex = Math.min(Math.max(currentIndex, 0), maxIndex);
    if (snapToGroup) currentIndex = getGroupStart(currentIndex);
    track.style.transform = `translateX(-${currentIndex * getSlideDistance()}px)`;
    previousButton.disabled = maxIndex === 0;
    nextButton.disabled = maxIndex === 0;
    updateDots();
  }

  function renderDots() {
    if (!dotsContainer) return;

    dotsContainer.innerHTML = "";
    dotButtons = getPageStarts().map((startIndex, dotIndex) => {
      const button = document.createElement("button");
      button.type = "button";
      button.className = "review-slider-dot";
      button.dataset.reviewIndex = String(startIndex);
      button.setAttribute("aria-label", `Show review slide ${dotIndex + 1}`);
      button.addEventListener("click", () => {
        currentIndex = startIndex;
        updateCarousel();
        pauseAfterManualMove();
      });
      dotsContainer.appendChild(button);
      return button;
    });

    updateDots();
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

  function showPreviousReview() {
    const maxIndex = getMaxStartIndex();
    currentIndex = currentIndex <= 0 ? maxIndex : Math.max(getGroupStart(currentIndex) - getVisibleCount(), 0);
    updateCarousel();
    pauseAfterManualMove();
  }

  function showNextReview() {
    const maxIndex = getMaxStartIndex();
    currentIndex = currentIndex >= maxIndex ? 0 : Math.min(getGroupStart(currentIndex) + getVisibleCount(), maxIndex);
    updateCarousel();
    pauseAfterManualMove();
  }

  previousButton.addEventListener("click", showPreviousReview);
  nextButton.addEventListener("click", showNextReview);

  carousel.addEventListener(
    "touchstart",
    (event) => {
      const touch = event.changedTouches[0];
      touchStartX = touch.clientX;
      touchStartY = touch.clientY;
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;

      if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY)) return;
      if (deltaX > 0) {
        showPreviousReview();
      } else {
        showNextReview();
      }
    },
    { passive: true }
  );

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
    renderDots();
    startAutoSlide();
  });

  renderDots();
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
