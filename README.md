# Osman Nuri — Portfolio

A lightweight, responsive portfolio website built with plain HTML, CSS, and JavaScript. The site is deployed as a static GitHub Pages project and has no build step or package manager dependencies.

## Project structure

```text
.
├── index.html       # Page content and metadata
├── css/style.css    # Layout, visual system, and responsive rules
├── js/main.js       # Interactions and Three.js background
├── photo.jpg        # Profile photo
├── logo.svg         # Brand mark
├── favicon-32.png   # Browser icon
└── apple-touch-icon.png
```

## Run locally

Open `index.html` in a browser, or serve the repository root with any static HTTP server. Three.js and web fonts are loaded from CDNs, so those features require an internet connection.

## Content updates

Update text and metadata in `index.html`, presentation in `css/style.css`, and behavior in `js/main.js`. Keep links to personal documents and local exports out of Git; PDF files are ignored.

## Deployment

GitHub Pages serves the repository as a static site. Keep asset paths relative to the repository root so they work when hosted under the project path.
