(ns github-colorful-contributions.data)

(def default-fills {:green ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"]
                    :blue ["#ebedf0", "#b4daff", "#75baff", "#0080ff", "#0056ac"]
                    :purple ["#ebedf0", "#dbb7ff", "#b76eff", "#8000ff", "#5200a4"]
                    :orange ["#ebedf0", "#ffd9b3", "#ffaf5f", "#ff8000", "#aa5500"]
                    :red ["#ebedf0", "#ffa3a3", "#ff6868", "#ff0000", "#9c0101"]})

(def dark-fills {:green ["#161b22", "#01311f", "#034525", "#0f6d31", "#00c647"]
                 :blue ["#161b22", "#011c57", "#04256c", "#13388c", "#013cc5"]
                 :purple ["#161b22", "#310358", "#43056d", "#59128c", "#7501c5"]
                 :orange ["#161b22", "#521b02", "#632a05", "#834610", "#c55501"]
                 :red ["#161b22", "#510202", "#610404", "#820f0f", "#c50101"]})

(defn reload-content-scripts []
  (.sendMessage (.. js/chrome -runtime) "runInject"))

(defn set-selected-fill [key]
  (.set (.. js/chrome -storage -sync)
        (clj->js {:gccUserSelectedFills key})))
