// eslint-disable no-console
import { mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import esbuild from "esbuild";

const { dirname, resolve } = path;

// Bundles the event-builder CLI into a single CommonJS file for the GitHub Action
// release artifact.
//
// Output (relative to this package root):
//   artifacts/event-builder-bundle/index.cjs
//
// The release workflow tars up the `artifacts/event-builder-bundle` directory.

const packageRoot = resolve(fileURLToPath(new URL("..", import.meta.url)));
const repoRoot = resolve(packageRoot, "../..");

const outDir = resolve(packageRoot, "artifacts/event-builder-bundle");
const outFile = resolve(outDir, "index.cjs");

await rm(outDir, { recursive: true, force: true });
await mkdir(dirname(outFile), { recursive: true });

const eventsRoot = resolve(repoRoot, "packages/events");

console.log("[bundle-release] repoRoot=", repoRoot);
console.log("[bundle-release] packageRoot=", packageRoot);
console.log("[bundle-release] eventsRoot=", eventsRoot);
console.log("[bundle-release] outFile=", outFile);

await esbuild.build({
  absWorkingDir: repoRoot,
  entryPoints: [resolve(packageRoot, "src/cli/index.ts")],
  outfile: outFile,
  bundle: true,
  platform: "node",
  target: "node20",
  format: "cjs",
  sourcemap: false,
  logLevel: "debug",
  banner: {
    js: [
      "// Polyfill for libs that reference import.meta.url even in CJS builds (e.g. yargs-parser)",
      "globalThis.__IMPORT_META_URL__ = require('node:url').pathToFileURL(__filename).href;",
    ].join("\n"),
  },
  define: {
    "import.meta.url": "globalThis.__IMPORT_META_URL__",
    "import.meta.resolve": "undefined",
  },
  alias: {
    // Bundle against the workspace sources instead of relying on the package
    // being built/linked into node_modules.
    "@nhsdigital/nhs-notify-events-client-config": resolve(
      eventsRoot,
      "src/index.ts",
    ),
    "@nhsdigital/nhs-notify-events-client-config/src": resolve(
      eventsRoot,
      "src",
    ),
  },
});

// Add a small marker file to make the tarball contents obvious when debugging.
await writeFile(
  resolve(outDir, "README.txt"),
  "event-builder-bundle\n",
  "utf8",
);
