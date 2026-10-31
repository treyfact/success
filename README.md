# Success Plan Builder

A simple page for building customer success plans as you learn about an account. Fill in what you know, in any order, and the page builds the plan around it:

- a **branch map** of the plan (Why, What, Who, How we know, plus your own branches)
- a **milestone timeline** from Day 1 through renewal
- a **scorecard** with baselines and targets
- a **ready check** that shows when the plan is ready to share
- a **plan view** you can print or save as a PDF, with a customer view that hides FactorLab-only notes

## Using it

1. Open the page (the GitHub Pages link, or double-click `index.html`).
2. Click **Create plan**, name the account, and pick what it needs this year.
3. Fill in **Quick start**: the essentials every plan needs, on one page. Each step turns green when it's ready.
4. Only when the account calls for more, open **Build out this plan** and add a section (first workflow, what good looks like, trade partners, experiments and more), or your own branch. Each section has questions to get curious with and a notes box for what you still need to find out.
5. Click **View plan** to see it the way the customer will.
6. To share it, click **Export PDF, then For the customer**. Your browser's print window opens; pick **Save as PDF**. The customer version leaves out the FactorLab-only parts. **Internal (full plan)** keeps them.

Sections marked with the small folded-page icon follow the pattern in Barry's 2027 model plan.

## Putting it on your phone's home screen

Open the page on your phone. On iPhone, tap **Share, then Add to Home Screen**. On Android, tap the menu, then **Add to Home screen**. It shows up as the FactorLab circle, named "Success Plans", and opens in your browser so it sees the same saved plans.

## Where your plans are saved

**Plans are saved in your browser, not on GitHub.** That keeps customer details out of this public repo.

- Your plans stay in the browser you made them in. Clearing your browser data deletes them.
- To back up a plan or hand it to a teammate: **More, then Export this plan (file)**. Save the file in Google Drive. A PDF can't be reopened for editing; this file can.
- To open a plan someone sent you: **More, then Import a plan file**.

Never commit an exported plan file to this repo.

## Hosting it on GitHub Pages (one time)

1. In the repo on GitHub, go to **Settings, then Pages**.
2. Under **Build and deployment**, set Source to **Deploy from a branch**, then pick **main** and **/(root)**. Save.
3. After about a minute the page is live at `https://<your-github-username>.github.io/<repo-name>/`.

## Changing it with Claude Code

1. Open Claude Code in this repo (on your computer, or at claude.ai/code with the repo selected).
2. Say what you want in plain words, for example: "Add a question about permits to the First workflow section" or "Make the Experiments section show for Starter plans too."
3. Claude reads `CLAUDE.md` for the rules, makes the change in `index.html`, checks it, and shows you before anything is pushed.
4. Once you approve, it commits and pushes, and the live page updates in about a minute.
