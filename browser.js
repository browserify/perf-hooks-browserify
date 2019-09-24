/* eslint-env browser */

var performance = global.performance
var PerformanceObserver = global.PerformanceObserver

var nodeTiming = {}

// Does not do anything right now.
// This could be implemented by wrapping the `PerformanceObserver` callback
// and using `performance.measure()` with a special name (like "timerified [fn]")
// Then when `entryTypes: ['function']` is passed we observe "measure" instead and filter the entries.
function timerify (fn) {
  return fn
}

function measure (name, startMark, endMark) {
  // Allowed in the browser but not in Node.js
  if (endMark === undefined) {
    throw new Error('The mark \'undefined\' does not exist')
  }

  try {
    return performance.measure(name, startMark, endMark)
  } catch (error) {
    // Handle case where browsers will throw when `startMark` does not exist, while Node.js defaults to 0
    if (error.message.indexOf('The mark \'' + startMark + '\' does not exist') !== -1) {
      return performance.measure(name, undefined, endMark)
    }
    throw error
  }
}

exports.performance = {
  clearMarks: performance.clearMarks.bind(performance),
  mark: performance.mark.bind(performance),
  measure: measure,
  now: performance.now.bind(performance),
  nodeTiming: nodeTiming,
  timeOrigin: performance.timeOrigin,
  timerify: timerify
}
exports.PerformanceObserver = PerformanceObserver
