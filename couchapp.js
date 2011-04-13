var couchapp = require('couchapp')

var ddoc = module.exports = {
  _id: '_design/app',
  views: {},
  lists: {},
  shows: {}
}

couchapp.loadAttachments(ddoc, __dirname + '/public')
