if (typeof goog == 'undefined') {
  console.warn(
    'ClojureScript could not load :main, did you forget to specify :asset-path?'
  )
}

goog.require('devtools.preload')
goog.require('figwheel.connect')
goog.require('process.env')
goog.require('github_colorful_contributions_graph.core')

setTimeout(function() {
  figwheel.connect.start()
}, 1000)
