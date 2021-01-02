(ns github-colorful-contributions.components.footer)

(defn footer []
  [:footer.gcc-footer
   [:h3.subtitle.is-7.has-text-right "Made with "
    [:span {:style {:color "red"}} "❤"]
    " and fun by "
    [:span {:style {:color "seagreen"}} "g1eny0ung"]
    "."]])
