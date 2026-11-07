import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';

async function snippets(locale) {
  const raw = await readFile(`src/content/articles/${locale}/rules-hooks.md`, 'utf8');
  const code = raw.match(/```javascript\n(\/\/ stop-check\.cjs[\s\S]*?)```/)[1];
  const config = [...raw.matchAll(/```json\n([\s\S]*?)```/g)]
    .map((m) => m[1]).find((s) => s.includes('"Stop"'));
  return { code, config: JSON.parse(config) };
}

test('bilingual documented Stop wrapper maps failing checks to 2 and guards repeat stops', async () => {
  const en = await snippets('en');
  assert.deepEqual(await snippets('zh'), en, 'both translations publish the same runnable code/config');
  const hook = en.config.hooks.Stop[0].hooks[0];
  assert.equal(hook.type, 'command');
  assert.equal(hook.command, 'node');
  assert.deepEqual(hook.args, ['${CLAUDE_PROJECT_DIR}/.claude/hooks/stop-check.cjs']);
  const root = await mkdtemp(path.join(tmpdir(), 'opc hook fixture '));
  try {
    await mkdir(path.join(root, 'site'));
    await mkdir(path.join(root, '.claude/hooks'), { recursive: true });
    const file = path.join(root, '.claude/hooks/stop-check.cjs');
    await writeFile(file, en.code);
    assert.equal(spawnSync(process.execPath, ['--check', file]).status, 0);
    async function checkScript(code) {
      await writeFile(path.join(root, 'site/package.json'), JSON.stringify({
        scripts: { check: `node -e "process.exit(${code})"` },
      }));
    }
    const run = (input, project = root) => spawnSync(process.execPath, [file], {
      cwd: tmpdir(), encoding: 'utf8', input,
      env: { ...process.env, CLAUDE_PROJECT_DIR: project }, timeout: 15000,
    });
    const event = JSON.stringify({ hook_event_name: 'Stop', stop_hook_active: false });
    await checkScript(0);
    assert.equal(run(event).status, 0);
    await checkScript(1);
    const failure = run(event);
    assert.equal(failure.status, 2, failure.stderr);
    assert.match(failure.stderr, /Typecheck failed/);
    // If the guard incorrectly ran npm, the missing project would fail.
    assert.equal(run(JSON.stringify({ hook_event_name: 'Stop', stop_hook_active: true }), '/not-a-project').status, 0);
    assert.equal(run('{malformed').status, 2);
    assert.equal(run(JSON.stringify({ hook_event_name: 'PostToolUse' })).status, 2);
    assert.equal(run(event, '').status, 2);
    assert.equal(run(event, '/not-a-project').status, 2);
  } finally {
    await rm(root, { recursive: true, force: true });
  }
});
