'use strict'

const Package = require('@panda-cli/package')

function exec() {
  const pkg = new Package()
  console.log('121', process.env.CLI_TARGET_PATH)
}

module.exports = exec
