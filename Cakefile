fs = require 'fs'
{exec, spawn} = require 'child_process'
{bundle} = require 'browserify'


task 'build:parser', ->
  jison = exec 'jison src/compiler/karol.yy src/compiler/karol.l'
  connectStd jison
  jison.on 'exit', ->
    fs.rename 'karol.js', 'lib/compiler/parser.js'

task 'build', ->
  bundled = bundle
    base:    __dirname + '/lib',
    require: ['underscore']
  fs.writeFileSync 'public/bundle.js', bundled, 'utf-8'


task 'server', ->
  connect = require 'connect'
  server = connect.createServer(connect.static(__dirname+'/public'))
  server.listen 8000
  console.log "Server listening on localhost:8000"


# The URL is secret since it contains the admin password
#COUCHAPP_URL = fs.readFileSync('COUCHDB_URL', 'utf-8')

# Note to myself: Start CouchDB with `sudo /etc/init.d/couchdb start`
COUCHAPP_URL = 'http://localhost:5984/karel'

task 'push', 'Push the couchapp to the server', ->
  couchapp = spawn 'couchapp', ['push', 'couchapp/app.js', COUCHAPP_URL]
  connectStd couchapp

task 'sync', 'Push and watch local files for changes', ->
  couchapp = spawn 'couchapp', ['sync', 'couchapp/app.js', COUCHAPP_URL]
  connectStd couchapp


connectStd = (process) ->
  log = (data) -> console.log data.toString()
  process.stdout.on 'data', log
  process.stderr.on 'data', log
