function getTabState() {
  chrome.tabs.query({ currentWindow: true }, (tabs) => {
    const tabCount = tabs.length;
    const activeTab = tabs.find((t) => t.active);
    const activeTabIndex = activeTab != null ? activeTab.index : 0;

    if (activeTab?.id) {
      chrome.tabs.sendMessage(activeTab.id, { tabCount, activeTabIndex }).catch(() => {
        // Content script not injectable on this page (e.g. chrome://)
      });
    }
  });
}

chrome.runtime.onStartup.addListener(getTabState);
chrome.tabs.onActivated.addListener(getTabState);
chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (changeInfo.status === "loading" || changeInfo.status === "complete") {
    getTabState();
  }
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "getTabState") {
    getTabState();
    sendResponse({});
  }
});
