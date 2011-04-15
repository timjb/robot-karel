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


// Project View
// ------------

ddoc.rewrites.push({
  from:  ':author/:title',
  to:    '_list/project/projectsByAuthorAndTitle',
  query: { key: [':author', ':title'] }
})

ddoc.lists.project = function(doc) {
  var self = this;
  provides('html', function() {
    var row = getRow()
    if (!row) return
    var doc = row.value
    
    var mustache = require('mustache')
    return mustache.to_html(self.templates.layout, {
      title: doc.author+"/"+doc.title,
      body:  mustache.to_html(self.templates.project, doc)
    })
  })
}


// 404
// ---

// TODO
