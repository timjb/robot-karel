var fs = require('fs')
,   karol = require('../lib/compiler/karol')

fs.readFile(process.ARGV[2], 'utf-8', function (err, contents) {
  if (err) throw err
  console.log(karol.compile(contents))
})
