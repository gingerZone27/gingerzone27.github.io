# Personal academic website

A white, responsive academic site with personal information, a research biography, and up to ten selected publications. Navigation scrolls smoothly between sections and content slides into view. Reduced-motion preferences are respected.

## Customize

Edit `profile.js` to add your name, affiliation, biography, professional links, and selected publications. Add a portrait file and set `portrait` to its relative path if desired. Publication entries use `title`, `authors`, `venue`, `year`, and `url`. Only the first ten entries are displayed. Do not upload private CVs or proposal materials.

## Publish with GitHub Pages

1. Create a public repository named `YOUR_USERNAME.github.io` for your primary personal website, or use a separate repository for a project website.
2. Upload the files in this directory to its root.
3. In Settings → Pages, choose **Deploy from a branch**, then select **main** and **/(root)** and save.
4. GitHub will display the published URL on that settings page after deployment completes.

This site has no build step or package dependencies. Relative asset paths support both primary and project GitHub Pages URLs.

## Local preview

Run `python3 -m http.server 4173 --bind 127.0.0.1` in this directory, then open http://127.0.0.1:4173.

## Content sources and review

Publications were selected from Junjie Yang’s [Google Scholar profile](https://scholar.google.com/citations?user=JWDziWkAAAAJ). Biography is a draft based on the [TUM doctoral dissertation](https://mediatum.ub.tum.de/doc/1783770/1783770.pdf) and the author biography in [TUM research materials](https://mediatum.ub.tum.de/doc/1783951/zpk3t3gm2fih7ypw5nh2wzroo.Satoshi%20Inagaki.pdf). Please review the biography before any future publication. No current job rank or contact email has been inferred. A monogram is used until you choose a portrait.

This version is local only; nothing has been published.
