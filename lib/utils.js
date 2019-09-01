const chrono = require('chrono-node')

function recursiveJSONParser(obj) {
  function traverse(obj) {
    if (typeof obj !== 'object' || obj === null) return obj
    for (let key in obj) {
      obj[key] = recursiveJSONParser(obj[key])
    }
    return obj
  }

  try {
    return traverse(JSON.parse(obj))
  }
  catch (e){
    return traverse(obj)
  }
}

function parseEvent(event) {
  const m = recursiveJSONParser(event)

  // abstraction layer for any changes that might happen...
  return m
}

function getTimeoutDate(event, waitTime) {
  const date = event.timestamp
  const timeout = new Date(chrono.parseDate(waitTime, new Date(date)))
  return timeout
}

module.exports = {
  recursiveJSONParser,
  parseEvent,
  getTimeoutDate
}
