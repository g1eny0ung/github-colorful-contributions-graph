(ns github-colors-contributions.components.panel
  (:require
   [reagent.core :as r]
   [github-colors-contributions.components.colorblock :refer [colorblock]]
   [github-colors-contributions.data :refer [default-fills
                                             reload-content-scripts
                                             set-defined-fill
                                             set-selected-fill]]))

(defonce user-defined-fill (r/atom ["#ebedf0"
                                    "#c6e48b"
                                    "#7bc96f"
                                    "#239a3b"
                                    "#196127"]))

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

(def picker-positions [{:left "28px"}
                       {:left "-28px"}
                       {:left "-84px"}
                       {:right "-28px"}
                       {:right "28px"}])

(defn set-color [index]
  (fn [color] (swap! user-defined-fill assoc index (get (js->clj color) "hex"))
    (reset! user-selected-fill "none")
    (set-defined-fill @user-defined-fill)
    (set-selected-fill "none")
    (reload-content-scripts)))

(defn panel []
  [:div.gcc-panel
   [:div.blocks
    (doall (for [i (range 5)]
             ^{:key i} [colorblock {:picker-position (nth picker-positions i)
                                    :color (nth @user-defined-fill i)
                                    :set-color (set-color i)}]))]
   [:div
    [:h3 "Or choose predefined colors:"]
    [:div.default-fills
     (doall (for [[k fill] default-fills]
              ^{:key k} [:div
                         [:input {:type "radio"
                                  :value (str k)
                                  :checked (= @user-selected-fill (str k))
                                  :on-change (fn [e]
                                               (reset! user-selected-fill (.. e -target -value))
                                               (set-selected-fill k)
                                               (reload-content-scripts))}]
                         [:ul (for [f fill]
                                ^{:key (str (rand 100) f)}
                                [:li {:style {:background f}}])]]))]]
   [:div.buttons
    [:h3 "Options:"]
    [:button {:on-click (fn [] (reset! user-defined-fill (:green default-fills))
                          (set-defined-fill @user-defined-fill)
                          (set-selected-fill "none")
                          (reload-content-scripts))} "Reset colors"]]])
