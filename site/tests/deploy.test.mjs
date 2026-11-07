import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, readlink, rm } from 'node:fs/promises';
import path from 'node:path';
import { tmpdir } from 'node:os';
import { createHash } from 'node:crypto';
import { spawnSync, spawn } from 'node:child_process';
const helper = path.resolve('ops/activate-release.sh.example');
const wrapper = path.resolve('ops/deploy.sh.example');
test('deployment EXAMPLE: fresh release, reuse refusal, checksum rejection, automatic rollback and lock', async () => {
  const dir = await mkdtemp(path.join(tmpdir(), 'opc-deploy-'));
  try {
    const artifact = path.join(dir, 'artifact'), root = path.join(dir, 'server'), bin = path.join(dir, 'bin');
    await mkdir(bin); await mkdir(path.join(artifact, 'en'), { recursive: true }); await mkdir(path.join(artifact, 'zh'));
    const checksums = {};
    for (const name of ['en/index.html', 'zh/index.html', 'sitemap.xml']) {
      const content = `fixture ${name}`;
      await writeFile(path.join(artifact, name), content);
      checksums[name] = createHash('sha256').update(content).digest('hex');
    }
    await writeFile(path.join(artifact, 'release.json'), JSON.stringify({ revision: 'a'.repeat(40), verifiedAt: 'fixture-only', checksums }));
    await writeFile(path.join(bin, 'curl'), `#!/usr/bin/env bash\nset -eu\n[[ "\${FAIL_PROBE:-0}" != 1 ]] || exit 22\nurl="\${!#}"; route="\${url#http://fixture/}"; route="\${route%%\\?*}"; [[ "$route" != */ ]] || route="\${route}index.html"\ncat "$MOCK_ROOT/current/$route"\n`, { mode: 0o755 });
    const archive = spawnSync('tar', ['-czf', '-', '-C', artifact, '.']).stdout;
    const env = { ...process.env, PATH: `${bin}:${process.env.PATH}`, MOCK_ROOT: root };
    const activate = (id, extra = {}, data = archive) => spawnSync('bash', [helper, root, id, 'http://fixture'], { input: data, env: { ...env, ...extra }, encoding: 'utf8' });
    let result = activate('initial-bad-probe', { FAIL_PROBE: '1' });
    assert.notEqual(result.status, 0);
    await assert.rejects(readlink(path.join(root, 'current')), { code: 'ENOENT' });
    result = activate('first'); assert.equal(result.status, 0, result.stderr);
    assert.equal(await readlink(path.join(root, 'current')), path.join(root, 'releases/first'));
    result = activate('first'); assert.notEqual(result.status, 0);
    result = activate('bad-probe', { FAIL_PROBE: '1' }); assert.notEqual(result.status, 0);
    assert.equal(await readlink(path.join(root, 'current')), path.join(root, 'releases/first'));
    assert.equal((await readFile(path.join(root, 'deployment-records/bad-probe/status'), 'utf8')).trim(), 'rolled-back');
    await writeFile(path.join(artifact, 'en/index.html'), 'tampered');
    const badArchive = spawnSync('tar', ['-czf', '-', '-C', artifact, '.']).stdout;
    result = activate('bad-checksum', {}, badArchive); assert.notEqual(result.status, 0);
    assert.equal(await readlink(path.join(root, 'current')), path.join(root, 'releases/first'));
    result = activate('../bad'); assert.equal(result.status, 64);
    const lock = spawn('flock', [path.join(root, '.deploy.lock'), 'bash', '-c', 'echo LOCKED; read -r line'], { stdio: ['pipe', 'pipe', 'pipe'] });
    await new Promise((resolve, reject) => { lock.stdout.once('data', resolve); lock.once('error', reject); });
    result = activate('overlap'); assert.equal(result.status, 75);
    lock.stdin.end('done\n'); await new Promise((resolve) => lock.once('exit', resolve));
    await writeFile(path.join(artifact, 'en/index.html'), 'fixture en/index.html');
    await writeFile(path.join(bin, 'ssh'), '#!/usr/bin/env bash\nset -eu\n[[ "$1" == fixture ]] || exit 64\nexec bash -c "$2"\n', { mode: 0o755 });
    result = spawnSync('bash', [wrapper], { encoding: 'utf8', env: { ...env, ROOT: root, RELEASE_ID: 'wrapper-roundtrip', ARTIFACT_DIR: artifact, REMOTE: 'fixture', PROBE_ORIGIN: 'http://fixture' } });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(await readlink(path.join(root, 'current')), path.join(root, 'releases/wrapper-roundtrip'));
  } finally { await rm(dir, { recursive: true, force: true }); }
});
