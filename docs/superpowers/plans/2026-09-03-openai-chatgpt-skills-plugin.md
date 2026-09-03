# OpenAI / ChatGPT Skills Plugin Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a validated OpenAI/ChatGPT-compatible distribution of Matt Pocock's stable engineering skills.

**Architecture:** Preserve upstream history and skill files, add an OpenAI plugin shell and a small compatibility/validation layer, and patch only host-specific runtime assumptions. CI executes deterministic repository validation.

**Tech Stack:** Markdown Agent Skills, YAML, JSON, Node.js 22, GitHub Actions, GitHub CLI.

**Spec:** `docs/superpowers/specs/2026-09-03-openai-chatgpt-skills-plugin-design.md`

## Global Constraints
- Preserve upstream MIT license and attribution.
- Keep upstream syncable; record the source commit.
- No required MCP server, cloud backend, analytics, or experimental skills in v0.1.
- User-invoked/model-invoked policy must remain consistent between `SKILL.md` and `agents/openai.yaml`.

---

### Task 1: OpenAI plugin metadata and provenance
**Files:** create `.codex-plugin/plugin.json`, `UPSTREAM.md`, `PATCHES.md`; modify `README.md`.
- [ ] Add validation expectations for plugin manifest/provenance to `scripts/validate-openai-plugin.mjs` test fixture first.
- [ ] Run validator and confirm RED because the OpenAI plugin files do not exist.
- [ ] Add minimal plugin/provenance files and README install/use documentation.
- [ ] Re-run validator and confirm this section is GREEN.
- [ ] Commit `feat: add OpenAI plugin metadata and provenance`.

### Task 2: Deterministic compatibility validator
**Files:** create `scripts/validate-openai-plugin.mjs`; modify `package.json`.
- [ ] Write validator checks for manifest paths, stable skill sidecars, invocation-policy parity, and forbidden operative Claude-only runtime patterns.
- [ ] Run validator against current branch and capture the expected failures.
- [ ] Add `npm run validate:openai` and make validator output actionable per file.
- [ ] Re-run until failures point only at genuine compatibility patches.
- [ ] Commit `test: add OpenAI plugin compatibility validator`.

### Task 3: Harness-neutral core orchestration
**Files:** modify stable core skills including `implement`, `code-review`, `to-spec`, `to-tickets`, and setup only where validator proves a host-specific runtime assumption.
- [ ] For each flagged behavior, add/extend a fixture assertion in the validator first.
- [ ] Confirm the assertion fails on the upstream wording.
- [ ] Replace slash-command/tool assumptions with host-neutral skill invocation/capability wording.
- [ ] Re-run validation after each patch and keep upstream semantics unchanged.
- [ ] Commit `fix: make core orchestration OpenAI compatible`.

### Task 4: CI and activation fixtures
**Files:** create `.github/workflows/openai-plugin.yml`, `evals/activation-cases.json`.
- [ ] Add fixture validation requiring positive/negative examples for explicit-only and model-invoked skill classes.
- [ ] Run validation and confirm RED before the fixture exists.
- [ ] Add representative activation cases and CI running Node 22 + `npm run validate:openai`.
- [ ] Re-run validation locally and inspect workflow syntax.
- [ ] Commit `ci: validate OpenAI plugin compatibility`.

### Task 5: Repository verification and release-ready PR
- [ ] Run `npm ci` and existing upstream checks.
- [ ] Run `npm run validate:openai` from a clean worktree state.
- [ ] Search stable skills for remaining Claude-only operative runtime assumptions and classify any intentional documentation references.
- [ ] Create/push `mrprohack/mattpocock-skills-openai`, preserving `upstream` remote locally.
- [ ] Push `feat/openai-chatgpt-plugin`, open a PR to `main`, and verify GitHub Actions/check status.
- [ ] Perform Superpowers verification-before-completion before claiming success.
