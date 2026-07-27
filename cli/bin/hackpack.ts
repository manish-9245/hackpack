#!/usr/bin/env node
import { runMain } from "citty";
import { main } from "../src/index.ts";
import { showWelcome } from "../src/banner.ts";

const rest = process.argv.slice(2);
if (rest.length === 0 || rest.includes("--help") || rest.includes("-h")) {
  showWelcome();
}

runMain(main);
