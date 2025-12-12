// worker/src/auth.js
export async function validateApiKey(apiKey, env) {
  const user = await env.KV.get(`user:${apiKey}`);
  return user !== null;
}

export async function checkAndIncrementUsage(apiKey, env) {
  const today = new Date().toISOString().split('T')[0];
  const key = `usage:${apiKey}:${today}`;
  let count = await env.KV.get(key);
  count = count ? parseInt(count) + 1 : 1;

  if (count > 100) {
    throw new Error('Daily limit exceeded');
  }

  await env.KV.put(key, count.toString(), { expirationTtl: 86400 }); // 24 小時過期
}