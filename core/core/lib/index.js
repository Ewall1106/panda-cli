'use strict'

const semver = require('semver')
const colors = require('colors')
const rootCheck = require('root-check')
const userHome = require('user-home')
const pathExists = require('path-exists').sync

const pkg = require('../package.json')
const logs = require('@panda-cli/logs')
const constant = require('./const')

function core() {
  try {
    checkVersion()
    checkNodeVersion()
    checkRoot()
    checkUserHome()
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

module.exports = core
