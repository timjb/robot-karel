// DOESN'T WORK at the moment


var assert = require('assert')
,   zombie = require('zombie')

function open(callback) {
  zombie.visit('http://localhost:8000/#examples/pyramid', function(err, browser, status) {
    //if (err) throw err
    
    callback(browser)
  })
}

exports.testSwitchTo2DView = function(next) {
  open(function(browser) {
    assert.equal(0, browser.querySelectorAll('.world-2d').length)
    browser.pressButton('#view-select-2d', function() {
      assert.equal(1, browser.querySelectorAll('.world-2d').length)
      next()
    })
  })
}

function getGrid(browser, callback) {
  browser.pressButton('#view-select-2d', function() {
    var table = browser.querySelector('.world-2d')
    
    var data = []
    ;[].forEach.call(table.getElementsByTagName('tr'), function(tr) {
      var row = []
      ;[].forEach.call(tr.getElementsByTagName('td'), function(td) {
        row.push(td.innerHTML)
      })
      data.push(row)
    })
    callback(data)
  })
}

exports.testWorldToolbar = function() {}

exports.testRun = function(next) {
  open(function(browser) {
    browser.pressButton("Run", function() {
      setTimeout(function() {
        getGrid(browser, function(grid) {
          //console.log(grid)
          next()
        })
      }, 500)
    })
  })
}

exports.testReset = function() {}

exports.testCreateNewWorld = function() {}


// Run tests sequentially
var tests = [
  exports.testSwitchTo2DView,
  exports.testRun
]

function next() {
  if (tests.length) {
    tests.shift()(next)
  }
}

next()
