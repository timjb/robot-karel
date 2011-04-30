var fs       = require('fs')
,   path     = require('path')
,   couchapp = require('couchapp')


// Design Document Skeleton
// ------------------------

var ddoc = module.exports = {
  _id: '_design/app',
  views: {},
  lists: {},
  shows: {},
  rewrites: [],
  templates: {}
}

// A short DSL for creating rewrite rules
function route(from, to, query) {
  ddoc.rewrites.push({ from: from, to: to, query: query })
}

// Pretend that this is a CouchDB without vhosts settings and URL rewriting.
// This is important for accessing documents with janmonschke/backbone-couchdb.
route('karel/*', '../../*')


// Validations
// -----------

ddoc.validate_doc_update = function(newDoc, oldDoc, userCtx) {
  // A short DSL
  function unauthorized(reason) { throw { unauthorized: reason } }
  function forbidden(reason)    { throw { forbidden:    reason } }
  function unchanged(field) {
    if (oldDoc && oldDoc[field] !== newDoc[field]) {
      forbidden("Field '"+field+"' can't be changed.")
    }
  }
  function required(field, type, nonempty) {
    if (typeof newDoc[field] === 'undefined') {
      forbidden("Field '"+field+"' is required.")
    }
    if (nonempty && !newDoc[field]) {
      forbidden("Field '"+field+"' mustn't be empty.")
    }
    if (type && typeof newDoc[field] !== type) {
      forbidden("Field '"+field+"' must have the JS type "+type)
    }
  }
  
  
  if (newDoc.body) { // a HTML page
    if (userCtx.roles.indexOf('_admin') == -1) {
      unauthorized("Only admins can save HTML pages.")
    }
  }
  
  if ((oldDoc || newDoc).author) {
    if(!newDoc._deleted) unchanged('author')
    if ((oldDoc || newDoc).author !== userCtx.name) {
      unauthorized("Only the 'author' of a document can save/delete it.")
    }
  }
  
  if (newDoc.type === 'project') {
    required('author',      'string', true)
    required('world',       'string')
    required('code',        'string')
    required('language',    'string')
    required('title',       'string', true)
    required('description', 'string')
    if (['javascript', 'karol'].indexOf(newDoc.language) === -1) {
      forbidden("The field 'language' must be either 'javascript' or 'karol'.")
    }
  }
}


// Views
// -----

ddoc.views.projectsByAuthorAndTitle = {
  map: function(doc) {
    if (doc.type == 'project') {
      emit([doc.author, doc.title], doc)
    }
  }
}


// Templates and CommonJS
// ----------------------

function addDirectorySync(dirpath, obj) {
  fs.readdirSync(dirpath).forEach(function (filename) {
    var filepath = dirpath + '/' + filename
    ,   fileext  = path.extname(filepath)
    ,   filebasename = path.basename(filepath, fileext)
    obj[filebasename] = fs.readFileSync(filepath, 'utf-8')
  })
}

addDirectorySync(__dirname + '/commonjs',  ddoc)
addDirectorySync(__dirname + '/templates', ddoc.templates)


// Attachments
// -----------

route('f/*', '*')

couchapp.loadAttachments(ddoc, path.join(__dirname, '../public'))
couchapp.loadAttachments(ddoc, path.join(__dirname, '../lib'))
couchapp.loadAttachments(ddoc, path.join(__dirname, '../skin/lib'), 'skin/lib')
couchapp.loadAttachments(ddoc, path.join(__dirname, '../skin/css'), 'skin/css')


// IDE
// ---

route('new', '_show/create_project')

ddoc.shows.create_project = function() {
  var mustache = require('mustache')
  
  var self = this
  provides('html', function() {
    return mustache.to_html(self.templates.layout, {
      title: 'New Project',
      body: self.templates.create_project
    })
  })
}

route(
  ':author/:title/edit',
  '_list/ide/projectsByAuthorAndTitle',
  { key: [':author', ':title'] }
)

