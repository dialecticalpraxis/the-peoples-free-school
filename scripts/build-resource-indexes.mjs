#!/usr/bin/env node
/**
 * build-resource-indexes.mjs
 *
 * Single source of truth for resources is the `resources:` frontmatter list on
 * each theme lens file (content/03-themes/<NN-theme>/<lens>.md). This script walks
 * those files, merges each resource across every lens/theme it appears in, and
 * regenerates the tables in the cross-cutting index pages under content/04-resources/.
 *
 * It only rewrites the block between the AUTO-GENERATED markers in each index
 * file, so the human-written intros and "notes on access/selection" are preserved.
 *
 * Run manually with `npm run resources`, or automatically as part of `prebuild`.
 * No network, no side effects beyond writing the four index files.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs"
import { join, dirname, basename } from "node:path"
import { fileURLToPath } from "node:url"
import { parse as parseYaml } from "yaml"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const THEMES_DIR = join(ROOT, "content", "03-themes")
const RESOURCES_DIR = join(ROOT, "content", "04-resources")

const BEGIN =
  "<!-- AUTO-GENERATED: resources — edit lens frontmatter, then run `npm run resources` -->"
const END = "<!-- END AUTO-GENERATED -->"

const LENS_LABELS = {
  experiential: "Experiential",
  historical: "Historical",
  theoretical: "Theoretical",
  practical: "Practical",
  liberatory: "Liberatory",
}

const KNOWN_FORMATS = new Set(["reading", "primary-source", "film", "video", "podcast"])

// Optional central file for resources not tied to a single theme/lens (see Q3).
const EXTRA_FILE = join(RESOURCES_DIR, "_extra.yaml")

// Top-level "sources" — archives, libraries, publishers, podcast shows, and
// channels to explore, as opposed to the specific items inside them.
const SOURCES_FILE = join(RESOURCES_DIR, "_sources.yaml")
const SOURCE_SECTIONS = [
  ["Archives & libraries", new Set(["archive", "library"])],
  ["Study guides & reading plans", new Set(["study-guide"])],
  ["Courses", new Set(["course"])],
  ["Publishers & imprints", new Set(["publisher"])],
  ["Podcasts & audio", new Set(["podcast"])],
  ["Video channels", new Set(["channel"])],
  ["Projects & networks", new Set(["project", "network"])],
]

const warnings = []
function warn(where, msg) {
  warnings.push(`  ! ${where}: ${msg}`)
}

/** Flag common frontmatter mistakes that would otherwise drop a resource silently. */
function validate(r, where) {
  if (!r || typeof r !== "object") return false
  if (!r.title) {
    const miskeyed = Object.keys(r).find((k) => k.toLowerCase() === "title")
    warn(
      where,
      miskeyed
        ? `entry uses "${miskeyed}:" — must be lowercase "title:"`
        : "entry has no title (skipped)",
    )
    return false
  }
  if (r.format && !KNOWN_FORMATS.has(r.format)) {
    warn(
      where,
      `"${r.title}" has format "${r.format}" — not one of ${[...KNOWN_FORMATS].join(", ")}; ` +
        `it will appear only in all-resources.md, not a format-specific index`,
    )
  }
  return true
}

// ---------------------------------------------------------------------------
// 1. Collect every resource record from theme lens frontmatter
// ---------------------------------------------------------------------------

function readFrontmatter(text) {
  if (!text.startsWith("---")) return null
  const end = text.indexOf("\n---", 3)
  if (end === -1) return null
  const raw = text.slice(3, end)
  try {
    return parseYaml(raw) || {}
  } catch (err) {
    throw new Error(`Failed to parse frontmatter: ${err.message}`)
  }
}

/** Fallback: "01-how-capitalism-works" -> "How Capitalism Works" */
function slugToLabel(slug) {
  return slug
    .replace(/^\d+[-_]?/, "")
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ")
}

