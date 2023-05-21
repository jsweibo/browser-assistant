function start() {
  chrome.storage.local.get('config', function (res) {
    if (!('config' in res)) {
      // writing settings will invoke chrome.storage.onChanged
      chrome.storage.local.set({
        config: DEFAULT_SETTINGS,
      });
    }
  });
}

chrome.browserAction.onClicked.addListener(function () {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onMessage.addListener(function (message, sender) {
  // retransmit signal
  chrome.tabs.sendMessage(sender.tab.id, message);
});

chrome.storage.onChanged.addListener(function () {
  // restart
  start();
});

// start
start();
