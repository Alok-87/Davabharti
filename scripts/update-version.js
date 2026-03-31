// scripts/update-version.js
import fs from "fs";
import { execSync } from "child_process";

const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
const version = pkg.version;

let commitMessage = "";
let hash = "";

try {
  commitMessage = execSync("git log -1 --pretty=%s").toString().trim();
  hash = execSync("git rev-parse --short HEAD").toString().trim();
} catch {
  commitMessage = "No commit info available";
  hash = "unknown";
}

const content = `// Auto-generated during build
export const APP_VERSION = "${version}";
export const APP_COMMIT_MESSAGE = "${commitMessage.replace(/"/g, '\\"')}";
export const APP_BUILD_HASH = "${hash}";
export const APP_BUILD_TIME = "${new Date().toISOString()}";
`;

fs.writeFileSync("src/version.ts", content);
console.log("✅ version.ts updated:", version, "|", commitMessage);
