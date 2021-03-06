function zeroFill(i) {
  return (i < 10 ? '0' : '') + i
}

module.exports = function now () {
  var d = new Date()
  return d.getFullYear() + '-'
    + zeroFill(d.getMonth() + 1) + '-'
    + zeroFill(d.getDate()) + '--'
    + zeroFill(d.getHours()) + ':'
    + zeroFill(d.getMinutes()) + ':'
    + zeroFill(d.getSeconds())
}
