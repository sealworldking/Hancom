require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const key = process.env.GROQ_API_KEY

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body   // [{role:'user', content:'...'}, ...] 전체 대화 기록

  const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + key
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages
    })
  })

  const data = await groqRes.json()
  const reply = data.choices?.[0]?.message?.content || '(응답 없음)'
  res.json({ reply })
})

app.listen(3000, () => console.log('http://localhost:3000'))
