# Chrome Web Store listing copy

## English

### Short description

Extract page titles, summaries, key topics, passages, links, and selected text with one click—all processed locally.

### Detailed description

Extract page info with one click turns a busy webpage into clean, reusable notes in seconds.

Features:

- Extract the page title, description, key headings, useful passages, and relevant links.
- Copy the cleaned text of the current page with one click.
- Copy selected text from the popup or from the floating action beside your selection after activating the extension on that page.
- Use keyboard shortcuts: Ctrl/⌘ + Shift + I to extract page information and Ctrl/⌘ + Shift + Y to copy the page.
- Choose from multiple interface languages, including English, Simplified Chinese, Japanese, Korean, Spanish, French, German, Portuguese, and Russian.
- Get clear success and failure feedback for every copy action.

Privacy:

Page content is processed locally in your browser. This extension does not upload page content to the publisher or require an account. Bundled page code is injected only after you choose a popup action or invoke an extension shortcut. Selection listening and the floating copy button then run in that document until it is reloaded or closed. No persistent host permissions or automatic content scripts are declared. Language and privacy preferences use browser sync storage and may be synchronised by your browser provider; page content is not saved to sync storage.

Permissions:

- Active tab and scripting are used to read the current page after you choose an action.
- No host_permissions, optional host permissions, or all-sites content_scripts are requested. The floating selection-copy button is enabled only in a document you explicitly activate.
- Storage is used to save your language and privacy preferences.
- Clipboard write is used only when you request a copy action.

### Reviewer test instructions

1. Open a normal article or search-results page.
2. Click the extension icon and choose “Extract key information” to copy a structured summary.
3. Choose “Copy current page” to copy cleaned page text.
4. After step 2 or 3, select text on the same page and use the floating “Copy selection” button, or use the popup action.
5. Open Settings to change the interface language and repeat a copy action.

## 中文

### 简短说明

一键提取网页标题、摘要、主题、关键段落、链接和选中文字，所有内容均在本地处理。

### 详细说明

Extract page info with one click 可以在几秒内把复杂网页整理成干净、可复用的文字信息。

- 提取页面标题、简介、关键标题、正文要点和相关链接。
- 一键复制清理后的当前页面正文。
- 支持从弹窗或网页选区旁的浮动按钮复制选中文字。
- 支持快捷键提取和复制页面。
- 支持中文、英语、日语、韩语、西班牙语、法语、德语、葡萄牙语和俄语。
- 每次复制操作都会显示成功或失败提示。

页面内容只在浏览器本地处理，不上传给发布者，也不要求用户注册账号。扩展不申请持久主机权限，不自动加载覆盖所有网站的内容脚本。仅在点击弹窗功能按钮或触发扩展快捷键后，才向当前标签页注入本地脚本；之后该文档才会监听选区并显示浮动复制按钮，直到刷新或关闭。语言与隐私偏好使用浏览器同步存储，启用同步后可能由浏览器提供商跨设备同步；网页正文不写入同步存储。

## 1.3.1 审核权限说明（可复制）

### activeTab

仅在用户点击扩展弹窗中的提取、复制功能按钮或触发扩展快捷键时，临时访问当前标签页，读取完成操作所需的标题、网址、网页正文和选中文字。不后台访问其他标签页，不申请所有网站的持久访问权限。

### scripting

配合 activeTab 临时授权，在用户明确操作后向当前标签页注入安装包内的本地脚本，用于提取网页信息、复制文字和启用该文档的浮动选区复制功能。文档刷新或关闭后脚本结束，新文档需要用户再次操作。

### storage

保存界面语言和设置偏好。使用浏览器同步存储，启用同步时可能由浏览器提供商跨设备同步设置；不保存网页正文或选中文字。

### clipboardWrite

仅在用户请求复制时，将提取的信息、网页文字或选中文字写入剪贴板，不读取剪贴板原有内容。

### 主机权限及远程代码

1.3.1 未声明 host_permissions、optional_host_permissions 或覆盖网站的 content_scripts。所有可执行代码随安装包提供，不使用远程代码。请上传 1.3.1 安装包后重新检查开发者后台的权限表单；本地改动不会自动更新已上传的 1.3.0 软件包。
