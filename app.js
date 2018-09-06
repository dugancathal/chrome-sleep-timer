const $ = (css) => document.querySelector(css)

function formatTimer(millisRemaining) {
  const hours = (Math.floor(millisRemaining / 1000 / 60 / 60)).toString().padStart(2, '0')
  const minutes = (Math.floor(millisRemaining / 1000 / 60)).toString().padStart(2, '0')
  const seconds = (Math.floor(millisRemaining / 1000) % 60).toString().padStart(2, '0')
  return `${hours}:${minutes}:${seconds}`
}

function newTimer(tab, timeToClose) {
  let startTime = new Date().getTime()
  return {
    id: `close-tab-${tab.id}`,
    tabId: tab.id,
    tabTitle: tab.title,
    duration: timeToClose,
    startTime,
    endTime: startTime + (timeToClose * 1000 * 60),
  }
}

const upsertTimer = (timers = [], timer) => {
  return [...timers.filter(t => t.id !== timer.id), timer]
}

function createTimer(tab) {
  const timeToClose = parseInt($('#close-in-minutes-select').value, 10)

  const timer = newTimer(tab, timeToClose)
  getVal('timers').then(timers => setVal('timers', upsertTimer(timers, timer)))
  chrome.alarms.create(timer.id, {delayInMinutes: timeToClose})
}

function updateTimers() {
  getVal('timers').then(timers => {
    $('table.timers tbody').innerHTML = timers.map(timer => `
      <tr>
        <td>${timer.tabTitle}</td>
        <td class="numeric">${formatTimer(timer.endTime - new Date().getTime())}</td>
      </tr>
    `).join('')
  })
  setTimeout(updateTimers, 1000)
}

(function () {
  getCurrentTab().then(tab => {
    $('#current-tab-name').innerText = tab.title
    $('#save-timer').onclick = () => createTimer(tab)
  })
  
  updateTimers()
})()