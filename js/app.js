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
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? "" : v);
    }
    for (const c of children.flat()) {
      if (c == null || c === false || c === "") continue;
      node.append(c instanceof Node ? c : String(c));
    }
    return node;
  }

  const has = (x) => (Array.isArray(x) ? x.length > 0 : Boolean(x));
  const dateRange = (a, b) => [a, b].filter(Boolean).join(" – ");
  const externalLink = (url, label, cls) =>
    el("a", { href: url, class: cls, target: url.startsWith("http") ? "_blank" : null, rel: "noopener" }, label);

  // ── Profile ──
  function renderProfile(p) {
    const initials = (p.name || "")
      .replace(/\(.*?\)/g, "")
      .split(/\s+/)
      .filter(Boolean)
      .map((w) => w[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();

    const avatar = p.photo
      ? el("img", { class: "avatar", src: p.photo, alt: p.name })
      : el("div", { class: "avatar avatar-initials", "aria-hidden": "true" }, initials);

    const contacts = (p.contacts || [])
      .filter((c) => c.value)
      .map((c) =>
        el("li", {}, el("span", { class: "muted" }, c.label + ": "), c.url ? externalLink(c.url, c.value) : c.value)
      );

    document.getElementById("profile").append(
      avatar,
      el(
        "div",
        { class: "profile-body" },
        el("h1", {}, p.name),
        el("p", { class: "headline" }, [p.title, p.location].filter(Boolean).join(" · ")),
        has(p.summary) && el("p", { class: "summary" }, p.summary),
        has(contacts) && el("ul", { class: "contacts" }, contacts),
        p.resumePdf && externalLink(p.resumePdf, "Download PDF resume", "button")
      )
    );
    document.getElementById("brand").textContent = p.name || "";
    document.title = p.name ? `${p.name} — ${p.title || "Portfolio"}` : "Portfolio";
  }

  // ── Resume ──
  function block(title, items) {
    return has(items) ? el("div", { class: "block" }, el("h3", {}, title), items) : null;
  }

  function entry({ heading, sub, when, bullets }) {
    return el(
      "article",
      { class: "entry" },
      el("div", { class: "entry-head" }, el("h4", {}, heading), when && el("span", { class: "muted when" }, when)),
      sub && el("p", { class: "muted" }, sub),
      has(bullets) && el("ul", {}, bullets.map((b) => el("li", {}, b)))
    );
  }

  function renderResume(r) {
    const exp = (r.experience || []).map((e) =>
      entry({
        heading: e.role,
        sub: [e.org, e.location].filter(Boolean).join(", "),
        when: dateRange(e.start, e.end),
        bullets: e.bullets,
      })
    );
    const edu = (r.education || []).map((e) =>
      entry({ heading: e.degree, sub: e.school, when: dateRange(e.start, e.end), bullets: e.details })
    );
    const skills = (r.skills || []).map((s) =>
      el("div", { class: "skill-group" }, el("h4", {}, s.group), el("div", { class: "chips" }, s.items.map((i) => el("span", { class: "chip" }, i))))
    );
    const awards = has(r.awards)
      ? el("ul", { class: "plain" }, r.awards.map((a) => el("li", {}, a.name, a.year && el("span", { class: "muted" }, ` · ${a.year}`))))
      : null;

    const mount = (id, node) => node && document.getElementById(id).append(node);
    mount("experience", block("Experience", exp));
    mount("education", block("Education", edu));
    mount("skills", block("Skills", skills));
    mount("awards", block("Awards", awards ? [awards] : []));
  }

  // ── Projects ──
  function projectCard(p) {
    const links = (p.links || []).filter((l) => l.url);
    const card = el(
      "article",
      { class: "card" + (p.featured ? " featured" : ""), "data-tags": (p.tags || []).join("|") },
      p.image && el("img", { class: "card-img", src: p.image, alt: "", loading: "lazy" }),
      el(
        "div",
        { class: "card-body" },
        el("div", { class: "entry-head" }, el("h3", {}, p.name), p.year && el("span", { class: "muted when" }, p.year)),
        p.featured && el("span", { class: "badge" }, "Featured"),
        p.summary && el("p", {}, p.summary),
        has(p.tags) && el("div", { class: "chips" }, p.tags.map((t) => el("span", { class: "chip" }, t))),
        p.description &&
          el("details", {}, el("summary", {}, "More details"), el("p", {}, p.description)),
        has(links) && el("div", { class: "card-links" }, links.map((l) => externalLink(l.url, l.label + " ↗")))
      )
    );
    return card;
  }

  function renderProjects(projects) {
    const grid = document.getElementById("project-grid");
    const filters = document.getElementById("project-filters");
    const sorted = [...projects].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    grid.append(...sorted.map(projectCard));

    const tags = [...new Set(projects.flatMap((p) => p.tags || []))].sort();
    if (tags.length < 2) return;

    let active = "All";
    const buttons = ["All", ...tags].map((t) =>
      el("button", { type: "button", class: "filter", "aria-pressed": String(t === active), onclick: () => select(t) }, t)
    );
    filters.append(...buttons);

    function select(tag) {
      active = tag;
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b.textContent === tag)));
      for (const card of grid.children) {
        const cardTags = card.dataset.tags.split("|");
        card.hidden = tag !== "All" && !cardTags.includes(tag);
      }
    }
  }

  // ── Theme toggle ──
  function setupTheme() {
    const root = document.documentElement;
    document.getElementById("theme-toggle").addEventListener("click", () => {
      const current =
        root.dataset.theme || (matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");
      const next = current === "dark" ? "light" : "dark";
      root.dataset.theme = next;
      try {
        localStorage.setItem("theme", next);
      } catch (e) {}
    });
  }

  renderProfile(data.profile || {});
  renderResume(data.resume || {});
  if (has(data.projects)) renderProjects(data.projects);
  else document.getElementById("projects").hidden = true;
  setupTheme();
  document.getElementById("footer").textContent = `© ${new Date().getFullYear()} ${data.profile?.name || ""}`;
})();
