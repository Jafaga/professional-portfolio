# Skill logo files

The skill constellation currently uses these square image files:

- `ja.png` — center image (already included)
- `python.svg`
- `java.svg`
- `javascript.svg`
- `html-css.svg`
- `cpp.svg`
- `git.svg`
- `prisma.svg`
- `macos.svg`

SVG or transparent PNG files both work. Keep the image square; the website places every logo inside a fixed circle with `object-fit: contain`, so rectangular source images will not escape the circle. If you switch a filename or extension, update both the `src` and `data-logo` values in `index.html`.

If a file is missing, the website automatically shows the original text initials until you add the logo.
