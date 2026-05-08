const { spawn, spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const repoRoot = path.resolve(__dirname, "..");
const configRoot = path.join(repoRoot, "src", "config", "sierpinski");
const reactScriptsBin = path.join(repoRoot, "node_modules", ".bin", process.platform === "win32" ? "react-scripts.cmd" : "react-scripts");
const watchedExtensions = new Set([".yml", ".yaml"]);

let debounceTimer = null;
const watchers = new Map();

function runGenerator() {
  const result = spawnSync("npm", ["run", "generate-registry"], {
    cwd: repoRoot,
    stdio: "inherit",
    shell: true
  });

  if (result.status !== 0) {
    console.error("Failed to regenerate Sierpinski registry.");
  }
}

function shouldRegenerate(filePath) {
  if (!filePath) {
    return true;
  }

  const ext = path.extname(filePath).toLowerCase();
  return watchedExtensions.has(ext);
}

function scheduleRegenerate(filePath) {
  if (!shouldRegenerate(filePath)) {
    return;
  }

  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    runGenerator();
    refreshWatchers();
  }, 100);
}

function watchDirectory(dirPath) {
  if (watchers.has(dirPath)) {
    return;
  }

  try {
    const watcher = fs.watch(dirPath, (eventType, filename) => {
      const changedPath = filename ? path.join(dirPath, filename.toString()) : dirPath;

      if (eventType === "rename") {
        refreshWatchers();
      }

      scheduleRegenerate(changedPath);
    });

    watcher.on("error", () => {
      watchers.delete(dirPath);
      watcher.close();
    });

    watchers.set(dirPath, watcher);
  } catch (error) {
    console.error(`Failed to watch ${dirPath}:`, error);
  }
}

function collectDirectories(dirPath, directories = []) {
  directories.push(dirPath);

  for (const name of fs.readdirSync(dirPath)) {
    const fullPath = path.join(dirPath, name);
    const stat = fs.statSync(fullPath);

    if (stat.isDirectory()) {
      collectDirectories(fullPath, directories);
    }
  }

  return directories;
}

function refreshWatchers() {
  const directories = new Set(collectDirectories(configRoot));

  for (const dirPath of directories) {
    watchDirectory(dirPath);
  }

  for (const [dirPath, watcher] of watchers.entries()) {
    if (!directories.has(dirPath)) {
      watcher.close();
      watchers.delete(dirPath);
    }
  }
}

runGenerator();
refreshWatchers();
console.log("Watching src/config/sierpinski YAML files for hot reload.");

const react = spawn(reactScriptsBin, ["start"], {
  cwd: repoRoot,
  env: {
    ...process.env,
    GENERATE_SOURCEMAP: "false"
  },
  stdio: "inherit"
});

function shutdown(signal) {
  for (const watcher of watchers.values()) {
    watcher.close();
  }

  if (!react.killed) {
    react.kill(signal);
  }
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

react.on("exit", (code, signal) => {
  for (const watcher of watchers.values()) {
    watcher.close();
  }

  if (signal) {
    process.kill(process.pid, signal);
    return;
  }

  process.exit(code || 0);
});
