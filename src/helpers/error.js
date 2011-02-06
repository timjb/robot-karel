function error(msg) {
  throw new Error(msg)
}

function errorFunction(msg) {
  return _(error).bind(null, msg)
}
