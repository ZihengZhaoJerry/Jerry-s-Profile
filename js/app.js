// Renders window.SITE_CONTENT (from data/content.js) into the page.
(function () {
  "use strict";

  const data = window.SITE_CONTENT;
  if (!data) {
    document.querySelector("main").textContent = "No content found. Check data/content.js.";
    return;
  }

  // ── tiny DOM helper: el("div", { class: "x" }, child1, "text", ...) ──
  function el(tag, attrs, ...children) {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(attrs || {})) {
      if (v == null || v === false) continue;
      if (k === "class") node.className = v;
      else if (k === "style") node.style.cssText = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false || c === "") continue;
      node.append(c instanceof Node ? c : String(c));
    }
    return node;
  }

  const $ = (id) => document.getElementById(id);
  const has = (x) => (Array.isArray(x) ? x.length > 0 : Boolean(x));
  const dateRange = (a, b) => [a, b].filter(Boolean).join(" – ");
  const link = (url, label, cls) =>
    el("a", { href: url, class: cls, target: /^https?:/.test(url) ? "_blank" : null, rel: "noopener" }, label);
  const chevron = " ›";

  // Gradients used for project artwork when a project has no image.
  const GRADIENTS = [
    "linear-gradient(135deg, #5e5ce6 0%, #bf5af2 100%)",
    "linear-gradient(135deg, #0a84ff 0%, #64d2ff 100%)",
    "linear-gradient(135deg, #ff375f 0%, #ff9f0a 100%)",
    "linear-gradient(135deg, #30d158 0%, #63e6e2 100%)",
    "linear-gradient(135deg, #ff9f0a 0%, #ffd60a 100%)",
    "linear-gradient(135deg, #1d1d1f 0%, #48484a 100%)",
  ];

  // ── Hero ──
  function renderHero(p) {
    const initials = (p.name || "")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    $("top").append(
      el(
        "div",
        { class: "hero-inner" },
        p.photo
          ? el("img", { class: "avatar reveal", src: p.photo, alt: p.name })
          : el("div", { class: "avatar avatar-initials reveal", "aria-hidden": "true" }, initials),
        p.title && el("p", { class: "hero-eyebrow reveal" }, p.title),
        el("h1", { class: "hero-title reveal" }, p.name),
        p.tagline && el("p", { class: "hero-tagline reveal" }, p.tagline),
        el(
          "div",
          { class: "hero-ctas reveal" },
          el("a", { class: "btn btn-primary", href: "#projects" }, "View projects"),
          el("a", { class: "btn-link", href: "#contact" }, "Get in touch" + chevron),
          p.resumePdf && link(p.resumePdf, "Download resume" + chevron, "btn-link")
        ),
        p.location && el("p", { class: "hero-meta reveal" }, p.location)
      )
    );
    $("brand").textContent = p.name || "";
    document.title = p.name ? `${p.name} — ${p.title || "Portfolio"}` : "Portfolio";
  }

  // ── About + highlight numbers ──
  function renderAbout(p) {
    const body = $("about-body");
    if (!p.summary && !has(p.highlights)) {
      $("about").hidden = true;
      return;
    }
    body.append(
      el("p", { class: "eyebrow reveal" }, "About"),
      p.summary && el("p", { class: "statement reveal" }, p.summary),
      has(p.highlights) &&
        el(
          "div",
          { class: "stats" },
          p.highlights.map((h) =>
            el("div", { class: "stat reveal" }, el("div", { class: "stat-value" }, h.value), el("div", { class: "stat-label" }, h.label))
          )
        )
    );
  }

  // ── Experience timeline + education ──
  function renderExperience(r) {
    const exp = r.experience || [];
    $("timeline").append(
      ...exp.map((e) =>
        el(
          "li",
          { class: "tl-item reveal" },
          el("div", { class: "tl-date" }, dateRange(e.start, e.end)),
          el(
            "div",
            { class: "tl-card" },
            el("h3", {}, e.role),
            el("p", { class: "tl-org" }, [e.org, e.location].filter(Boolean).join(" · ")),
            has(e.bullets) && el("ul", {}, e.bullets.map((b) => el("li", {}, b)))
          )
        )
      )
    );

    const edu = r.education || [];
    $("education").append(
      ...edu.map((e) =>
        el(
          "article",
          { class: "card edu-card reveal" },
          el("p", { class: "card-kicker" }, dateRange(e.start, e.end)),
          el("h4", {}, e.degree),
          el("p", { class: "muted" }, e.school),
          has(e.details) && el("ul", {}, e.details.map((d) => el("li", {}, d)))
        )
      )
    );
    if (!exp.length && !edu.length) $("experience").hidden = true;
  }

  // ── Projects: bento grid + detail sheet ──
  const dialog = $("project-dialog");

  function openProject(p, i) {
    const links = (p.links || []).filter((l) => l.url);
    $("sheet-body").replaceChildren(
      artwork(p, i, "sheet-art"),
      el(
        "div",
        { class: "sheet-content" },
        p.year && el("p", { class: "card-kicker" }, p.year),
        el("h2", { id: "sheet-title" }, p.name),
        p.summary && el("p", { class: "sheet-lead" }, p.summary),
        p.description && el("p", {}, p.description),
        has(p.tags) && el("div", { class: "tags" }, p.tags.map((t) => el("span", { class: "tag" }, t))),
        has(links) && el("div", { class: "sheet-links" }, links.map((l) => link(l.url, l.label + chevron, "btn btn-primary")))
      )
    );
    dialog.showModal();
  }

  dialog.addEventListener("click", (e) => {
    // Close on backdrop click or close button.
    if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
  });

  function artwork(p, i, cls) {
    if (p.image) return el("img", { class: cls, src: p.image, alt: "", loading: "lazy" });
    const monogram = p.name.replace(/[^A-Za-z0-9 ]/g, "").split(/\s+/).filter(Boolean)[0] || "";
    return el(
      "div",
      { class: cls, style: `background: ${p.color || GRADIENTS[i % GRADIENTS.length]}`, "aria-hidden": "true" },
      el("span", {}, p.emoji || monogram)
    );
  }

  function projectCard(p, i) {
    return el(
      "button",
      {
        type: "button",
        class: "card project reveal" + (p.featured ? " featured" : ""),
        "data-tags": (p.tags || []).join("|"),
        onclick: () => openProject(p, i),
      },
      artwork(p, i, "project-art"),
      el(
        "div",
        { class: "project-body" },
        el("p", { class: "card-kicker" }, [p.featured && "Featured", p.year].filter(Boolean).join(" · ")),
        el("h3", {}, p.name),
        p.summary && el("p", { class: "muted" }, p.summary),
        el("span", { class: "learn-more" }, "Learn more" + chevron)
      )
    );
  }

  function renderProjects(projects) {
    const grid = $("project-grid");
    const sorted = projects
      .map((p, i) => [p, i])
      .sort(([a], [b]) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    grid.append(...sorted.map(([p, i]) => projectCard(p, i)));
    // Lead with a full-width tile when there's an odd count, so the 2-column grid has no gaps.
    if (sorted.length % 2 === 1) grid.firstElementChild.classList.add("wide");

    const tags = [...new Set(projects.flatMap((p) => p.tags || []))].sort();
    if (tags.length < 2) return;

    const buttons = ["All", ...tags].map((t) =>
      el("button", { type: "button", "aria-pressed": String(t === "All"), onclick: () => select(t) }, t)
    );
    $("project-filters").append(...buttons);

    function select(tag) {
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.textContent === tag)));
      for (const card of grid.children) {
        card.hidden = tag !== "All" && !card.dataset.tags.split("|").includes(tag);
      }
    }
  }

  // ── Skills ──
  function renderSkills(skills) {
    if (!has(skills)) {
      $("skills").hidden = true;
      return;
    }
    $("skills-grid").append(
      ...skills.map((s) =>
        el(
          "article",
          { class: "card skill-card reveal" },
          el("h3", {}, s.group),
          el("div", { class: "tags" }, s.items.map((i) => el("span", { class: "tag" }, i)))
        )
      )
    );
  }

  // ── Contact ──
  function renderContact(p) {
    const contacts = (p.contacts || []).filter((c) => c.url);
    $("contact-body").append(
      el("p", { class: "eyebrow reveal" }, "Contact"),
      el("h2", { class: "contact-title reveal" }, p.contactHeadline || "Let's build something together."),
      el(
        "div",
        { class: "contact-links reveal" },
        contacts.map((c) =>
          link(c.url, el("span", {}, el("small", {}, c.label), el("strong", {}, c.value + chevron)), "contact-link")
        )
      )
    );
  }

  // ── Theme toggle ──
  function setupTheme() {
    const root = document.documentElement;
    $("theme-toggle").addEventListener("click", () => {
      const current = root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  // ── Fade-up on scroll ──
  function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((n) => n.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    items.forEach((n) => io.observe(n));
  }

  // ── Nav gets a hairline once you scroll ──
  function setupNav() {
    const nav = document.querySelector(".nav");
    const onScroll = () => nav.classList.toggle("scrolled", scrollY > 8);
    addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  const profile = data.profile || {};
  const resume = data.resume || {};
  renderHero(profile);
  renderAbout(profile);
  renderExperience(resume);
  if (has(data.projects)) renderProjects(data.projects);
  else $("projects").hidden = true;
  renderSkills(resume.skills);
  renderContact(profile);
  setupTheme();
  setupNav();
  setupReveal();
  $("footer").textContent = `© ${new Date().getFullYear()} ${profile.name || ""}`;
})();
