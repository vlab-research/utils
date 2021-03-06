const chrono = require('chrono-node')
const util = require('util')

function recursiveJSONParser(obj) {
  function traverse(obj) {
    if (typeof obj !== 'object' || obj === null) return obj
    for (let key in obj) {
      obj[key] = recursiveJSONParser(obj[key])
    }
    return obj
  }

  try {
    const o = JSON.parse(obj)

    // make sure we didn't parse a string
    // into a number!!!
    if (o === +obj) {
      return traverse(obj)
    }
    return traverse(o)
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

  console.log('EVENT:\n', util.inspect(event, null, 8), '\n-----------------------\n')
  throw new Error('Could not get Facebook page from event!')
}

function getUserFromEvent(event) {
  try {
    if (event.source === 'synthetic' && event.user) {
      return event.user
    }
    if (event.message && event.message.is_echo && event.recipient.id) {
      return event.recipient.id
    }
    if (event.sender.id) {
      return event.sender.id
    }
  } catch (e) {}

  console.log('EVENT:\n', util.inspect(event, null, 8), '\n-----------------------\n')
  throw new Error('Could not get Facebook user from event!')
}


module.exports = {
  recursiveJSONParser,
  getPageFromEvent,
  getUserFromEvent,
  parseEvent,
  getTimeoutDate
}
