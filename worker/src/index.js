// src/index.js
export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    
    // 簡單的路由測試
    if (url.pathname === '/test') {
      return new Response('Worker is working!', {
        headers: { 'Content-Type': 'text/plain' }
      });
    }
    
    // API 路由
    if (url.pathname.startsWith('/api')) {
      return new Response(JSON.stringify({ 
        message: 'API endpoint working',
        timestamp: new Date().toISOString()
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    // 預設回應
    return new Response('AIFinTech API Server', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
}