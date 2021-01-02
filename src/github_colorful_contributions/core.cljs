(ns ^:figwheel-hooks github-colorful-contributions.core
  (:require [goog.dom :as gdom]
            [reagent.dom :as rdom]
            [github-colorful-contributions.components.header :refer [header]]
            [github-colorful-contributions.components.panel :refer [panel]]
            [github-colorful-contributions.components.footer :refer [footer]]))

(defn get-app-element []
  (gdom/getElement "app"))

(defn github-colorful-contributions []
  [:div.container
   [header]
   [panel]
   [footer]])

(defn mount [el]
  (rdom/render [github-colorful-contributions] el))

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
