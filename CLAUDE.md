# Success Plan Builder: instructions for Claude Code

This repo holds one web page, `index.html`, that FactorLab CSMs use to build customer success plans. A CSM fills in what they learn about an account, and the page builds a branch map, a milestone timeline, a scorecard and a ready-to-share check as they go.

**Start simple, one step at a time, build out where needed.** A new plan holds only the core sections (`core: true`), worked one at a time with Back and Next. A step bar at the top always shows "Step x of y" with a clickable strip, one segment per step (green when it has something in it). Every other section waits on the **Build out this plan** page until the CSM adds it. Never make an add-on section show up by default, and don't put several sections on one page; Trey tried a one-page Quick start and it was too much.

**Built for live customer meetings.** Three top-bar buttons:
- **Focus** hides the side menu and map so only the current step shows. Remembered per browser (`spb.focus`).
- **Timer** pops out a small window with Start, Pause and Reset (`spb.timer`). Chrome and Edge use Document Picture-in-Picture so it stays on top; other browsers get a pop-up placed at the top right. Reference only: no warnings or alarms.
- **Customer window** opens a separate window to screen-share. It shows only `presentHtml(plan, true)`, the customer view, and re-draws as the CSM types. Its "Working on" line hides FactorLab-only steps. Never put internal content (FactorLab-only sections, notes, context, curious questions) in that window.

The owner is Trey Timmerman (CSM). He asks for changes in plain language. Read this file before every change.

## Non-negotiables

1. **No customer data in this repo, ever.** The repo is public. Plans live in each CSM's browser (localStorage) and in exported `.json` files they keep in Google Drive. Never add example plans, account names, contacts, contract values or anything copied from a real customer. If you need test data, use an obviously fake name ("Example Builders") and don't commit it.
2. **One file, no build step, no outside libraries.** Everything stays inside `index.html`: HTML, CSS and plain JavaScript. No npm, no CDNs, no frameworks. The page has to work when someone double-clicks the file with no internet. The only other files are the icons (`favicon.ico`, `favicon.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`), all the same FactorLab circle, and `manifest.webmanifest`. The app icons keep the circle at about 84% of the square; the maskable one stays smaller because Android trims it to a circle. Keep the manifest's `display` set to `browser`: a standalone home-screen app gets its own storage on iPhones and would not see plans saved in Safari. (Opening the file directly logs a harmless manifest error; it goes away on the hosted page.)
3. **Simplicity first.** Before you add a field, a section or a button, ask whether it saves the CSM time or makes the plan clearer for the customer. If it doesn't, push back and suggest something smaller.
4. **Curiosity stays built in.** Every section has "Questions to get curious with" and a notes box. Don't remove them. CSMs are meant to learn the account as they fill in the plan, not complete a form.
5. **Never break saved plans.** CSMs have plans saved in their browsers. Don't rename or remove existing keys in `SECTIONS`, `fields` or `columns`. If the data shape has to change, bump `APP_VERSION` and handle the old shape when loading (see "Data model").
6. **Ask before big changes.** Trey wants to review before anything is pushed. Show him what will change, then commit and push only after he says go.

## How the file is organized

Inside the `<script>` tag, top to bottom:

| Block | What it holds | Edit it when |
| --- | --- | --- |
| `CONFIG` (TIERS, MODES, BRANCHES, PHASES, FAILURE_MODES, SECTIONS) | All the words and structure a CSM sees | Changing a question, prompt, section, field, default or tier |
| `readyChecks()` | What "ready to share" means | Changing the quality bar |
| State and storage | localStorage load and save, `newPlan()`, `blankData()` | Rarely |
| Render functions | Nav, forms, map, timeline, ready check, plan view | Changing how things look |
| Events | One delegated handler for input, change and click | Adding a new kind of control |

Almost every request will be a change to the `CONFIG` block only. Prefer that.

## Adding or changing a section

Each section is an object in `SECTIONS`:

