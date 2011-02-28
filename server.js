#!/usr/bin/env node

var express = require('express')

var app = express.createServer()

app.configure(function() {
  app.use(express.staticProvider(__dirname))
})

app.configure('production', function() {
  app.use(express.errorHandler())
})

app.listen(8000)
