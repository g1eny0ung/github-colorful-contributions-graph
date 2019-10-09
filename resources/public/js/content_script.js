var defaultFills = {
  green: ['#ebedf0', '#c6e48b', '#7bc96f', '#239a3b', '#196127'],
  blue: ['#ebedf0', '#b4daff', '#75baff', '#0080ff', '#0056ac'],
  purple: ['#ebedf0', '#DBB7FF', '#B76EFF', '#8000FF', '#5200A4'],
  orange: ['#ebedf0', '#FFD9B3', '#FFAF5F', '#FF8000', '#AA5500'],
  red: ['#ebedf0', '#ffa3a3', '#ff6868', '#ff0000', '#9c0101']
}

function changeFill(originFills, definedFills, val) {
  switch (val) {
    case originFills[0]:
      return definedFills[0]
    case originFills[1]:
      return definedFills[1]
    case originFills[2]:
      return definedFills[2]
    case originFills[3]:
      return definedFills[3]
    case originFills[4]:
      return definedFills[4]
    default:
      break
  }
}

chrome.storage.sync.get(
  [
    'githubColorsContributionsUserDefinedFills',
    'githubColorsContributionsUserSelectedFills',
    'githubColorsContributionsPreDefinedFills'
  ],
  function(result) {
    chrome.storage.local.get(['isInject'], function(localResult) {
      var originFills
      if (localResult.isInject) {
        originFills = result.githubColorsContributionsPreDefinedFills
      } else {
        originFills = defaultFills.green
      }

      main(result, originFills)
    })
  }
)

function main(result, originFills) {
  var definedFills
  if (result.githubColorsContributionsUserSelectedFills !== 'none') {
    definedFills = defaultFills[result.githubColorsContributionsUserSelectedFills]
  } else {
    definedFills = result.githubColorsContributionsUserDefinedFills
  }

  var contribColumns = document.querySelectorAll('svg.js-calendar-graph-svg > g > g')
  if (contribColumns.length === 0) {
    return
  }
  var alContribColumns = Array.prototype.slice.call(contribColumns)

  alContribColumns.map(function(c) {
    var rects = Array.prototype.slice.call(c.children)
    rects.map(function(rect) {
      rect.attributes.fill.value = changeFill(originFills, definedFills, rect.attributes.fill.value)
    })
  })

  var tips = document.querySelectorAll('.contrib-legend.text-gray > ul.legend > li')
  var alTips = Array.prototype.slice.call(tips)

  alTips.map(function(t, i) {
    t.style = 'background-color: ' + definedFills[i]
  })

  var profileRollupContentRowSpans = document.querySelectorAll('ul.profile-rollup-content > li span.progress-bar')

  Array.prototype.slice.call(profileRollupContentRowSpans).map(span => {
    span.style.backgroundColor = changeFill(originFills, definedFills, span.attributes.style.value.split(' ')[1])
  })

  var activityOverviewGraph = document.querySelector('.js-activity-overview-graph-container > svg > g')

  if (activityOverviewGraph) {
    Array.prototype.slice.call(activityOverviewGraph.children).map(child => {
      if (child.nodeName === 'path') {
        child.attributes.fill.value = definedFills[2]
        child.style.stroke = definedFills[2]
      }
      if (child.nodeName === 'line') {
        child.style.stroke = definedFills[2]
      }
      if (child.nodeName === 'ellipse') {
        child.style.stroke = definedFills[2]
      }
    })
  }

  // Isometric Contributions
  let count = 0
  const icStatsCountsId = setInterval(() => {
    var icStatsCounts = document.querySelectorAll('span.ic-stats-count')

    if (icStatsCounts.length > 0) {
      Array.prototype.slice.call(icStatsCounts).map(span => {
        span.style.color = definedFills[4]
      })
      clearInterval(icStatsCountsId)
    } else {
      count++
    }

    if (count === 30) {
      clearInterval(icStatsCountsId)
    }
  }, 500)

  chrome.storage.sync.set({
    githubColorsContributionsPreDefinedFills: definedFills
  })
  chrome.storage.local.set({
    isInject: false
  })
}