```js
{
  key: 'loop',                 // permanent ID; never rename
  branch: 'know',              // why | what | who | know | internal
  title: 'Closing the loop',   // shown in the nav and as the heading
  short: 'the loop',           // used in the map's "Add ..." ghost chip
  core: true,                  // always in the plan (leave off for add-on sections)
  when: 'When to add it, one line',  // add-on sections only; shown on Build out this plan
  model: true,                 // shows the dog-ear: pattern from Barry's 2027 model plan
  tiers: ['growth', 'enterprise'],   // which size shortcuts add it (Growth set, Enterprise set)
  intro: 'One or two plain sentences.',
  ask: ['Curious question 1', 'Curious question 2'],
  hint: 'Optional grey tip box.',
  fields: [ /* see field types */ ],
  leaves: d => [ /* short strings that appear as chips on the map */ ]
}
```

Field types:

| type | Value saved | Notes |
| --- | --- | --- |
| `text`, `textarea`, `date` | string | `placeholder`, `help` optional |
| `select` | string | `options: ['', 'A', 'B']` (first blank = "Choose...") |
| `list` | array of strings | Add with Enter; each item can become a map chip |
| `checks` | array of strings | `options: [...]`, shown as pill checkboxes |
| `table` | array of row objects | `columns: [{ key, label, type?: 'select', options?, multi?: true }]`, `defaultRows: () => [...]`, `addLabel` |
| `milestones` | `{ readiness: [{text, done}], d30: [...], ... }` | Only used by the `milestones` section |

`showIf: d => d.first === 'Other'` hides a field until it applies.

A section shows in the plan if it is `core`, the CSM added it (`meta.sections`), or it already has something written in it. Written work never disappears. "Remove from this plan" only appears on an empty add-on section.

Sections marked `branch: 'internal'` are FactorLab-only. They show with a dashed border and are hidden when "Customer view" is on.

## Data model

```js
plan = {
  id, app: 'success-plan-builder', version,
  meta: { account, csm, backup, tier, sections, mode, day1, context, sources, verified, created, updated },
  data: { [sectionKey]: { [fieldKey]: value } },
  custom: [{ id, title, items: [], notes }],   // the CSM's own branches
  notes: { [sectionKey]: 'notes and open questions' }
}
```

- Storage key: `spb.plans.v1` (all plans), `spb.current.v1` (the open plan). The key name stays the same across versions.
- `APP_VERSION` is 2. Version 1 plans had no `meta.sections`; `migrate()` gives them their old size's sections so nothing they could see disappears. Run new migrations there.
- `tier` is now a label plus a shortcut: picking a bigger size adds that size's sections. It never hides anything.
- The "Export PDF" button (For the customer / Internal) opens the plan view and the browser's print dialog. No PDF library; the page title becomes the suggested file name. "More, then Export this plan (file)" saves JSON wrapped as `{ app, version, exported, plan }`, and "Import a plan file" reads it back. Keep both: a PDF can't be reopened for editing.
- On import, `blankData()` fills in any sections or fields that were added after the file was saved. New fields therefore need a sensible empty default.

## Writing the words on the page

- Plain language a superintendent would use. No software vocabulary ("prompts", "workflow engine", "users").
- Sell the why, not the what. Say what gets easier for the customer.
- No em dashes. Use commas, colons or periods.
- Never suggest FactorLab or SmartTagIt can predict incidents. The honest claim: better leaders and better planning tend to go with better outcomes over time.
- Frame positively. Don't name the negative even to deny it.
- Don't use "pilot", "trial" or "beta".
- Keep it short. If a line can lose words, cut them.

## Checking your work

1. Open `index.html` in a browser (or run a quick headless check with Playwright if it's available).
2. Create a plan with a fake name, fill a few sections, add a list item, add a table row, add your own branch.
3. Confirm the map, timeline, ready check and step bar update, a reload keeps the plan, and "View plan" plus "Customer view" look right. Open the Customer window, type in the main window, and confirm it updates and never shows FactorLab-only content.
4. Export the plan, delete it, import the file, and confirm it comes back.
5. Check the browser console for errors.
6. Narrow the window to phone width and make sure nothing breaks.

## Publishing

GitHub Pages serves `index.html` from the `main` branch root. A push to `main` updates the live page in about a minute.

Commit messages: short and plain, e.g. "Add permits question to First workflow section".
