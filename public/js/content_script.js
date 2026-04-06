var progressGreen = ['#ebedf0', '#9be9a8', '#40c463', '#30a14e', '#216e39']

function lightProfile(defaultGreen) {
  return {
    green: defaultGreen,
    blue: [defaultGreen[0], '#caddf9', '#79b8ff', '#2188ff', '#005cc5'],
    purple: [defaultGreen[0], '#e1d4fa', '#b392f0', '#8a63d2', '#5a32a3'],
    orange: [defaultGreen[0], '#ffdfb6', '#ffb757', '#f68212', '#c24e00'],
    red: [defaultGreen[0], '#ffc1c0', '#f97a82', '#d73a49', '#86181d'],
    cyan: [defaultGreen[0], '#d2f4f4', '#7eddd3', '#12b5b0', '#08706d'],
    pink: [defaultGreen[0], '#ffdae5', '#ff99b8', '#f45287', '#bf125d'],
    lime: [defaultGreen[0], '#d9f99d', '#bef264', '#65a30d', '#365314'],
    halloween: [defaultGreen[0], '#ffee4a', '#ffc501', '#fe9600', '#333'],
  }
}
function darkProfile(defaultGreen) {
  return {
    green: defaultGreen,
    blue: [defaultGreen[0], '#0a3069', '#0969da', '#388bfd', '#79c0ff'],
    purple: [defaultGreen[0], '#3c1e70', '#6e40c9', '#8957e5', '#d2a8ff'],
    orange: [defaultGreen[0], '#4d1e00', '#9e3605', '#e36209', '#ffa657'],
    red: [defaultGreen[0], '#490202', '#8e1519', '#da3633', '#ff7b72'],
    cyan: [defaultGreen[0], '#00373d', '#008291', '#00bcd4', '#b2ebf2'],
    pink: [defaultGreen[0], '#490628', '#b1105d', '#db61a2', '#f692ce'],
    lime: [defaultGreen[0], '#242c05', '#4d5b12', '#82991b', '#d9f99d'],
    halloween: [defaultGreen[0], '#631c03', '#bd561d', '#fa7a18', '#fddf68'],
  }
}
function darkDimmedProfile(defaultGreen) {
  return {
    green: defaultGreen,
    blue: [defaultGreen[0], '#1a3a5a', '#285d95', '#4182c4', '#6db1f5'],
    purple: [defaultGreen[0], '#342a5c', '#524291', '#7562bc', '#a392e8'],
    orange: [defaultGreen[0], '#4d2d12', '#824d1a', '#c27021', '#f0a05a'],
    red: [defaultGreen[0], '#4d2323', '#7a3535', '#ad4f4f', '#e07b7b'],
    cyan: [defaultGreen[0], '#1e4042', '#327178', '#519fa6', '#89d1d9'],
    pink: [defaultGreen[0], '#4d2d3e', '#8a4267', '#bf6b93', '#e899c0'],
    lime: [defaultGreen[0], '#323d1c', '#54662d', '#89a84a', '#bef264'],
    // Halloween is the same as dark profile.
    halloween: [defaultGreen[0], '#631c03', '#bd561d', '#fa7a18', '#fddf68'],
  }
}

// auto, light, dark
var colorMode = document.documentElement.getAttribute('data-color-mode')
var darkTheme = document.documentElement.getAttribute('data-dark-theme')
var isDarkMode

function initDefaultFills(colorMode, darkTheme) {
  var defaultGreen = [0, 1, 2, 3, 4].map((i) =>
    window
      .getComputedStyle(document.body)
      .getPropertyValue(`--contribution-default-bgColor-${i}`),
  )

  if (colorMode === 'auto') {
    isDarkMode =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: dark)').matches

    if (isDarkMode) {
      return darkTheme === 'dark_dimmed'
        ? darkDimmedProfile(defaultGreen)
        : darkProfile(defaultGreen)
    } else {
      return lightProfile(defaultGreen)
    }
  }

  if (colorMode === 'dark') {
    isDarkMode = true
    return darkTheme === 'dark_dimmed'
      ? darkDimmedProfile(defaultGreen)
      : darkProfile(defaultGreen)
  }

  isDarkMode = false
  return lightProfile(defaultGreen)
}

var maxTries = 5
var tries = 0
var intervalId

// If intervalId is null, it means the page has already loaded.
if (intervalId === null) {
  main()
} else {
  intervalId = setInterval(() => {
    main()

    if (++tries === maxTries) {
      clearInterval(intervalId)
      intervalId = null
    }
  }, 1000)
}

function main() {
  if (document.querySelector('.js-yearly-contributions')) {
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }

    var defaultFills = initDefaultFills(colorMode, darkTheme)

    browser.storage.sync
      .get({
        gccPreDefinedFills: defaultFills.green,
        gccUserSelectedFills: 'green',
      })
      .then(function (result) {
        browser.storage.local.get(['isInject']).then(function (localResult) {
          var originFills
          if (localResult.isInject) {
            originFills = result.gccPreDefinedFills
          } else {
            originFills = defaultFills.green
          }

          run(originFills, defaultFills[result.gccUserSelectedFills])
        })
      })

    initMediaListener()
  }
}

