'use strict'

var test = require('tape')
var performance = require('perf_hooks').performance
var PerformanceObserver = require('perf_hooks').PerformanceObserver

test(function (t) {
  [1, null, undefined, {}, [], Infinity].forEach(function (i) {
    t.throws(function () {
      new PerformanceObserver(i) // eslint-disable-line no-new
    }
    // Allow error message mismatch
    // 'Callback must be a function'
    )
  })
  var observer = new PerformanceObserver(t.fail);

  [1, null, undefined].forEach(function (input) {
    t.throws(
      function () { observer.observe(input) }
      // Allow error message mismatch
      // new RegExp(`The "options" argument must be of type Object. Received type ${typeof input}$`)
    )
  });

  [1, undefined, null, {}, Infinity].forEach(function (i) {
    t.throws(function () { observer.observe({ entryTypes: i }) }
      // Allow error message mismatch
      // /The value "\[object Object\]" is invalid for option "entryTypes"$/
    )
  })

  t.end()
})

// Test Non-Buffered
test('non-buffered', { skip: process.browser }, function (t) {
  var observer =
    new PerformanceObserver(callback)

  var num = 3

  function callback (list, obs) {
    t.strictEqual(obs, observer)
    var entries = list.getEntries()
    t.strictEqual(entries.length, 1)
    num--
    if (num === 0) {
      observer.disconnect()
      t.end()
    }
  }
  observer.observe({ entryTypes: ['mark'] })
  performance.mark('test1')
  performance.mark('test2')
  performance.mark('test3')
})

// Test Buffered
test('buffered', function (t) {
  var observer =
    new PerformanceObserver(callback)

  function callback (list, obs) {
    t.strictEqual(obs, observer)
    var entries = list.getEntries()
    t.strictEqual(entries.length, 3)
    observer.disconnect()

    var entriesByName = list.getEntriesByName('test1')
    t.strictEqual(entriesByName.length, 1)
    t.strictEqual(entriesByName[0].name, 'test1')
    t.strictEqual(entriesByName[0].entryType, 'mark')

    var entriesByName1 = list.getEntriesByName('test1', 'mark')
    t.strictEqual(entriesByName1.length, 1)
    t.strictEqual(entriesByName1[0].name, 'test1')
    t.strictEqual(entriesByName1[0].entryType, 'mark')

    var entriesByName2 = list.getEntriesByName('test1', 'measure')
    t.strictEqual(entriesByName2.length, 0)

    var entriesByType = list.getEntriesByType('measure')
    t.strictEqual(entriesByType.length, 1)
    t.strictEqual(entriesByType[0].name, 'test3')
    t.strictEqual(entriesByType[0].entryType, 'measure')

    t.end()
  }

  observer.observe({ entryTypes: ['mark', 'measure'], buffered: true })
  // Do this twice to make sure it doesn't throw
  observer.observe({ entryTypes: ['mark', 'measure'], buffered: true })
  // Even tho we called twice, count should be 1
  performance.mark('test1')
  performance.mark('test2')
  performance.measure('test3', 'test1', 'test2')
})
