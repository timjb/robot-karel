/**
 * Rewrite settings to be exported from the design doc
 */

module.exports = []

// A short DSL for creating rewrite rules
function route(from, to, query) {
  module.exports.push({ from: from, to: to, query: query })
}


// Assets
// ======

route('/static/*', 'static/*')


// Static pages
// ============

route('/',        '_show/home') // Home page
route('/p/specs', '_show/specs')
route('/p/:page', '_show/static_page/:page')


// Users
// =====

// Show
route(
  '/:user',
  '_list/user/projectsByAuthorAndTitle',
  { startkey: [':user'] }
)


// Projects
// ========

// Show
route(
  '/:author/:title',
  '_list/project/projectsByAuthorAndTitle',
  { key: [':author', ':title'] }
)
// Edit
route(
  '/:author/:title/edit',
  '_list/ide/projectsByAuthorAndTitle',
  { key: [':author', ':title'] }
)
// Create
route('/new', '_show/create_project')
// Export
route(
  '/:author/:title/welt.kdw',
  '_list/exportWorld/projectsByAuthorAndTitle',
  { key: [':author', ':title'] }
)
route(
  '/:author/:title/programm.kdp',
  '_list/exportKDPProgram/projectsByAuthorAndTitle',
  { key: [':author', ':title'] }
)
route(
  '/:author/:title/program.js',
  '_list/exportJSProgram/projectsByAuthorAndTitle',
  { key: [':author', ':title'] }
)


// 404 -- Not found
// ================

route('*', '_show/not_found')
