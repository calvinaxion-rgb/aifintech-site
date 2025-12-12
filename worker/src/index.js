// worker/src/index.js
import { createCheckoutSession, handleWebhook } from './payments.js';
import { validateApiKey, checkAndIncrementUsage } from './auth.js';

// 模組動態載入（簡化：直接 import）
import * as enModules from '../modules/en/index.js';
import * as zhCNModules from '../modules/zh-CN/index.js';
import * as zhTWModules from '../modules/zh-TW/index.js';

const MODULES = {
  en: enModules,
  'zh-CN': zhCNModules,
  'zh-TW': zhTWModules
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const path = url.pathname;

    // 路由：創建 Stripe 付費頁面
    if (path === '/api/create-checkout-session' && request.method === 'POST') {
      const { apiKey, email } = await request.json();
      return createCheckoutSession(apiKey, email, env);
    }

    // 路由：Stripe Webhook（付款成功通知）
    if (path === '/webhook' && request.method === 'POST') {
      return handleWebhook(request, env);
    }

    // 路由：獲取 AI 內容（/api/v1/zh-TW/macro）
    if (path.startsWith('/api/v1/')) {
      const parts = path.split('/');
      const lang = parts[3]; // en, zh-CN, zh-TW
      const module = parts[4]; // macro, stocks, etc.

      if (!['en', 'zh-CN', 'zh-TW'].includes(lang) || !module) {
        return new Response('Invalid language or module', { status: 400 });
      }

      const apiKey = request.headers.get('X-API-Key') || 'demo';
      if (apiKey !== 'demo') {
        const isValid = await validateApiKey(apiKey, env);
        if (!isValid) return new Response('Invalid API Key', { status: 403 });
        await checkAndIncrementUsage(apiKey, env);
      }

      try {
        const content = await MODULES[lang][module]?.(env) || { title: module, content: 'Module not implemented' };
        return new Response(JSON.stringify(content), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (e) {
        return new Response(JSON.stringify({ error: e.message }), { status: 500 });
      }
    }

    return new Response('Not Found', { status: 404 });
  }
};