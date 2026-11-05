# Destination Converge 2026

A starter website for the Converge 2026 hackathon.

1. Give yourself more time before your codespace pauses: open [github.com/settings/codespaces](https://github.com/settings/codespaces), set **Default idle timeout** to `240` minutes and click **Save**. Do this first; it only applies to codespaces created afterwards.
2. Open your team's repository (the organizers will send you the link) and click **Code → Codespaces → Create codespace on main**.
3. Wait a minute or two. The website opens in a new browser tab, and VS Code is ready with Claude Code, Codex and GitHub Copilot.

## Sign in to your AI assistant

**Claude Code**: you need a paid Claude plan (Pro, Max, Team or Enterprise).

1. Click the Spark icon in the left sidebar (or at the top right of any open file), then click **Sign in**.
2. VS Code offers to open the sign-in page in your browser. Opening it from there doesn't work in a codespace, so close that offer and choose to copy the link instead.
3. Paste the link into a new browser tab, sign in to Claude and copy the code it shows you.
4. Paste the code back into VS Code.
5. Click **New session** to start a local Claude Code session.

**Codex**: the usual sign-in button doesn't work inside a codespace, so sign in from the terminal instead:

1. Open a terminal with **Terminal → New Terminal**.
2. Type `codex login --device-auth` and press Enter.
3. Open the link it shows, sign in to ChatGPT and enter the code it gives you.
4. Open the Command Palette (Ctrl+Shift+P, or Cmd+Shift+P on a Mac), run **Developer: Reload Window**, then click the Codex icon in the sidebar.

**GitHub Copilot**: you're already signed in with your GitHub account. Click the chat icon at the top of the window.

## Build

Ask your AI assistant for what you want ("make the hero about fall foliage", "add a page of hotels") and watch the website update as it works.

Your changes show only in your team's previews until you publish them. When you're ready for the world to see the site, ask your AI assistant to "publish", or type `/publish` in Claude Code.

Lost the website tab? Open the **Ports** panel at the bottom of VS Code and click the globe icon next to **Website**.

## Coming back later

Your codespace pauses after 4 hours without activity, and after 12 hours no matter what. To pick up where you left off, open [github.com/codespaces](https://github.com/codespaces) and click your codespace. The website starts again by itself. Your work is safe on GitHub as long as your AI assistant saved (pushed) it, which it does after every working change.
