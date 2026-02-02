const loadPartials = async () => {
  const targets = Array.from(document.querySelectorAll("[data-include]"));

  const loadOne = async (el) => {
    const file = el.getAttribute("data-include");
    if (!file) return;

    try {
      const res = await fetch(file);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      el.innerHTML = await res.text();
    } catch (err) {
      el.innerHTML = `
        <div class="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-6 text-sm text-red-600">
          No se pudo cargar ${file}. Asegurate de servir el sitio desde un servidor local.
        </div>
      `;scr
      console.warn("Partial load failed:", file, err);
    }
  };

  await Promise.all(targets.map(loadOne));
  initReveal();
};

const initReveal = () => {
  const elements = Array.from(document.querySelectorAll(".reveal"));
  if (!elements.length) return;

  elements.forEach((el, index) => {
    const delay = Math.min(index * 60, 420);
    el.style.transitionDelay = `${delay}ms`;
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  elements.forEach((el) => observer.observe(el));
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadPartials);
} else {
  loadPartials();
}
