const express = require('express')
const cors = require('cors')        // npm install cors (최초 1회)
const app = express()

// 미들웨어 = 모든 요청이 라우트 전에 위→아래 순서대로 거침 (라우트 위에 둠)
app.use(cors())            // 다른 포트(프론트 5173 등) 허용
app.use(express.json())    // POST body → req.body 객체로 해석
app.use((req, res, next) => {       // 직접 만든 미들웨어
  console.log(req.method, req.url)  // 모든 요청 로그 찍기
  next()                            // 다음으로 넘김 (안 부르면 여기서 멈춤)
})

// 미들웨어 다 거친 뒤 라우트 실행
app.get('/api/users', (req, res) => res.json([{ id: 1, name: '지니' }]))

app.listen(3000, () => console.log('http://localhost:3000/api/users'))
