fs = require 'fs'
url = require 'url'
path = require 'path'
crypto = require 'crypto'
{exec, spawn} = require 'child_process'


# Uses the same keys as [michael's substance](https://github.com/michael/substance)
try
  config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'))
catch _
  process.stderr.write "You must write a `config.json` file for some tasks. Use `config.json.example` for reference."

if config
  parts = url.parse config.couchdb_url
  db_host = parts.hostname
  db_port = parts.port
  db_name = parts.pathname.slice(1)
  if auth = parts.auth
    db_user = auth.split(':')[0]
    db_pass = auth.split(':')[1]


# Build
# =====

task 'build:parser', ->
  jison = exec 'jison src/parser/karol.yy src/parser/karol.l'
  connectStd jison
  jison.on 'exit', ->
    fs.rename 'karol.js', 'lib/parser/parser.js'

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


# Test
# ====

task 'test', ->
  require './test/run_tests'
  # doesn't work somehow
  jasmine = exec 'jasmine-node test/spec'
  connectStd jasmine


# Push/Sync CouchApp
# ==================

# Note to myself: Start CouchDB with `sudo /etc/init.d/couchdb start`

createCouchApp = (callback) ->
  couchapp = require 'couchapp'
  couchapp.createApp require('./couchapp/app.js'), config.couchdb_url, callback

task 'push', 'Push the couchapp to the server', ->
  createCouchApp (app) -> app.push()

task 'sync', 'Push and watch local files for changes', ->
  createCouchApp (app) -> app.sync()

STATIC_DIR = "#{__dirname}/couchapp/static"

task 'upload:static', ->
  db = openDBWithAuth db_user, db_pass
  fs.readdirSync(STATIC_DIR)
    .forEach (file) ->
      name = file.replace(/\.html$/, '')
      body = fs.readFileSync("#{STATIC_DIR}/#{file}", 'utf-8')
      title = if m = body.match(/<h2>(.*)<\/h2>/) then m[1] else "Untitled Page"
      db.save name,
        title: title
        body:  body


# Examples
# ========

DEFAULT_WORLD = "#{__dirname}/examples/default_world.kdw"

task 'upload:examples', ->
  invoke 'upload:old-examples'
  invoke 'upload:new-examples'

uploadExamplesDir = (dir, description) ->
  db = openDBWithExamples()
  fs.readdirSync(dir)
    .forEach (file) ->
      language = if file.match(/\.js$/)
        'javascript'
      else if file.match(/\.kdp$/)
        'karol'
      else
        null
      
      return unless language
      
      codeFile  = "#{dir}/#{file}"
      worldFile = codeFile.replace(/\.[a-z]+$/, '.kdw')
      worldFile = DEFAULT_WORLD unless path.existsSync worldFile
      
      db.save sha1(codeFile),
        type:        'project'
        author:      "examples"
        title:       path.basename(codeFile).replace(/\.[a-z]+$/, '')
        world:       fs.readFileSync worldFile, 'utf-8'
        code:        fs.readFileSync codeFile, 'utf-8'
        language:    language
        description: description
      , (err) -> console.error err if err

task 'upload:old-examples', "Upload the old examples that come bundled with Robot Karol", ->
  uploadExamplesDir("#{__dirname}/examples/old", "This is one of the examples that come bundled with Robot Karol.")

task 'upload:new-examples', "Upload the new examples", ->
  uploadExamplesDir("#{__dirname}/examples/new", "")


# Helpers
# -------

sha1 = (str) ->
  hash = crypto.createHash('sha1')
  hash.update(str)
  hash.digest('hex')

openDBWithAuth = (username, password) ->
  auth = if username and password
    username: username
    password: password
  else
    undefined
  
  cradle = require 'cradle'
  connection = new cradle.Connection
    host: db_host
    port: db_port
    auth: auth
  connection.database db_name

openDBWithExamples = -> openDBWithAuth 'examples', config.examples_password

connectStd = (child) ->
  child.stdout.pipe(process.stdout)
  child.stderr.pipe(process.stderr)
