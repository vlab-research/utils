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
  try {
    if (event.source === 'synthetic' && event.page) {
      return event.page
    }
    if (event.message && event.message.is_echo && event.sender.id) {
      return event.sender.id
    }
    if (event.recipient.id) {
      return event.recipient.id
    }
  } catch (e) {}

  console.log('EVENT:\n', JSON.parse(event, null, 4), '-----------------------\n')
  throw new Error('Could not get Facebook page event!')
}


module.exports = {
  recursiveJSONParser,
  getPageFromEvent,
  parseEvent,
  getTimeoutDate
}
