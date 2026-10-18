# Architecture

## Overview

The portfolio is a static, single-page site served directly from the repository root. It has no compilation stage, server code, or dependency installation step. `index.html` loads the local stylesheet and script and fetches Three.js and web fonts from public CDNs.

## Responsibilities

- **`index.html`** — document metadata, page sections, copy, links, and script/style references.
- **`css/style.css`** — design tokens, component styles, animation, and responsive layouts.
- **`js/main.js`** — preloader, animated background, navigation, reveal effects, counters, cursor, and card interactions.
- **Root image files** — profile image, logo, and browser icons.

## Runtime flow

1. The browser parses the HTML and loads the local CSS and JavaScript plus external fonts and Three.js.
2. After the DOM is ready, `main.js` attaches interaction handlers and starts the background animation.
3. The page remains usable as ordinary document content; animation is an enhancement layered over it.

## Hosting

GitHub Pages serves the static files. Asset references should remain relative to the repository root to support project-site URLs. No secrets or private resume files belong in this repository.
