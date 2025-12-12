// worker/modules/zh-TW/macro.js
export default async function generateMacroReport(env) {
  const prompt = `你是一位資深金融分析師。請以台灣投資人熟悉的語氣，用繁體中文分析最新美國總體經濟數據（GDP、通膨、聯準會利率），並提供簡明展望。輸出 JSON 格式：{"title": "...", "content": "...", "timestamp": "ISO8601"}`;

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