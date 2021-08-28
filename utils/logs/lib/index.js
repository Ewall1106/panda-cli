'use strict'

const log = require('npmlog')

// https://github.com/npm/npmlog#readme
log.level = process.env.LOG_LEVEL ? process.env.LOG_LEVEL : 'info'
// log.heading = "panda-cli";
// log.headingStyle = { fg: "white", bg: "blue" };

module.exports = log
