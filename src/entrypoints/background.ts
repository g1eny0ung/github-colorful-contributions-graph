export default defineBackground(() => {
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

  browser.storage.local.set({
    isInject: false,
  })

  browser.runtime.onMessage.addListener(function (message) {
    if (message === 'runInject') {
      browser.storage.local.set(
        {
          isInject: true,
        },
        async function () {
          const [currentTab] = await browser.tabs.query({
            active: true,
            currentWindow: true,
          })

          browser.scripting.executeScript({
            target: { tabId: currentTab.id! },
            // @ts-ignore
            files: ['/js/content_script.js'],
          })
        },
      )
    }
  })
})
