chrome.alarms.onAlarm.addListener((alarm) => {
  getVal('timers').then(timers => {
    const timer = timers.find(t => t.id === alarm.name)
    setVal('timers', timers.filter(timer => timer.id !== alarm.name))
    chrome.tabs.remove(timer.tabId)
  })
})