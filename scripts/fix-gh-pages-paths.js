const fs = require("fs");
const path = require("path");

const distIndexPath = path.join(__dirname, "..", "dist", "index.html");
const pagesTarget = (process.env.PAGES_TARGET || "relative").toLowerCase();

if (!fs.existsSync(distIndexPath)) {
  console.error("dist/index.html not found. Run build first.");
  process.exit(1);
}

const html = fs.readFileSync(distIndexPath, "utf8");

const toGithubRootPaths = (content) =>
  content
    // quoted with ./
    .replace(/href="\.\/chef-food-frontend\./g, 'href="/chef-food-frontend/chef-food-frontend.')
    .replace(/src="\.\/chef-food-frontend\./g, 'src="/chef-food-frontend/chef-food-frontend.')
    // quoted without ./
    .replace(/href="chef-food-frontend\./g, 'href="/chef-food-frontend/chef-food-frontend.')
    .replace(/src="chef-food-frontend\./g, 'src="/chef-food-frontend/chef-food-frontend.')
    // unquoted (parcel minified output)
    .replace(/href=chef-food-frontend\./g, 'href=/chef-food-frontend/chef-food-frontend.')
    .replace(/src=chef-food-frontend\./g, 'src=/chef-food-frontend/chef-food-frontend.')
    // already has /chef-food-frontend/ prefix but without subdirectory
    .replace(/href="\/chef-food-frontend\./g, 'href="/chef-food-frontend/chef-food-frontend.')
    .replace(/src="\/chef-food-frontend\./g, 'src="/chef-food-frontend/chef-food-frontend.');

const toRelativePaths = (content) =>
  content
    // normalize explicit repository-root paths
    .replace(/href="\/chef-food-frontend\/chef-food-frontend\./g, 'href="./chef-food-frontend.')
    .replace(/src="\/chef-food-frontend\/chef-food-frontend\./g, 'src="./chef-food-frontend.')
    .replace(/href=\/chef-food-frontend\/chef-food-frontend\./g, 'href=./chef-food-frontend.')
    .replace(/src=\/chef-food-frontend\/chef-food-frontend\./g, 'src=./chef-food-frontend.')
    // normalize root paths without subfolder duplication
    .replace(/href="\/chef-food-frontend\./g, 'href="./chef-food-frontend.')
    .replace(/src="\/chef-food-frontend\./g, 'src="./chef-food-frontend.')
    .replace(/href=\/chef-food-frontend\./g, 'href=./chef-food-frontend.')
    .replace(/src=\/chef-food-frontend\./g, 'src=./chef-food-frontend.');

const fixed = pagesTarget === "github" ? toGithubRootPaths(html) : toRelativePaths(html);

fs.writeFileSync(distIndexPath, fixed);
console.log(`Fixed static asset paths for target: ${pagesTarget}`);
