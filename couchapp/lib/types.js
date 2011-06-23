var Type        = require('kanso/types').Type
,   fields      = require('kanso/fields')
,   widgets     = require('kanso/widgets')
,   permissions = require('kanso/permissions')

// lib/models/project.js
exports.project = new Type('project', {
  permissions: {
    add:    permissions.loggedIn(),
    update: permissions.usernameMatchesField('author'),
    remove: permissions.usernameMatchesField('author')
  },
  fields: {
    author:      fields.creator(),
    title:       fields.string(),
    description: fields.string({ widget: widgets.textarea() }),
    code:        fields.string({ widget: widgets.textarea() }),
    language:    fields.choice({ values: [['karol',"Robot Karol"], ['javascript',"JavaScript"]] }),
    world:       fields.string({ widget: widgets.hidden() })
  }
})

exports.page = new Type('page', {
  permissions: {
    add:    permissions.hasRole('_admin'),
    update: permissions.hasRole('_admin'),
    remove: permissions.hasRole('_admin')
  },
  fields: {
    _id:     fields.string({
               omit_empty:  true,
               required:    false,
               widget:      widgets.text(), // make the _id editable
               permissions: { update: permissions.fieldUneditable() }
             }),
    creator: fields.creator(),
    title:   fields.string(),
    content: fields.string({ widget: widgets.textarea({ cols: 50, rows: 20 }) })
  }
})
