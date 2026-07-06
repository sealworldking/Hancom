// id=title 인 요소를 찾아서, 그 요소 자체를 title 이라는 상수에 담는 코드이다.
const title=document.querySelector("#title")
// . => ~의 라는 뜻으로 해석.
const btn=document.querySelector("#btn")

// 버튼을 누르면 title의 텍스트를 바꿔라.
btn.addEventListener("click",()=>{
    //제목이 바뀌는 로직
    title.textContent="Hello world";
});