function initMediaListener() {
  if (typeof mediaListenerAdded !== 'undefined') {
    return
  } else {
    browser.storage.sync.set({ theme: isDarkMode ? 'dark' : 'light' }) // Set the theme in advance for use by popup

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        var mode = e.matches ? 'dark' : 'light'
        var defaultFills = initDefaultFills(mode, darkTheme)

        browser.storage.sync
          .get({
            gccPreDefinedFills: defaultFills.green,
            gccUserSelectedFills: 'green',
          })
          .then(function (result) {
            run(
              result.gccPreDefinedFills,
              defaultFills[result.gccUserSelectedFills],
            )
            browser.storage.sync.set({ theme: mode })
          })
      })

    mediaListenerAdded = true
  }
}

function run(originFills, definedFills) {
  // calendar
  const weeks = Array(53)
    .fill()
    .map((_, i) => i)
    .map((i) =>
      document.querySelectorAll(
        `.js-calendar-graph-table tbody td.ContributionCalendar-day[data-ix="${i}"]`,
      ),
    )
  if (weeks.length === 0) {
    return
  }
  weeks.forEach(function (week) {
    var rects = Array.prototype.slice.call(week)

    rects.forEach(function (rect) {
      const level = rect.getAttribute('data-level')

      rect.style.backgroundColor = definedFills[parseInt(level, 10)]
    })
  })

  // legends
  var legends = document.querySelectorAll('.js-calendar-graph .float-right div')
  Array.prototype.slice.call(legends).map(function (t, i) {
    t.style.backgroundColor = definedFills[i]
  })

  // progress
  var progressSpans = document.querySelectorAll(
    '.Progress > span.Progress-item:not(.progress-pjax-loader-bar)',
  )
  if (progressSpans.length) {
    Array.prototype.slice.call(progressSpans).map((span) => {
      // The data-bg-color is used to store the defined color.
      const currentColor =
        span.getAttribute('data-bg-color') ||
        span.getAttribute('style').split(' ')[2]

      span.style.backgroundColor =
        definedFills[progressGreen.indexOf(currentColor)]
      span.setAttribute('data-bg-color', currentColor)
    })
  }

  // Activity overview
  var activityOverviewGraph = document.querySelector(
    '.js-activity-overview-graph-container > svg > g',
  )
  if (activityOverviewGraph) {
    Array.prototype.slice.call(activityOverviewGraph.children).map((child) => {
      if (child.nodeName === 'path') {
        child.attributes.fill.value = definedFills[3]
        child.style.stroke = definedFills[3]
      }
      if (child.nodeName === 'line') {
        child.style.stroke = definedFills[3]
      }
      if (child.nodeName === 'ellipse') {
        child.style.stroke = definedFills[3]
      }
    })
  }

  // Isometric Contributions
  let count = 0
  const icStatsId = setInterval(() => {
    var icStatsSpans = document.querySelectorAll(
      '.ic-contributions-wrapper .color-fg-success',
    )

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

  browser.storage.sync.set({
    gccPreDefinedFills: definedFills,
  })
  browser.storage.local.set({
    isInject: false,
  })
}

function changeIsoColors(originFills, definedFills) {
  var iso = document.querySelector('canvas#isometric-contributions')
  var ctx = iso.getContext('2d')
  var imageData = ctx.getImageData(0, 0, iso.width, iso.height)
  var data = imageData.data

  function helper(val) {
    return val
      .map((d) => {
        var color = new obelisk.CubeColor().getByHorizontalColor(
          parseInt('0x' + d.replace('#', '')),
        ) // border, borderHighlight, left, right, horizontal
        var colorVals = Object.values(color).map((d) =>
          Number(d).toString(16).slice(2),
        )

        return colorVals
      })
      .reduce((acc, d) => acc.concat(d), [])
      .map(hex2rgb)
      .map((d) => `${d.r},${d.g},${d.b}`)
  }

  var originFillsObelisk = helper(originFills)
  var definedFillsObelisk = helper(definedFills)

  /**
   * 2026-02-18 update: I optimized the code to handle unrecognized colors.
   *
   * 1. The code should avoid handling '0,0,0' color.
   * 2. The code should handle the case when the original color is not in the originFillsObelisk. Use the previous color instead.
   */
  var prevRgb = '0,0,0'
  for (var i = 0; i < data.length; i += 4) {
    var originalRgb = `${data[i]},${data[i + 1]},${data[i + 2]}`

    if (originalRgb !== '0,0,0') {
      var hit = originFillsObelisk.indexOf(originalRgb)

      if (hit > 0) {
        var rgb = definedFillsObelisk[hit]
          .split(',')
          .map((d) => parseInt(d, 10))

        data[i] = rgb[0]
        data[i + 1] = rgb[1]
        data[i + 2] = rgb[2]
      } else if (prevRgb !== '0,0,0') {
        data[i] = data[i - 4]
        data[i + 1] = data[i - 3]
        data[i + 2] = data[i - 2]
      }
    }

    prevRgb = originalRgb
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
