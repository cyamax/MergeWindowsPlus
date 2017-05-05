// windowsが切り替わったとときに発火
function movelisten(){
  chrome.windows.getAll({"populate" : true},changepop);
}

function changepop(windows){
  //console.log(windows.length);
  if (windows.length > 1) {
    chrome.browserAction.setBadgeText({text:String(windows.length)});
  }else{
    chrome.browserAction.setBadgeText({text:""});
  }
}


// Copyright (c) 2011 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.
var targetWindow = null;
var tabCount = 0;

function start(tab) {
  chrome.windows.getCurrent(getWindows);
}

function getWindows(win) {
  targetWindow = win;
  chrome.tabs.getAllInWindow(targetWindow.id, getTabs);
}

function getTabs(tabs) {
  tabCount = tabs.length;
  // We require all the tab information to be populated.
  chrome.windows.getAll({"populate" : true}, moveTabs);
}

function moveTabs(windows) {
  var numWindows = windows.length;
  var tabPosition = tabCount;
  for (var i = 0; i < numWindows; i++) {
    var win = windows[i];

    if (targetWindow.id != win.id) {
      var numTabs = win.tabs.length;

      for (var j = 0; j < numTabs; j++) {
        var tab = win.tabs[j];
        // Move the tab into the window that triggered the browser action.
        chrome.tabs.move(tab.id,
            {"windowId": targetWindow.id, "index": tabPosition});
        tabPosition++;
      }
    }
  }

  chrome.browserAction.setBadgeText({text:""});
}

// Set up a click handler so that we can merge all the windows.
chrome.browserAction.onClicked.addListener(start);

chrome.tabs.onActivated.addListener(movelisten); 