const $ = selector => document.querySelector(selector);
const messages = {
  'zh-CN': { title:'Extract page info with one click', subtitle:'把网页变成可直接使用的信息', insight:'提取重要信息', insightHint:'标题、主题、摘要、关键段落和链接', page:'复制当前页面', pageHint:'复制清理后的完整正文', selection:'复制选中内容', selectionHint:'保留你当前选中的文字', shortcut:'快捷键', shortcutText:'Ctrl / ⌘ + Shift + I 提取信息 · Ctrl / ⌘ + Shift + Y 复制页面', privacy:'内容只在本地处理，不上传页面数据', copied:'已成功复制到剪贴板', copyFailed:'复制失败，请重试或检查浏览器权限', none:'当前页面没有选中文本' },
  'en': { title:'Extract page info with one click', subtitle:'Turn any page into usable information', insight:'Extract key information', insightHint:'Title, topics, summary, passages and links', page:'Copy current page', pageHint:'Copy a cleaned version of the page', selection:'Copy selection', selectionHint:'Keep the text you selected', shortcut:'Shortcuts', shortcutText:'Ctrl / ⌘ + Shift + I extract · Ctrl / ⌘ + Shift + Y copy page', privacy:'Processed locally. Page data is never uploaded.', copied:'Copied to clipboard', copyFailed:'Copy failed. Try again or check browser permissions.', none:'No text is selected' },
  'ja': { title:'Extract page info with one click', subtitle:'ページを使える情報に変換', insight:'重要情報を抽出', insightHint:'タイトル、テーマ、要約、本文、リンク', page:'現在のページをコピー', pageHint:'整理した本文をコピー', selection:'選択範囲をコピー', selectionHint:'選択したテキストを保持', shortcut:'ショートカット', shortcutText:'Ctrl / ⌘ + Shift + I 抽出 · Ctrl / ⌘ + Shift + Y コピー', privacy:'ローカル処理。ページデータは送信されません。', copied:'クリップボードにコピーしました', copyFailed:'コピーに失敗しました。再試行してください。', none:'テキストが選択されていません' }
};
let lang = resolvePageLanguage('auto');
let t = PAGE_I18N[lang] || messages[lang];
function renderLanguage() { const ids=['appTitle','subtitle','insightLabel','insightHint','pageLabel','pageHint','selectionLabel','selectionHint','shortcutTitle','shortcutText','privacy']; const keys=['title','subtitle','insight','insightHint','page','pageHint','selection','selectionHint','shortcut','shortcutText','privacy']; ids.forEach((id, i) => { $('#'+id).textContent = t[keys[i]]; }); }
renderLanguage();
const languageReady = chrome.storage.sync.get({language:'auto'}).then(settings => { lang=resolvePageLanguage(settings.language); t=PAGE_I18N[lang]; renderLanguage(); });
let toastTimer;
const toast = (message, type='success') => { const box=$('#copyToast'); $('#toastIcon').textContent=type==='success'?'✓':'!'; $('#toastText').textContent=message; box.className=`copy-toast show ${type}`; clearTimeout(toastTimer); toastTimer=setTimeout(()=>box.className='copy-toast',2600); };
async function copy(text) {
  if (!text) { toast(t.copyFailed, 'error'); return false; }
  try { if (!navigator.clipboard?.writeText) throw new Error('clipboard API unavailable'); await navigator.clipboard.writeText(text); toast(t.copied); return true; }
  catch {
    try { const area=document.createElement('textarea'); area.value=text; area.style.position='fixed'; area.style.opacity='0'; document.body.appendChild(area); area.focus(); area.select(); const ok=document.execCommand('copy'); area.remove(); if(!ok) throw new Error('copy command failed'); toast(t.copied); return true; }
    catch { toast(t.copyFailed, 'error'); return false; }
  }
}
chrome.tabs.query({ active:true, currentWindow:true }, tabs => { const tab=tabs[0]; $('#pageTitle').textContent=tab?.title||'—'; try { $('#pageHost').textContent=new URL(tab.url).host; $('#favicon').textContent=(new URL(tab.url).hostname||'◎')[0].toUpperCase(); } catch {} });
document.querySelectorAll('.action').forEach(button => button.addEventListener('click', async () => {
  await languageReady;
  document.querySelectorAll('.action').forEach(item => item.classList.remove('is-active'));
  button.classList.add('is-active');
  button.focus({ preventScroll: true });
  const action=button.dataset.action;
  try {
    const [tab]=await chrome.tabs.query({active:true,currentWindow:true});
    const response=await requestPage(tab?.id, action==='insight'?'extract-insight':action==='page'?'copy-page':'selection');
    if(action==='selection' && !response?.text) return toast(t.none, 'error');
    if(response?.text) await copy(response.text); else toast(t.copyFailed, 'error');
  } catch (error) { toast(`${t.copyFailed} (${error.message})`, 'error'); }
}));
$('#settings').addEventListener('click',()=>chrome.runtime.openOptionsPage());
