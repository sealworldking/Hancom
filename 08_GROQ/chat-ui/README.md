# GROQ Chat (로컬 2-서버 버전)

원본 실습 버전. 백엔드(Express)와 프론트(Vite)를 각각 띄운다.

## 실행

터미널 2개 필요.

**터미널 1 — 백엔드** (상위 폴더 `08_GROQ`)
```bash
cd ..
node server.js          # http://localhost:3000
```

**터미널 2 — 프론트** (이 폴더)
```bash
npm install
npm run dev             # http://localhost:5173
```

프론트가 `http://localhost:3000/api/chat`(server.js)로 요청한다.
백엔드가 `08_GROQ/.env`의 `GROQ_API_KEY`를 사용한다.

> Vercel 서버리스 배포 버전은 별도 폴더(`My First Vercel`)에 있다.
