chrome.runtime.onInstalled.addListener(function () {
  chrome.storage.local.set({
    isInject: false,
  })

  chrome.action.disable()

  chrome.declarativeContent.onPageChanged.removeRules(undefined, function () {
    chrome.declarativeContent.onPageChanged.addRules([
      {
        conditions: [
          new chrome.declarativeContent.PageStateMatcher({
            pageUrl: { hostPrefix: 'github.com', schemes: ['https'] },
            css: ['div.js-yearly-contributions'],
          }),
        ],
        actions: [new chrome.declarativeContent.ShowPageAction()],
      },
    ])
  })
})

chrome.runtime.onMessage.addListener(function (message) {
  if (message === 'runInject') {
    chrome.storage.local.set(
      {
        isInject: true,
      },
      async function () {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true })

        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['js/content_script.js'],
        })
      }
    )
  }
})
