/**
 * CRA build wrapper for Windows path-casing issues.
 *
 * Fixes ESLint "Plugin 'react' was conflicted" when the same project folder
 * is accessed with different path casing (e.g. POTFOLIOXENTENISON vs potfolioXentenison),
 * which can make ESLint load the same config twice under different cache keys.
 */
const fs = require("fs");

const realCwd = fs.realpathSync(process.cwd());
if (realCwd !== process.cwd()) {
  process.chdir(realCwd);
}

require("react-scripts/scripts/build");

