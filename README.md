# Success Plan Builder

A simple page for building customer success plans as you learn about an account. Fill in what you know, in any order, and the page builds the plan around it:

- a **branch map** of the plan (Why, What, Who, How we know, plus your own branches)
- a **milestone timeline** from Day 1 through renewal
- a **scorecard** with baselines and targets
- a **ready check** that shows when the plan is ready to share
- a **plan view** you can print or save as a PDF, with a customer view that hides FactorLab-only notes

## Using it

1. Open the page (the GitHub Pages link, or double-click `index.html`).
2. Click **Create plan**, name the account, and pick what it needs this year. Then pick a starting point:
   - **Guided Plan**: the core steps every account needs. Build out as you go.
   - **Flintco Plan**: Barry's 2027 model plan, step by step, with no customer names in it. The label shows only on your side; the customer never sees it.
   - **Custom Build**: choose the steps, their order and the questions first. Add steps of your own with your own answer boxes. **Save this build** keeps it in your browser; **Export build (file)** gives you a file a teammate can open with **Open a build file**, so you both run the same plan. **Change the steps** reopens it later.
3. Work through the plan one step at a time with **Next**. The bar at the top shows which step you're on ("Step 3 of 8"); click any segment to jump. Each step has questions to get curious with and a notes box for what you still need to find out.
4. Only when the account calls for more, open **Build out this plan** and add a section (first workflow, what good looks like, trade partners, experiments and more), or your own branch.

**In a live meeting:** click **Focus** to see only the step you're on, **Timer** to pop out a small timer with Start and Pause, and **Customer window** to open a clean window you can share on screen. The customer window shows only what the customer should see and updates as you type. In Zoom or Teams, share that window, not your whole screen.

**Had the call without the plan open?** Click **Fill from a call** (on Account basics, or under More). Drop in the transcript, click **Copy for your AI**, paste it into ChatGPT, Claude, Gemini or Copilot and send. Copy the AI's whole reply, paste it back, and tick the answers you want. Nothing goes in until you tick it, and nothing you already wrote gets replaced. Use a company AI account if you have one, since the transcript has customer details in it.

**Logging it in HubSpot:** More, then **Copy summary for HubSpot**, then paste it as a note on the company.

**Building a plan with a teammate:** click **Team code**, then **Start a team code**, and read the code out (or paste it in chat). Your teammate opens the page, clicks **Team code**, types it in and clicks **Join**. The plan appears on their screen and changes show up on both screens as you type. The plan passes between you but isn't stored online; you each keep a saved copy in your own browser.
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
