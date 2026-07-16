#!/usr/bin/env node
/**
 * build-school-index.mjs
 *
 * Builds a traditional back-of-book index for the whole school from the same
 * single source of truth as the resource tables: the `resources:` frontmatter
 * on each theme lens file, plus the subsection (###) headings in those files.
 *
 * It regenerates the block between the AUTO-GENERATED markers in
 * content/school-index.md, so the human-written intro is preserved. It produces:
 *   - People, thinkers, and authors (A to Z by surname, with works and locations)
 *   - Topics and subsections (A to Z, from lens ### headings)
 *   - Organizations, channels, and publishers (A to Z)
 *
 * Run with `npm run index`, or via `npm run generate`. No network, no side
 * effects beyond writing content/school-index.md.
 */

import { readFileSync, writeFileSync, readdirSync, statSync, existsSync } from "node:fs"
import { join, dirname, basename } from "node:path"
import { fileURLToPath } from "node:url"
import { parse as parseYaml } from "yaml"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const THEMES_DIR = join(ROOT, "content", "03-themes")
const OUT_FILE = join(ROOT, "content", "school-index.md")

const BEGIN =
  "<!-- AUTO-GENERATED: index — edit lens frontmatter and headings, then run `npm run index` -->"
const END = "<!-- END AUTO-GENERATED -->"

const LENS_LABELS = {
  experiential: "Experiential",
  historical: "Historical",
  theoretical: "Theoretical",
  practical: "Practical",
  liberatory: "Liberatory",
}

// ### headings that are format or structure labels, not topics worth indexing.
const SKIP_HEADINGS = new Set(
  [
    "video",
    "videos",
    "film",
    "films",
    "short video",
    "podcast",
    "podcasts",
    "films and video",
    "films and documentaries",
    "film and video",
    "journalism",
    "audio",
    "further listening",
    "further reading",
  ].map((s) => s.toLowerCase()),
)

// ---------------------------------------------------------------------------

function readFrontmatter(text) {
  if (!text.startsWith("---")) return null
  const end = text.indexOf("\n---", 3)
  if (end === -1) return null
  try {
    return parseYaml(text.slice(3, end)) || {}
  } catch {
    return null
  }
}

function slugToLabel(slug) {
  return slug
    .replace(/^\d+[-_]?/, "")
    .split("-")
    .map((w) => (w ? w[0].toUpperCase() + w.slice(1) : w))
    .join(" ")
}

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
    // keep slug-derived label
  }
  themeNameCache.set(slug, name)
  return name
}

/** Wikilink to a lens page, for a bullet-list context (plain, unescaped pipe). */
function lensLink(slug, lens) {
  return `[[${slug}/${lens}|${themeLabel(slug)} · ${LENS_LABELS[lens]}]]`
}

/** Distinguish a person's name from an organization, channel, or publisher. */
const ORG_RE =
  /\b(news|radio|institute|archives?|schools?|press|books?|committee|organi[sz]ation|podcast|magazine|network|projects?|collective|library|productions?|studios?|university|editorial|board|channel|party|times|review|report|company|associates|center|centre|forum|tube|profiles|appeal|ecologist|solarpunk|witness|culture|berkeley|oral history|BBC|DW|RSA|TED|NPR|PBS|DSA|PSL|NACLA|ISR|ACLU|FRELIMO|PAIGC|MPLA|CrashCourse|Tricontinental|Verso|Vox|Jacobin|Pathfinder|Democracy|Cold War|Great War|Daily Show|Working Class History|Second Thought|Deprogram|Cosmonaut|Guerrilla History|Overthink|Philosophize This|BreakThrough|Our Human Planet|Behind Asia|Heterodox Marxism|History Matters|Get\.history|ENDEVR|SuperNamn|Bisi|Asianometry|Hakim|Densho|Grist|Atmos|Truthout|Dissent|Shareable|SisterSong|StoryCorps|Upstream|Netflix|Harvard)\b/i

// Mononym thinkers that would otherwise be read as single-token channels.
const PERSON_ALLOWLIST = new Set(["Voline", "Novalis", "Bifo"])

function isOrg(name) {
  const n = name.trim()
  if (PERSON_ALLOWLIST.has(n)) return false
  if (/^the\s/i.test(n)) return true // "The Appeal", "The RSA", "The Red Nation"...
  if (n.includes("&")) return true // "Then & Now", "Theory & Philosophy"
  if (n.includes(":") || n.includes("(")) return true // "Tricontinental: ...", "ABC News (Australia)"
  if (ORG_RE.test(n)) return true
  if (!n.includes(" ")) return true // single-word handle: channel or alias
  return false
}

function surnameKey(name) {
  const p = name.trim().split(/\s+/)
  return (p[p.length - 1] || "").toLowerCase()
}

function cell(s) {
  return String(s ?? "").trim()
}

/** First A-Z letter of a sort key, for grouping; non-alphabetic falls under "#". */
function letterOf(key) {
  const m = String(key).match(/[a-z]/i)
  return m ? m[0].toUpperCase() : "#"
}

// ---------------------------------------------------------------------------
// Collect
// ---------------------------------------------------------------------------

