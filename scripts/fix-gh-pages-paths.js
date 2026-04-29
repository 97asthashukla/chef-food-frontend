const fs = require("fs");
const path = require("path");

const distIndexPath = path.join(__dirname, "..", "dist", "index.html");

if (!fs.existsSync(distIndexPath)) {
  console.error("dist/index.html not found. Run build first.");
  process.exit(1);
}

const html = fs.readFileSync(distIndexPath, "utf8");

const fixed = html
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

fs.writeFileSync(distIndexPath, fixed);
console.log("Fixed GitHub Pages asset paths in dist/index.html");
