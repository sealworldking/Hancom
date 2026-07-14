import { useState, useRef, useEffect } from 'react'
import './App.css'

function App() {
  const [messages, setMessages] = useState([])   // {role:'user'|'assistant', content:'...'}
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const logRef = useRef(null)

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight })
  }, [messages, loading])

  const sendMessage = async () => {
    if (!input.trim() || loading) return

    const nextMessages = [...messages, { role: 'user', content: input }]
    setMessages(nextMessages)
    setInput('')
    setLoading(true)

    const res = await fetch('http://localhost:3000/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: nextMessages })
    })
    const data = await res.json()

    setMessages([...nextMessages, { role: 'assistant', content: data.reply }])
    setLoading(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') sendMessage()
  }

  return (
    <div className="chat-wrap">
      <div className="chat-header">GROQ Chat</div>
      <div className="chat-log" ref={logRef}>
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.content}
          </div>
        ))}
        {loading && <div className="bubble assistant">생각 중...</div>}
      </div>

      <div className="input-row">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
        />
        <button onClick={sendMessage} disabled={loading}>전송</button>
      </div>
    </div>
  )
}

export default App
