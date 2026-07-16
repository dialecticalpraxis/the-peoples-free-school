# Contributing to The People's Free School

Thank you for wanting to help. This project grows when the people who use the model share back what they have built, learned, and discovered. You do not need to be a programmer, and you do not need to know anything about code, Git, or GitHub to contribute. This guide will walk you through it from the very beginning.

Read the part that fits how you want to help. You do not need to read the whole thing.

## Table of contents

- [The short version](#the-short-version)
- [Ways to contribute](#ways-to-contribute)
- [If you have never used GitHub before, start here](#if-you-have-never-used-github-before-start-here)
- [Path 1: Suggest a change without editing anything (open an "issue")](#path-1-suggest-a-change-without-editing-anything-open-an-issue)
- [Path 2: Edit a file right in your web browser (no software to install)](#path-2-edit-a-file-right-in-your-web-browser-no-software-to-install)
- [Path 3: Add a brand-new file or a whole example](#path-3-add-a-brand-new-file-or-a-whole-example)
- [Path 4: The advanced route (fork, clone, and Obsidian)](#path-4-the-advanced-route-fork-clone-and-obsidian)
- [How the repository is organized](#how-the-repository-is-organized)
- [Adding a resource (field reference)](#adding-a-resource-field-reference)
- [House style and conventions](#house-style-and-conventions)
- [What we can and cannot accept](#what-we-can-and-cannot-accept)
- [A glossary of GitHub words](#a-glossary-of-github-words)
- [Getting help](#getting-help)

---

## The short version

If you already know your way around GitHub: fork the repo, make a branch, add your material to the right theme and lens (or to `examples/`), keep the license intact, and open a pull request with a short description of what you added and why. Resources are added as `resources:` frontmatter on the theme lens file — the cross-cutting index tables in `resources/` are generated automatically, so you never edit them by hand. See [Adding a resource (field reference)](#adding-a-resource-field-reference). Skip to [House style and conventions](#house-style-and-conventions).

Everyone else: keep reading. It is genuinely not hard, and you can do all of it in a web browser.

---

## Ways to contribute

There is no small contribution. Any of these help:

- **Add a resource.** Know a reading, podcast, film, or other material that belongs in the library? Add it to the appropriate theme and lens, with a brief note explaining why it belongs.
- **Share a session.** Ran a session that worked (or one that didn't)? Document it and add it to the `examples/` folder so other groups can learn from it.
- **Improve a document.** Spot something unclear, incomplete, or wrong? Fix a typo, sharpen a sentence, or flag the problem for someone else to fix.
- **Translate.** Translations of the founding statement, pedagogy, and how-to-start guide into other languages expand the model's reach.
- **Ask a question or raise an idea.** If you are not sure something belongs, or you have a suggestion but not a specific edit, that is worth sharing too.

You do not have to know which "path" below to use. Pick the one that matches how much you want to do, and if in doubt, use [Path 1](#path-1-suggest-a-change-without-editing-anything-open-an-issue) — it is the simplest.

---

## If you have never used GitHub before, start here

**What is GitHub?** GitHub is a website that stores this project's files and keeps a history of every change ever made to it. Think of it like a shared Google Drive folder, except it remembers every version and lets many people suggest changes without stepping on each other.

**What is Git?** Git is the technology underneath that tracks those changes. Good news: for everything in Paths 1, 2, and 3 below, **you never touch Git directly.** You just click buttons on the GitHub website.

**Do I need to install anything?** No. Paths 1, 2, and 3 happen entirely in your web browser.

**Do I need an account?** Yes, a free GitHub account. To create one:

1. Go to [github.com](https://github.com).
2. Click **Sign up**.
3. Enter an email address, choose a password and a username, and follow the prompts. It is free.
4. Verify your email when GitHub sends you a confirmation message.

That is the only setup you need for Paths 1–3. Come back here when you are signed in.

**A note on nervousness:** You cannot break anything. Nothing you do gets published to the project automatically. Every change you suggest has to be reviewed and approved by a maintainer before it becomes part of the project. So click around, try things, and don't worry.

---

## Path 1: Suggest a change without editing anything (open an "issue")

This is the easiest way to contribute. An **issue** is just a message to the maintainers — a note that says "here's a typo," "this reading belongs in theme 3," "this link is broken," or "have you considered adding X?" You are not editing any files; you are leaving a note.

Use this path when you want to point something out but would rather someone else make the actual change, or when you have a question or an idea rather than a finished edit.

**Steps:**

1. Go to the project's page on GitHub: **https://github.com/dialecticalpraxis/the-peoples-free-school**
2. Near the top, click the **Issues** tab.
3. Click the green **New issue** button.
4. Give it a short, clear **title** (for example: "Broken link in pedagogy document" or "Suggested reading for theme 2: labor").
5. In the big text box, describe what you noticed or suggest. The more specific, the better — if it's about a particular file, name the file or paste the link to it.
6. Click **Submit new issue**.

That's it. A maintainer will see it and respond. You can come back to that issue's page any time to see replies.

---

## Path 2: Edit a file right in your web browser (no software to install)

Use this path to fix a typo, improve a sentence, or add a resource to a file that already exists. GitHub lets you edit any file directly on the website. Behind the scenes it handles all the Git steps for you.

Here is the whole process. It looks long because every click is spelled out, but it takes about two minutes once you've done it once.

### Step 1 — Find the file you want to change

1. Go to **https://github.com/dialecticalpraxis/the-peoples-free-school**
2. Click through the folders to the file you want to edit. For example, to add a reading to the "theoretical" lens of the capitalism theme, you would click `themes` → `01-how-capitalism-works` → `theoretical.md`.
3. You are now looking at the file.

### Step 2 — Open the editor

1. Look for the **pencil icon** (✏️) near the top right of the file. Hovering over it says "Edit this file."
2. Click it.
3. If GitHub shows a message about forking (something like "You need to fork this repository to propose changes"), click the green button to continue. **This is normal and expected** — GitHub is making your own copy to work in so you can't accidentally change the original. You don't have to understand it; just click through.

### Step 3 — Make your change

1. You are now in a text editor in your browser. Type your change directly, the same way you'd edit any document.
2. The files are written in **Markdown**, a simple way of formatting plain text. You mostly don't need to worry about it — write normal sentences. If you want to match the formatting around your text (headings, bold, links), copy the pattern of the lines already in the file. There is a short [style section below](#house-style-and-conventions).

### Step 4 — Describe your change

1. Scroll to the bottom, or click the green **Commit changes...** button.
2. A box appears asking you to describe what you did. In the first line, write a short summary, like `Fix typo in founding statement` or `Add Silvia Federici reading to theme 4`. This summary is called a **commit message** — it's just a human-readable note about what changed.
3. Leave the option set to **"Create a new branch for this commit and start a pull request"** if it's offered (a **branch** is just a named copy of your work; you don't need to think about it).

### Step 5 — Open the pull request

1. Click **Propose changes**, then **Create pull request**.
2. A **pull request** (often shortened to **PR**) is your formal request that says: "Here is a change I made — please review it and, if you like it, add it to the project."
3. Give it a title and, in the description box, briefly explain **what** you changed and **why**. For a new resource, say why it belongs (see [House style](#house-style-and-conventions)).
4. Click **Create pull request**.

**Done.** A maintainer will review it. They might merge it as-is, or leave a comment asking a question or suggesting a tweak. You'll get a notification. If they ask for a change, you can edit the same file again the same way, and it updates the pull request automatically.

---

## Path 3: Add a brand-new file or a whole example

Sometimes you're not editing an existing file — you're adding a new one. The most common case is **contributing an example**: documentation of a session or study circle your group ran, which lives in its own folder under `examples/`.

You can do this in the browser too:

1. Go to **https://github.com/dialecticalpraxis/the-peoples-free-school**
2. Navigate into the folder where the new file belongs (for an example, click into `examples/`).
3. Near the top right, click **Add file** → **Create new file**.
4. In the filename box at the top, type the name. To create a new folder at the same time, type the folder name, then a `/`, then the filename. For example: `flint-hills-first-circle/README.md` creates a folder called `flint-hills-first-circle` with a `README.md` file inside it.
5. Write your content in the editor.
6. Follow **Steps 4 and 5 from Path 2** above (describe the change, create a branch, open a pull request).

See the [examples/README.md](./examples/README.md) for what makes a good example and an important note about participant consent and privacy.

---

## Path 4: The advanced route (fork, clone, and Obsidian)

You only need this path if you want to make a large contribution, work on many files at once, or work offline. It is also the way to go if you want to use [Obsidian](https://obsidian.md) to see the whole repository as a connected web of notes, which is how the project is designed to be read. **If Paths 1–3 cover what you need, you can skip this section entirely.**

This path uses **Git** on your own computer. Here is the shape of it:

1. **Fork the repository.** On the project's GitHub page, click **Fork** (top right). This makes a copy of the whole project under your own GitHub account.
2. **Clone your fork.** "Cloning" means downloading it to your computer. You'll need Git installed ([git-scm.com](https://git-scm.com) has installers for every system) or a friendlier app like [GitHub Desktop](https://desktop.github.com), which does the same thing with buttons instead of typed commands. In GitHub Desktop: **File → Clone repository**, then pick your fork.
3. **Open the folder in Obsidian (optional).** Install Obsidian (free), then **Open folder as vault** and choose the cloned folder. Now the `[[wikilinks]]` between readings, themes, and sessions become clickable and navigable as a graph.
4. **Make your changes** in Obsidian or any text editor.
5. **Commit and push.** In GitHub Desktop, your changes appear in the left panel. Write a summary, click **Commit to main** (or to a branch), then **Push origin** to send them up to your fork on GitHub.
6. **Open a pull request** from your fork back to the main project, the same way as in Path 2, Step 5.

If any of that is unfamiliar, GitHub's own guide — [github.com/git-guides](https://github.com/git-guides) — walks through fork, clone, commit, and push in more depth. And you are always welcome to use the simpler browser paths above instead.

---

## How the repository is organized

Knowing where things go makes contributing much easier. Here is the layout:

- **`start-here/`** — The founding statement, the pedagogy, the how-to-start guide, and the facilitator guide. The core documents of the project.
- **`themes/`** — The heart of the resource library. There are nine numbered theme folders (for example, `01-how-capitalism-works`). Inside each theme, materials are sorted by **lens** into five files:
  - `theoretical.md` — concepts and frameworks for understanding the theme
  - `historical.md` — how it came to be, told through history
  - `experiential.md` — material rooted in lived and felt experience
  - `practical.md` — how it connects to organizing and action
  - `liberatory.md` — visions and practices of freedom and alternatives
- **`session-templates/`** — Ready-to-use structures for single sessions, six-week study circles, and weekend intensives.
- **`resources/`** — Cross-cutting **indexes** (readings by author, films, videos, podcasts, primary sources, an all-resources master table, and top-level sources). These tables are **generated automatically** from the resources tagged in the theme files — you never edit them by hand. The material itself lives in the theme folders.
- **`examples/`** — Case studies from groups that have used the model. Each example gets its own folder.

**Where does a new reading go?** Into the theme and lens it best fits — for instance, a Silvia Federici text on reproductive labor goes in `themes/04-gender-reproduction-and-the-household/historical.md`. You add it as a `resources:` entry in that file's frontmatter; the index tables update themselves. The exact fields are in [Adding a resource (field reference)](#adding-a-resource-field-reference) below.

If you're unsure which theme or lens fits, it's fine to make your best guess and say so in your pull request, or to open an issue and ask.

---

## Adding a resource (field reference)

Resources are stored as structured data, and the index tables in `resources/` (readings by author, films, videos, podcasts, primary sources, the all-resources master, and sources) are **generated from it**. You add the data in one place; the tables rebuild themselves whenever the site builds. **Never edit the tables in `resources/` by hand** — your changes there will be overwritten.

### Where to add it

- **A specific item** (a single text, episode, film, or document) → the `resources:` frontmatter of the theme lens it fits, e.g. `themes/01-how-capitalism-works/theoretical.md`. The theme and lens are read from the file's location, and an item used in more than one lens is merged into one row automatically.
- **An item not tied to one theme/lens yet** → `resources/_extra.yaml`.
- **A whole source** — an archive, library, publisher, podcast show, or channel to explore, rather than one item → `resources/_sources.yaml` (appears on the *Sources to explore* page).

### Item fields

Frontmatter goes at the very top of the lens file, between `---` lines:

```yaml
---
resources:
  - title: "Value, Price and Profit"     # required
    authors: ["Karl Marx"]               # list; use the show/host for podcasts, director for films
    year: 1865                            # optional
    format: reading                       # required — see the list below
    kind: book                            # optional sub-type — see suggestions below
    access: free                          # free | borrow | paywalled | print
    url: "https://..."                    # link to the material
    length: "58 min"                      # optional — for films, videos, podcasts
    note: "One line describing it for the table."
---
```

**`format`** (this decides which index the item lands in) — one of exactly:

| `format` | Index it appears in | Use for |
| --- | --- | --- |
| `reading` | Readings by author | books, pamphlets, articles, handbooks |
| `primary-source` | Primary sources | manifestos, speeches, archives, oral histories, documents |
| `film` | Films and documentaries | documentaries and narrative films you'd screen |
| `video` | Videos and lectures | online explainers, lectures, video essays |
| `podcast` | Podcasts | podcast series and single episodes |

Every item also appears in the all-resources master table regardless of format. A `format` value not in this list still shows in the master table but won't land in a format-specific page — and the generator will print a warning in the build log, so watch for those.

**`kind`** (optional, free text; used to group rows) — suggested values by format:

- reading → `book`, `pamphlet`, `article`, `handbook`, `toolkit`, `reference`
- primary-source → `manifesto`, `speech`, `archive`, `collection`, `excerpt`, `testimony`
- film → `documentary`, `narrative`, `short`
- video → `explainer`, `lecture`, `essay`, `interview`
- podcast → `series` (an ongoing show) or `episode` (a single installment)

**`access`** — `free`, `borrow` (free to borrow, e.g. Internet Archive loans), `paywalled`, or `print`.

### Source fields

For `resources/_sources.yaml`:

```yaml
sources:
  - name: "Marxists Internet Archive"    # required
    type: archive                         # archive | library | study-guide | course | publisher | podcast | channel | project | network
    url: "https://www.marxists.org"       # required
    access: free
    note: "One line on what you'll find there."
```

### Common mistakes

- **Capitalized keys.** It must be `title:`, not `Title:` — YAML is case-sensitive, and a mis-cased key means the whole entry is skipped (the build log warns you).
- **A made-up `format`.** Stick to the five values above, or the item only shows in the master table.
- **Editing a table in `resources/`.** Those files are generated; edit the source instead.

If you're editing in your browser and can't run the generator, that's fine — the automation regenerates and commits the tables for you after your change is merged.

---

## House style and conventions

You don't need to memorize these. When in doubt, look at the lines already in the file you're editing and copy their pattern. A maintainer can always fix formatting during review.

**Markdown basics.** Files are written in Markdown, a lightweight way to format text:

- `# Heading`, `## Smaller heading`, `### Smaller still` — headings (the number of `#` sets the level)
- `**bold text**` — **bold**
- `*italic text*` — *italic*
- `- item` — a bulleted list
- `[link text](https://example.com)` — a link to a web page

**Annotate what you add.** Don't just drop in a title. Add a short note (a sentence or two) explaining what the material is and *why it belongs* in that theme and lens — what it helps a group see or understand. The whole library is annotated this way so that facilitators can choose well.

**Linking between files.** The project uses two kinds of links:

- **Wikilinks** like `[[readings-by-author|Readings by author]]` — these connect files inside the vault and are how Obsidian builds its graph. The part before the `|` is the file being linked; the part after is the text that shows. When you're adding to an existing file, match whichever style the surrounding lines use.
- **Standard Markdown links** like `[the pedagogy document](./start-here/02-pedagogy.md)` — used especially for links that need to work on the GitHub website.

**Respect privacy and consent.** When documenting sessions or the people in them, use first names or pseudonyms unless you have explicit consent, and never document anything shared in confidence. See the note in [examples/README.md](./examples/README.md).

**On access and copyright.** The school does not host or distribute copyrighted material. When a reading is paywalled or print-only, link to a publisher page and note that, rather than uploading the text itself. See the note in [resources/README.md](./resources/README.md).

---

## What we can and cannot accept

**We welcome:**

- Readings, media, and primary sources that fit the themes, with honest annotations
- Documentation of real sessions and study circles, including ones that didn't go as hoped
- Corrections, clarifications, and improvements to any document
- Translations
- Questions and suggestions

**We cannot accept:**

- Uploads of copyrighted texts, PDFs, or media the school has no right to distribute (link to them instead)
- Documentation that exposes participants without their consent
- Material that works against the school's purpose and principles — read the [Founding Statement](01-founding-statement.md) if you're unsure what that means

**Licensing.** This project is shared under a [Creative Commons Attribution-ShareAlike 4.0 International License](https://creativecommons.org/licenses/by-sa/4.0/). By contributing, you agree that your contribution can be shared under that same license, so that the whole project stays free for anyone to use, adapt, and share. Please keep the license intact in anything you add or adapt.

---

## A glossary of GitHub words

Every specialized word you'll meet, in plain language:

- **Repository (or "repo")** — the project and all its files, including their full history. This whole thing is one repository.
- **Issue** — a note or message about the project: a bug, a typo, a question, a suggestion. Opening an issue changes no files.
- **Fork** — your own personal copy of the repository, under your account, that you can change freely without affecting the original.
- **Branch** — a named line of work. It lets you prepare a change without disturbing the main version. GitHub often makes one for you automatically.
- **Commit** — a single saved change, with a short message describing it. Like hitting "save" with a note attached.
- **Commit message** — the short description you write for a commit, e.g. "Fix broken link in theme 3."
- **Pull request (or "PR")** — a request to add your changes to the main project. It's how a maintainer reviews and, if they approve, merges your work.
- **Merge** — accepting a pull request, so your change becomes part of the project.
- **Maintainer** — a person who reviews contributions and looks after the project.
- **Clone** — to download a copy of the repository to your own computer.
- **Push** — to send commits from your computer up to GitHub.
- **Markdown** — the simple text-formatting system all these files are written in.

---

## Getting help

Stuck at any step? That's normal, and asking is itself a fine way to start.

- **Open an issue** ([Path 1](#path-1-suggest-a-change-without-editing-anything-open-an-issue)) describing what you're trying to do and where you got stuck. Maintainers would much rather help than have you give up.
- For general GitHub how-to, [GitHub's own documentation](https://docs.github.com/en/get-started) is thorough and searchable.

The point of this school is that everyone in the room is both a learner and a teacher. The same is true here. You don't have to already know how any of this works to have something worth contributing. Welcome.
