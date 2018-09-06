function getCurrentTab() {
  return new Promise((res, rej) => {
    chrome.windows.getCurrent((window) => {
      chrome.tabs.query({active: true, windowId: window.id}, (tabs) => {
        res(tabs[0])
      })
    })
  })
}

function tabWithId(id) {
  return new Promise((res, rej) => {
    chrome.tabs.get(id, (tab) => {
      if (tab.id !== chrome.tabs.TAB_ID_NONE)
        res(tab)
      else
        rej()
    })
  })
}

function getVal(key) {
  return new Promise((res, rej) => {
    chrome.storage.local.get([key], (vals) => {
      if(chrome.runtime.lastError) {
        rej(chrome.runtime.lastError)
      }
      res(vals[key])
    })
  })
}

function setVal(key, val) {
  return new Promise((res, rej) => {
    chrome.storage.local.set({[key]: val}, () => {
      if(chrome.runtime.lastError) {
        rej(chrome.runtime.lastError)
      }
      res()
    })
  })
}