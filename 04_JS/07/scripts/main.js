// multiply 라는 함수를 만들어주는 부분.
const multiply=(num1,num2)=>num1*num2;
// 4 부분
const a=document.querySelector("#a");
// 7 부분
const b=document.querySelector("#b");
// 곱하기 버튼을 눌러봐 부분. 결과를 알려주는 칸으로 바뀜.
const out=document.querySelector("#out");

//  a.value는 type="number"인 input이라도 항상 문자열(string) 타입으로 나오기 때문에, Number(a.value)와 같은 방식으로 불러와야 계산이 가능해진다.
document.querySelector("#calc").addEventListener("click",()=>{
  out.textContent=`${a.value} x ${b.value} = ${multiply(Number(a.value), Number(b.value))}`;
})