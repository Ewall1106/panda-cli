'use strict'

const path = require('path')
const semver = require('semver')
const colors = require('colors')
const rootCheck = require('root-check')
const userHome = require('user-home')
const dotenv = require('dotenv')
const pathExists = require('path-exists').sync
const argv = require('minimist')(process.argv.slice(2))

const constant = require('./const')
const pkg = require('../package.json')
const logs = require('@panda-cli/logs')
const { getNpmInfo } = require('@panda-cli/get-npm-info')

// 主流程
async function core() {
  try {
    checkVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
    checkArgs()
    checkEnv()
    await checkGlobalUpdate()
  } catch (error) {
    logs.error(error.message)
  }
}

// 打印 package 版本
function checkVersion() {
  logs.info(pkg.version)
}

// 比较 Node 版本
function checkNodeVersion() {
  const currentVersion = process.version
  const lowestVersion = constant.LOWEST_NODE_VERSION
  const compareVersionBoolean = semver.gte(currentVersion, lowestVersion)
  if (!compareVersionBoolean) {
    throw new Error(colors.red(`需要安装${lowestVersion}以上的版本`))
  }
}

// root 用户自动降级
function checkRoot() {
  rootCheck()
  // console.log(process.getuid())
}

// 检查用户主目录
function checkUserHome() {
  if (!userHome || !pathExists(userHome)) {
    throw new Error(colors.red('当前登录用户主目录不存在！'))
  }
}

// 检查入参及开启debug模式
function checkArgs() {
  if (argv.debug) {
    process.env.LOWEST_NODE_VERSION = 'verbose'
    logs.level = 'verbose'
  }
}

// 检查环境变量
function checkEnv() {
  let config
  const dotenvPath = path.resolve(userHome, '.env')
  if (pathExists(dotenvPath)) {
    config = dotenv.config({ path: dotenvPath }) // 将环境变量从主目录的 .env 文件加载到 process.env 中
  }
  createDefaultConfig()
  logs.verbose('123', process.env.CLI_HOME_PATH)
}

// 检查本地是否是最新版本
async function checkGlobalUpdate() {
  // 1. 获取当前版本号和模块名
  const npmName = pkg.name
  const currentVersion = pkg.version
  // 2. 调用 Npm API，获取所有版本号
  const { versions = {} } = await getNpmInfo(npmName)
  // 3. 提取所有版本号，比对那些版本号是大于当前版本号
  const versionsList = Object.keys(versions)
  // 4. 获取最新版本号，提示用户更新到该版本
  if (versionsList && versionsList.length) {
    const flag = semver.gte(currentVersion, versionsList[0])
    if (!flag) {
      logs.warn(
        colors.yellow(
          `请更新 ${npmName} 到最新版本，最新版本为${versionsList[0]}，当前版本为${currentVersion}`
        )
      )
      process.exit()
    }
  }
}

// 创建默认的环境变量（这里设置的是主目录的环境变量，其实大可不必，完全可以读cwd根目录中的环境变量）
function createDefaultConfig() {
  const cliConfig = {
    home: userHome
  }
  if (process.env.CLI_HOME) {
    cliConfig['cliHome'] = path.join(userHome, process.env.CLI_HOME)
  } else {
    cliConfig['cliHome'] = path.join(userHome, constant.DEFAULT_CLI_HOME)
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome
}

module.exports = core