function collect() {
  const people = new Map() // name -> { works: Map(title->url), locs: Map(key->link) }
  const orgs = new Map()
  const topics = new Map() // heading -> Map(key->link)

  const addName = (map, name, title, url, link, locKey) => {
    if (!map.has(name)) map.set(name, { works: new Map(), locs: new Map() })
    const e = map.get(name)
    if (title && !e.works.has(title)) e.works.set(title, url || "")
    e.locs.set(locKey, link)
  }

  const slugs = readdirSync(THEMES_DIR).filter((n) => {
    try {
      return statSync(join(THEMES_DIR, n)).isDirectory()
    } catch {
      return false
    }
  })

  for (const slug of slugs.sort()) {
    const dir = join(THEMES_DIR, slug)
    const files = readdirSync(dir).filter(
      (f) => f.endsWith(".md") && basename(f, ".md") in LENS_LABELS,
    )
    for (const file of files) {
      const lens = basename(file, ".md")
      const text = readFileSync(join(dir, file), "utf8")
      const link = lensLink(slug, lens)
      const locKey = `${slug}/${lens}`

      const fm = readFrontmatter(text)
      if (fm && Array.isArray(fm.resources)) {
        for (const r of fm.resources) {
          if (!r || !r.title) continue
          const authors = Array.isArray(r.authors) ? r.authors : r.authors ? [r.authors] : []
          for (const a of authors) {
            const name = String(a).trim()
            if (!name) continue
            addName(isOrg(name) ? orgs : people, name, cell(r.title), r.url, link, locKey)
          }
        }
      }

      for (const line of text.split("\n")) {
        const m = line.match(/^###\s+(.+?)\s*$/)
        if (!m) continue
        const h = m[1].trim()
        if (SKIP_HEADINGS.has(h.toLowerCase())) continue
        if (!topics.has(h)) topics.set(h, new Map())
        topics.get(h).set(locKey, link)
      }
    }
  }

  return { people, orgs, topics }
}

// ---------------------------------------------------------------------------
// Render
// ---------------------------------------------------------------------------

function renderNames(map, { bySurname }) {
  const entries = [...map.entries()].sort((a, b) => {
    const ka = bySurname ? surnameKey(a[0]) : a[0].toLowerCase()
    const kb = bySurname ? surnameKey(b[0]) : b[0].toLowerCase()
    return ka.localeCompare(kb) || a[0].localeCompare(b[0])
  })

  const out = []
  let letter = ""
  for (const [name, e] of entries) {
    const key = bySurname ? surnameKey(name) : name.toLowerCase()
    const first = letterOf(key)
    if (first !== letter) {
      letter = first
      out.push("", `#### ${letter}`, "")
    }
    const works = [...e.works.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([t, u]) => (u ? `[${t}](${u})` : `*${t}*`))
      .join(", ")
    const locs = [...e.locs.values()].join(" · ")
    const worksPart = works ? ` — ${works}` : ""
    out.push(`- **${name}**${worksPart} — ${locs}`)
  }
  return out.join("\n")
}

function renderTopics(topics) {
  const entries = [...topics.entries()].sort((a, b) =>
    a[0].toLowerCase().localeCompare(b[0].toLowerCase()),
  )
  const out = []
  let letter = ""
  for (const [h, locs] of entries) {
    const first = letterOf(h)
    if (first !== letter) {
      letter = first
      out.push("", `#### ${letter}`, "")
    }
    out.push(`- **${h}** — ${[...locs.values()].join(" · ")}`)
  }
  return out.join("\n")
}

function spliceBlock(generated) {
  const text = readFileSync(OUT_FILE, "utf8")
  const block = `${BEGIN}\n\n${generated}\n\n${END}`
  let next
  if (text.includes(BEGIN) && text.includes(END)) {
    next = text.replace(new RegExp(`${escapeRe(BEGIN)}[\\s\\S]*?${escapeRe(END)}`), block)
  } else {
    const marker = "\n## Status"
    const idx = text.indexOf(marker)
    next =
      idx === -1
        ? `${text.trimEnd()}\n\n${block}\n`
        : text.slice(0, idx) + `\n${block}\n` + text.slice(idx)
  }
  if (next !== text) {
    writeFileSync(OUT_FILE, next)
    return true
  }
  return false
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const { people, orgs, topics } = collect()

const generated = [
  `## People, thinkers, and authors`,
  "",
  `_${people.size} names, indexed by surname. Each links to the theme lenses where their work appears._`,
  renderNames(people, { bySurname: true }),
  "",
  `## Topics and subsections`,
  "",
  `_${topics.size} topics, from the subsection headings across the theme lenses._`,
  renderTopics(topics),
  "",
  `## Organizations, channels, and publishers`,
  "",
  `_${orgs.size} organizations, channels, and publishers whose work is used in the library._`,
  renderNames(orgs, { bySurname: false }),
].join("\n")

if (!existsSync(OUT_FILE)) {
  console.error(
    `index: ${OUT_FILE} does not exist; create it with the AUTO-GENERATED markers first.`,
  )
  process.exit(1)
}

const changed = spliceBlock(generated)
console.log(
  `index: ${people.size} people, ${orgs.size} organizations, ${topics.size} topics; ${changed ? "updated" : "no change to"} content/school-index.md`,
)
