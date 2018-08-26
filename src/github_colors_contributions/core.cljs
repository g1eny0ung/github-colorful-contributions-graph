(ns github-colors-contributions.core
  (:require [reagent.core :as reagent]
            [github-colors-contributions.data :as d]
            [github-colors-contributions.components.header :refer [header]]
            [github-colors-contributions.components.panel :refer [panel]]
            [github-colors-contributions.components.footer :refer [footer]]))

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
