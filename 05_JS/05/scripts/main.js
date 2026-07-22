// const = constant(상수) 줄임말. 변수 선언 키워드 중 하나, 한번 값 넣으면 재할당 못 함.
// 이거는 id="a"인 요소를 찾아서, 그 요소 자체를 a라는 변수(재할당 불가)에 담아라. 라는 뜻.
const a=document.querySelector("#a");
const b=document.querySelector("#b");
const op=document.querySelector("#op");
const out=document.querySelector("#out");

// id="calc"인 요소(계산 버튼) 찾아서, 거기다 "클릭하면 실행할 함수" 등록해라
document.querySelector("#calc").addEventListener("click", () => {
  // Number( ): 입력칸 글자 "3"을 숫자 3으로 바꾸기
  const x = Number(a.value);
  const y = Number(b.value);
  let result;   // 결과는 나중에 정해지니 let
  // 3. 고른 기호(op)에 따라 다른 연산자로 계산 (=== 는 같은지 비교)
  if (op.value === "+") { result = x + y; }
  else if (op.value === "-") { result = x - y; }
  else if (op.value === "*") { result = x * y; }
  else { result = x / y; }
  // 템플릿 리터럴로 "3 + 5 = 8" 같은 문장 조립
  out.textContent = `${x} ${op.value} ${y} = ${result}`;
});