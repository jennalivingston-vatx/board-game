---
name: publish
description: Put the current site live on the team's public website. Use when the attendee asks to publish, go live, or update the public site.
---

# Publish

The team's public site is built from the `prod` branch. Day-to-day work lands on `main` and shows only in each person's preview; publishing copies `main` to `prod`, and Cloudflare puts it live.

1. Run the checks in **Checking your work** in `AGENTS.md`. Publish only a site that builds.
2. Save any unsaved work as **Saving work** in `AGENTS.md` describes, so `main` on GitHub holds everything, teammates' latest changes included.
3. Run `git push origin main:prod`. `prod` only ever receives `main`, so this is always a fast-forward.
4. Tell the attendee the public site updates in a minute or two at `https://<pattern>/`, the `routes` pattern in `wrangler.jsonc`, and list in plain words what this publish includes, teammates' changes too: compare against the previous publish with `git log --oneline <old prod>..main`, using the old `prod` commit that the push printed.
