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


ddoc.rewrites = [
  { from: '/',          to: '_show/static/home' },
  { from: 'ide',        to: 'ide.html' },
  { from: 'examples/*', to: 'examples/*' },
  { from: 'vendor/*',   to: 'vendor/*' }
]

fs.readdirSync(path.join(__dirname, '../public')).forEach(function (filename) {
  ddoc.rewrites.push({ from: filename, to: filename })
})

ddoc.rewrites.push({ from: ':page', to: '_show/static/:page' })


ddoc.shows.static = function (doc) {
  var mustache = require('mustache')
  mustache.to_html(this.templates.layout, doc, {}, send)
  return ''
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
