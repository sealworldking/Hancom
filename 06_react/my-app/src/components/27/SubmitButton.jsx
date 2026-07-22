
import { Button } from '@mui/material'

const SubmitButton = () => {
  return (
    <Button variant="contained" onClick={() => alert('안녕!')}>
      제출
    </Button>
  )
}

export default SubmitButton

// // MUI = 미리 만들어진 UI 부품 라이브러리
// 1. 설치: npm install @mui/material @emotion/react @emotion/styled
// 2. 가져오기: import { Button } from '@mui/material'
// 3. 쓰기: <Button variant="contained">제출</Button> — props로 모양만 지정
