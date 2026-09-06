// Called only from an explicit popup action or extension keyboard command.
globalThis.requestPage = async function requestPage(tabId, action) {
  if (!Number.isInteger(tabId)) throw new Error('No active tab');
  // Re-check activeTab permission on every invocation. The content script is
  // idempotent, so subsequent requests do not add duplicate listeners.
  await chrome.scripting.executeScript({
    target: { tabId },
    files: ['i18n.js', 'content.js']
  });
  const response = await chrome.tabs.sendMessage(tabId, { action });
  if (!response || response.error) throw new Error(response?.error || 'No response from page');
  return response;
};
