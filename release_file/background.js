let targetWindow = null;
let tabCount = 0;

function updateBadgeOnTabChange() {
  chrome.windows.getAll({"populate": true}, updateBadgeTextForWindows);
}

function updateBadgeTextForWindows(windows) {
  if (windows.length > 1) {
    chrome.action.setBadgeText({text: String(windows.length)});
  } else {
    chrome.action.setBadgeText({text: ""});
  }
}

function handleActionClick() {
  chrome.windows.getCurrent((win) => {
    targetWindow = win;
    chrome.tabs.query({windowId: targetWindow.id}, (tabs) => {
      tabCount = tabs.length;
      chrome.windows.getAll({"populate": true}, moveTabsToCurrentWindow);
    });
  });
}

function moveTabsToCurrentWindow(windows) {
  let numWindows = windows.length;
  let tabPosition = tabCount;
  for (let i = 0; i < numWindows; i++) {
    let win = windows[i];
    if (targetWindow.id !== win.id) {
      let numTabs = win.tabs.length;
      for (let j = 0; j < numTabs; j++) {
        let tab = win.tabs[j];
        chrome.tabs.move(tab.id, {
          windowId: targetWindow.id,
          index: tabPosition++
        });
      }
    }
  }
  chrome.action.setBadgeText({text: ""});
}

chrome.action.onClicked.addListener(handleActionClick);
chrome.tabs.onActivated.addListener(updateBadgeOnTabChange);
