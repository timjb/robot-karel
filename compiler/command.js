var fs = require('fs')
,   robotKarol = require('./robot-karol')

fs.readFile(process.ARGV[2], 'utf-8', function (err, contents) {
  if (err) throw err
  robotKarol.compile(contents)
})
