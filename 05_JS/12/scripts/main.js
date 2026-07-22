// 입력받은 텍스트를 가져온다.(hello와 같은 텍스트)
const s=document.querySelector("#s");
// 결과를 보여줄 텍스트를 불러온다.
const out=document.querySelector("#out");

// 버튼을 누르면 생기는 일들을 설정.
document.querySelector("#go").addEventListener("click",()=>{
    // 입력받은 텍스트의 값을 text에 넣는다.
    const text=s.value;
    // 결과 보여주는 텍스트의 값을 수정해준다.
    out.innerHTML=
    // 입력받은 텍스트의 길이를 출력
        `글자 수(length): ${text.length}` + "<br>" +
    // 모든 문자를 대문자로 변환
        `대문자(toUpperCase): ${text.toUpperCase()}` + "<br>" +
    // e만 대문자로 바꾸기
        `e→E 바꾸기(replace): ${text.replace("e", "E")}`+ "<br>" +
    // 모든 l을 대문자로 바꾸기
        `e→E 전부 바꾸기(replaceAll): ${text.replaceAll("l", "L")}`;
});