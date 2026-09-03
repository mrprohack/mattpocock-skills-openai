# OpenAI Compatibility Patches

This file records intentional differences from `mattpocock/skills`.

## Distribution
- Adds `.codex-plugin/plugin.json` for an OpenAI-native plugin entry point.
- Adds deterministic OpenAI compatibility validation, activation fixtures, and CI.
- Adds `UPSTREAM.md` so the exact source revision is auditable.

## Runtime wording
- Skill-to-skill orchestration uses host-neutral skill invocation wording instead of assuming Claude slash commands.
- Setup instructions avoid requiring Claude-specific command syntax.
- The underlying engineering methodology, skill names, testing philosophy, and issue-tracker semantics remain upstream-compatible.

## CI / release automation
- Removes upstream `.github/workflows/release.yml` from this compatibility distribution.
- The inherited Changesets action attempted to create a version PR with `GITHUB_TOKEN`, which this repository's Actions policy does not permit.
- Plugin compatibility CI remains in `.github/workflows/openai-plugin.yml`; compatibility releases are intentionally handled separately from upstream's release automation.
