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

exports.performance = {
  clearMarks: performance.clearMarks.bind(performance),
  mark: performance.mark.bind(performance),
  measure: performance.measure.bind(performance),
  now: performance.now.bind(performance),
  nodeTiming: nodeTiming,
  timeOrigin: performance.timeOrigin,
  timerify: timerify
}
exports.PerformanceObserver = PerformanceObserver
