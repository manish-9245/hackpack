#!/usr/bin/env node
import { register } from 'tsx/esm/api';

// Registered in-process (not via `node --import tsx`) so module resolution for
// tsx and its transpiled imports stays anchored to this package's own
// node_modules, regardless of the caller's current working directory.
register();
await import('./hackpack.ts');
