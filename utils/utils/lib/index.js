'use strict'

function isObject(arg) {
  return Object.prototype.toString.call(arg) === '[object Object]'
}

module.exports = {
  isObject
}
