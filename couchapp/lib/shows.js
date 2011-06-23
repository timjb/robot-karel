/**
 * Show functions to be exported from the design doc.
 */

var templates = require('kanso/templates')

// TODO: remove duplicate in lists.js
var layout = function (req, parts) {
  if (req.client) {
    $('#content').html(parts.content)
    document.title = parts.title
  } else {
    var body = templates.render('layout.html', req, parts)
    ,   res  = { body: body }
    if (parts.code) res.code = parts.code
    return res
  }
}


exports.create_project = function (doc, req) {
  return layout(req, {
    title:   "New Project",
    content: templates.render('create_project.html', req, {})
  })
}

exports.specs = function (doc, req) {
  return layout(req, {
    title:   "Jasmine Specs",
    content: templates.render('specs.html', req, {})
  })
}

exports.home = function (doc, req) {
  return layout(req, {
    title:   "Home",
    content: templates.render('home.html', req, {})
  })
}

exports.static_page = function (doc, req) {
  return layout(req, {
    title:   doc.title,
    content: templates.render('static_page.html', req, doc)
  })
}

exports.not_found = function (doc, req) {
  return layout(req, {
    code:      404, // HTTP Status Code
    title:     "404 - Not Found",
    className: 'not_found',
    content:   templates.render('404.html', req, {})
  })
}
