// Badge.jsx = 뱃지 부품(컴포넌트)
// props: text(글자), type("new" 또는 "not")

import './Badge.css'   // 이 부품 전용 꾸미기

const Badge = ({ text, type }) => {
    return (
        // 삼항 연산자로 className 자체를 바꿈
        //   type === "new" 참  -> "badge green" (초록)
        //   거짓            -> "badge red"   (빨강)
        <p className={type === "new" ? "badge green" : "badge red"}>
            {text}
        </p>
    )
}

export default Badge
