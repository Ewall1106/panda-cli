'use strict'

const path = require('path')

function formatPath(p) {
  if (p && typeof p === 'string') {
    const sep = path.sep
    if (sep === '/') return p
  } else {
    return p.replace(/\\/g, '/') // 将windows系统上路径反斜杠替换
  }
}

module.exports = formatPath
