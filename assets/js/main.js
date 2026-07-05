const body = document.body;
const menuToggle = document.querySelector("[data-menu-toggle]");
const navLinks = document.querySelector(".nav-links");
const navDropdowns = Array.from(document.querySelectorAll(".nav-dropdown"));
const mobileNavQuery = window.matchMedia("(max-width: 980px)");

if (window.location.protocol === "file:") {
  const routeMap = new Map([
    ["/", "index.html"],
    ["/services", "services.html"],
    ["/prices", "prices.html"],
    ["/locations", "locations.html"],
    ["/articles/office-cleaning-checklist-birmingham", "articles/office-cleaning-checklist-birmingham.html"],
    ["/articles/deep-cleaning-vs-end-of-tenancy-cleaning", "articles/deep-cleaning-vs-end-of-tenancy-cleaning.html"],
    ["/articles/after-builders-cleaning-checklist", "articles/after-builders-cleaning-checklist.html"],
    ["/articles/end-of-tenancy-cleaning-cost-birmingham", "articles/end-of-tenancy-cleaning-cost-birmingham.html"],
    ["/articles/end-of-tenancy-cleaning-checklist-birmingham", "articles/end-of-tenancy-cleaning-checklist-birmingham.html"],
    ["/articles", "articles.html"],
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
// Greeting: "Hi, thanks for contacting DepositReadyClean.
// Are you looking for end of tenancy, Airbnb or regular home cleaning?"
// Quick replies: End of tenancy clean; Airbnb turnover; Regular cleaning; Get a price.

function setNavDropdownOpen(dropdown, isOpen) {
  dropdown.classList.toggle("is-open", isOpen);
  dropdown.querySelector(".nav-dropdown-toggle")?.setAttribute("aria-expanded", String(isOpen));
}

function closeNavDropdowns(exceptDropdown = null) {
  navDropdowns.forEach((dropdown) => {
    if (dropdown !== exceptDropdown) {
      setNavDropdownOpen(dropdown, false);
    }
  });
}

navDropdowns.forEach((dropdown, index) => {
  const toggle = dropdown.querySelector(".nav-dropdown-toggle");
  const menu = dropdown.querySelector(".nav-dropdown-menu");

  if (!toggle || !menu) return;

  if (!menu.id) {
    menu.id = `nav-dropdown-menu-${index + 1}`;
  }

  toggle.setAttribute("aria-haspopup", "true");
  toggle.setAttribute("aria-controls", menu.id);
  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", (event) => {
    if (!mobileNavQuery.matches) return;

    event.preventDefault();
    const isOpen = !dropdown.classList.contains("is-open");
    closeNavDropdowns(dropdown);
    setNavDropdownOpen(dropdown, isOpen);

    if (!isOpen) {
      toggle.blur();
    }
  });
});

mobileNavQuery.addEventListener("change", () => closeNavDropdowns());

if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = body.classList.toggle("menu-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));

    if (!isOpen) {
      closeNavDropdowns();
    }
  });

  navLinks.addEventListener("click", (event) => {
    const link = event.target.closest("a");

    if (link && !(mobileNavQuery.matches && link.classList.contains("nav-dropdown-toggle"))) {
      body.classList.remove("menu-open");
      menuToggle.setAttribute("aria-expanded", "false");
      closeNavDropdowns();
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
const navDropdownLinkSets = {
  services: [
    ["/end-of-tenancy-cleaning-birmingham", "End of Tenancy Cleaning"],
    ["/deep-cleaning-birmingham", "Deep Cleaning"],
    ["/after-builders-cleaning-birmingham", "After Builders Cleaning"],
    ["/carpet-cleaning-birmingham", "Carpet Cleaning"],
    ["/airbnb-cleaning-birmingham", "Airbnb Turnover Cleaning"],
  ],
  commercial: [
    ["/commercial-cleaning-birmingham", "Commercial Cleaning"],
    ["/office-cleaning-birmingham", "Office Cleaning"],
    ["/communal-area-cleaning-birmingham", "Communal Area Cleaning"],
    ["/retail-cleaning-birmingham", "Retail Cleaning"],
    ["/commercial-deep-cleaning-birmingham", "Commercial Deep Cleaning"],
    ["/healthcare-cleaning-birmingham", "Healthcare Cleaning"],
    ["/school-cleaning-birmingham", "School Cleaning"],
    ["/gym-cleaning-birmingham", "Gym Cleaning"],
    ["/restaurant-cleaning-birmingham", "Restaurant Cleaning"],
    ["/commercial-carpet-cleaning-birmingham", "Commercial Carpet Cleaning"],
  ],
  more: [
    ["/about", "About Us"],
    ["/articles", "Cleaning Guides"],
    ["/locations", "Locations"],
    ["/contact", "Contact"],
  ],
};

document.querySelectorAll(".nav-dropdown-menu").forEach((menu) => {
  const linkSet = navDropdownLinkSets[menu.dataset.dropdownMenu];

  if (!linkSet) return;

  menu.textContent = "";
  linkSet.forEach(([href, label]) => {
    const link = document.createElement("a");
    link.href = href;
    link.textContent = label;
    menu.appendChild(link);
  });
});

const servicePages = new Set([
  "/end-of-tenancy-cleaning-birmingham",
  "/after-builders-cleaning-birmingham",
  "/deep-cleaning-birmingham",
  "/carpet-cleaning-birmingham",
  "/airbnb-cleaning-birmingham",
  "/regular-cleaning",
]);
const commercialPages = new Set([
  "/commercial-cleaning-birmingham",
  "/office-cleaning-birmingham",
  "/communal-area-cleaning-birmingham",
  "/retail-cleaning-birmingham",
  "/commercial-deep-cleaning-birmingham",
  "/healthcare-cleaning-birmingham",
  "/school-cleaning-birmingham",
  "/gym-cleaning-birmingham",
  "/restaurant-cleaning-birmingham",
  "/commercial-carpet-cleaning-birmingham",
]);
const morePages = new Set([
  "/about",
  "/articles",
  "/locations",
  "/contact",
]);
document.querySelectorAll(".nav-links a").forEach((link) => {
  const url = new URL(link.getAttribute("href"), window.location.href);
  const href = normalizePath(url.pathname);
  const hasHash = Boolean(url.hash);
  const hashMatches = hasHash && href === currentPage && url.hash === window.location.hash;
  const isServiceChild = !hasHash && href === "/services" && servicePages.has(currentPage);
  const isCommercialChild = !hasHash && href === "/commercial-cleaning-birmingham" && commercialPages.has(currentPage);
  const isMoreChild = !hasHash && href === "/about" && morePages.has(currentPage);

  if ((!hasHash && href === currentPage) || hashMatches || isServiceChild || isCommercialChild || isMoreChild) {
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  }
});

document.querySelectorAll("[data-postcode-coverage]").forEach((coverage, index) => {
  const grid = coverage.querySelector(".postcode-chip-grid");
  const toggle = coverage.querySelector("[data-postcode-toggle]");

  if (!grid || !toggle) return;

  if (!grid.id) {
    grid.id = `postcode-chip-grid-${index + 1}`;
  }

  toggle.setAttribute("aria-controls", grid.id);
  toggle.setAttribute("aria-expanded", "false");

  toggle.addEventListener("click", () => {
    const isExpanded = coverage.classList.toggle("is-expanded");
    toggle.setAttribute("aria-expanded", String(isExpanded));
    toggle.textContent = isExpanded ? "Show fewer postcodes" : "Show all postcodes";
  });
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
  const autoSlideInterval = 10000;
  const manualPauseDuration = autoSlideInterval;
  let currentIndex = 0;
  let autoSlideTimer = 0;
  let manualPauseTimer = 0;
  let isPointerPaused = false;
  let isFocusPaused = false;
  let isManualPaused = false;
  let isTouchPaused = false;
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
    return Math.max(0, cards.length - 1);
  }

  function getGroupStart(index) {
    const starts = getPageStarts();

    return starts.reduce((closest, start) => {
      return Math.abs(start - index) < Math.abs(closest - index) ? start : closest;
    }, starts[0] || 0);
  }

  function getPageStarts() {
    const visibleCount = getVisibleCount();
    const starts = [];

    for (let index = 0; index < cards.length; index += visibleCount) {
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
    previousButton.disabled = getPageStarts().length <= 1;
    nextButton.disabled = getPageStarts().length <= 1;
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
    if (maxIndex === 0 || isPointerPaused || isFocusPaused || isManualPaused || isTouchPaused) return;

    autoSlideTimer = window.setInterval(() => {
      const starts = getPageStarts();
      const currentPageIndex = starts.indexOf(getGroupStart(currentIndex));
      currentIndex = currentPageIndex >= starts.length - 1 ? starts[0] : starts[currentPageIndex + 1];
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
    const starts = getPageStarts();
    const currentPageIndex = starts.indexOf(getGroupStart(currentIndex));
    currentIndex = currentPageIndex <= 0 ? starts[starts.length - 1] : starts[currentPageIndex - 1];
    updateCarousel();
    pauseAfterManualMove();
  }

  function showNextReview() {
    const starts = getPageStarts();
    const currentPageIndex = starts.indexOf(getGroupStart(currentIndex));
    currentIndex = currentPageIndex >= starts.length - 1 ? starts[0] : starts[currentPageIndex + 1];
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
      isTouchPaused = true;
      stopAutoSlide();
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchend",
    (event) => {
      const touch = event.changedTouches[0];
      const deltaX = touch.clientX - touchStartX;
      const deltaY = touch.clientY - touchStartY;
      let didSwipe = false;

      if (Math.abs(deltaX) >= 45 && Math.abs(deltaX) >= Math.abs(deltaY)) {
        didSwipe = true;
        if (deltaX > 0) {
          showPreviousReview();
        } else {
          showNextReview();
        }
      }

      isTouchPaused = false;
      if (!didSwipe) startAutoSlide();
    },
    { passive: true }
  );

  carousel.addEventListener(
    "touchcancel",
    () => {
      isTouchPaused = false;
      startAutoSlide();
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

function pushTrackingEvent(eventName, eventParams = {}) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...eventParams,
  });
}

document.querySelectorAll("[data-track-click]").forEach((target) => {
  target.addEventListener("click", () => {
    pushTrackingEvent("drc_click", {
      click_type: target.dataset.trackClick,
      click_text: target.textContent.trim(),
      click_url: target.href || "",
      page_path: window.location.pathname,
    });
  });
});

document.querySelectorAll("[data-track-form-submit]").forEach((form) => {
  form.addEventListener(
    "submit",
    () => {
      pushTrackingEvent("drc_form_submit_attempt", {
        form_source: form.dataset.source || document.title,
        page_path: window.location.pathname,
      });
    },
    { capture: true }
  );
});

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
