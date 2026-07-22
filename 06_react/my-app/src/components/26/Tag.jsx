// 배열 = 재료 목록 / map = 자동 찍어내는 틀 / 재료 N개 -> 화면 요소 N개
// key = 각 요소 이름표 (필수, 없으면 경고)
const Tag=({tags})=>{
    return (
        <div>
            {/* tags(복수 배열)를 map으로 펼침. 요소 하나는 tag(단수) */}
            {tags.map((tag)=>(
                // key = 요소 구분용 이름표. "#"+tag = #HTML 형태로 붙여 표시
                <span key={tag}>{"#"+tag}</span>
            ))}
        </div>
    )
}

//   key 주의 — 값을 key로 쓰면 중복 값일 때 문제
//   list=["react","css","react"] → key "react" 2개 → React 경고, 목록 바뀔 때 버그
//   해결:
//   1) 실무 정답: 데이터에 고유 id → key={t.id}  (값 겹쳐도 id는 안 겹침)
//   2) 값+번호 조합: key={tag+i}
//   3) 최후 수단: key={i}  (목록 고정일 때만. 추가/삭제/정렬 있으면 위험)
//   지금 코드는 HTML/CSS/JS/REACT 다 달라서 key={tag} 안전

//  배열을 받아 map으로 각 요소를 같은 패턴에 넣어 개수만큼 자동 출력하는 것을 말한다.

export default Tag