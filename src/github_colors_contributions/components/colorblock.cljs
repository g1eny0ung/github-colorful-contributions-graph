(ns github-colors-contributions.components.colorblock
  (:require [reagent.core :as r]
            [cljsjs.react]
            [cljsjs.react-color]))

(defn colorblock [{:keys [picker-position color set-color]}]
  (let [display-picker (r/atom false)]
    (fn [{:keys [picker-position color set-color]}]
      [:div.colorblock
       [:div.block
        {:style {:background color}
         :on-click #(swap! display-picker not)}]
       [:div.picker-wrapper {:style (merge
                                     picker-position
                                     {:display (if (true? @display-picker)
                                                 "block"
                                                 "none")})}
        [:> js/ReactColor.ChromePicker {:color color
                                        :onChangeComplete set-color
                                        :disableAlpha true}]]])))
