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

- **profile**: name, title, location, photo, summary, contact links, optional PDF resume
- **resume**: `experience`, `education`, `skills`, `awards`
- **projects**: each has `name`, `year`, `summary`, `description` (expandable), `tags`, optional `image`, `links`, and `featured`

If you leave a field out or leave it empty, its UI is hidden. Featured projects are sorted first. When at least two tags exist, tag filter buttons are generated automatically.

## Running locally

Open `index.html` directly in a browser. Because the content is a `.js` file rather than JSON, no server is needed. You can also serve it:

```sh
python3 -m http.server 8000   # then visit http://localhost:8000
```

## Features

- Profile header with a photo, or initials if there's no photo
- Resume with experience, education, skills, and awards
- Project cards with tag filtering, expandable details, and links
- Light/dark mode that follows the system setting and has a manual toggle, which is remembered
- Mobile-friendly layout
- Print stylesheet (Cmd/Ctrl+P gives a clean resume)

## Deploying to GitHub Pages

Push to `main`. In the repo, go to **Settings → Pages** and set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`. The site will be live at `https://zihengzhaojerry.github.io/Jerry-s-Profile/`.
