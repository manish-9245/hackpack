#!/usr/bin/env node
import { execa } from 'execa';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const hackpackPath = join(__dirname, 'hackpack.ts');

try {
  await execa('node', ['--import', 'tsx', hackpackPath, ...process.argv.slice(2)], {
    stdio: 'inherit',
  });
} catch (error) {
  process.exit(error.exitCode || 1);
}
