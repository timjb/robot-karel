{exec} = require 'child_process'
fs     = require 'fs'

task 'build:parser', ->
  jison = exec 'jison src/compiler/karol.yy src/compiler/karol.l'
  log = (data) -> console.log data.toString()
  jison.stdout.on 'data', log
  jison.stderr.on 'data', log
  jison.on 'exit', ->
    fs.rename 'karol.js', 'lib/compiler/parser.js'
