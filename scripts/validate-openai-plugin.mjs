import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const failures = [];
const fail = (message) => failures.push(message);
const read = (relative) => fs.readFileSync(path.join(root, relative), 'utf8');
const exists = (relative) => fs.existsSync(path.join(root, relative));

const claudeManifest = JSON.parse(read('.claude-plugin/plugin.json'));
const stableSkills = claudeManifest.skills;
const requiredFiles = [
  '.codex-plugin/plugin.json',
  'UPSTREAM.md',
  'PATCHES.md',
  'evals/activation-cases.json',
];

for (const file of requiredFiles) {
  if (!exists(file)) fail(`missing required OpenAI distribution file: ${file}`);
}

let codexManifest = null;
if (exists('.codex-plugin/plugin.json')) {
  try {
    codexManifest = JSON.parse(read('.codex-plugin/plugin.json'));
  } catch (error) {
    fail(`invalid .codex-plugin/plugin.json: ${error.message}`);
  }
}

if (codexManifest) {
  if (codexManifest.name !== 'mattpocock-skills-openai') {
    fail('OpenAI plugin name must be mattpocock-skills-openai');
  }
  if (!Array.isArray(codexManifest.skills) || codexManifest.skills.length === 0) {
    fail('OpenAI plugin manifest must declare stable skills');
  } else {
    const expected = [...stableSkills].sort();
    const actual = [...codexManifest.skills].sort();
    if (JSON.stringify(expected) !== JSON.stringify(actual)) {
      fail('OpenAI plugin skills must match the upstream stable skill manifest');
    }
  }
}

for (const skillPath of stableSkills) {
  const relative = skillPath.replace(/^\.\//, '');
  const skillFile = `${relative}/SKILL.md`;
  const openaiFile = `${relative}/agents/openai.yaml`;
  if (!exists(skillFile)) {
    fail(`stable skill missing SKILL.md: ${skillFile}`);
    continue;
  }
  if (!exists(openaiFile)) {
    fail(`stable skill missing OpenAI metadata: ${openaiFile}`);
    continue;
  }

  const skill = read(skillFile);
  const openai = read(openaiFile);
  const explicitClaude = /^disable-model-invocation:\s*true\s*$/m.test(skill);
  const explicitOpenAI = /^\s*allow_implicit_invocation:\s*false\s*$/m.test(openai);
  if (explicitClaude !== explicitOpenAI) {
    fail(`invocation policy drift: ${relative}`);
  }
}

const coreOrchestrators = [
  'skills/engineering/implement/SKILL.md',
  'skills/engineering/to-spec/SKILL.md',
  'skills/engineering/to-tickets/SKILL.md',
  'skills/engineering/setup-matt-pocock-skills/SKILL.md',
];
const forbiddenPatterns = [
  { pattern: /\bUse \/tdd\b/i, label: 'slash-command dependency on /tdd' },
  { pattern: /\buse \/code-review\b/i, label: 'slash-command dependency on /code-review' },
  { pattern: /tell the user to run `\/setup-matt-pocock-skills`/i, label: 'Claude-style setup command wording' },
];
for (const file of coreOrchestrators) {
  const body = read(file);
  for (const rule of forbiddenPatterns) {
    if (rule.pattern.test(body)) fail(`${file}: ${rule.label}`);
  }
}

if (exists('evals/activation-cases.json')) {
  try {
    const cases = JSON.parse(read('evals/activation-cases.json'));
    const explicit = cases.filter((item) => item.class === 'explicit-only');
    const automatic = cases.filter((item) => item.class === 'model-invoked');
    if (explicit.length < 2) fail('activation fixtures need at least two explicit-only cases');
    if (automatic.length < 2) fail('activation fixtures need at least two model-invoked cases');
    for (const item of cases) {
      if (!item.skill || !item.prompt || typeof item.shouldInvoke !== 'boolean') {
        fail('every activation case needs skill, prompt, class, and boolean shouldInvoke');
        break;
      }
    }
  } catch (error) {
    fail(`invalid evals/activation-cases.json: ${error.message}`);
  }
}

if (failures.length) {
  console.error('OpenAI plugin validation failed:');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`OpenAI plugin validation passed for ${stableSkills.length} stable skills.`);
