'use strict'

const logs = require('@panda-cli/logs')
const Package = require('@panda-cli/package')

const SETTINGS = {
  init: '@panda-cli/init'
}

async function exec(...args) {
  const cmdObj = args[args.length - 1]
  const targetPath = process.env.CLI_TARGET_PATH
  const homePath = process.env.CLI_HOME_PATH
  const packageName = SETTINGS[cmdObj.name()]
  const packageVersion = 'latest'

  logs.verbose('targetPath', targetPath)
  logs.verbose('homePath', homePath)

  const pkg = new Package({
    targetPath,
    packageName,
    packageVersion
  })

  console.log('1231231', await pkg.getRootFilePath())
}

module.exports = exec
