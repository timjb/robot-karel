require 'sprockets'

task :default do
  secretary = Sprockets::Secretary.new(
    :load_path    => ["./frameworks/regal.js/"],
    :source_files => [
      "./frameworks/javascript-stacktrace/stacktrace.js",
      "./frameworks/three.js/build/Three.js",
      "./frameworks/three.js/src/extras/primitives/Cube.js",
      "./frameworks/three.js/src/extras/primitives/Plane.js",
      "./karol.js"
    ]
  )
  concatenation = secretary.concatenation
  concatenation.save_to("./app.js")
end

task :open do
  sh "google-chrome --allow-file-access-from-files index.html"
end
