import './request-page.js';
const getTab = async () => (await chrome.tabs.query({ active: true, lastFocusedWindow: true }))[0];

async function send(action) {
  try {
    const tab = await getTab();
    const response = await requestPage(tab?.id, action);
    if (response?.text) await chrome.scripting.executeScript({ target: { tabId: tab.id }, func: copyText, args: [response.text] });
  } catch (error) { console.debug('Page Insight:', error.message); }
}

async function copyText(text) {
  try {
    if (!navigator.clipboard?.writeText) throw new Error('Clipboard API unavailable');
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = document.createElement('textarea');
    const focused = document.activeElement;
    area.value = text;
    area.style.cssText = 'position:fixed;left:-9999px;top:-9999px';
    document.body.appendChild(area);
    try { area.focus(); area.select(); return document.execCommand('copy'); }
    finally { area.remove(); focused?.focus({ preventScroll: true }); }
  }
}

chrome.commands.onCommand.addListener(command => {
  if (command === 'copy-page' || command === 'extract-insight') return send(command);
});
