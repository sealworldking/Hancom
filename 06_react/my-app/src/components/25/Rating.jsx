const Rating=({score})=>{
    return (
        <div>
            {/* Array(5) = 빈 구멍 5개를 만든다.
            // 그 후 ...(스프레드)로 undefined 채워 진짜 배열 만듦.
            // 이후 .map((_, i))로 반복, 번호 i 써서 이모티콘 채움. _는 안 쓰는 값 자리. */}
            {[...Array(5)].map((_, i)=>
                <span key={i}>{i<score ?"⭐":"🌙"}</span>
            )}
        </div>
    )
}

export default Rating