// Run from site/. The deploy example accepts only this verified, recorded artifact.
import { spawnSync, execFileSync } from 'node:child_process';
import { mkdir, readdir, readFile, writeFile, cp } from 'node:fs/promises';
import path from 'node:path';
import { createHash } from 'node:crypto';
const output = process.argv[2];
if (!output) throw new Error('Usage: node ops/package-release.mjs /absolute/new-artifact-dir');
if (!path.isAbsolute(output) || path.resolve(output).startsWith(process.cwd() + path.sep))
  throw new Error('Artifact must be outside site/');
if (execFileSync('git', ['status', '--porcelain', '--untracked-files=all']).toString().trim())
  throw new Error('Commit changes before packaging a revision-bound artifact');
const revision = execFileSync('git', ['rev-parse', 'HEAD']).toString().trim();
for (const command of ['check', 'test', 'build']) {
  const result = spawnSync('npm', ['run', command], { stdio: 'inherit' });
  if (result.status !== 0) process.exit(1);
}
if (execFileSync('git', ['rev-parse', 'HEAD']).toString().trim() !== revision ||
    execFileSync('git', ['status', '--porcelain', '--untracked-files=all']).toString().trim())
  throw new Error('Source changed during verification; artifact not packaged');
await mkdir(output); // Intentionally fails if the artifact path already exists.
await cp('dist', output, { recursive: true });
const checksums = {};
async function walk(dir) {
  for (const ent of await readdir(dir, { withFileTypes: true })) {
    const file = path.join(dir, ent.name);
    if (ent.isSymbolicLink()) throw new Error('Artifact symlinks are forbidden');
    if (ent.isDirectory()) await walk(file);
    else if (ent.isFile()) checksums[path.relative(output, file).replaceAll(path.sep, '/')] = createHash('sha256').update(await readFile(file)).digest('hex');
    else throw new Error('Artifact special files are forbidden');
  }
}
await walk(output);
await writeFile(path.join(output, 'release.json'), JSON.stringify({ revision, verifiedAt: new Date().toISOString(), checksums }, null, 2));
console.log(`Verified artifact: ${output}, revision ${revision}, ${Object.keys(checksums).length} files`);
