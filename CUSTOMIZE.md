# Portfolio editing map

This site is deliberately built with plain HTML, CSS, and JavaScript so it stays easy to edit and deploy on GitHub Pages. No package installation or build command is required.

## The files you will edit most often

| What you want to change | File | What to search for |
| --- | --- | --- |
| Name, headline, introduction, and contact details | `index.html` | `Justine Afaga`, `hero-lede`, and `contact_info.json` |
| About text and quick statistics | `index.html` | `user_profile.log` and `stats-grid` |
| Skills and their descriptions | `index.html` | `data-skill=` |
| Education, work, and volunteer history | `index.html` | `data-timeline` |
| Project cards and case studies | `index.html` | `project-grid` and `project-dialog` |
| Project and essay images | `assets/images/` | Replace a file or update its `src` path |
| Portfolio assistant answers | `app.js` | `assistantResponses` |
| Colors, type, spacing, and animation | `styles.css` | The variables under `:root` |
| Résumé content | `resume.html` | Edit the visible résumé sections |
| Long-form source notes | `content/` | Markdown files grouped by project and essay |

## Adding a project

1. Put its image in `assets/images/`.
2. Copy one `<article class="project-card">` block in `index.html`.
3. Give it a unique `id`, update the text and image, and set `data-category` to one or more existing filter values.
4. Add a matching repository-list item if you want it shown in the left panel.
5. Copy a project `<dialog>` at the bottom of `index.html` if you want a case-study window. The card button's `data-dialog` must match the dialog's `id`.
6. Increase the project count displayed in the repository and project headers.

## Updating the assistant

The assistant is not an external AI service. It is a small private keyword guide that runs entirely in the visitor's browser. Edit the text inside `assistantResponses` in `app.js`. You can also update `classifyQuestion()` if you want a new word or phrase to route to a specific answer.

## Previewing locally

Open `index.html` directly, or from this folder run:

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Publishing on GitHub Pages

Upload the contents of this folder to the root of your `professional-portfolio` repository. In **Settings → Pages**, choose **Deploy from a branch**, select `main` and `/(root)`, then save. The project-site address is:

`https://jafaga.github.io/professional-portfolio/`
