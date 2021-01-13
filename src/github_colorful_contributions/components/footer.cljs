(ns github-colorful-contributions.components.footer)

(defn footer []
  [:footer.gcc-footer
   [:h3.subtitle.is-7.has-text-right "Made with "
    [:span {:style {:color "red"}} "❤"]
    " and fun by "
    [:span {:style {:color "seagreen" :cursor "pointer"}
            :on-click #(.create (.. js/chrome -tabs)
                                (clj->js {:url "https://github.com/g1eny0ung"}))} "g1eny0ung"]
    "."]])
