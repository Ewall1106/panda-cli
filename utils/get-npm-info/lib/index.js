'use strict'

const urlJoin = require('url-join')
const semver = require('semver')
const axios = require('axios')

function getNpmInfo(npmName, registry) {
  if (!npmName) return
  registry = registry || 'https://registry.npm.taobao.org/'
  const npmInfoUrl = urlJoin(registry, npmName)

  return new Promise((resolve, reject) => {
    axios
      .get(npmInfoUrl)
      .then(res => {
        if (res.status === 200) {
          resolve(res.data)
        }
      })
      .catch(err => {
        reject(err)
      })
  })
}

module.exports = {
  getNpmInfo
}
