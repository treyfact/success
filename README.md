# Success Plan Builder

A simple page for building customer success plans as you learn about an account. Fill in what you know, in any order, and the page builds the plan around it:

- a **branch map** of the plan (Why, What, Who, How we know, plus your own branches)
- a **milestone timeline** from Day 1 through renewal
- a **scorecard** with baselines and targets
- a **ready check** that shows when the plan is ready to share
- a **plan view** you can print or save as a PDF, with a customer view that hides FactorLab-only notes

## Using it

1. Open the page (the GitHub Pages link, or double-click `index.html`).
2. Click **Create plan**, name the account, and pick the plan size and what the account needs this year.
3. Work through the sections on the left. Start wherever you know the most. Each section has questions to get curious with and a notes box for what you still need to find out.
4. Click **View plan** to see it the way the customer will. Turn on **Customer view** before you share it, then **Print or save as PDF**.

Sections marked with the small folded-page icon follow the pattern in Barry's 2027 model plan.

## Where your plans are saved

**Plans are saved in your browser, not on GitHub.** That keeps customer details out of this public repo.

- Your plans stay in the browser you made them in. Clearing your browser data deletes them.
- To back up a plan or hand it to a teammate: **More, then Export this plan**. Save the file in Google Drive.
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
