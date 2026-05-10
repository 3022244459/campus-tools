import {spawnSync} from 'node:child_process';

const minimumMajor = Number(process.argv[2] ?? 17);

const result = spawnSync('java', ['-version'], {
  encoding: 'utf8',
});

if (result.error) {
  console.error(`Java was not found: ${result.error.message}`);
  process.exit(1);
}

const output = `${result.stderr ?? ''}\n${result.stdout ?? ''}`;
const versionMatch = output.match(/version "([^"]+)"/i) ?? output.match(/openjdk\s+([^\s]+)/i);
const version = versionMatch?.[1];
const major = version ? parseJavaMajorVersion(version) : null;

if (!major) {
  console.error('Unable to determine Java version from `java -version` output.');
  process.exit(1);
}

if (major < minimumMajor) {
  console.error(`Java ${minimumMajor}+ is required. Current Java version: ${version}.`);
  process.exit(1);
}

console.log(`Java ${version} detected.`);

function parseJavaMajorVersion(version) {
  const parts = version.split(/[._+-]/).map((part) => Number(part));
  if (!Number.isInteger(parts[0])) {
    return null;
  }

  if (parts[0] === 1 && Number.isInteger(parts[1])) {
    return parts[1];
  }

  return parts[0];
}
