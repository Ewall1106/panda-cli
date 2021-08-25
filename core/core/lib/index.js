"use strict";

const pkg = require("../package.json");
const logs = require("@panda-cli/logs");

function core() {
  checkVersion();
}

function checkVersion() {
  logs.info(pkg.version);
}

module.exports = core;
