// Hello.jsx = 화면 부품(컴포넌트) 한 개
// 컴포넌트 = JSX 돌려주는 함수. 이름은 대문자로 시작 (Hello)
//   소문자면 React가 일반 HTML 태그로 오해함

import './Hello.css'   // 이 부품 전용 꾸미기(CSS). .box 스타일 여기 있음

// props = 부모(App)가 넘겨준 값 보따리
//   App에서 <Hello name="철수" /> 하면 props.name 이 "철수"
const Hello = (props) => {
    return (
        // className (N 대문자). HTML의 class 를 JSX에선 className 으로 씀
        //   classname(소문자 n)이면 CSS 안 먹으니 주의
        <div className="box">
            {/* { } 안엔 JS 값. 넘어온 props.name 이 들어감 */}
            <h1>안녕! {props.name}!</h1>
            <p>반가워요 ㅎㅎ!!!</p>
        </div>
    )
}

// export default = 이 부품 밖으로 내보냄. App이 import로 가져다 씀
//   빠지면 빈 화면 (에러도 안 남)
export default Hello

// 정리
// 1. 컴포넌트 = 화면 찍는 도장 (함수 1개 = 부품 1개)
// 2. props    = 도장에 값 넘겨 다르게 찍기 (부모 -> 자식)
// 3. props.name = App이 넘긴 name 값 꺼내 쓰기
// 4. className = JSX의 class. Hello.css 의 .box 와 연결됨
