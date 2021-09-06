'use strict'

const path = require('path')
const pkgDir = require('pkg-dir')
const formatPath = require('@panda-cli/format-path')

class Package {
  constructor(options) {
    console.log('constructor', options)
    // package目标路径
    this.targetPath = options.targetPath
    // package缓存路径
    // this.storePath = options.storePath
    // package名字
    this.packageName = options.packageName
    // package版本
    this.packageVersion = options.packageVersion
  }

  // 判断package是否存在
  exist() {}

  // 安装package
  install() {}

  // 更新package
  update() {}

  // 获取入口文件的路径
  async getRootFilePath() {
    // 1. 获取package.json所在的目录
    const rootDir = await pkgDir(this.targetPath)

    if (rootDir) {
      // 2. 读取package.json
      const pkgFile = require(path.resolve(rootDir, 'package.json'))
      // 3. 找 main 或 lib
      if (pkgFile && pkgFile.main) {
        // 4. 路径兼容（drain windows)
        return formatPath(path.resolve(rootDir, pkgFile.main))
      }
    }
    return undefined
  }
}

module.exports = Package
