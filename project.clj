(defproject github-colorful-contributions-graph "2.0.0"
  :description "A Chrome extension for customizing the colors of the GitHub contributions' graph."
  :url "http://github.com/g1eny0ung/github-colorful-contributions-graph"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}

  :min-lein-version "2.7.1"

  :dependencies [[org.clojure/clojure "1.9.0"]
                 [org.clojure/clojurescript "1.10.520"]
                 [reagent "0.8.1"]
                 [cljsjs/react-color "2.13.8-0"]]

  :plugins [[lein-ancient "0.6.15"]]

  :source-paths ["src"]

  :aliases {"fig:build" ["trampoline" "run" "-m" "figwheel.main" "-b" "dev"]
            "fig:min"   ["run" "-m" "figwheel.main" "-O" "advanced" "-bo" "min"]}

  :profiles {:dev {:dependencies [[com.bhauman/figwheel-main "0.2.3"]
                                  [com.bhauman/rebel-readline-cljs "0.1.4"]]}})
