var lightGreen = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']
var darkGreen = ['#161b22', '#01311f', '#034525', '#0f6d31', '#00c647']

var theme = document.documentElement.getAttribute('data-color-mode')

var defaultFills = initDefaultFills(theme)
function initDefaultFills(theme) {
  return theme === 'light'
    ? {
        green: lightGreen,
        blue: ['#ebedf0', '#b4daff', '#75baff', '#0080ff', '#0056ac'],
        purple: ['#ebedf0', '#dbb7ff', '#b76eff', '#8000ff', '#5200a4'],
        orange: ['#ebedf0', '#ffd9b3', '#ffaf5f', '#ff8000', '#aa5500'],
        red: ['#ebedf0', '#ffa3a3', '#ff6868', '#ff0000', '#9c0101'],
      }
    : {
        green: darkGreen,
        blue: ['#161b22', '#011c57', '#04256c', '#13388c', '#013cc5'],
        purple: ['#161b22', '#310358', '#43056d', '#59128c', '#7501c5'],
        orange: ['#161b22', '#331101', '#632a05', '#834610', '#c55501'],
        red: ['#161b22', '#380101', '#610404', '#820f0f', '#c50101'],
      }
}

function initThemeObserver() {
  if (typeof themeObserved !== 'undefined') {
    return
  } else {
    chrome.storage.sync.set({ theme }) // Set the theme in advance for use by popup

    const observer = new MutationObserver(function (mutationsList) {
      for (const mutation of mutationsList) {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-color-mode') {
          var theme = mutation.target.getAttribute(mutation.attributeName)

          defaultFills = initDefaultFills(theme)
          chrome.storage.sync.get(
            {
              gccPreDefinedFills: defaultFills.green,
              gccUserSelectedFills: 'green',
            },
            function (result) {
              main(result.gccPreDefinedFills, defaultFills[result.gccUserSelectedFills], theme)
            }
          )
          chrome.storage.sync.set({ theme })
        }
      }
    })

    observer.observe(document.documentElement, { attributes: true })
    themeObserved = true
  }
}
initThemeObserver()

chrome.storage.sync.get({ gccPreDefinedFills: defaultFills.green, gccUserSelectedFills: 'green' }, function (result) {
  chrome.storage.local.get(['isInject'], function (localResult) {
    var originFills
    if (localResult.isInject) {
      originFills = result.gccPreDefinedFills
    } else {
      originFills = defaultFills.green
    }

    main(originFills, defaultFills[result.gccUserSelectedFills], theme)
  })
})

function main(originFills, definedFills, theme) {
  // calendar
  const weeks = Array(53)
    .fill()
    .map((_, i) => i)
    .map((i) => document.querySelectorAll(`.js-calendar-graph-table tbody td.ContributionCalendar-day[data-ix="${i}"]`))
  if (weeks.length === 0) {
    return
  }
  weeks.forEach(function (week) {
    var rects = Array.prototype.slice.call(week)

    rects.forEach(function (rect) {
      rect.style.backgroundColor = changeFill(
        originFills,
        definedFills,
        rgb2hex(window.getComputedStyle(rect).backgroundColor)
      )
    })
  })

  // legends
  var legends = document.querySelectorAll('.js-calendar-graph .float-right rect')
  Array.prototype.slice.call(legends).map(function (t, i) {
    t.style.fill = definedFills[i]
  })

  // progress
  var progressSpans = document.querySelectorAll('.Progress > span.Progress-item:not(.progress-pjax-loader-bar)')
  if (progressSpans.length) {
    Array.prototype.slice.call(progressSpans).map((span) => {
      span.style.backgroundColor = changeFill(
        arraysEqual(originFills, darkGreen) ? lightGreen : originFills,
        arraysEqual(definedFills, darkGreen) ? lightGreen : definedFills,
        rgb2hex(window.getComputedStyle(span).backgroundColor)
      )
    })
  }

  // Activity overview
  var activityOverviewGraph = document.querySelector('.js-activity-overview-graph-container > svg > g')
  if (activityOverviewGraph) {
    Array.prototype.slice.call(activityOverviewGraph.children).map((child) => {
      if (child.nodeName === 'path') {
        child.attributes.fill.value = theme === 'light' ? definedFills[2] : definedFills[4]
        child.style.stroke = theme === 'light' ? definedFills[2] : definedFills[4]
      }
      if (child.nodeName === 'line') {
        child.style.stroke = theme === 'light' ? definedFills[4] : definedFills[2]
      }
      if (child.nodeName === 'ellipse') {
        child.style.stroke = definedFills[4]
      }
    })
  }

  // Isometric Contributions
  let count = 0
  const icStatsId = setInterval(() => {
    var icStatsSpans = document.querySelectorAll('.ic-contributions-wrapper .color-fg-success')

    if (icStatsSpans.length > 0) {
      Array.prototype.slice.call(icStatsSpans).map((span) => {
        span.style = `color: ${definedFills[4]} !important;`
      })
      changeIsoColors(originFills, definedFills)
      clearInterval(icStatsId)
    } else {
      count++
    }

    if (count === 10) {
      clearInterval(icStatsId)
    }
  }, 500)

  chrome.storage.sync.set({
    gccPreDefinedFills: definedFills,
  })
  chrome.storage.local.set({
    isInject: false,
  })
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
      return val
  }
}

function changeIsoColors(originFills, definedFills) {
  var iso = document.querySelector('canvas#isometric-contributions')
  var ctx = iso.getContext('2d')
  var imageData = ctx.getImageData(0, 0, iso.width, iso.height)
  var data = imageData.data

  function helper(val) {
    return val
      .map((d) => {
        var color = new obelisk.CubeColor().getByHorizontalColor(parseInt('0x' + d.replace('#', ''))) // border / borderHighlight / horizontal / left / right
        var colorValues = Object.values(color)
          .map((d) => Number(d).toString(16).slice(2))
          .slice(1) // Remove border value

        return colorValues
      })
      .reduce((acc, d) => acc.concat(d), [])
      .map(hex2rgb)
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

function hex2rgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : null
}

function rgb2hex(rgb) {
  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/)

  function hex(x) {
    return ('0' + parseInt(x).toString(16)).slice(-2)
  }

  return '#' + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3])
}

function arraysEqual(a1, a2) {
  /* WARNING: arrays must not contain {objects} or behavior may be undefined */
  return JSON.stringify(a1) == JSON.stringify(a2)
}
