# Feature Scout

Feature Scout is an automated, source-grounded feature-ideation workflow for the
PL0 muhūrta app. On a schedule (or on demand) it asks Claude — via the
`jyotish-books-scout` agent — to read the existing app, propose fresh
classically-grounded feature ideas, and open a pull request adding them to
[`FEATURE-IDEAS.md`](../FEATURE-IDEAS.md).

It was set up as a collaborative, multi-agent workflow: a scaffolding agent
created the pieces, and at runtime the GitHub Action delegates to the
`jyotish-books-scout` subagent to do the research and writing.

## What it does

1. Grounds itself in the current app (README, `FEATURE-IDEAS.md`,
   `classical-rules.js`, and `www/index.html`) so ideas are non-duplicative.
2. Proposes 8–12 new features, each with a title, description, classical basis,
   and a realistic client-side JS implementation note.
3. Appends them to `FEATURE-IDEAS.md` under a dated heading.
4. Opens a pull request so a human can review before anything is merged.

The heavy lifting lives in
[`.claude/agents/jyotish-books-scout.md`](../.claude/agents/jyotish-books-scout.md),
which the workflow invokes. Update that file to change how ideas are generated.

## "When usage tokens are available" gating

Feature Scout calls the Anthropic API, which consumes paid usage tokens, so it
stays **dormant and free by default**. It runs only when BOTH conditions hold:

- the repo **variable** `FEATURE_SCOUT_ENABLED` is set to `true`, and
- the repo **secret** `ANTHROPIC_API_KEY` is present.

If either is missing, the `guard` job logs a friendly
"skipping — no token budget / not enabled" message and the downstream job is
skipped. The run still exits **successfully** — a dormant scout is not a failed
build.

### Enable it

1. Repo → **Settings → Secrets and variables → Actions**.
2. Under **Variables**, add `FEATURE_SCOUT_ENABLED` = `true`.
3. Under **Secrets**, add `ANTHROPIC_API_KEY` with your Anthropic API key.

To pause it again, delete the variable (or set it to anything other than
`true`); no need to touch the workflow file.

## Run it manually

Actions tab → **Feature Scout** → **Run workflow**. (Gating still applies — if
the variable/secret are not set, the guard job will skip and exit cleanly.)

## Schedule

By default it runs weekly, Mondays at 09:00 UTC (`cron: '0 9 * * 1'`). Adjust
the `schedule` block in
[`.github/workflows/feature-scout.yml`](../.github/workflows/feature-scout.yml)
to change the cadence.

## Output

Suggestions are appended to `FEATURE-IDEAS.md` and proposed via a pull request —
never committed straight to the default branch. Review, curate, and merge the
ones worth building.
