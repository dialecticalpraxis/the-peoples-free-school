# Publishing this vault with Quartz

This repository is both an Obsidian vault and a [Quartz](https://quartz.jzhao.xyz) website. The notes in `content/` are published to https://dialecticalpraxis.github.io/the-peoples-free-school. Everything else at the repo root is Quartz machinery.

## How it fits together

- `content/` holds every published note. Each folder has an `index.md` that serves as its landing page. Add or edit Markdown here to change the site. Obsidian wikilinks (`[[note]]`, `[[folder/note|label]]`) work as-is.
- `quartz.config.yaml` controls the site: title, `baseUrl`, colors, fonts, and which plugins are on.
- `quartz.lock.json` pins the exact plugin versions used for a build.
- `.github/workflows/deploy.yml` rebuilds and redeploys the site every time you push to `main`.
- `quartz/`, `package.json`, and the other root files are Quartz itself. You rarely touch these.

## One-time setup on GitHub

The site does not go live until GitHub Pages is switched to build from Actions:

1. Push the current changes to `main` (see below).
2. On GitHub, open the repo's **Settings > Pages**.
3. Under **Source**, choose **GitHub Actions**.
4. Open the **Actions** tab and watch the "Deploy Quartz site to GitHub Pages" workflow finish. The site appears at the URL above.

If a run fails with an environment protection error, delete any existing `github-pages` environment under **Settings > Environments** and re-run.

## Editing and previewing locally

You need Node 22 or newer. From the repo root:

```
npm install              # first time only
npx quartz plugin install # first time only; fetches the community plugins
npx quartz build --serve  # preview at http://localhost:8080
```

Edit files in `content/`, and the preview reloads. When you are happy, commit and push to `main` and the live site updates on its own.

## Notes on this setup

- Social-share preview images (the `og-image` plugin) are turned off in `quartz.config.yaml` because they require fetching a font at build time. Set `enabled: true` on that plugin to turn them back on.
- The `quartz-themes` preset pack was removed from the lockfile to keep builds fast; it was not in use.
- To point the site at a custom domain, follow the "Custom Domain" steps in the [Quartz hosting docs](https://quartz.jzhao.xyz/hosting) and set `baseUrl` accordingly.
