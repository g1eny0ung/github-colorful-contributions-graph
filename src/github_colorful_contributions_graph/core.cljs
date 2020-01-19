(ns ^:figwheel-hooks github-colorful-contributions-graph.core
  (:require [goog.dom :as gdom]
            [reagent.core :as reagent]
            [github-colorful-contributions-graph.components.header :refer [header]]
            [github-colorful-contributions-graph.components.panel :refer [panel]]
            [github-colorful-contributions-graph.components.footer :refer [footer]]))

(defn github-colorful-contributions-graph []
  [:div.container
   [header]
   [panel]
   [footer]])

(defn get-app-element []
  (gdom/getElement "app"))

(defn mount [el]
  (reagent/render-component [github-colorful-contributions-graph] el))

(defn mount-app-element []
  (when-let [el (get-app-element)]
    (mount el)))

;; conditionally start your application based on the presence of an "app" element
;; this is particularly helpful for testing this ns without launching the app
(mount-app-element)

;; specify reload hook with ^:after-load metadata
(defn ^:after-load on-reload []
  (mount-app-element)
  ;; optionally touch your app-state to force rerendering depending on
  ;; your application
  ;; (swap! app-state update-in [:__figwheel_counter] inc)
  )
