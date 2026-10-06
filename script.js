(() => {
  "use strict";
  const profile = window.academicProfile;
  if (!profile) return;
  const set = (id, text) => { document.getElementById(id).textContent = text || ""; };
  const safeURL = value => {
    try {
      const url = new URL(value, document.baseURI);
      return ["http:", "https:", "mailto:"].includes(url.protocol) ? url.href : null;
    } catch { return null; }
  };
  set("name", profile.name); set("role", profile.role); set("affiliation", profile.affiliation);
  set("intro", profile.intro);
  document.title = `${profile.name} — Academic profile`;
  document.querySelector('meta[name="description"]').content = profile.intro || "Academic profile, research biography, and selected publications.";
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
    if (paper.year) {
      body.querySelector(".venue").append(document.createTextNode(`, ${paper.year}`));
    }
    li.append(body); document.getElementById("publication-list").append(li);
  }
  const sections = [...document.querySelectorAll("main section")];
  const navLinks = [...document.querySelectorAll("nav a")];
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
  const resolveSection = hash => sections.find(section => `#${section.id}` === hash);
  let currentSection = resolveSection(window.location.hash) || sections[0];
  let navigationVersion = 0;
  const animations = new Set();
  const markCurrentPage = () => {
    navLinks.forEach(link => {
      if (link.hash === `#${currentSection.id}`) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };
  const focusPage = section => {
    section.setAttribute("tabindex", "-1");
    section.focus({ preventScroll: true });
  };
  const animate = async (section, frames, duration) => {
    const animation = section.animate(frames, {
      duration, easing: "cubic-bezier(.22,.7,.24,1)", fill: "none"
    });
    animations.add(animation);
    try { await animation.finished; } catch { /* A newer navigation cancels this animation. */ }
    finally { animations.delete(animation); }
  };
  const navigate = async (target, { updateHistory = false, moveFocus = false } = {}) => {
    const version = ++navigationVersion;
    for (const animation of animations) animation.cancel();
    if (updateHistory && window.location.hash !== `#${target.id}`) {
      history.pushState(null, "", `#${target.id}`);
    }
    const canAnimate = !reducedMotion.matches && typeof target.animate === "function";
    if (target !== currentSection) {
      if (canAnimate) {
        await animate(currentSection, [
          { opacity: 1, transform: "translateY(0) scale(1)" },
          { opacity: 0, transform: "translateY(7px) scale(.99)", boxShadow: "inset 6px 6px 16px #c6ced1, inset -6px -6px 16px #ffffff" }
        ], 160);
      }
      if (version !== navigationVersion) return;
      currentSection = target;
      sections.forEach(section => { section.hidden = section !== target; });
      markCurrentPage();
      window.scrollTo({ top: 0, behavior: "instant" });
      // The page itself animates; visible content should not wait on a second reveal.
      target.querySelectorAll(".reveal").forEach(element => {
        if (element.getBoundingClientRect().top < window.innerHeight) element.classList.add("visible");
      });
      if (canAnimate) {
        await animate(target, [
          { opacity: 0, transform: "translateY(14px) scale(.99)", boxShadow: "0px 0px 0px #c6ced1, 0px 0px 0px #ffffff" },
          { opacity: 1, transform: "translateY(0) scale(1)", boxShadow: getComputedStyle(target).boxShadow }
        ], 430);
      }
    } else window.scrollTo({ top: 0, behavior: reducedMotion.matches ? "instant" : "smooth" });
    if (version === navigationVersion && moveFocus) focusPage(target);
  };
  sections.forEach(section => { section.hidden = section !== currentSection; });
  markCurrentPage();
  document.addEventListener("click", event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    const target = link && resolveSection(link.hash);
    if (!target) return;
    event.preventDefault();
    navigate(target, { updateHistory: true, moveFocus: true });
  });
  // Hash changes also cover browser Back/Forward and direct section links.
  window.addEventListener("hashchange", () => {
    navigate(resolveSection(window.location.hash) || sections[0], { moveFocus: true });
  });
  // Returning from a long publication page must restore the selected page at the top.
  if ("scrollRestoration" in history) history.scrollRestoration = "manual";
  window.scrollTo({ top: 0, behavior: "instant" });
  if ("IntersectionObserver" in window) {
    document.documentElement.classList.add("js");
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.05 });
    document.querySelectorAll(".reveal").forEach(element => observer.observe(element));
  }
})();
