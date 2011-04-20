fs = require 'fs'
path = require 'path'
{exec, spawn} = require 'child_process'


task 'build:parser', ->
  jison = exec 'jison src/compiler/karol.yy src/compiler/karol.l'
  connectStd jison
  jison.on 'exit', ->
    fs.rename 'karol.js', 'lib/compiler/parser.js'

task 'server', ->
  connect = require 'connect'
  server = connect.createServer(connect.static(__dirname+'/public'))
  server.listen 8000
  console.log "Server listening on localhost:8000"

###
task 'compress', 'Bundle and compress all JavaScript files', ->
  {parser,uglify} = require 'uglify-js'
  
  extractScripts = (html) ->
    scriptTag = /<script src="\/f\/([a-zA-Z0-9_.-\/]+)"><\/script>/g
    scripts = []
    scripts.push match[1] while match = scriptTag.exec html
    scripts
  
  searchFile = (filename) ->
    for dir in ['/lib/', '/public/']
      filepath = __dirname + dir + filename
      return filepath if path.existsSync filepath
  
  readFile = (filepath) ->
    fs.readFileSync filepath, 'utf-8'
  
  compress = (code) ->
    ast = parser.parse code
    ast = uglify.ast_mangle ast
    ast = uglify.ast_squeeze ast
    uglify.gen_code ast
  
  compressed = extractScripts(readFile 'couchapp/templates/layout.html')
    .map(searchFile)
    .map(readFile)
    .map(compress)
    .join()
  
  # TODO: write compressed
###


# The URL is secret since it contains the admin password
#COUCHAPP_URL = fs.readFileSync('COUCHDB_URL', 'utf-8')

# Note to myself: Start CouchDB with `sudo /etc/init.d/couchdb start`
COUCHAPP_URL = 'http://t:t@localhost:5984/karel'

task 'push', 'Push the couchapp to the server', ->
  couchapp = spawn 'couchapp', ['push', 'couchapp/app.js', COUCHAPP_URL]
  connectStd couchapp

task 'sync', 'Push and watch local files for changes', ->
  couchapp = spawn 'couchapp', ['sync', 'couchapp/app.js', COUCHAPP_URL]
  connectStd couchapp


EXAMPLES_DIR   = "#{__dirname}/test/compiler/examples"
STANDARD_WORLD = "#{EXAMPLES_DIR}/01Programm.kdw"

task 'upload:examples', "Upload Robot Karol's examples to your local CouchDB", ->
  cradle = require 'cradle'
  connection = new (cradle.Connection)
  db = connection.database 'karel'
  extKdp = /\.kdp$/
  fs.readdirSync(EXAMPLES_DIR)
    .filter((filename) -> filename.match(extKdp))
    .sort()
    .forEach (kdpFilename) ->
      kdpPath = "#{EXAMPLES_DIR}/#{kdpFilename}"
      kdwPath = kdpPath.replace(extKdp, '.kdw')
      kdwPath = STANDARD_WORLD unless path.existsSync kdwPath
      db.save
        author:   "examples"
        title:    path.basename kdpPath, '.kdp'
        world:    fs.readFileSync kdwPath, 'utf-8'
        code:     fs.readFileSync kdpPath, 'utf-8'
        language: 'karol'
        collection: 'projects'


connectStd = (process) ->
  log = (data) -> console.log data.toString()
  process.stdout.on 'data', log
  process.stderr.on 'data', log
