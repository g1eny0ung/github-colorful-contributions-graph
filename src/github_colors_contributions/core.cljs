(ns github-colorful-contributions-graph.core
  (:require [reagent.core :as reagent]
            [github-colorful-contributions-graph.data :as d]
            [github-colorful-contributions-graph.components.header :refer [header]]
            [github-colorful-contributions-graph.components.panel :refer [panel]]
            [github-colorful-contributions-graph.components.footer :refer [footer]]))

(enable-console-print!)

(defn app []
  [:div.container
   [header]
   [panel]
   [footer]
   ])

(reagent/render-component [app]
                          (. js/document (getElementById "app")))

(defn on-js-reload []
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
)
