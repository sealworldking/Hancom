// Profile.jsx = 화면 부품(컴포넌트) 한 개
// 컴포넌트 = JSX 돌려주는 함수. 이름은 대문자로 시작 (Profile)

import './Profile.css'   // 이 부품 전용 꾸미기. 안 하면 CSS 안 먹음

// props = 부모(App)가 넘겨준 값 보따리
//   App에서 <Profile name="김대진" job="웹 프론트" /> 하면
//   props.name 이 "김대진", props.job 이 "웹 프론트"
const Profile = (props) => {
    return (
        <div className="profile">
            {/* { } 안엔 JS 값. 넘어온 props 값이 들어감 */}
            <h1>{props.name}</h1>
            <p>{props.job}</p>
        </div>
    )
}

export default Profile   // 밖으로 내보냄. App이 import로 가져다 씀
