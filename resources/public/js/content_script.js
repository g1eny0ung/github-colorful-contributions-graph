var defaultFills = {
  green: ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39'],
  blue: ['#ebedf0', '#b4daff', '#75baff', '#0080ff', '#0056ac'],
  purple: ['#ebedf0', '#DBB7FF', '#B76EFF', '#8000FF', '#5200A4'],
  orange: ['#ebedf0', '#FFD9B3', '#FFAF5F', '#FF8000', '#AA5500'],
  red: ['#ebedf0', '#ffa3a3', '#ff6868', '#ff0000', '#9c0101'],
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
      return null
  }
}

chrome.storage.sync.get(
  [
    'githubColorsContributionsUserDefinedFills',
    'githubColorsContributionsUserSelectedFills',
    'githubColorsContributionsPreDefinedFills',
  ],
  function (result) {
    chrome.storage.local.get(['isInject'], function (localResult) {
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

  alContribColumns.map(function (c) {
    var rects = Array.prototype.slice.call(c.children)
    rects.map(function (rect) {
      rect.attributes.fill.value = changeFill(originFills, definedFills, rect.attributes.fill.value)
    })
  })

  var tips = document.querySelectorAll('.contrib-legend.text-gray > ul.legend > li')
  var alTips = Array.prototype.slice.call(tips)

  alTips.map(function (t, i) {
    t.style = 'background-color: ' + definedFills[i]
  })

  var profileRollupContentRowSpans = document.querySelectorAll('ul.profile-rollup-content > li span.progress-bar')

  Array.prototype.slice.call(profileRollupContentRowSpans).map((span) => {
    span.style.backgroundColor = changeFill(originFills, definedFills, span.attributes.style.value.split(' ')[1])
  })

  var activityOverviewGraph = document.querySelector('.js-activity-overview-graph-container > svg > g')

  if (activityOverviewGraph) {
    Array.prototype.slice.call(activityOverviewGraph.children).map((child) => {
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
      Array.prototype.slice.call(icStatsCounts).map((span) => {
        span.style.color = definedFills[4]
      })
      changeIsoColors(definedFills, originFills)
      clearInterval(icStatsCountsId)
    } else {
      count++
    }

    if (count === 10) {
      clearInterval(icStatsCountsId)
    }
  }, 500)

  chrome.storage.sync.set({
    githubColorsContributionsPreDefinedFills: definedFills,
  })
  chrome.storage.local.set({
    isInject: false,
  })
}

function changeIsoColors(definedFills, originFills) {
  var iso = document.querySelector('canvas#isometric-contributions')
  var ctx = iso.getContext('2d')
  var imageData = ctx.getImageData(0, 0, iso.width, iso.height)
  var data = imageData.data

  function helper(val) {
    return val
      .map((d) =>
        Object.values(new obelisk.CubeColor().getByHorizontalColor(parseInt('0x' + d.replace('#', '')))).map((d) =>
          Number(d).toString(16).slice(2)
        )
      )
      .reduce((acc, d) => acc.concat(d), [])
      .map(hexToRgb)
      .map((d) => `${d.r},${d.g},${d.b}`)
  }

  var originFillsObelisk = helper(originFills)
  var definedFillsObelisk = helper(definedFills)

  for (var i = 0; i < data.length; i += 4) {
    var originalRgb = `${data[i]},${data[i + 1]},${data[i + 2]}`
    var hit = originFillsObelisk.indexOf(originalRgb)

    if (hit > 0) {
      var rgb = definedFillsObelisk[hit].split(',').map((d) => parseInt(d, 10))

      data[i] = rgb[0]
      data[i + 1] = rgb[1]
      data[i + 2] = rgb[2]
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}
