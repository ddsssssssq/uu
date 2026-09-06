const getTab = async () => (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0];

async function send(action) {
  const tab = await getTab();
  if (!tab?.id || tab.url?.startsWith('chrome://') || tab.url?.startsWith('edge://')) return;
  try {
    const response = await chrome.tabs.sendMessage(tab.id, { action });
    if (response?.text) await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: copyText, args: [response.text] });
  } catch (error) { console.debug('Page Insight:', error.message); }
}

function copyText(text) {
  navigator.clipboard?.writeText(text).catch(() => {
    const area = document.createElement('textarea'); area.value = text; document.body.appendChild(area); area.select();
    document.execCommand('copy'); area.remove();
  });
}

chrome.commands.onCommand.addListener(command => send(command === 'copy-page' ? 'copy-page' : 'extract-insight'));
