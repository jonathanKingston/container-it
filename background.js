let counter = 0;
browser.storage.local.get("counter").then((items) => {
  if (items.counter) {
    counter = items.counter;
  } else {
    setCounter(counter);
  }
});

browser.contextMenus.create({
  id: "clone-container",
  title: "Clone page",
  contexts: ["all"],
});
browser.contextMenus.create({
  id: "add-container",
  title: "Change default page",
  contexts: ["all"],
});

browser.browserAction.onClicked.addListener((tab) => {
  createTabClone(tab);
});

browser.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === "add-container") {
    setPage(tab.url);
  } else {
    createTabClone(tab);
  }
});

function setCounter(counter) {
  browser.storage.local.set({
    counter
  });
}

function setPage(page) {
  browser.storage.local.set({
    page
  });
}

function createTabClone(tab) {
  ++counter;
  setCounter(counter);
  browser.storage.local.get("page").then((items) => {
    if (items.page) {
      browser.contextualIdentities.create({
        name: `${counter} - Container`,
        color: "red",
        icon: "circle"
      }).then((container) => {
        browser.tabs.create({
          url: items.page,
          cookieStoreId: container.cookieStoreId
        });
      });
    } else {
      setPage(tab.url);
    }
  });

}
