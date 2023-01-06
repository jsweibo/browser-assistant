chrome.browserAction.onClicked.addListener(function () {
  chrome.runtime.openOptionsPage();
});

chrome.runtime.onMessage.addListener(function (message, sender) {
  // retransmit signal
  chrome.tabs.sendMessage(sender.tab.id, message);
});
