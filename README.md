# Jerry's Profile

A personal resume and project portfolio. It's a static site with no dependencies and no build step. All content comes from one data file.

## Structure

```
index.html        Page shell (Profile / Resume / Projects sections)
data/content.js   ← ALL your content: edit this file
js/app.js         Renders content.js into the page
css/styles.css    Styling (light/dark themes, responsive, print)
assets/           Put your headshot, project screenshots, PDF resume here
```

## Editing content

Open `data/content.js` and replace the placeholder values:

- **profile**: name, title, `tagline` (the gradient line under your name), location, photo, summary, `highlights` (big numbers in About), contact links, `contactHeadline`, optional PDF resume
- **resume**: `experience`, `education`, `skills`, `awards`
- **projects**: each has `name`, `year`, `summary`, `description` (shown in the detail popup), `tags`, `links`, `featured`, and card artwork: an `image`, or a gradient with an `emoji`/short glyph (override the gradient with `color`)

If you leave a field out or leave it empty, its UI is hidden. Featured projects are sorted first. When there's an odd number of projects, the first one becomes a full-width tile. When at least two tags exist, tag filter buttons are generated automatically.

## Running locally

Open `index.html` directly in a browser. Because the content is a `.js` file rather than JSON, no server is needed. You can also serve it:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Features

- Clean, Apple-inspired design: big type, generous spacing, frosted-glass nav, fade-in on scroll
- Hero with a photo or gradient initials, a tagline, and call-to-action buttons
- About statement with highlight numbers, an experience timeline, education cards
- Project tiles with tag filtering; click one to open a detail popup with links
- Skills cards and a contact section
- Light/dark mode that follows the system setting and has a manual toggle, which is remembered
- Mobile-friendly layout
- Print stylesheet (Cmd/Ctrl+P gives a clean resume)

## Deploying to GitHub Pages

Push to `main`. In the repo, go to **Settings → Pages** and set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`. The site will be live at `https://zihengzhaojerry.github.io/Jerry-s-Profile/`.
