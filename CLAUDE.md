# Success Plan Builder: instructions for Claude Code

This repo holds one web page, `index.html`, that FactorLab CSMs use to build customer success plans. A CSM fills in what they learn about an account, and the page builds a branch map, a milestone timeline, a scorecard and a ready-to-share check as they go.

**Start simple, one step at a time, build out where needed.** A new plan holds only the core sections (`core: true`), worked one at a time with Back and Next. A step bar at the top always shows "Step x of y" with a clickable strip, one segment per step (green when it has something in it). Every other section waits on the **Build out this plan** page until the CSM adds it. Never make an add-on section show up by default, and don't put several sections on one page; Trey tried a one-page Quick start and it was too much.

**Type.** Barlow is the font for the whole app and the PDFs; Barlow Condensed in capitals carries section titles, the account name, the step counter, labels and card headers. Both are embedded in `index.html` as small base64 subsets (Latin only) under the SIL Open Font License, so the page still works offline. Don't swap in a web font link or a system font.

**Dark mode.** More, then Dark mode (or Light mode) switches the app, the Note window and the step builder to a dark palette, remembered per browser (`spb.theme`, applied by a tiny script in `<head>` so there's no flash). Colors come from the `:root` variables; panels use `var(--surface)`, never a hard-coded white. The logo has a second copy (`.logo-dark`) with "Factor" in white and "Lab" still red; the plan pages always use the normal logo (`docLogo()` reads the first `.brand-logo`). The plan pages, the Customer window and the PDFs always stay light: they're what prints and what the customer sees (`.doc-page` resets the light colors inside dark mode).

**Three starting points.** Create plan fades into a "Pick a starting point" screen with three large choices in condensed caps. Then Account basics, always step 1.
- **Guided Plan**: the setup described above. No `meta.flow`; core sections plus anything added.
- **Flintco Plan**: the steps and questions of Barry's 2027 model plan in its order (`FLINTCO_STEPS`, the `fc...` sections with `set: 'flintco'`). Every customer name, person and figure is removed. Trey approved the label "Flintco Plan" for the CSM side only (the starting-point screen, the side menu, the side map, the builder). It must never reach the customer view, the Customer window or either PDF, and nothing Flintco-specific (names, their strategy, their numbers) goes in this public repo.
- **Custom Build**: a step builder. Pick steps from both sets, order them (number dropdown or arrows), rename a built-in step and edit its curious questions, or add steps of your own with your own questions and answer boxes (Short answer, Long answer, List, Pick one, Tick boxes, Date, Table). Built-in steps keep their answer boxes so they still feed the map, timeline, ready check and PDF. Builds save in the browser (`spb.builds`) and export as a `-build.json` file a teammate can open, so the team can run the same build. "Change the steps" reopens the builder on any Flintco or Custom plan.
A floating **Back** button sits bottom left on every step (`backTarget()`): it goes one step back through the whole plan, and from Account basics to the starting point. It hides on the welcome screen, the picker, the builder and the plan view. "Back: Starting point" on Account basics also returns an existing plan to the picker (`repick`); switching gives the plan exactly the new template's steps. The old template's steps go on a shelf (`meta.shelf`, one shape per template, see `shelvedKeys()`) with their answers kept in the plan, so they're hidden, never deleted, and come back when you switch back. A step both templates share (like Their goal) keeps its answer across the switch. Keep the starting-point screen to these three choices. Saved builds live inside Custom Build, under "Start from".

**Note (fill the plan like a notes app).** The **Note** button opens the whole plan as one plain note in its own window (`#note=<plan id>`, `initNote()`; a new tab on phones). A pinned strip under the account name lists every section; swipe it sideways and tap a name to jump there, and the section you're reading lights up as you scroll (`noteJumpTo()`, `noteSpy()`). Every step is a heading, every question is bold and the answer is typed underneath in plain text; pick-one questions are tappable words and tick-box questions a checklist, so there are no dropdowns. Lists are one item per line; tables are one row per line with cells split by " / " (`noteCols` picks which columns show; rows keep their hidden columns). End a line with "?" and press Enter to start a question of your own: if it matches a question in the plan the answer goes there, otherwise it's saved in `data.misc` and waits on the **Notes to sort** page in the main view, where each one is moved to a step or deleted. Notes to sort never reach the customer view, the Customer window or the PDFs. The note and the main window share the browser's saved copy: before every save, `mergeDisk()` takes in what other windows saved and keeps this window's changes on top, answer by answer (`fineKeys()`), and a `storage` event refreshes the other window. Edits in the note reach a teammate on a team code through the main window.

**Built for live customer meetings.** Three top-bar buttons:
- **Focus** hides the side menu and map so only the current step shows. Remembered per browser (`spb.focus`).
- **Timer** pops out a small window with Start, Pause and Reset (`spb.timer`). Chrome and Edge use Document Picture-in-Picture so it stays on top; other browsers get a pop-up placed at the top right. Reference only: no warnings or alarms.
- **Customer window** opens a separate window to screen-share. It shows only `presentHtml(plan, true)`, the customer view, and re-draws as the CSM types. Its "Working on" line hides FactorLab-only steps. Never put internal content (FactorLab-only sections, notes, context, curious questions) in that window.

**Team code (build one plan together on a call).** One CSM clicks Team code, then "Start a team code" to get a random code like `K7PQ-4QXM`; a teammate joins with it. Changes pass between them through Supabase Realtime broadcast over a plain WebSocket (no library). Nothing is stored on Supabase; each browser keeps its own saved copy as always. Every piece of the plan (each section, each section's notes, each basics field, your branches) carries the time it was last changed (`planKeys()`, `team.ver`). When versions meet, the newer change wins for that piece only, so an older edit never replaces a newer one. When a screen wakes up or reconnects, it sends its own unsent changes, then asks the others for anything newer (`sync`). Changes made while offline keep the time they were made, not the time they were sent. A change that arrives while you're typing waits until you leave the field. Device clocks are trusted to within a second or two. The project URL and publishable key in `index.html` are meant to be public; never put a secret or service_role key in this repo. Free Supabase projects pause after about a week unused; restoring takes a minute in the Supabase dashboard. To test without Supabase, set `localStorage['spb.teamWs']` to a local stand-in server that speaks the Phoenix channel protocol.

**The customer view builds itself as the CSM fills it in.** Everywhere the customer view appears (Customer window, View plan with Customer view ticked, the customer PDF), empty branches and sections stay hidden, and the pre-filled milestones and rhythm only appear once the CSM sets Day 1 or changes or ticks something (`milestonesTouched()`). It also leaves out the plan size and mode labels (a customer shouldn't read "Recover"). The CSM's own views, the side map and the internal plan view, always show everything, including the empty "Add ..." and "Not started" chips.

**The plan document is fixed landscape pages, not a long scroll.** `presentHtml()` builds 11 x 8.5 in pages (1056 x 816 px), and the same pages appear in View plan, the Customer window and both PDFs. Every page has the account name top left, the FactorLab logo top right (taken from the `.brand-logo` image, so there's one copy of it) and "Page x of y" bottom right. The customer copy's footer is only the page number (no "Prepared by" line); the internal copy also shows "FactorLab internal", the CSM and the date. The order: **The plan at a glance** (goal, our bet, one card per branch with a few lines each), **Milestones and how we'll run it**, **Scorecard and owners**, then **In full** pages only when a card or the timeline had to cut lines ("+ N more on the In full page"), then **FactorLab only** on the internal version. Nothing may ever split across a page or run off the bottom: when there's more than fits, cut it to the In full page instead of shrinking the text. `docPaginate()` lays the In full pages out in three columns. On screens `fitDoc()` scales the pages to fit, and under 760 px wide it switches to a plain single-column flow. Print uses `@page { margin: 0 }` so the browser adds no headers or footers. After any change to the document, render both PDFs with a plan that has lots of answers and look at every page.

The owner is Trey Timmerman (CSM). He asks for changes in plain language. Read this file before every change.

## Non-negotiables

1. **No customer data in this repo, ever.** The repo is public. Plans live in each CSM's browser (localStorage) and in exported `.json` files they keep in Google Drive. Never add example plans, account names, contacts, contract values or anything copied from a real customer. If you need test data, use an obviously fake name ("Example Builders") and don't commit it.
2. **One file, no build step, no outside libraries.** Everything stays inside `index.html`: HTML, CSS and plain JavaScript. No npm, no CDNs, no frameworks. The page has to work when someone double-clicks the file with no internet (only the team code needs a connection). The only other files are the icons (`favicon.ico`, `favicon.png`, `apple-touch-icon.png`, `icon-192.png`, `icon-512.png`, `icon-maskable-512.png`), all the same FactorLab circle, and `manifest.webmanifest`. The app icons keep the circle at about 84% of the square; the maskable one stays smaller because Android trims it to a circle. Keep the manifest's `display` set to `browser`: a standalone home-screen app gets its own storage on iPhones and would not see plans saved in Safari. (Opening the file directly logs a harmless manifest error; it goes away on the hosted page.)
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
  set: 'flintco',              // Flintco Plan steps only: hidden from the Guided catalog, offered in Custom Build
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

**Every multiple choice has "Something else".** Pick-one lists, tick boxes, pick-one table columns and "What the account needs this year" all add a "Something else" choice that opens a box to type in, in the main view and the Note. The typed text is saved as the answer itself (`select`: the value; `checks`: an extra item in the array; table cell: the cell; mode: `meta.mode = 'other'` plus `meta.modeOther`), so maps, ready checks and PDFs show it like any other answer. Use `modeOf(meta)`, never `MODES[meta.mode]` directly. A list that already has its own `'Other'` option with a follow-up box (First workflow) keeps it, shown as "Something else". Don't add "Something else" as a literal option in `options`; the renderer adds it. Plan size and the step builder's own controls are settings, not questions, and don't get it.

A section shows in the plan if it is `core`, the CSM added it (`meta.sections`), or it already has something written in it. Written work never disappears. "Remove from this plan" only appears on an empty add-on section.

Sections marked `branch: 'internal'` are FactorLab-only. They show with a dashed border and are hidden when "Customer view" is on.

## Data model

```js
plan = {
  id, app: 'success-plan-builder', version,
  meta: { account, csm, backup, tier, sections, template, flow, shelf, mode, day1, context, sources, verified, created, updated },
  // template: 'guided' | 'flintco' | 'custom' (missing means guided)
  // flow (Flintco and Custom plans only): { name, steps: [{ key, title?, ask? }], own: { id: { title, branch, intro, ask, fields: [{ key, label, type, options }] } } }
  //   steps list the plan's steps in order; "own-<id>" keys are steps the CSM wrote; answers live in data['own-<id>']
  // data.misc: { items: [{ id, q, a, at }], end }: questions of your own from the Note, not yet sorted (at = the note box they follow)
  // shelf (only after a template switch): { [template]: flow, or { sections } for guided }: the steps set aside, restored on switching back
  data: { [sectionKey]: { [fieldKey]: value } },
  custom: [{ id, title, items: [], notes }],   // the CSM's own branches
  notes: { [sectionKey]: 'notes and open questions' }
}
```

- Storage key: `spb.plans.v1` (all plans), `spb.current.v1` (the open plan). The key name stays the same across versions.
- `spb.builds` holds saved Custom Builds (steps and questions only, never customer answers).
- `APP_VERSION` is 2. `template` and `flow` were added without a version bump: a plan without them is a Guided plan, exactly as before. Version 1 plans had no `meta.sections`; `migrate()` gives them their old size's sections so nothing they could see disappears. Run new migrations there.
- `tier` is now a label plus a shortcut: picking a bigger size adds that size's sections. It never hides anything.
- The "Export PDF" button (For the customer / Internal) opens the plan view and the browser's print dialog, landscape, one document page per sheet. No PDF library; the page title becomes the suggested file name. "More, then Export this plan (file)" saves JSON wrapped as `{ app, version, exported, plan }`, and "Import a plan file" reads it back. Keep both: a PDF can't be reopened for editing.
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
2. Create a plan with a fake name from each starting point (Guided, Flintco, Custom Build with a step of your own), fill a few sections, add a list item, add a table row, add your own branch. Confirm the word "Flintco" never shows in the customer view, the Customer window or either PDF.
3. Confirm the map, timeline, ready check and step bar update, a reload keeps the plan, and "View plan" plus "Customer view" look right. Open the Customer window, type in the main window, and confirm it updates and never shows FactorLab-only content.
4. Export the plan, delete it, import the file, and confirm it comes back.
5. Check the browser console for errors.
6. Narrow the window to phone width and make sure nothing breaks.

## Publishing

GitHub Pages serves `index.html` from the `main` branch root. A push to `main` updates the live page in about a minute.

Commit messages: short and plain, e.g. "Add permits question to First workflow section".
