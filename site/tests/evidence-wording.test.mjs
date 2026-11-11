import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve('src/content/articles');

test('called-out evidence and bilingual issues stay fixed', async () => {
  const enSpec = await readFile(path.join(root, 'en/spec-first-agent-loop.md'), 'utf8');
  const zhSpec = await readFile(path.join(root, 'zh/spec-first-agent-loop.md'), 'utf8');
  const zhCodex = await readFile(path.join(root, 'zh/codex.md'), 'utf8');
  const enCodex = await readFile(path.join(root, 'en/codex.md'), 'utf8');
  const zhClaude = await readFile(path.join(root, 'zh/claude-code.md'), 'utf8');
  assert.match(enSpec, /Task-splitting example \(not a measured average\)/);
  assert.doesNotMatch(enSpec, /Typical diff size/);
  assert.match(zhSpec, /任务拆分示例（不是实测平均值）/);
  assert.doesNotMatch(zhSpec, /典型 Diff 规模/);
  assert.match(enCodex, /parallel execution is not an automatic speedup/);
  assert.match(zhCodex, /并行并不会自动加快进度/);
  assert.doesNotMatch(zhCodex, /最大的效率杠杆/);
  assert.doesNotMatch(zhClaude, /唯有 hooks 与 CI 能确定性拦截/);
  assert.match(zhClaude, /事后检查不能逆转已经发生的动作/);
  const en48 = await readFile(path.join(root, 'en/48h-mvp-agent-stack.md'), 'utf8');
  assert.match(en48, /id="broken-link-release-gate"/);
  assert.match(en48, /ab2504a843597dfb408f4ea34fe168e8a8dc2c0b/);
  assert.match(en48, /\/en\/does-not-exist\//);
  assert.match(en48, /missing output/);
});
