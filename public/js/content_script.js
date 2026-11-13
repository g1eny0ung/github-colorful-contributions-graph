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

var contributionCellSelector =
  '.js-yearly-contributions .js-calendar-graph-table tbody td.ContributionCalendar-day[data-level]'
var contributionCell
var contributionObserver
var isoIntervalId
var isoRestoreId
var isoFills
var isoCanvasFills = isoCanvasFills || new WeakMap()
var maxTries = 5
var tries = 0
var intervalId

clearInterval(intervalId)
intervalId = null

if (!main()) {
  intervalId = setInterval(() => {
    main()

    if (++tries === maxTries) {
      clearInterval(intervalId)
      intervalId = null
    }
  }, 1000)
}

function main() {
  var cell = document.querySelector(contributionCellSelector)
  if (cell) {
    contributionCell = cell
    if (intervalId) {
      clearInterval(intervalId)
      intervalId = null
    }

    var defaultFills = initDefaultFills(
      document.documentElement.getAttribute('data-color-mode'),
      document.documentElement.getAttribute('data-dark-theme'),
    )

    applySelectedFills(cell, defaultFills)

    initMediaListener()
    observeContributionUpdates()
    return true
  }
}

function observeContributionUpdates() {
  if (contributionObserver) {
    return
  }

  contributionObserver = new MutationObserver((records) => {
    if (contributionCell.isConnected) {
      return
    }
    if (records.some((record) => record.addedNodes.length > 0)) {
      main()
    }
  })
  document.addEventListener('visibilitychange', restoreIsometricColors)
  contributionObserver.observe(document.documentElement, {
    childList: true,
    subtree: true,
  })
}

function applySelectedFills(cell, defaultFills) {
  browser.storage.sync
    .get({ gccUserSelectedFills: 'green' })
    .then(function (result) {
      if (cell?.isConnected && contributionCell === cell) {
        run(defaultFills.green, defaultFills[result.gccUserSelectedFills])
      }
    })
}

function initMediaListener() {
  if (typeof mediaListenerAdded !== 'undefined') {
    return
  } else {
    browser.storage.sync.set({ theme: isDarkMode ? 'dark' : 'light' }) // Set the theme in advance for use by popup

    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', () => {
        var mode = document.documentElement.getAttribute('data-color-mode')
        if (mode !== 'auto') {
          return
        }

        var defaultFills = initDefaultFills(
          mode,
          document.documentElement.getAttribute('data-dark-theme'),
        )

        applySelectedFills(contributionCell, defaultFills)
        browser.storage.sync.set({ theme: isDarkMode ? 'dark' : 'light' })
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

  clearInterval(isoIntervalId)
  isoFills = { cell: contributionCell, originFills, definedFills }
  let attempts = 0
  isoIntervalId = setInterval(() => {
    if (
      !isoFills.cell.isConnected ||
      paintIsometricColors() ||
      ++attempts === 10
    ) {
      clearInterval(isoIntervalId)
    }
  }, 500)
}

function restoreIsometricColors() {
  clearTimeout(isoRestoreId)
  if (document.visibilityState === 'visible') {
    isoRestoreId = setTimeout(() => {
      if (paintIsometricColors()) {
        clearInterval(isoIntervalId)
      }
    }, 100)
  }
}

function paintIsometricColors() {
  if (!isoFills?.cell.isConnected) {
    return false
  }

  const canvas = document.querySelector('canvas#isometric-contributions')
  const stats = document.querySelectorAll(
    '.ic-contributions-wrapper .color-fg-success',
  )
  if (!canvas || !stats.length) {
    return false
  }

  const { originFills, definedFills } = isoFills
  if (!changeIsoColors(canvas, originFills, definedFills)) {
    return false
  }
  stats.forEach((span) => {
    span.style.setProperty('color', definedFills[4], 'important')
  })
  return true
}

function changeIsoColors(canvas, originFills, definedFills) {
  const ctx = canvas.getContext('2d')
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
  const { data } = imageData
  const replacements = new Map()
  const cubeColors = (fill) => {
    const hex = fill.trim().slice(1)
    const fullHex = hex.length === 3 ? hex.replace(/./g, '$&$&') : hex
    return Object.values(
      new obelisk.CubeColor().getByHorizontalColor(parseInt(fullHex, 16)),
    ).map((color) => color & 0xffffff)
  }

  const target = definedFills.map(cubeColors)
  const previous = isoCanvasFills.get(canvas)
  for (const fills of previous ? [previous, originFills] : [originFills]) {
    fills.forEach((fill, level) => {
      cubeColors(fill).forEach((color, face) => {
        if (color !== 0 && !replacements.has(color)) {
          replacements.set(color, target[level][face])
        }
      })
    })
  }

  let matched = false
  let changed = false
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] === 0) {
      continue
    }
    const color = (data[i] << 16) | (data[i + 1] << 8) | data[i + 2]
    const replacement = replacements.get(color)
    if (replacement === undefined) {
      continue
    }

    matched = true
    if (replacement !== color) {
      data[i] = replacement >> 16
      data[i + 1] = (replacement >> 8) & 255
      data[i + 2] = replacement & 255
      changed = true
    }
  }

  if (changed) {
    ctx.putImageData(imageData, 0, 0)
  }
  if (matched) {
    isoCanvasFills.set(canvas, definedFills)
  }
  return matched
}
