if (!CSS.supports("animation-delay: calc(sibling-index() * 0.1s)")) {
  for (const group of document.querySelectorAll("[data-stagger]")) {
    Array.from(group.children).forEach((el, index) => {
      el.style.setProperty("--sibling-index", String(index + 1));
    });
  }
}

const prefersMotion = matchMedia(
  "(prefers-reduced-motion: no-preference)",
).matches;

if (
  !CSS.supports("(animation-timeline: scroll()) and (animation-range: 0% 100%)")
) {
  const header = document.querySelector(".site-header");
  const progress = document.querySelector("#scroll-progress");

  const updateScroll = () => {
    const scrollY = window.scrollY;
    if (header) {
      header.classList.toggle("is-scrolled", scrollY > 24);
    }

    if (progress && prefersMotion) {
      const scrollable =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        scrollable > 0 ? Math.min(1, Math.max(0, scrollY / scrollable)) : 0;
      progress.style.transform = `scaleX(${ratio})`;
    }
  };

  window.addEventListener("scroll", updateScroll, { passive: true });
  updateScroll();
}

if (
  !CSS.supports("(animation-timeline: view()) and (animation-range: entry)") &&
  prefersMotion
) {
  const revealTargets = document.querySelectorAll(
    ".service-card, .scroll-reveal",
  );
  for (const el of revealTargets) {
    el.classList.add("is-reveal-pending");
  }

  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.remove("is-reveal-pending");
          entry.target.classList.add("is-revealed");
          observer.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.12 },
  );

  for (const el of revealTargets) {
    revealObserver.observe(el);
  }

  const heroStage = document.querySelector(".hero-stage");
  const heroPhoto = document.querySelector(".hero-photo");

  if (heroStage && heroPhoto) {
    heroPhoto.style.scale = "1.09";

    const updateParallax = () => {
      const rect = heroStage.getBoundingClientRect();
      const total = window.innerHeight + rect.height;
      const progress =
        total > 0 ? (window.innerHeight - rect.top) / total : 0.5;
      const clamped = Math.min(1, Math.max(0, progress));
      const offsetPercent = -4 + clamped * 8;
      heroPhoto.style.transform = `translateY(${offsetPercent}%)`;
    };

    const parallaxObserver = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            window.addEventListener("scroll", updateParallax, {
              passive: true,
            });
            updateParallax();
          } else {
            window.removeEventListener("scroll", updateParallax);
          }
        }
      },
      { threshold: 0 },
    );

    parallaxObserver.observe(heroStage);
    updateParallax();
  }
}
