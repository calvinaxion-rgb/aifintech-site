// public/js/i18n.js
export function getLang() {
  return localStorage.getItem('lang') || 
    (navigator.language.startsWith('zh-TW') || navigator.language.startsWith('zh-HK') ? 'zh-TW' : 
    navigator.language.startsWith('zh') ? 'zh-CN' : 'en');
}

export function setLang(lang) {
  localStorage.setItem('lang', lang);
}