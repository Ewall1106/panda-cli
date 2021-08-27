'use strict'

const semver = require('semver')
const colors = require('colors')

const pkg = require('../package.json')
const logs = require('@panda-cli/logs')
const constant = require('./const')

function core() {
  checkVersion()
  checkNodeVersion()
  console.log('12312')
}

// 打印package版本
function checkVersion() {
  logs.info(pkg.version)
}

// 比较Node版本
function checkNodeVersion() {
  const currentVersion = process.version
  const lowestVersion = constant.LOWEST_NODE_VERSION
  const compareVersionBoolean = semver.gte(currentVersion, lowestVersion)
  if (!compareVersionBoolean) {
    logs.error(`需要安装${lowestVersion}以上的版本`)
    return
  }
}

module.exports = core
