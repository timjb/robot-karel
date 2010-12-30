require 'sprockets'

task :default do
  secretary = Sprockets::Secretary.new(
    :load_path => [
      "./frameworks/regal.js/",
      "./frameworks/bespin-embedded/",
      "./frameworks/three.js/build/",
      "./frameworks/three.js/src/extras/primitives/",
      "./frameworks/javascript-stacktrace/"
    ],
    :source_files => ["./karol.js"]
  )
  concatenation = secretary.concatenation
  concatenation.save_to("./app.js")
end

task :open do
  sh "google-chrome --allow-file-access-from-files index.html"
end
