# Portfolio editing map

This site is deliberately built with plain HTML, CSS, and JavaScript so it stays easy to edit and deploy on GitHub Pages. No package installation or build command is required.

## The files you will edit most often

| What you want to change | File | What to search for |
| --- | --- | --- |
| Name, headline, introduction, and contact details | `index.html` | `Justine Afaga`, `hero-lede`, and `contact_info.json` |
| About text and quick statistics | `index.html` | `user_profile.log` and `stats-grid` |
| Skills and their descriptions | `index.html` | `data-skill=` |
| Skill logo images | `assets/images/skills/` | See the README inside that folder |
| Education, work, and volunteer history | `index.html` | `data-timeline` |
| Project cards | `index.html` | `project-grid` |
| Full project reports | `projects/` | One HTML page per project |
| Journal cards | `index.html` | `writing-grid` |
| Full journal posts | `blog/` | One HTML page per post |
| GitHub account used by the live repository list | `app.js` | `githubUsername` |
| Project and essay images | `assets/images/` | Replace a file or update its `src` path |
| Portfolio assistant answers | `app.js` | `assistantResponses` |
| Colors, type, spacing, and animation | `styles.css` | The variables under `:root` |
| Résumé PDF | `assets/resume/AfagaJustine_resume_OFFICIAL.pdf` | Replace this file and keep the same filename |
| Long-form source notes | `content/` | Markdown files grouped by project and essay |

## Adding a project

1. Put its image in `assets/images/`.
2. Copy one `<article class="project-card">` block in `index.html`.
3. Give it a unique `id`, update the text and image, and set `data-category` to one or more existing filter values.
4. Copy one report page in `projects/`, rename it, and edit the report content.
5. Point the card image, title, and `Open report` link to that page.
6. Increase the project count displayed in the project header.

## Adding a journal post

1. Copy one HTML page in `blog/` and give the copy a short filename.
2. Update its title, description, reading metadata, image, and article text.
3. Copy one `.writing-card` in `index.html` and point both card links to the new page.
4. Keep the older Markdown notes in `content/essays/` if you want a source archive.

## GitHub repository list

The left repository panel automatically loads up to 12 recently updated public repositories from the `Jafaga` GitHub account. Each row opens the real repository in a new tab. It uses GitHub's public API without a token and keeps a 15-minute browser-session cache. If GitHub cannot be reached, the two saved portfolio repository links remain available.

## Replacing the résumé PDF

1. Rename your finished résumé file to `AfagaJustine_resume_OFFICIAL.pdf`.
2. Open `assets`, then `resume`.
3. Replace the existing PDF with your new file.
4. Do not change the filename. The header, About card, and portfolio assistant all point to this one file.

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
