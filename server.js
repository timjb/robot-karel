#!/usr/bin/env node

var express    = require('express')
,   browserify = require('browserify')

var app = express.createServer()

app.configure(function() {
  app.use(express.static(__dirname))
  app.use(browserify({
    base:  __dirname + '/lib',
    mount: '/browserify.js',
    require: ['underscore', 'backbone']
  }))
})

app.configure('production', function() {
  app.use(express.errorHandler())
})

app.listen(8000)

console.log("Started Server on http://localhost:8000/")
