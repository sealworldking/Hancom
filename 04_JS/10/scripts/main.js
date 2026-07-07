const greet=document.querySelector("#greet");
const input=document.querySelector("#name");

// saved에 localStorage에서 name 키로 저장된 값을 가져오는 코드이다.
const saved=localStorage.getItem("name");
// 만약 불러올 값이 없다면, 즉 저장된 값이 없다면
if(saved){
    greet.textContent=`안녕, ${saved}!`;
}

// 저장 버튼을 누르면 할 것
document.querySelector("#save").addEventListener("click",()=>{
    const myName=input.value;
    if(!myName){
        return;
    }
    // 브라우저에 이름을 저장해서, 새로고침해도 안사라지게 하는 코드
    localStorage.setItem("name",myName);
    // greet 내부 텍스트의 값을 안녕, '이름'으로 바꾸는 코드.
    greet.textContent=`안녕, ${myName}!`;
});

// 리셋 버튼을 누르면 삭제.
document.querySelector("#reset").addEventListener("click",()=>{
    localStorage.removeItem("name");
    greet.textContent="안녕하세요!";
})

// 실제로, 페이지에서 개발자도구에서 Application 의 Local Storage에서 내 이름이 생겼다가 사라지는 것을 확인하였다.