/** Prefer the theme's frontmatter title, then its H1, else derive from the slug. */
const themeNameCache = new Map()
function themeLabel(slug) {
  if (themeNameCache.has(slug)) return themeNameCache.get(slug)
  let name = slugToLabel(slug)
  try {
    const idx = readFileSync(join(THEMES_DIR, slug, "index.md"), "utf8")
    const fm = readFrontmatter(idx)
    if (fm && fm.title) {
      name = String(fm.title).trim()
    } else {
      const m = idx.match(/^#\s+(.+?)\s*$/m)
      if (m) name = m[1].trim()
    }
  } catch {
    // no index.md; keep the slug-derived label
  }
  themeNameCache.set(slug, name)
  return name
}

/** Stable identity so the same resource used in several lenses merges into one row. */
function resourceKey(r) {
  if (r.id) return `id:${r.id}`
  if (r.url) return `url:${r.url.replace(/\/$/, "").toLowerCase()}`
  return `tt:${(r.title || "").toLowerCase()}|${r.year || ""}`
}

function collectResources() {
  const merged = new Map()

  const themeSlugs = readdirSync(THEMES_DIR).filter((name) =>
    statSync(join(THEMES_DIR, name)).isDirectory(),
  )

  for (const themeSlug of themeSlugs.sort()) {
    const themeDir = join(THEMES_DIR, themeSlug)
    const lensFiles = readdirSync(themeDir).filter(
      (f) => f.endsWith(".md") && basename(f, ".md") in LENS_LABELS,
    )

    for (const file of lensFiles) {
      const lens = basename(file, ".md")
      const fm = readFrontmatter(readFileSync(join(themeDir, file), "utf8"))
      if (!fm || !Array.isArray(fm.resources)) continue

      for (const r of fm.resources) {
        if (!validate(r, `themes/${themeSlug}/${file}`)) continue
        const key = resourceKey(r)
        const location = {
          themeSlug,
          lens,
          // Quartz resolves this wikilink to the lens page. The alias pipe is
          // escaped as \| so it is not read as a table-column separator.
          link: `[[${themeSlug}/${lens}\\|${themeLabel(themeSlug)} · ${LENS_LABELS[lens]}]]`,
        }
        addResource(merged, key, r, location)
      }
    }
  }

  // Central file: resources not (yet) filed under a theme lens. Each entry may
  // set `used_in` (plain text or a [[wikilink]]); otherwise it shows as unfiled.
  if (existsSync(EXTRA_FILE)) {
    let extra
    try {
      extra = parseYaml(readFileSync(EXTRA_FILE, "utf8"))
    } catch (err) {
      warn("resources/_extra.yaml", `could not parse: ${err.message}`)
    }
    const list = Array.isArray(extra)
      ? extra
      : Array.isArray(extra?.resources)
        ? extra.resources
        : []
    list.forEach((r, i) => {
      if (!validate(r, `resources/_extra.yaml[${i}]`)) return
      const location = {
        themeSlug: `_extra:${i}`,
        lens: "",
        link: r.used_in ? String(r.used_in) : "_unfiled_",
      }
      addResource(merged, resourceKey(r), r, location)
    })
  }

  return [...merged.values()]
}

function addResource(merged, key, r, location) {
  if (merged.has(key)) {
    merged.get(key).usedIn.push(location)
  } else {
    merged.set(key, { ...r, usedIn: [location] })
  }
}

function collectSources() {
  if (!existsSync(SOURCES_FILE)) return []
  let parsed
  try {
    parsed = parseYaml(readFileSync(SOURCES_FILE, "utf8"))
  } catch (err) {
    warn("resources/_sources.yaml", `could not parse: ${err.message}`)
    return []
  }
  const list = Array.isArray(parsed) ? parsed : Array.isArray(parsed?.sources) ? parsed.sources : []
  return list.filter((s, i) => {
    if (!s || !s.name) {
      warn(`resources/_sources.yaml[${i}]`, "source has no name (skipped)")
      return false
    }
    if (!s.url) warn(`resources/_sources.yaml[${i}]`, `"${s.name}" has no url`)
    return true
  })
}

// ---------------------------------------------------------------------------
// 2. Formatting helpers
// ---------------------------------------------------------------------------

const ACCESS_LABEL = {
  free: "Free",
  borrow: "Free to borrow",
  paywalled: "Paywalled",
  print: "Print",
}

const FORMAT_LABEL = {
  reading: "Reading",
  "primary-source": "Primary source",
  film: "Film",
  video: "Video / lecture",
  podcast: "Podcast",
}

function cell(s) {
  // Escape pipes so table cells never break.
  return String(s ?? "")
    .replace(/\|/g, "\\|")
    .replace(/\n+/g, " ")
    .trim()
}

function authorList(r) {
  return Array.isArray(r.authors) ? r.authors.join(", ") : r.authors || "—"
}

function accessCell(r) {
  return ACCESS_LABEL[r.access] || (r.access ? cell(r.access) : "—")
}

function linkedTitle(r) {
  const title = cell(r.title)
  return r.url ? `[${title}](${r.url})` : title
}

function usedInCell(r) {
  // De-dupe (same lens listed twice) and keep a stable order.
  const seen = new Set()
  return r.usedIn
    .filter((l) => {
      const k = `${l.themeSlug}/${l.lens}`
      if (seen.has(k)) return false
      seen.add(k)
      return true
    })
    .map((l) => l.link)
    .join("<br>")
}

function table(headers, rows) {
  if (rows.length === 0)
    return "> _None yet. Add resources to a theme lens and re-run `npm run resources`._"
  const head = `| ${headers.join(" | ")} |`
  const sep = `| ${headers.map(() => "---").join(" | ")} |`
  const body = rows.map((cells) => `| ${cells.join(" | ")} |`).join("\n")
  return [head, sep, body].join("\n")
}

function bySurname(a, b) {
  const key = (r) => {
    const first = Array.isArray(r.authors) ? r.authors[0] : r.authors || r.title
    const parts = String(first).trim().split(/\s+/)
    return (parts[parts.length - 1] || "").toLowerCase()
  }
  return key(a).localeCompare(key(b)) || cell(a.title).localeCompare(cell(b.title))
}

function byTitle(a, b) {
  return cell(a.title).localeCompare(cell(b.title))
}

// ---------------------------------------------------------------------------
// 3. Build each index's generated block
// ---------------------------------------------------------------------------

function readingsBlock(resources) {
  const readings = resources.filter((r) => r.format === "reading").sort(bySurname)
  const rows = readings.map((r) => [
    cell(authorList(r)),
    linkedTitle(r),
    cell(r.year ?? "—"),
    accessCell(r),
    usedInCell(r),
  ])
  return [
    `_${readings.length} readings, indexed by author. Generated from theme lens frontmatter._`,
    "",
    table(["Author", "Work", "Year", "Access", "Used in"], rows),
  ].join("\n")
}

function filmsBlock(resources) {
  const films = resources.filter((r) => r.format === "film")
  const sections = [
    ["Documentaries", (r) => r.kind === "documentary"],
    ["Narrative films", (r) => r.kind === "narrative"],
    ["Other films", (r) => r.kind !== "documentary" && r.kind !== "narrative"],
  ]
  const out = [`_${films.length} films and documentaries. Generated from theme lens frontmatter._`]
  for (const [heading, pred] of sections) {
    const rows = films
      .filter(pred)
      .sort(byTitle)
      .map((r) => [
        linkedTitle(r),
        cell(authorList(r)),
        cell(r.year ?? "—"),
        cell(r.length ?? "—"),
        accessCell(r),
        usedInCell(r),
      ])
    out.push(
      "",
      `### ${heading}`,
      "",
      table(["Title", "Director / creator", "Year", "Length", "Access", "Used in"], rows),
    )
  }
  return out.join("\n")
}

function videosBlock(resources) {
  const videos = resources.filter((r) => r.format === "video").sort(bySurname)
  const rows = videos.map((r) => [
    linkedTitle(r),
    cell(authorList(r)),
    cell(r.year ?? "—"),
    cell(r.length ?? "—"),
    cell(r.kind ?? "—"),
    accessCell(r),
    usedInCell(r),
  ])
  return [
    `_${videos.length} videos and lectures — online explainers, lectures, and video essays (distinct from films you would screen). Generated from theme lens frontmatter._`,
    "",
    table(["Title", "Creator", "Year", "Length", "Type", "Access", "Used in"], rows),
  ].join("\n")
}

function podcastsBlock(resources) {
  const pods = resources.filter((r) => r.format === "podcast")
  const sections = [
    ["Ongoing podcasts", (r) => r.kind !== "episode"],
    ["Notable episodes", (r) => r.kind === "episode"],
  ]
  const out = [`_${pods.length} podcasts. Generated from theme lens frontmatter._`]
  for (const [heading, pred] of sections) {
    const rows = pods
      .filter(pred)
      .sort(byTitle)
      .map((r) => [
        linkedTitle(r),
        cell(authorList(r)),
        r.kind === "episode" ? cell(r.year ?? "—") : cell(r.year ? `${r.year}–` : "—"),
        accessCell(r),
        usedInCell(r),
      ])
    out.push(
      "",
      `### ${heading}`,
      "",
      table(["Show / episode", "Host", "Year", "Access", "Used in"], rows),
    )
  }
  return out.join("\n")
}

function primarySourcesBlock(resources) {
  const sources = resources.filter((r) => r.format === "primary-source").sort(bySurname)
  const rows = sources.map((r) => [
    linkedTitle(r),
    cell(authorList(r)),
    cell(r.year ?? "—"),
    cell(r.kind ?? "—"),
    accessCell(r),
    usedInCell(r),
  ])
  return [
    `_${sources.length} primary sources. Generated from theme lens frontmatter._`,
    "",
    table(["Source", "Author / holder", "Year", "Type", "Access", "Used in"], rows),
  ].join("\n")
}

function masterBlock(resources) {
  const rows = [...resources]
    .sort(
      (a, b) =>
        (FORMAT_LABEL[a.format] || a.format || "").localeCompare(
          FORMAT_LABEL[b.format] || b.format || "",
        ) || bySurname(a, b),
    )
    .map((r) => [
      linkedTitle(r),
      cell(authorList(r)),
      cell(r.year ?? "—"),
      FORMAT_LABEL[r.format] || cell(r.format ?? "—"),
      accessCell(r),
      usedInCell(r),
    ])
  return [
    `_${resources.length} resources in total, every format, sorted by format then author. Generated from theme lens frontmatter._`,
    "",
    table(["Title", "Author / creator", "Year", "Format", "Access", "Used in"], rows),
  ].join("\n")
}

function sourcesBlock(sources) {
  const linkName = (s) => (s.url ? `[${cell(s.name)}](${s.url})` : cell(s.name))
  const allTypes = new Set(SOURCE_SECTIONS.flatMap(([, types]) => [...types]))
  const out = [
    `_${sources.length} sources — archives, libraries, shows, and channels to browse on your own. ` +
      `For the specific items drawn from them, see [[all-resources|all resources]]. ` +
      `Generated from content/04-resources/_sources.yaml._`,
  ]

  const section = (heading, rows) => {
    if (rows.length)
      out.push("", `### ${heading}`, "", table(["Source", "Access", "What you'll find"], rows))
  }
  const toRow = (s) => [linkName(s), accessCell(s), cell(s.note ?? "—")]
  const byName = (a, b) => cell(a.name).localeCompare(cell(b.name))

  for (const [heading, types] of SOURCE_SECTIONS) {
    section(
      heading,
      sources
        .filter((s) => types.has(s.type))
        .sort(byName)
        .map(toRow),
    )
  }
  section(
    "Other",
    sources
      .filter((s) => !allTypes.has(s.type))
      .sort(byName)
      .map(toRow),
  )

  return out.join("\n")
}

// ---------------------------------------------------------------------------
// 4. Splice generated blocks into the index files
// ---------------------------------------------------------------------------

function spliceBlock(file, generated) {
  const path = join(RESOURCES_DIR, file)
  const text = readFileSync(path, "utf8")
  const block = `${BEGIN}\n\n${generated}\n\n${END}`

  let next
  if (text.includes(BEGIN) && text.includes(END)) {
    next = text.replace(new RegExp(`${escapeRe(BEGIN)}[\\s\\S]*?${escapeRe(END)}`), block)
  } else {
    // First run: append the block before the trailing "## Status" section if present.
    const marker = "\n## Status"
    const idx = text.indexOf(marker)
    next =
      idx === -1
        ? `${text.trimEnd()}\n\n${block}\n`
        : text.slice(0, idx) + `\n${block}\n` + text.slice(idx)
  }

  if (next !== text) {
    writeFileSync(path, next)
    return true
  }
  return false
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// ---------------------------------------------------------------------------
// 5. Main
// ---------------------------------------------------------------------------

const resources = collectResources()
const sources = collectSources()
const outputs = [
  ["sources.md", sourcesBlock(sources)],
  ["readings-by-author.md", readingsBlock(resources)],
  ["films.md", filmsBlock(resources)],
  ["videos-and-lectures.md", videosBlock(resources)],
  ["podcasts.md", podcastsBlock(resources)],
  ["primary-sources.md", primarySourcesBlock(resources)],
  ["all-resources.md", masterBlock(resources)],
]

let changed = 0
for (const [file, block] of outputs) {
  if (spliceBlock(file, block)) changed++
}

const themeCount = new Set(
  resources.flatMap((r) => r.usedIn.map((l) => l.themeSlug)).filter((s) => !s.startsWith("_extra")),
).size

console.log(
  `resources: ${resources.length} items across ${themeCount} theme(s), ${sources.length} sources; ` +
    `updated ${changed}/${outputs.length} index files.`,
)

if (warnings.length) {
  console.warn(`\n${warnings.length} warning(s):`)
  for (const w of warnings) console.warn(w)
}
