# OpenAI / ChatGPT Skills Plugin Design

## Goal
Create an OpenAI-native distribution of `mattpocock/skills` that preserves the upstream engineering methodology while making invocation and orchestration reliable in ChatGPT/Codex.

## Upstream strategy
- Preserve the upstream git history and keep `upstream` pointing at `https://github.com/mattpocock/skills.git`.
- Keep Matt Pocock's MIT license and attribution intact.
- Record the exact upstream commit used by each release in `UPSTREAM.md`.
- Document every OpenAI-specific behavioral deviation in `PATCHES.md`.

## Plugin architecture
- Add `.codex-plugin/plugin.json` as the OpenAI plugin entry point.
- Continue using the existing `skills/**/SKILL.md` files and `agents/openai.yaml` sidecars.
- Do not require a custom MCP server for v0.1; skills are the primary product.
- Keep user-invoked orchestrators explicit-only and model-invoked disciplines automatically reachable.

## Compatibility rules
- Remove operative Claude-only slash-command/tool assumptions from stable skills.
- Express skill-to-skill dependencies as host-neutral skill invocation instructions.
- Preserve the core flow: alignment/grilling -> spec -> tracer-bullet tickets -> TDD implementation -> two-axis review.
- Prefer `AGENTS.md` for OpenAI-native setup while respecting existing `CLAUDE.md` in mixed-harness repositories.
## Validation and safety
- Add deterministic repository validation for plugin metadata, skill frontmatter, OpenAI sidecars, and invocation-policy consistency.
- Add fixture-based activation/compatibility checks for explicit-only versus model-invoked skills.
- Add CI that runs validation on pushes and pull requests.
- Do not copy experimental `skills/in-progress` entries into the plugin manifest for the first release.

## v0.1 scope
The first release packages the stable engineering and productivity skills already shipped by upstream, plus OpenAI-specific plugin metadata, compatibility fixes, documentation, and validation. It does not add a new agent framework, cloud service, analytics, or required MCP server.

## Success criteria
1. Repository installs as an OpenAI/Codex skill plugin from `.codex-plugin/plugin.json`.
2. Stable explicit-only skills have matching `agents/openai.yaml` invocation policy.
3. Stable model-invoked skills remain implicitly invocable.
4. Core orchestrators no longer require Claude-specific slash-command semantics internally.
5. Validation catches missing sidecars, policy drift, invalid manifest paths, and forbidden host-specific runtime instructions.
6. CI is green on the feature branch before merge.
