// backend/server.js
const express = require('express');
const fetch = require('node-fetch');
const bodyParser = require('body-parser');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
require('dotenv').config();
const app = express();
app.use(helmet());
app.use(bodyParser.json({ limit: '2mb' }));
const limiter = rateLimit({ windowMs: 60*1000, max: 60 });
app.use(limiter);
const OPENAI_KEY = process.env.OPENAI_API_KEY;
const PORT = process.env.PORT || 3001;
if (!OPENAI_KEY) console.warn('OPENAI_API_KEY not set');

app.get('/health', (req, res) => res.json({ ok: true }));

app.post('/api/parse-resume', async (req, res) => {
  const { text } = req.body;
  if (!text || text.length < 30) return res.status(400).json({ error: 'resume text required' });
  const prompt = `Extract a JSON object with keys: title, company, location, salary, description, skills (array), experience_years (number) from the resume text. If values are missing, provide reasonable guesses. Output only valid JSON.\n\nResume:\n${text.slice(0,5000)}`;
  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({ model: 'gpt-4o-mini', messages:[{role:'user',content:prompt}], max_tokens:600, temperature:0.1 })
    });
    if (!resp.ok) {
      const txt = await resp.text();
      console.error('OpenAI error', resp.status, txt);
      return res.status(502).json({ error: 'LLM provider error' });
    }
    const j = await resp.json();
    let content = j?.choices?.[0]?.message?.content || j?.choices?.[0]?.text || '';
    try {
      const parsed = JSON.parse(content);
      return res.json(parsed);
    } catch(e){
      const m = content.match(/\{[\s\S]*\}/);
      if (m) { try { return res.json(JSON.parse(m[0])); } catch(e2){} }
      return res.json({ title: 'Suggested role', company: 'Self', description: content });
    }
  } catch(err){
    console.error('Server error', err);
    return res.status(500).json({ error: 'server error' });
  }
});

app.post('/api/generate-job', async (req,res) => {
  const { title, bullets = [], tone = 'professional' } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const prompt = `Write a clear job description for the role: "${title}".\n\nBullets:\n${bullets.map(b=>'- '+b).join('\n')}\n\nTone: ${tone}`;
  try {
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method:'POST',
      headers:{ 'Content-Type':'application/json', Authorization: `Bearer ${OPENAI_KEY}` },
      body: JSON.stringify({ model:'gpt-4o-mini', messages:[{role:'user', content:prompt}], max_tokens:600 })
    });
    const j = await resp.json();
    const description = j?.choices?.[0]?.message?.content || j?.choices?.[0]?.text || '';
    res.json({ description });
  } catch(e){
    console.error(e);
    res.status(500).json({ error: 'LLM request failed' });
  }
});

app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
