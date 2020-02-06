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

function getTimeoutDate(waitStart, waitTime) {
  const timeout = new Date(chrono.parseDate(waitTime, new Date(waitStart)))
  return timeout
}

function getPageFromEvent(event) {
  if (event.source === 'synthetic') {
    return event.page
  }
  if (event.message && event.message.is_echo) {
    return event.sender.id
  }
  else {
    return event.recipient.id
  }
}


module.exports = {
  recursiveJSONParser,
  getPageFromEvent,
  parseEvent,
  getTimeoutDate
}
