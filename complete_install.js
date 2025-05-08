"use strict";

const child_process = require("child_process");
const path = require("path");

let args = process.argv.slice(2);
if (args.length > 0) {
  args = "-- " + args.join(" ");
}
else {
  args = "";
}

try {
  child_process.execSync(
    `npm run completeInstall ${args}`,
    {
      stdio: "inherit",
      cwd: path.join(__dirname, "node_modules", "profoundjs")
    }
  );
}
catch (error) {
  process.exit(typeof error.status === "number" ? error.status : 1);
}
