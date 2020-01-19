if (typeof goog == 'undefined') {
  console.warn('ClojureScript could not load :main, did you forget to specify :asset-path?')
}

goog.require('figwheel.core')
goog.require('figwheel.main')
goog.require('figwheel.repl.preload')
goog.require('devtools.preload')
goog.require('figwheel.main.css_reload')
goog.require('process.env')
goog.require('github_colorful_contributions_graph.core')
