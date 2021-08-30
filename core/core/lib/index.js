'use strict'

const path = require('path')
const semver = require('semver')
const colors = require('colors')
const rootCheck = require('root-check')
const userHome = require('user-home')
const dotenv = require('dotenv')
const pathExists = require('path-exists').sync

const constant = require('./const')
const pkg = require('../package.json')
const logs = require('@panda-cli/logs')
const init = require('@panda-cli/init')
const { getNpmInfo } = require('@panda-cli/get-npm-info')

const { Command } = require('commander')
const program = new Command()

// 主流程
async function core() {
  try {
    prepare()
    registerCommand()
  } catch (error) {
    logs.error(error.message)
  }
}

async function prepare() {
  checkVersion()
  checkNodeVersion()
  checkRoot()
  checkUserHome()
  checkEnv()
  await checkGlobalUpdate()
}

// 打印 package 版本
function checkVersion() {
  // logs.info(pkg.version)
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

// 检查环境变量
function checkEnv() {
  let config
  const dotenvPath = path.resolve(userHome, '.env')
  if (pathExists(dotenvPath)) {
    config = dotenv.config({ path: dotenvPath }) // 将环境变量从主目录的 .env 文件加载到 process.env 中
  }
  createDefaultConfig()
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

// 注册命令
function registerCommand() {
  // 全局配置（panda命令后面接--xxx则认为是选项，反之认为是命令）
  program
    .name('panda')
    .usage('<command> [options]')
    .version(pkg.version)
    .option('-d, --debug', '是否开启调试模式', false) // 这个只是注册全局选项
    .option('-tp, --targetPath <targetPath>', '是否指定本地调式文件路径', '') // 注册全局选项（每个命令都会有这个选项）

  // 注册命令
  program
    .command('init [projectName]') // "<>"表示必填项 "[]"表示可选项
    .description('初始化项目')
    .option('-f, --force', '是否强制初始化项目') // 添加选项
    .action(init)

  // 监听debug命令
  program.on('option:debug', () => {
    process.env.LOWEST_NODE_VERSION = 'verbose'
    logs.level = 'verbose'
  })

  // 监听targetPath
  program.on('option:targetPath', function (path) {
    process.env.CLI_TARGET_PATH = path
  })

  // 监听
  program.on('command:*', function (operands) {
    const availableCommands = program.commands.map(cmd => cmd.name())
    console.log(colors.red(`未知的命令:${operands[0]}`))
    if (availableCommands && availableCommands.length) {
      console.log(colors.green(`可用的命令:${availableCommands.join(' ')}`))
    }
    process.exitCode = 1
  })

  program.parse(process.argv)

  // program.args 获取解析参数 要放在program.parse后面。
  if (program.args && program.args.length < 1) {
    program.outputHelp()
  }
}

module.exports = core
