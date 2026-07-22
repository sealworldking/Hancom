require('dotenv').config()
const express = require('express')
const cors = require('cors')

const app = express()
app.use(cors())
// 이미지(base64 data URL)는 용량이 커서 기본 100kb 한도를 넘음. 25mb로 상향.
app.use(express.json({ limit: '25mb' }))

const key = process.env.GROQ_API_KEY

// 텍스트 전용 모델(빠름/저렴)과 비전 모델(이미지 인식)
const TEXT_MODEL = 'llama-3.1-8b-instant'
const VISION_MODEL = 'meta-llama/llama-4-scout-17b-16e-instruct'

// 항상 한국어로 답하도록 강제하는 시스템 지시
const SYSTEM_PROMPT = {
  role: 'system',
  content:
    '너는 한국어로만 답하는 어시스턴트다. 사용자가 어떤 언어로 묻든, 항상 자연스럽고 문법에 맞는 한국어로 답하라. ' +
    '코드, 명령어, 고유명사, 이미 영어인 기술 용어는 원문 그대로 두되, 설명 문장은 반드시 한국어로 작성하라.'
}

// messages 안에 이미지가 하나라도 있으면 true
const hasImage = (messages) =>
  messages.some(
    (m) =>
      Array.isArray(m.content) &&
      m.content.some((c) => c.type === 'image_url')
  )

app.post('/api/chat', async (req, res) => {
  const { messages } = req.body   // [{role, content}] — content는 문자열 또는 멀티모달 배열

  // 이미지 유무에 따라 모델 자동 선택
  const model = hasImage(messages) ? VISION_MODEL : TEXT_MODEL

  // 시스템 지시를 맨 앞에 붙여 항상 한국어로 답하게 함
  const withSystem = [SYSTEM_PROMPT, ...messages]

  try {
    const groqRes = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + key
      },
      body: JSON.stringify({ model, messages: withSystem })
    })

    const data = await groqRes.json()

    // Groq이 에러를 주면(모델 미지원, 용량 초과 등) 그대로 프론트에 노출
    if (data.error) {
      return res.status(groqRes.status).json({ reply: data.error.message })
    }

    const reply = data.choices?.[0]?.message?.content || '(응답 없음)'
    res.json({ reply })
  } catch (err) {
    res.status(500).json({ reply: '서버 오류: ' + err.message })
  }
})

app.listen(3000, () => console.log('http://localhost:3000'))
