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
