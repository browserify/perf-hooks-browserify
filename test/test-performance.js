'use strict'

var test = require('tape')
var performance = require('perf_hooks').performance

test('performance', function (t) {
  t.ok(performance)
  t.ok(performance.nodeTiming)
  t.strictEqual(typeof performance.timeOrigin, 'number')
  // Use a fairly large epsilon value, since we can only guarantee that the node
  // process started up in 20 seconds.
  t.ok(Math.abs(performance.timeOrigin - Date.now()) < 20000)

  var inited = performance.now()
  t.ok(inited < 20000)
  t.end()
})

test('performance.mark', function (t) {
  t.doesNotThrow(function () {
    // Should work without throwing any errors
    performance.mark('A')
    performance.clearMarks('A')

    performance.mark('B')
    performance.clearMarks()
  })
  t.end()
})

test('performance.measure', function (t) {
  performance.mark('A');
  [undefined, null, 'foo', 'initialize', 1].forEach(function (i) {
    performance.measure('test', i, 'A') // Should not throw.
  });

  [undefined, null, 'foo', 1].forEach(function (i) {
    t.throws(
      function () { performance.measure('test', 'A', i) }
      // Allow different error message in different environments
      // new RegExp(`The "${i}" performance mark has not been set$`)
    )
  })

  performance.clearMarks()
  t.end()
})

test('measurement', function (t) {
  performance.mark('A')
  setImmediate(function () {
    performance.mark('B')
    performance.measure('foo', 'A', 'B')
    t.end()
  })
})

test('nodeTiming', { skip: process.browser }, function (t) {
  t.strictEqual(performance.nodeTiming.name, 'node')
  t.strictEqual(performance.nodeTiming.entryType, 'node')
  t.end()
})
