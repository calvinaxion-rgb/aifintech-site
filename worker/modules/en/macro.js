// worker/modules/en/macro.js
export default async function generateMacroReport(env) {
  const prompt = `You are a senior financial analyst. Analyze the latest US macro data (GDP, inflation, Fed rate) and provide a concise outlook. Use professional tone. Output in JSON: {"title": "...", "content": "...", "timestamp": "ISO8601"}`;

  const response = await fetch('https://api.groq.com/openapi/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.GROQ_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'llama3-70b-8192',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      response_format: { type: 'json_object' }
    })
  });

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}