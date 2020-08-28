(ns github-colorful-contributions-graph.components.panel
  (:require
   [reagent.core :as r]
   [github-colorful-contributions-graph.components.colorblock :refer [colorblock]]
   [github-colorful-contributions-graph.data :refer [default-fills
                                                     reload-content-scripts
                                                     set-defined-fill
                                                     set-selected-fill]]))

(defonce user-defined-fill (r/atom (:green default-fills)))
(defonce user-selected-fill (r/atom ""))

(.get
 (.. js/chrome -storage -sync)
 #js ["githubColorsContributionsUserDefinedFills"
      "githubColorsContributionsUserSelectedFills"]
 (fn [result] (let [clj-result (js->clj result)
                    d-fill (get clj-result "githubColorsContributionsUserDefinedFills")
                    s-fill (get clj-result "githubColorsContributionsUserSelectedFills")]
                (reset! user-defined-fill d-fill)
                (reset! user-selected-fill s-fill))))

(def picker-positions [{:left "0"}
                       {:left "0"}
                       {:left "-88px"}
                       {:right "8px"}
                       {:right "8px"}])

(defn set-color [index]
  (fn [color] (swap! user-defined-fill assoc index (get (js->clj color) "hex"))
    (reset! user-selected-fill "none")
    (set-selected-fill "none")
    (set-defined-fill @user-defined-fill)
    (reload-content-scripts)))

(defn panel []
  [:div.gcc-panel
   [:div.blocks
    (doall (for [i (range 5)]
             ^{:key i} [colorblock {:picker-position (nth picker-positions i)
                                    :color (nth @user-defined-fill i)
                                    :set-color (set-color i)}]))]
   [:div.fills
    [:h3 "Or choose predefined colors:"]
    [:div.default-fills
     (doall (for [[k fill] default-fills]
              ^{:key k} [:div
                         [:input {:type "radio"
                                  :value (name k)
                                  :checked (= @user-selected-fill (name k))
                                  :on-change (fn [e]
                                               (reset! user-selected-fill (.. e -target -value))
                                               (set-selected-fill k)
                                               (reload-content-scripts))}]
                         [:ul (for [f fill]
                                ^{:key f}
                                [:li {:style {:background f}}])]]))]]
   [:div.buttons
    [:h3 "Options:"]
    [:button {:on-click (fn [] (reset! user-defined-fill (:green default-fills))
                          (reset! user-selected-fill "none")
                          (set-defined-fill @user-defined-fill)
                          (set-selected-fill "none")
                          (reload-content-scripts))} "Reset colors"]]])
