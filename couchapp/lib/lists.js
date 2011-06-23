/**
 * List functions to be exported from the design doc.
 */

var templates = require('kanso/templates')

// TODO: remove duplicate in shows.js
var layout = function (req, parts) {
  if (req.client) {
    $('#content').html(parts.content)
    document.title = parts.title
  } else {
    return templates.render('layout.html', req, parts)
  }
}


exports.ide = function (head, req) {
  start({ code: 200, headers: { 'Content-Type': 'text/html' } })
  
  var row = getRow()
  if (!row) {
    // TODO: show 404
    //return self.templates['404']
    return '404'
  }
  var doc = row.value
  
  return layout(req, {
    title: "Editing " + doc.author+"/"+doc.title,
    className: 'ide',
    noWrapper: true,
    content: templates.render('ide.html', req, {
      json: JSON.stringify(doc)
    })
  })
}


// Exports

exports.exportWorld = function (head, req) {
  start({ code: 200, headers: { 'Content-Type': 'text/kdw' } })
  
  var row = getRow()
  if (!row) return "Not found." // TODO: proper 404
  var doc = row.value
  return doc.world
}

exports.exportKDPProgram = function (head, req) {
  start({ code: 200, headers: { 'Content-Type': 'text/kdp' } })
  
  var row = getRow()
  if (!row) return "Not found." // TODO: proper 404
  var doc = row.value
  return doc.code
}

exports.exportJSProgram = function (head, req) {
  start({ code: 200, headers: { 'Content-Type': 'text/kdp' } })
  
  var row = getRow()
  if (!row) return "Not found." // TODO: proper 404
  var doc = row.value
  return doc.code
}


// User page
exports.user = function (head, req) {
  start({ code: 200, headers: { 'Content-Type': 'text/html' } })
  
  var docs = []
  
  var row, docs = []
  while (row = getRow()) docs.push(row.value)
  
  if (!docs.length) {
    // TODO: show not_found page
    // TODO: 404 HTTP Status Code
    return "404"
  }
  
  var userName = docs[0].author
  return layout(req, {
    title:   userName,
    content: templates.render('user.html', req, {
      userName: userName,
      numberOfProjects: docs.length,
      projects: docs
    })
  })
}

// Project page
exports.project = function (head, req) {
  start({ code: 200, headers: { 'Content-Type': 'text/html' } })
  
  var row = getRow()
  if (!row) {
    // TODO: show not_found page
    // TODO: 404 HTTP Status Code
    return "404"
  }
  var doc = row.value
  
  return layout(req, {
    title:   doc.author+"/"+doc.title,
    content: templates.render('project.html', req, {
      authorized:  req.userCtx.name === doc.author,
      author:      doc.author,
      title:       doc.title,
      description: doc.description,
      json:        JSON.stringify(doc)
    })
  })
}
