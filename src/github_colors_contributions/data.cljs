(ns github-colors-contributions.data)

(def default-fills {:green ["#ebedf0" "#c6e48b" "#7bc96f" "#239a3b" "#196127"]
                    :blue ["#ebedf0", "#b4daff", "#75baff", "#0080ff", "#0056ac"]
                    :purple ["#ebedf0", "#DBB7FF", "#B76EFF", "#8000FF", "#5200A4"]
                    :orange ["#ebedf0", "#FFD9B3", "#FFAF5F", "#FF8000", "#AA5500"]
                    :red ["#ebedf0", "#ffa3a3", "#ff6868", "#ff0000", "#9c0101"]})

(defn reload-content-scripts []
  (.sendMessage (.. js/chrome -runtime) "runInject"))

(defn set-defined-fill [fill]
  (.set (.. js/chrome -storage -sync)
        (clj->js {:githubColorsContributionsUserDefinedFills
                  fill})))

(defn set-selected-fill [key]
  (.set (.. js/chrome -storage -sync)
        (clj->js {:githubColorsContributionsUserSelectedFills
                  key})))
