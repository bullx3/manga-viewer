global.browser = require('webextension-polyfill')

async function executeViewer(tabId){
  let obj = {};
  let result = await browser.tabs.executeScript(tabId, {file: "/scraping.js"})
  localStorage["viewerParam"] = JSON.stringify(result[0]);
  await browser.tabs.update(tabId, {"url": "/viewer/viewer.html"})
  console.log("finish to viewer.html");
}

browser.contextMenus.create({
  "title": "新しいタブでMangaViewerを表示",
  "type": "normal",
  "contexts": ["link"], // リンクのみ有効
  "onclick": (info) => {
    console.log("onclick contextMenu");
    (async () => {
      let tabs = await browser.tabs.query({active: true, currentWindow: true});
      let tab = tabs[0];
      let newTab = await browser.tabs.create({"url": info.linkUrl, "active": false, "index": tab.index+1});
      executeViewer(newTab.id);
    })();

  }
});

/**
 * manifest.jsonで指定したcommandのショートカットを入力すると呼び出される
 */
browser.commands.onCommand.addListener((command) => {
  console.log('Command:', command);
  if(command == "change_image_preview"){
    executeViewer(null);
  }
});

// page action判定
browser.tabs.onUpdated.addListener(function(tabId, changeInfo, tab){
  // Show page action http or https
  if (changeInfo.status == "complete"){
      if (tab.url.indexOf("https://") === 0 || tab.url.indexOf("http://") === 0){
        browser.pageAction.show(tabId);
      }
  }
});
