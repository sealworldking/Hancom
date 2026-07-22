let n=0;
const plus=document.querySelector("#plus");
const minus=document.querySelector("#minus");
const out=document.querySelector("#count");

// 화면 갱신 코드를 함수로 뽑아둠 (중복 제거)
function update(){
  out.textContent=`${n}번 눌렀어요`;
}

plus.addEventListener("click",() =>{
  n++;
  update();
})
minus.addEventListener("click",() =>{
  n--;
  update();
})

// < 확장 학습 내용 >
// 1. 버튼을 2개(plus, minus)로 늘려서 addEventListener를 두 번 등록함.
//    - 각 버튼마다 별도의 이벤트 리스너를 붙여서 서로 다른 동작(증가/감소)을 하게 만듦.
// 2. plus는 n++ (n = n + 1), minus는 n-- (n = n - 1)로 값을 반대로 바꿈.
// 3. out.textContent 갱신 코드를 update() 함수 처리하여 중복 제거함.
//    - 두 리스너가 각자 out.textContent를 직접 쓰던 것을 update() 호출로 통일.
//    - 표시 형식 바꾸고 싶으면 update() 함수 한 곳만 고치면 됨.
// 4. 함수: 반복되는 코드를 이름 붙여 한 군데 모아두고, 필요할 때마다 그 이름만 불러서 update() 실행하는 것.
//    - update() : 이름을 불러서 묶음 안의 코드를 실행함.
//    - 덕분에 표시 형식을 바꿀 때 update() 함수 한 줄만 고치면 plus/minus 양쪽에 다 적용됨.