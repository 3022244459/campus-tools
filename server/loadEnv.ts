import fs from 'node:fs';
import path from 'node:path';
import {parse as parseDotenv} from 'dotenv';

type EnvTarget = Record<string, string | undefined>;

const envFiles = ['.env.local', '.env'];

export function loadServerEnv(cwd = process.cwd(), env: EnvTarget = process.env): void {
  for (const fileName of envFiles) {
    const filePath = path.resolve(cwd, fileName);
    if (!fs.existsSync(filePath)) {
      continue;
    }

    const parsed = parseDotenv(fs.readFileSync(filePath));
    for (const [key, value] of Object.entries(parsed)) {
      if (env[key] === undefined) {
        env[key] = value;
      }
    }
  }
}
