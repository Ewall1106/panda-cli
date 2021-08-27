'use strict'

const semver = require('semver')
const colors = require('colors')
const rootCheck = require('root-check')

const pkg = require('../package.json')
const logs = require('@panda-cli/logs')
const constant = require('./const')

function core() {
  checkVersion()
  checkNodeVersion()
  checkRoot()
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
    logs.error(`需要安装${lowestVersion}以上的版本`)
  }
}

// root 用户自动降级
function checkRoot() {
  rootCheck()
  // console.log(process.getuid())
}

module.exports = core
