'use strict'

const logs = require('@panda-cli/logs')
const Package = require('@panda-cli/package')

const SETTINGS = {
  init: '@panda-cli/init'
}

async function exec(...args) {
  const cmdObj = args[args.length - 1]
  const targetPath = process.env.CLI_TARGET_PATH || process.cwd() // 如果没有targetPath就用当前进程运行路径当targetPath
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

  if (pkg.exist()) {
    // 更新package
  } else {
    // 安装package
    pkg.install()
  }
  const rootFile = await pkg.getRootFilePath()
  require(rootFile).apply(null, arguments)
}

module.exports = exec
