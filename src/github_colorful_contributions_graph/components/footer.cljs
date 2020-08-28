(ns github-colorful-contributions-graph.components.footer)

(defn footer []
  [:footer.gcc-footer
   [:h4 "Made with "
    [:span {:style {:color "red"}} "❤"]
    " and fun by "
    [:a {:href "https://github.com/g1eny0ung"
         :style {:color "seagreen"}} "g1eny0ung"]]])
