'use strict'

// init 命令需要动态化
// 团队A 使用@panda-cli/initA作为初始化模板
// 团队B 使用@panda-cli/initB作为初始化模板
// 团队C 使用@panda-cli/initC作为初始化模板
function init(projectName, cmdObj) {
  console.log('>>>>', process.env.CLI_TARGET_PATH)
  // console.log('clone command called', projectName, this, cmdObj)
}

module.exports = init
