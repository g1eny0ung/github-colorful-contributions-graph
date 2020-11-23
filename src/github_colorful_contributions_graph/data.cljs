(ns github-colorful-contributions-graph.data)

(def default-fills {:green ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]
                    :blue ["#ebedf0", "#b4daff", "#75baff", "#0080ff", "#0056ac"]
                    :purple ["#ebedf0", "#dbb7ff", "#b76eff", "#8000ff", "#5200a4"]
                    :orange ["#ebedf0", "#ffd9b3", "#ffaf5f", "#ff8000", "#aa5500"]
                    :red ["#ebedf0", "#ffa3a3", "#ff6868", "#ff0000", "#9c0101"]})

(defn reload-content-scripts []
  (.sendMessage (.. js/chrome -runtime) "runInject"))

(defn set-defined-fill [fill]
  (.set (.. js/chrome -storage -sync)
        (clj->js {:gccUserDefinedFills fill})))

(defn set-selected-fill [key]
  (.set (.. js/chrome -storage -sync)
        (clj->js {:gccUserSelectedFills key})))
