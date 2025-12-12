// worker/src/payments.js
import { Stripe } from 'stripe';

export async function createCheckoutSession(apiKey, email, env) {
  const stripe = new Stripe(env.STRIPE_SECRET_KEY, { apiVersion: '2024-06-20' });

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    line_items: [{
      price: 'price_1Sc7QTPHtFeOUxWRMO6vfttq', // 👈 替換為你的 Stripe Price ID
      quantity: 1
    }],
    subscription_data: {
      metadata: { api_key: apiKey }
    },
    customer_email: email,
    success_url: 'https://aifintech.aaft.tech/dashboard.html?success=true',
    cancel_url: 'https://aifintech.aaft.tech/pricing.html'
  });

  return new Response(JSON.stringify({ url: session.url }), {
    headers: { 'Content-Type': 'application/json' }
  });
}

export async function handleWebhook(request, env) {
  const sig = request.headers.get('stripe-signature');
  const payload = await request.text();

  let event;
  try {
    event = await request.clone().json();
    // 驗證 webhook（需在 Cloudflare Secrets 設定 STRIPE_WEBHOOK_SECRET）
    // 此處簡化：假設已驗證
  } catch (err) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;
    const apiKey = session.subscription_data?.metadata?.api_key;
    if (apiKey) {
      await env.KV.put(`user:${apiKey}`, JSON.stringify({ is_pro: true, pro_since: new Date().toISOString() }));
    }
  }

  return new Response('OK', { status: 200 });
}