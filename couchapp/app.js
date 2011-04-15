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


// Views
// -----

// This view is required by janmonschke/backbone-couchdb
ddoc.views.byCollection = {
  map: function (doc) {
    if (doc.collection) emit(doc.collection, doc)
  }
}

ddoc.views.projectsByAuthorAndTitle = {
  map: function(doc) {
    if (doc.collection == 'projects') {
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

route('vendor/*', 'vendor/*')

fs.readdirSync(path.join(__dirname, '../public')).forEach(function (filename) {
  route(filename, filename)
})

couchapp.loadAttachments(ddoc, path.join(__dirname, '../public'))


// IDE
// ---

route('ide', 'ide.html')


// Static Pages
// ------------

route('/',       '_show/static/home') // Home page
route('p/:page', '_show/static/:page')

ddoc.shows.static = function(doc) {
  var mustache = require('mustache')
  
  return mustache.to_html(this.templates.layout, {
    title: doc.title,
    body:  mustache.to_html(this.templates.static, doc)
  })
}


// User View
// ---------

route(':user', '_list/user/projectsByAuthorAndTitle', { startkey: [':user'] })

ddoc.lists.user = function() {
  var mustache = require('mustache')
  
  var self = this
  provides('html', function() {
    
    var rows = []
    ,   row  = null
    while (row = getRow()) rows.push(row.value)
    
    if (!rows.length) {
      return mustache.to_html(self.templates.layout, self['404'])
    }
    
    var userName = rows[0].author
    
    return mustache.to_html(self.templates.layout, {
      title: userName,
      body: mustache.to_html(self.templates.user, {
        userName: userName,
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

ddoc.lists.project = function(doc) {
  var mustache = require('mustache')
  var self = this
  provides('html', function() {
    var row = getRow()
    if (!row) return mustache.to_html(self.templates.layout, self['404'])
    var doc = row.value
    
    return mustache.to_html(self.templates.layout, {
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
    var mustache = require('mustache')
    return mustache.to_html(self.templates.layout, self['404'])
  })
}

ddoc['404'] = {
  title: "404",
  body:  "Not found :-("
}
