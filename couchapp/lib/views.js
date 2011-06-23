/**
 * Show functions to be exported from the design doc.
 */

exports.projectsByAuthorAndTitle = {
  map: function(doc) {
    if (doc.type == 'project') {
      emit([doc.author, doc.title], doc)
    }
  }
}
