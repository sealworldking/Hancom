// Avatar.jsx = 사용자 아바타 부품(컴포넌트)
// 컴포넌트 = JSX 돌려주는 함수. 이름은 대문자로 시작 (Avatar)

// props = 부모(App)가 넘긴 값
//   name   = 이름 (글자)
//   online = 접속 상태 (true/false = 참/거짓, 불리언)
const Avatar = ({ name, online }) => {
    return (
        <div className="avatar">
            <h2>{name}</h2>

            {/* 조건부 렌더링 = online 값에 따라 다르게 표시 */}
            {/* online 이 true 면 앞(온라인), false 면 뒤(오프라인) */}
            <p>{online ? "🟢 온라인" : "⚫ 오프라인"}</p>
        </div>
    )
}

export default Avatar   // 밖으로 내보냄. App이 import로 가져다 씀

// 정리
// 1. online 은 불리언(true/false). App에서 online={true} 로 넘김
//    문자 아니라서 따옴표 없이 { } 안에 true/false 로 넘김
// 2. 조건 ? A : B  = 삼항 연산자. 조건 참이면 A, 거짓이면 B
//    online ? "온라인" : "오프라인"  -> true 면 온라인 글자
