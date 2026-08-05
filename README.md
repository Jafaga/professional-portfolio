# Justine Afaga — Professional Portfolio

A responsive, accessible portfolio for [jafaga.github.io](https://jafaga.github.io), rebuilt as a dependency-free static site for fast GitHub Pages deployment.

## Site structure

- `index.html` — homepage content and section structure
- `styles.css` — complete design system and responsive styles
- `app.js` — navigation, scroll reveals, skills, project filtering, dialogs, and email form fallback
- `resume.html` / `resume.css` — printable résumé; use **Print / Save PDF** to create a PDF
- `assets/images/` — optimized selection of original portfolio imagery
- `assets/images/og.png` — custom social sharing preview card
- `content/projects/` — preserved long-form project source files
- `content/essays/` — preserved long-form writing source files
- `.github/workflows/pages.yml` — optional GitHub Pages deployment workflow

## Editing content

Open `index.html` in any editor. Each major part is a labeled `<section>`: About, Skills, Experience, Projects, Writing, and Contact. Project case-study dialogs are at the bottom of the same file. Personal links and contact details are plain text, so there is no hidden configuration.

The long-form Markdown source from the original portfolio remains under `content/`. It is included for reference and future migration to a blog or content system.

## Local preview

The site has no build step. You can open `index.html` directly, or serve the folder locally:

```sh
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deploying to GitHub Pages

1. Unzip this project.
2. Copy its contents to the root of the `jafaga.github.io` repository.
3. Commit and push to the `main` branch.
4. In GitHub, open **Settings → Pages**.
5. Under **Build and deployment**, select **GitHub Actions**. The included workflow will publish the site.

Because this is the special `jafaga.github.io` repository, the public URL will be `https://jafaga.github.io/`.

## Contact form behavior

The contact form does not send data to a third party. It validates the fields and opens the visitor’s default email app with a prepared message to `afagajus@hawaii.edu`. The visible email link remains available if no mail app is configured.

## Accessibility and performance

- Semantic landmarks and heading order
- Keyboard-visible focus styles and skip navigation
- Accessible project dialogs and status updates
- Reduced-motion support
- Responsive layouts for phones, tablets, and desktops
- Lazy-loaded project and essay imagery
- No runtime dependencies or tracking scripts
