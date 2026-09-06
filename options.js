const language=document.querySelector('#language'), privacyMode=document.querySelector('#privacyMode');
[['ko','한국어'],['es','Español'],['fr','Français'],['de','Deutsch'],['pt','Português'],['ru','Русский']].forEach(([value,label])=>{if(!language.querySelector(`option[value="${value}"]`)){const option=document.createElement('option');option.value=value;option.textContent=label;language.appendChild(option);}});
chrome.storage.sync.get({language:'auto',privacyMode:true}, settings=>{language.value=settings.language;privacyMode.checked=settings.privacyMode;});
language.addEventListener('change',()=>chrome.storage.sync.set({language:language.value}));
privacyMode.addEventListener('change',()=>chrome.storage.sync.set({privacyMode:privacyMode.checked}));
