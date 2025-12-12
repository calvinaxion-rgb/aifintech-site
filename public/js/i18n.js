// public/js/i18n.js
export function getLang() {
  return localStorage.getItem('lang') || 
    (navigator.language.startsWith('zh-TW') || navigator.language.startsWith('zh-HK') ? 'zh-TW' : 
    navigator.language.startsWith('zh') ? 'zh-CN' : 'en');
}

export function setLang(lang) {
  localStorage.setItem('lang', lang);
  // 廣播語言變更（供其他模組監聽）
  window.dispatchEvent(new CustomEvent('languageChanged', { detail: { lang } }));
}

// 自動設定初始語言
document.addEventListener('DOMContentLoaded', () => {
  const langSelect = document.getElementById('langSwitch');
  if (langSelect) {
    langSelect.value = getLang();
    langSelect.addEventListener('change', (e) => setLang(e.target.value));
  }
});