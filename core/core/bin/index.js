#!/usr/bin/env node

const utils = require("@panda-cli/utils");
const importLocal = require("import-local");
const log = require("npmlog");

if (importLocal(__filename)) {
  log.info("cli", "Using local version of this package");
} else {
  require("../lib")(process.argv.slice(2));
}
