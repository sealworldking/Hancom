// React에서 useState 라는 도구를 빌려온다.(숫자 기억하기용 도구임)
import { useState } from 'react'

// Counter 라는 이름의 부품을 만들기 시작한다.
// 부품은 이렇게 생겼어. 라고 설명 시작하는 코드이다.
const Counter = () => {
    // 상자를 만듦.(처음값은 0)
  const [count, setCount] = useState(0)
    // 이제 화면에 뭘 보여줄 것인가? 시작
  return (
    // React에서 여러 개를 묶기 뮈해 감싸는 것임. (<>)
    <>
      <button onClick={() => setCount(c => c + 1)}>+1</button>   {/* 올리기 */}
      <span>{count}</span>
      <button onClick={() => setCount(c => c - 1)}>-1</button>   {/* 내리기 */}
      <button 
        onClick={() => setCount(0)}
        style={{marginTop:"20px"}}
      >리셋</button>
    </>
  )
}

export default Counter
