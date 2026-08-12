# Justine Afaga — Professional Portfolio

A polished, responsive, terminal-inspired portfolio designed for GitHub Pages. It is an original implementation shaped by developer-workspace interfaces, with Justine's existing information, projects, writing, and experience preserved.

## Highlights

- Short, skippable boot sequence
- Desktop command rail and mobile navigation dock
- Animated code-editor hero and section-aware scroll progress
- About/profile console with animated counters
- Draggable and keyboard-accessible skill constellation with replaceable circular logo images
- Horizontal Git-style experience timeline that opens at the current role and scrolls back through earlier experience
- Live, searchable `@Jafaga` GitHub repository list, project filters, and dedicated project report pages
- Personal journal cards with complete standalone blog-post pages
- Résumé buttons that open a real PDF instead of a separate HTML page
- Contact form that prepares an email without storing visitor data
- Offline, private portfolio assistant with project, skills, experience, résumé, and contact answers
- Reduced-motion support, keyboard navigation, semantic landmarks, and responsive layouts

## Technology

This project uses semantic HTML, modern CSS, and dependency-free JavaScript. There is no framework, package manager, build step, analytics service, database, or chatbot API.

## Run locally

Open `index.html`, or run `python3 -m http.server 8000` in this directory and visit `http://localhost:8000`.

## Customize

See [`CUSTOMIZE.md`](CUSTOMIZE.md) for a direct editing map and project-adding checklist.

To use a newer résumé, replace `assets/resume/AfagaJustine_resume_OFFICIAL.pdf` with your updated PDF and keep the same filename. Every résumé button will update automatically.

## Deploy

Push the folder contents to the `main` branch of `Jafaga/professional-portfolio`. In the repository's **Settings → Pages**, set the source to **Deploy from a branch**, then select `main` and `/(root)`.

Live URL after GitHub finishes deploying: `https://jafaga.github.io/professional-portfolio/`
