(() => {
if (globalThis.__pageInfoContentLoaded) return;
globalThis.__pageInfoContentLoaded = true;
const clean = value => (value || '').replace(/\s+/g, ' ').trim();
const unique = values => [...new Set(values.map(clean).filter(value => value.length > 20))];
let lastSelection = clean(window.getSelection()?.toString());
let selectionBubble = null;
let selectionBubbleTimer = null;
let pageLanguage = resolvePageLanguage('auto');
let pageText = PAGE_I18N[pageLanguage];
chrome.storage.sync.get({ language: 'auto' }).then(settings => { pageLanguage = resolvePageLanguage(settings.language); pageText = PAGE_I18N[pageLanguage]; });
chrome.storage.onChanged.addListener((changes, area) => { if (area === 'sync' && changes.language) { pageLanguage = resolvePageLanguage(changes.language.newValue); pageText = PAGE_I18N[pageLanguage]; } });

function rememberSelection() {
  const selected = clean(window.getSelection()?.toString());
  if (selected) lastSelection = selected;
}

function copyRememberedSelection() {
  if (!lastSelection) return Promise.resolve(false);
  return (async () => {
    try {
      if (!navigator.clipboard?.writeText) throw new Error('clipboard unavailable');
      await navigator.clipboard.writeText(lastSelection);
      return true;
    } catch {
      try {
        const area = document.createElement('textarea');
        area.value = lastSelection;
        area.style.cssText = 'position:fixed;left:-9999px;top:-9999px;opacity:0';
        document.body.appendChild(area);
        area.focus(); area.select();
        const ok = document.execCommand('copy');
        area.remove();
        return ok;
      } catch { return false; }
    }
  })();
}

function hideSelectionBubble() {
  if (selectionBubble) selectionBubble.style.display = 'none';
}

function showSelectionBubble() {
  const selection = window.getSelection();
  if (!selection || !selection.rangeCount || !lastSelection) return hideSelectionBubble();
  const rect = selection.getRangeAt(0).getBoundingClientRect();
  if (!rect.width && !rect.height) return hideSelectionBubble();
  if (!selectionBubble) {
    selectionBubble = document.createElement('button');
    selectionBubble.type = 'button';
    selectionBubble.textContent = pageText.copySelection;
    selectionBubble.setAttribute('aria-label', pageText.copySelection);
    selectionBubble.style.cssText = 'display:none;position:fixed;z-index:2147483647;padding:8px 11px;border:1px solid #b5f36d;border-radius:9px;background:#151812;color:#b5f36d;font:600 12px/1.2 system-ui,sans-serif;box-shadow:0 6px 20px rgba(0,0,0,.3);cursor:pointer;white-space:nowrap;';
    selectionBubble.addEventListener('mousedown', event => { event.preventDefault(); event.stopPropagation(); });
    selectionBubble.addEventListener('click', async event => {
      event.preventDefault(); event.stopPropagation();
      const ok = await copyRememberedSelection();
      selectionBubble.textContent = ok ? pageText.selectionCopied : pageText.selectionFailed;
      selectionBubble.style.color = ok ? '#b5f36d' : '#ff9da7';
      clearTimeout(selectionBubbleTimer);
      selectionBubbleTimer = setTimeout(() => { hideSelectionBubble(); }, 1600);
    });
    document.documentElement.appendChild(selectionBubble);
  }
  selectionBubble.textContent = pageText.copySelection;
  selectionBubble.style.color = '#b5f36d';
  selectionBubble.style.display = 'block';
  selectionBubble.style.left = `${Math.max(8, Math.min(window.innerWidth - selectionBubble.offsetWidth - 8, rect.left + rect.width / 2 - selectionBubble.offsetWidth / 2))}px`;
  selectionBubble.style.top = `${Math.max(8, rect.top - selectionBubble.offsetHeight - 8)}px`;
}

function rememberAndShowSelection() {
  rememberSelection();
  clearTimeout(selectionBubbleTimer);
  selectionBubbleTimer = setTimeout(showSelectionBubble, 40);
}

document.addEventListener('mouseup', rememberSelection, true);
document.addEventListener('keyup', rememberSelection, true);
document.addEventListener('selectionchange', rememberSelection, true);
document.addEventListener('mouseup', rememberAndShowSelection, true);
document.addEventListener('keyup', rememberAndShowSelection, true);
window.addEventListener('scroll', hideSelectionBubble, true);

function pageData() {
  const title = clean(document.title);
  const description = clean(document.querySelector('meta[name="description"]')?.content || document.querySelector('meta[property="og:description"]')?.content);
  const headings = unique([...document.querySelectorAll('h1, h2, h3')].map(node => node.innerText)).slice(0, 12);
  const paragraphs = unique([...document.querySelectorAll('article p, main p, [role="main"] p, p')].map(node => node.innerText)).slice(0, 10);
  const links = [...document.querySelectorAll('main a[href], article a[href], a[href]')]
    .map(a => ({ text: clean(a.innerText), url: a.href }))
    .filter(a => a.text && a.url && !a.url.startsWith('javascript:'))
    .slice(0, 12);
  return { title, description, headings, paragraphs, links, url: location.href, host: location.host };
}

function formatInsight(data, lang = 'zh') {
  const t = PAGE_I18N[lang] || PAGE_I18N.en;
  const lines = [`${t.insightPrefix}: ${data.title || data.url}`, `${t.url}: ${data.url}`];
  if (data.description) lines.push(`\n${t.summary}: ${data.description}`);
  if (data.headings.length) lines.push(`\n${t.topics}:\n${data.headings.map(x => `- ${x}`).join('\n')}`);
  if (data.paragraphs.length) lines.push(`\n${t.passages}:\n${data.paragraphs.slice(0, 6).map(x => `- ${x}`).join('\n')}`);
  if (data.links.length) lines.push(`\n${t.links}:\n${data.links.map(x => `- ${x.text}: ${x.url}`).join('\n')}`);
  return lines.join('\n');
}

function fullText() {
  const clone = document.body.cloneNode(true);
  clone.querySelectorAll('script, style, noscript, nav, footer, header, aside, form, svg').forEach(node => node.remove());
  return clean(clone.innerText || clone.textContent).replace(/\s{2,}/g, '\n');
}

chrome.runtime.onMessage.addListener((message, sender, respond) => {
  if (message.action === 'extract-insight') {
    chrome.storage.sync.get({language:'auto'})
      .then(settings => respond({ text: formatInsight(pageData(), resolvePageLanguage(settings.language)) }))
      .catch(error => respond({ error: error.message }));
    return true;
  }
  if (message.action === 'copy-page') respond({ text: `${document.title}\n${location.href}\n\n${fullText()}` });
  if (message.action === 'selection') respond({ text: clean(window.getSelection()?.toString()) || lastSelection });
  if (message.action === 'page-data') respond({ data: pageData(), fullText: fullText() });
  return false;
});
})();
