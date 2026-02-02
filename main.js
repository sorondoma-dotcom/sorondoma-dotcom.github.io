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
      `;
      console.warn("Partial load failed:", file, err);
    }
  };

  await Promise.all(targets.map(loadOne));
  initReveal();
  initContactForm();
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

const initContactForm = () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const status = document.querySelector("#contact-status");
  const submitButton = form.querySelector("button[type=\"submit\"]");

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
      name: formData.get("nombre"),
      email: formData.get("email"),
      subject: formData.get("asunto"),
      message: formData.get("mensaje"),
    };

    if (status) {
      status.textContent = "Enviando mensaje...";
    }
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.classList.add("opacity-70", "cursor-not-allowed");
    }

    try {
      const endpoint = form.getAttribute("data-endpoint") || "/api/contact";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error?.message || "No se pudo enviar el mensaje.");
      }

      if (status) {
        status.textContent = "Mensaje enviado. Gracias por contactarme.";
      }
      form.reset();
    } catch (err) {
      if (status) {
        status.textContent = "Error al enviar. Intentalo de nuevo o escribe a sorondoma@gmail.com.";
      }
      console.warn("Contact form error:", err);
    } finally {
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.classList.remove("opacity-70", "cursor-not-allowed");
      }
    }
  });
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadPartials);
} else {
  loadPartials();
}
