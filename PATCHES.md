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
