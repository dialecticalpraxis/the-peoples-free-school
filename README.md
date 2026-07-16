# The People's Free School

[![CC BY-SA 4.0](https://licensebuttons.net/l/by-sa/4.0/88x31.png)](https://creativecommons.org/licenses/by-sa/4.0/)

*A model for adults to study together. Free to use, adapt, and share.*

The People's Free School is an open, adoptable model for collective adult political education. It draws on the folk school tradition of Myles Horton and the critical pedagogy of Paulo Freire. There are no professors and no students in the usual sense. Everyone in the room is both a learner and a teacher. The curriculum is shaped by the people who show up.

This repository contains everything you need to start a school in your community: the principles the school operates by, the methods that make it work, a growing library of readings and other materials, and templates for running sessions.

**Start with the [Founding Statement](01-founding-statement.md).**

## What's in this repository

The teaching materials live in [content/](./content/), which is also the source for the published website (see below).

- **[content/start-here/](./content/start-here/)** — Founding statement, pedagogy, and the guide to starting a school in your community
- **[content/themes/](./content/themes/)** — The thematic resource library, organized around the nine themes that anchor the school's work
- **[content/session-templates/](./content/session-templates/)** — Plug-and-play structures for single sessions, multi-week study circles, and weekend intensives
- **[content/resources/](./content/resources/)** — Indexes of readings, podcasts, films, and primary sources, organized by author and format
- **[content/examples/](./content/examples/)** — Case studies from groups that have used the model

## How to use this repository

**Browse it here on GitHub.** Every file renders as a readable web page. Start with the founding statement and follow links from there.

**Use it in Obsidian.** The teaching materials in `content/` are designed to be opened as an [Obsidian](https://obsidian.md) vault, which makes the connections between readings, themes, and sessions navigable as a linked knowledge graph. You do **not** need to clone the whole repository (which also contains the website tooling) — you only want the `content/` folder. Two ways to get just the vault:

- **Download the vault (easiest, no tools).** Grab the latest [`peoples-free-school-vault.zip`](https://github.com/dialecticalpraxis/the-peoples-free-school/releases/tag/vault), unzip it, install [Obsidian](https://obsidian.md) (free), and choose *Open folder as vault* on the unzipped folder. That's it.
- **Pull just the content folder (for git users).** [`degit`](https://github.com/Rich-Harris/degit) copies a subfolder with no history or tooling:
  ```
  npx degit dialecticalpraxis/the-peoples-free-school/content my-free-school-vault
  ```
  Then open `my-free-school-vault` as a vault in Obsidian.

The downloadable vault is regenerated automatically from `content/` on every change, so it always matches the site.

**Read it as a published site.** A web-rendered version of this repository is published at https://dialecticalpraxis.github.io/the-peoples-free-school. The site is built with [Quartz](https://quartz.jzhao.xyz) from the files in `content/` and redeploys automatically whenever changes are pushed to `main`.

**Fork it and make it your own.** If you start a school using this model, you are welcome to fork the repository, adapt the materials to your community, and run your own version. We ask only that you keep the license intact and contribute back what you can.

## How to contribute

Contributions are welcome. The project grows when groups who use the model share back what they have built, learned, and discovered.

Ways to contribute:

- **Add a resource.** If you know a reading, podcast, film, or other material that belongs in the library, open a pull request adding it to the appropriate theme and lens, with a brief annotation explaining why it belongs.
- **Share a session.** If you have run a session that worked, document it and add it to the examples folder. Other groups will learn from your experience.
- **Improve a document.** If you spot something unclear, incomplete, or wrong, open an issue or a pull request.
- **Translate.** Translations of the founding statement, pedagogy, and how-to-start guide into other languages expand the model's reach.

See [CONTRIBUTING.md](./CONTRIBUTING.md) for details on the contribution process.

## License

The People's Free School is licensed under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/).

You are free to:

- **Share** — copy and redistribute the material in any medium or format
- **Adapt** — remix, transform, and build upon the material for any purpose, even commercially

Under the following terms:

- **Attribution** — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- **ShareAlike** — If you remix, transform, or build upon the material, you must distribute your contributions under the same license as the original.

See the [LICENSE](./LICENSE.md) file for the full license text.

## Acknowledgments

The People's Free School stands in a tradition built by many. We owe particular debts to Myles Horton and the [Highlander Research and Education Center](https://highlandercenter.org), to Paulo Freire, to Septima Clark and the Citizenship Schools, and to the long lineage of popular educators, folk schools, and study circles that came before us and continue around us.

## Contact

[Derron Borders, Developer](https://www.dialecticalpraxis.com/#contact)
