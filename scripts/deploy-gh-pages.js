/**
 * Directly pushes dist/ to the gh-pages branch on GitHub,
 * bypassing the gh-pages npm package which caches stale files.
 */
const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const os = require("os");

const REPO_URL = "https://github.com/97asthashukla/chef-food-frontend.git";
const DIST_DIR = path.join(__dirname, "..", "dist");

if (!fs.existsSync(DIST_DIR)) {
  console.error("dist/ not found. Run npm run build first.");
  process.exit(1);
}

const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "gh-pages-"));

try {
  // Copy dist contents to temp dir
  fs.cpSync(DIST_DIR, tmp, { recursive: true });

  const run = (cmd) => execSync(cmd, { cwd: tmp, stdio: "inherit" });

  run("git init");
  run("git add .");
  run('git commit -m "Deploy to gh-pages"');
  run(`git remote add origin ${REPO_URL}`);
  run("git push -f origin HEAD:gh-pages");

  console.log("Successfully deployed to gh-pages!");
} finally {
  fs.rmSync(tmp, { recursive: true, force: true });
}
