#!/usr/bin/env node
/**
 * build-further-reading.mjs
 *
 * Some resources belong in the library but are not assigned in a lens: books and
 * articles worth having, curricula worth raiding, things behind a paywall. Mark
 * one `tier: extended` in a lens's `resources:` frontmatter and it stays out of
 * the curated Materials write-up, but is listed here in a "Further reading"
 * block on the same lens page. The curated list stays tight; the deeper shelf
 * stays one scroll away.
 *
 * Resources with no `tier` are the default (assigned, written up by hand in the
 * lens prose) and are untouched by this script. Extended items still flow into
 * the resource tables and the school index like any other resource.
 *
 * Run with `npm run further`. No network; it only writes theme lens files.
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs"
import { join, dirname, basename } from "node:path"
import { fileURLToPath } from "node:url"
import { parse as parseYaml } from "yaml"

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..")
const THEMES_DIR = join(ROOT, "content", "03-themes")

const BEGIN = "<!-- further-reading:start -->"
const END = "<!-- further-reading:end -->"

const LENSES = new Set(["experiential", "historical", "theoretical", "practical", "liberatory"])

const ACCESS_PHRASE = {
  free: "Free",
  borrow: "Free to borrow",
  paywalled: "Not free",
  print: "Print",
}

const INTRO =
  "_For resources behind a paywall, see [[04-resources/index#A note on access|the note on access]]._"

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

function host(url) {
  try {
    return new URL(url).hostname.replace(/^www\./, "")
  } catch {
    return "link"
  }
}

function line(r) {
  const authors = Array.isArray(r.authors) ? r.authors.join(", ") : r.authors || ""
  const who = authors ? `**${authors}**, ` : ""
  const year = r.year ? ` (${r.year})` : ""
  const note = r.note ? ` ${String(r.note).trim()}` : ""
  const phrase = ACCESS_PHRASE[r.access] || "Link"
  const where = r.url ? ` ${phrase}: [${host(r.url)}](${r.url})` : ` _${phrase}._`
  return `- ${who}_${r.title}_${year}.${note}${where}`
}

function block(items) {
  return [BEGIN, "", "## Further reading", "", INTRO, "", ...items.map(line), "", END].join("\n")
}

function splice(path, text, generated) {
  if (text.includes(BEGIN) && text.includes(END)) {
    const re = new RegExp(`${escapeRe(BEGIN)}[\\s\\S]*?${escapeRe(END)}`)
    return text.replace(re, generated)
  }
  // First run: sit above the trailing "## Status" section if there is one.
  const marker = "\n## Status"
  const idx = text.indexOf(marker)
  return idx === -1
    ? `${text.trimEnd()}\n\n${generated}\n`
    : `${text.slice(0, idx)}\n${generated}\n${text.slice(idx)}`
}

function removeBlock(text) {
  if (!text.includes(BEGIN) || !text.includes(END)) return text
  const re = new RegExp(`\\n*${escapeRe(BEGIN)}[\\s\\S]*?${escapeRe(END)}\\n*`)
  return text.replace(re, "\n\n")
}

function escapeRe(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

let touched = 0
let total = 0

const themes = readdirSync(THEMES_DIR).filter((n) => {
  try {
    return statSync(join(THEMES_DIR, n)).isDirectory()
  } catch {
    return false
  }
})

for (const theme of themes.sort()) {
  const dir = join(THEMES_DIR, theme)
  const files = readdirSync(dir).filter((f) => f.endsWith(".md") && LENSES.has(basename(f, ".md")))
  for (const file of files) {
    const path = join(dir, file)
    const text = readFileSync(path, "utf8")
    const fm = readFrontmatter(text)
    const items = (fm && Array.isArray(fm.resources) ? fm.resources : []).filter(
      (r) => r && r.title && r.tier === "extended",
    )
    total += items.length
    const next = items.length ? splice(path, text, block(items)) : removeBlock(text)
    if (next !== text) {
      writeFileSync(path, next)
      touched++
    }
  }
}

console.log(`further reading: ${total} extended item(s); updated ${touched} lens file(s)`)
