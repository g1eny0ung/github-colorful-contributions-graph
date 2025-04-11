(ns gh-colorful-contributions.data)

(def default-fills {:green ["#eff2f5", "#aceebb", "#4ac26b", "#2da44e", "#116329"]
                    :blue ["#eff2f5", "#a4c8ff", "#388bfd", "#0366d6", "#00499e"]
                    :purple ["#eff2f5", "#d2b4ff", "#a371f7", "#7431d8", "#5b349d"]
                    :orange ["#eff2f5", "#ffab70", "#f66a0e", "#c84600", "#b04800"]
                    :red ["#eff2f5", "#ff7b72", "#f85149", "#c93c37", "#9c1e1e"]})

(def dark-fills {:green ["#151b23", "#033a16", "#196c2e", "#2ea043", "#56d364"]
                 :blue ["#151b23", "#1c3251", "#2d5999", "#4993ff", "#8bb8ff"]
                 :purple ["#151b23", "#33274d", "#5b3b82", "#8957e5", "#b989ff"]
                 :orange ["#151b23", "#3d2013", "#7d3a11", "#c45e1c", "#f6854d"]
                 :red ["#151b23", "#37181a", "#6e2226", "#ae3636", "#f35d5d"]})

(defn reload-content-scripts []
  (.sendMessage (.. js/chrome -runtime) "runInject"))

(defn set-selected-fill [key]
  (.set (.. js/chrome -storage -sync)
        (clj->js {:gccUserSelectedFills key}))
  (reload-content-scripts))
