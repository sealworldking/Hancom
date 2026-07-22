// Greeting.jsx = 화면 부품(컴포넌트) 한 개
// 컴포넌트 = JSX 돌려주는 함수. 이름은 대문자로 시작 (Greeting)

import './Greeting.css'   // 이 부품 전용 꾸미기(CSS)

const Greeting = () => {
    return (
        // className (N 대문자). HTML의 class 를 JSX에선 className 으로 씀
        <div className="greeting">
            <h1>Hello! React</h1>
        </div>
    )
}

export default Greeting   // 밖으로 내보냄. App이 import로 가져다 씀