ddoc.lists.ide = function() {
  var mustache = require('mustache')
  
  var self = this
  provides('html', function() {
    var row = getRow()
    if (!row) return self.templates['404']
    var doc = row.value
    
    return mustache.to_html(self.templates.layout, {
      baseUrl: '../..',
      title: "Editing " + doc.author+"/"+doc.title,
      className: 'ide',
      noWrapper: true,
      body: mustache.to_html(self.templates.ide, {
        json: JSON.stringify(doc)
      })
    })
  })
}


// Export
// ------

route(
  ':author/:title/welt.kdw',
  '_list/exportWorld/projectsByAuthorAndTitle',
  { key: [':author', ':title'] }
)

ddoc.lists.exportWorld = function() {
  var self = this
  registerType('kdw', 'text/kdw')
  provides('kdw', function() {
    var row = getRow()
    if (!row) return "Not found."
    var doc = row.value
    return doc.world
  })
}

route(
  ':author/:title/programm.kdp',
  '_list/exportKDPProgram/projectsByAuthorAndTitle',
  { key: [':author', ':title'] }
)

ddoc.lists.exportKDPProgram = function() {
  var self = this
  registerType('kdp', 'text/kdp')
  provides('kdp', function() {
    var row = getRow()
    if (!row) return "Not found."
    var doc = row.value
    return doc.code
  })
}

route(
  ':author/:title/program.js',
  '_list/exportJSProgram/projectsByAuthorAndTitle',
  { key: [':author', ':title'] }
)

ddoc.lists.exportJSProgram = function() {
  var self = this
  registerType('js', 'text/javascript')
  provides('js', function() {
    var row = getRow()
    if (!row) return "Not found."
    var doc = row.value
    return doc.code
  })
}


// Static Pages
// ------------

route('/',       '_show/home/home') // Home page
route('p/:page', '_show/static/:page')

ddoc.shows.home = function(doc) {
  var mustache = require('mustache')
  
  return mustache.to_html(this.templates.layout, {
    title: doc.title,
    body:  mustache.to_html(this.templates.static, doc)
  })
}

// This differs only in that it sets `baseUrl`
ddoc.shows.static = function(doc) {
  var mustache = require('mustache')
  
  return mustache.to_html(this.templates.layout, {
    baseUrl: '..',
    title: doc.title,
    body:  mustache.to_html(this.templates.static, doc)
  })
}


// User View
// ---------

route(
  ':user',
  '_list/user/projectsByAuthorAndTitle',
  { startkey: [':user'] }
)

ddoc.lists.user = function(head, req) {
  var mustache = require('mustache')
  
  var self = this
  provides('html', function() {
    
    var rows = []
    ,   row  = null
    while (row = getRow()) {
      var doc = row.value
      doc.authorized = req.userCtx.name === doc.author
      rows.push(doc)
    }
    
    if (!rows.length) return self.templates['404']
    
    var userName = rows[0].author
    
    return mustache.to_html(self.templates.layout, {
      title: userName,
      body: mustache.to_html(self.templates.user, {
        userName: userName,
        numberOfProjects: rows.length,
        projects: rows
      })
    })
  })
}


// Project View
// ------------

route(
  ':author/:title',
  '_list/project/projectsByAuthorAndTitle',
  { key: [':author', ':title'] }
)

ddoc.lists.project = function(head, req) {
  var mustache = require('mustache')
  var self = this
  provides('html', function() {
    var row = getRow()
    if (!row) return self.templates['404']
    var doc = row.value
    doc.authorized = req.userCtx.name === doc.author
    
    return mustache.to_html(self.templates.layout, {
      baseUrl: '..',
      title: doc.author+"/"+doc.title,
      body:  mustache.to_html(self.templates.project, doc)
    })
  })
}


// 404
// ---

route('*', '_show/404')

ddoc.shows['404'] = function() {
  var self = this
  provides('html', function() {
    return self.templates['404']
  })
}
