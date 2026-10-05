(() => {
  "use strict";
  const profile = window.academicProfile;
  if (!profile) return;
  const set = (id, text) => { document.getElementById(id).textContent = text || ""; };
  const safeURL = (value, image = false) => {
    try {
      const url = new URL(value, document.baseURI);
      return (image ? ["http:", "https:"] : ["http:", "https:", "mailto:"]).includes(url.protocol) ? url.href : null;
    } catch { return null; }
  };
  set("name", profile.name); set("role", profile.role); set("affiliation", profile.affiliation);
  set("intro", profile.intro); set("location", profile.location); set("footer-name", profile.name);
  set("initials", profile.initials); set("monogram", profile.initials);
  document.title = `${profile.name} — Academic profile`;
  document.querySelector('meta[name="description"]').content = profile.intro || "Academic profile, research biography, and selected publications.";
  if (profile.portrait) {
    const url = safeURL(profile.portrait, true);
    if (url) {
      const image = document.getElementById("portrait");
      image.addEventListener("load", () => { image.hidden = false; document.getElementById("monogram").hidden = true; });
      image.src = url; image.alt = `Portrait of ${profile.name}`;
    }
  }
  for (const item of profile.links || []) {
    const url = safeURL(item.url); if (!url) continue;
    const a = document.createElement("a"); a.href = url; a.textContent = item.label;
    const arrow = document.createElement("span"); arrow.textContent = "↗"; arrow.setAttribute("aria-hidden", "true"); a.append(arrow);
    document.getElementById("links").append(a);
  }
  for (const paragraph of profile.biography || []) {
    const p = document.createElement("p"); p.textContent = paragraph; document.getElementById("biography").append(p);
  }
  for (const interest of profile.interests || []) {
    const li = document.createElement("li"); li.textContent = interest; document.getElementById("interests").append(li);
  }
  const publications = (profile.publications || []).slice(0, 10);
  set("publication-count", publications.length ? `${publications.length} selected works` : "");
  document.getElementById("empty-publications").hidden = publications.length > 0;
  for (const paper of publications) {
    const li = document.createElement("li"); li.className = "publication reveal";
    const body = document.createElement("div");
    for (const [tag, cls, value] of [["h3", "", paper.title], ["p", "authors", paper.authors], ["p", "venue", paper.venue]]) {
      const element = document.createElement(tag); element.className = cls; if (cls === "authors") {
        const parts = (value || "").split(/(J\. Yang)/g);
        for (const part of parts) {
          if (part === "J. Yang") { const strong = document.createElement("strong"); strong.textContent = part; element.append(strong); }
          else element.append(document.createTextNode(part));
        }
      } else element.textContent = value || "";
      body.append(element);
    }
    const url = safeURL(paper.url);
    if (paper.url && url) { const a = document.createElement("a"); a.href = url; a.className = "paper-link"; a.textContent = "Read publication ↗"; a.setAttribute("aria-label", `Read ${paper.title}`); body.append(a); }
    const year = document.createElement("span"); year.className = "year"; year.textContent = paper.year || "";
    li.append(body, year); document.getElementById("publication-list").append(li);
  }
  if (!("IntersectionObserver" in window)) return;
  document.documentElement.classList.add("js");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add("visible"); observer.unobserve(entry.target); } });
  }, { threshold: 0.05 });
  document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
  const navLinks = [...document.querySelectorAll("nav a")];
  const sections = [...document.querySelectorAll("main section")];
  let scheduled = false;
  const updateNavigation = () => {
    const offset = document.querySelector("header").getBoundingClientRect().bottom + 90;
    let current = sections[0];
    for (const section of sections) if (section.getBoundingClientRect().top <= offset) current = section;
    if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 4) current = sections[sections.length - 1];
    navLinks.forEach(a => { if (a.hash === `#${current.id}`) a.setAttribute("aria-current", "location"); else a.removeAttribute("aria-current"); });
    scheduled = false;
  };
  window.addEventListener("scroll", () => { if (!scheduled) { scheduled = true; requestAnimationFrame(updateNavigation); } }, { passive: true });
  window.addEventListener("resize", updateNavigation); updateNavigation();
})();
