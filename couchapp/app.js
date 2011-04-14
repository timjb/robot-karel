var fs       = require('fs')
,   path     = require('path')
,   couchapp = require('couchapp')

var ddoc = module.exports = {
  _id: '_design/app',
  views: {},
  lists: {},
  shows: {},
  templates: {}
}


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


ddoc.rewrites = [
  { from: '/',          to: '_show/static/home' },
  { from: 'ide',        to: 'ide.html' },
//  { from: 'examples/*', to: 'examples/*' },
  { from: 'vendor/*',   to: 'vendor/*' },
  { from: 'karel/*',    to: '../../*' }
]

fs.readdirSync(path.join(__dirname, '../public')).forEach(function (filename) {
  ddoc.rewrites.push({ from: filename, to: filename })
})

ddoc.rewrites.push({ from: ':page', to: '_show/static/:page' })
ddoc.rewrites.push({
  from:  ':author/:title',
  to:    '_list/project/projectsByAuthorAndTitle',
  query: { key: [':author', ':title'] }
})


ddoc.shows.static = function(doc) {
  var mustache = require('mustache')
  
  return mustache.to_html(this.templates.layout, {
    title: doc.title,
    body:  mustache.to_html(this.templates.static, doc)
  })
}

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


couchapp.loadAttachments(ddoc, path.join(__dirname, '../public'))
