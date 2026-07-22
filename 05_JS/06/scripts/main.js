// flavor 값을 가져올 준비, result 값을 바꿀 준비를 하는 것.
const flavor=document.querySelector("#flavor");
const result=document.querySelector("#result");

document.querySelector("#calc").addEventListener("click",()=>{
  if(flavor.value==="chocolate"){
    result.textContent="와! 초코 아이스크림 좋아!";
  }
  else if(flavor.value==="vanilla"){
    result.textContent="바닐라도 깔끔하니 좋지!";
  }
  else{
    result.textContent="음... 그래도 초코가 최고인데...";
  }
});