// 1. 관련된 값을 "이름표: 값" 쌍으로 묶어 person 객체 만들기
let person = {
  name: "콩이",   // 이름표(속성) name → 값 "콩이"
  age: 10         // 이름표(속성) age → 값 10
};

// 2. 결과 칸을 찾아 담기
const out = document.querySelector("#out");

// 3. 객체 값을 화면에 그리는 화살표 함수
// render 함수를 만드는 과정이다.
const render = () => {
  // 점(.)으로 값 읽기, 템플릿 리터럴로 조립
  out.textContent = `${person.name} (${person.age}살)`;
};
render();

// 나이 한 살 추가해주는 버튼
// 4. "나이 +1" 버튼 — 점(.)으로 age 값 바꾸기 (화살표 함수)
document.querySelector("#up").addEventListener("click", () => {
  person.age++;          // person.age = person.age + 1 과 같음
  render();
});

// 이름을 두부 <-> 콩이로 번갈아 바꿔주는 버튼.
// 5. "이름 바꾸기" 버튼 — 점(.)으로 name 값 바꾸기
document.querySelector("#rename").addEventListener("click", () => {
  if (person.name === "두부") {
    person.name = "콩이";
  } else {
    person.name = "두부";
  }
  render();
});

// < 확장 학습 내용 >
// 원래는 버튼 누르면 무조건 person.name = "두부"로 고정됐음.
// -> 09번(이미지 토글)에서 썼던 if/else 패턴을 가져와서 이름도 번갈아 바뀌게 확장함.
// - 지금 이름이 "두부"면 "콩이"로, 아니면(= "콩이"면) "두부"로 바꿈.
// - 핵심은 "현재 값을 먼저 확인하고, 그 값에 따라 반대 값으로 바꾼다"는 조건문 구조를
//   객체 속성(person.name)에도 똑같이 적용할 수 있다는 것.