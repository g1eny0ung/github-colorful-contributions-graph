export default defineBackground(() => {
  if (!import.meta.env.FIREFOX) {
    browser.runtime.onInstalled.addListener(function () {
      browser.declarativeContent.onPageChanged.removeRules(
        undefined,
        function () {
          browser.declarativeContent.onPageChanged.addRules([
            {
              conditions: [
                new browser.declarativeContent.PageStateMatcher({
                  pageUrl: { hostEquals: 'github.com', schemes: ['https'] },
                  css: ['.js-yearly-contributions'],
                }),
              ],
              actions: [new browser.declarativeContent.ShowAction()],
            },
          ])
        },
      )
    })
  }

  browser.runtime.onMessage.addListener((message) => {
    if (message !== 'runInject') {
      return
    }

    return injectIntoActiveTab()
  })
})

async function injectIntoActiveTab() {
  const [currentTab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  })
  if (currentTab?.id === undefined) {
    return
  }

  await browser.scripting.executeScript({
    target: { tabId: currentTab.id },
    files: ['/js/content_script.js'],
  })
}
