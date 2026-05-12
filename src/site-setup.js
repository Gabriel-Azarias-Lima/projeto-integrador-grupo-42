/**
 * Setup compartilhado do <head>: Tailwind (Play CDN) + fontes + styles.css.
 * Inclua após <script src="https://cdn.tailwindcss.com"></script>.
 */
tailwind.config = {
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        panel: "#1a1a1a",
        panel2: "#222222",
        primary: "#D4AF37",
        secondary: "#997A2C",
        tertiary: "#F5E6BE",
        gold: "#D4AF37",
        goldmuted: "#997A2C",
        muted: "#a0a0a0",
        label: "#808080",
      },
      boxShadow: {
        lift: "0 20px 60px rgba(0,0,0,.55)",
      },
    },
  },
};

(function injectSiteHeadAssets() {
  const head = document.head;
  if (!head) return;

  function link(attrs) {
    const el = document.createElement("link");
    Object.entries(attrs).forEach(([k, v]) => {
      if (v == null) return;
      if (k === "crossOrigin") el.crossOrigin = v;
      else el.setAttribute(k, v);
    });
    head.appendChild(el);
  }

  link({ rel: "preconnect", href: "https://fonts.googleapis.com" });
  link({ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" });
  link({
    rel: "stylesheet",
    href:
      "https://fonts.googleapis.com/css2?family=Manrope:wght@300;400;500;600;700&family=Noto+Serif:ital,wght@0,500;0,600;0,700;1,500&display=swap",
  });
  link({ rel: "stylesheet", href: "./src/styles.css" });
})();
