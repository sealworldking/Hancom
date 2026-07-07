/*
===== JS 내장 객체 · 메서드 · 이벤트 총정리 =====
지금까지 배운 Math·String·Array·Object·JSON·Date·Number 메서드와 이벤트 목록을 한 곳에 모아둠.
실행용이 아니라 필요할 때 찾아보는 참고 카드임 (아래 내용을 그대로 실행하면 에러남 —
btn·input·form 같은 요소가 실제 페이지에 없어서. 필요할 때 찾아서 내 프로젝트에 맞게 옮겨 쓸 것).

--------------------------------------------------
【 내장 객체 메서드 】
--------------------------------------------------

// 【 MATH 】
Math.abs(-5) // 5
Math.round(4.5) // 5
Math.floor(4.9) // 4
Math.ceil(4.1) // 5
Math.max(1,5,3) // 5
Math.min(1,5,3) // 1
Math.random() // 0~1

// 【 STRING 】
"hello".toUpperCase() // "HELLO"
"HELLO".toLowerCase() // "hello"
"hello".length // 5
"hello".includes("ell") // true
"hello".charAt(0) // "h"
"hello".substring(0,3) // "hel"
"hello".split("") // ["h","e","l","l","o"]
"hello".replace("l","L") // "heLlo"
"  hello  ".trim() // "hello"

// 【 ARRAY 】
[1,2,3].length // 3
[1,2,3].push(4) // [1,2,3,4]
[1,2,3].pop() // 3
[1,2,3].shift() // 1
[1,2,3].unshift(0) // [0,1,2,3]
[1,2,3].join(",") // "1,2,3"
[1,2,3].map(x => x*2) // [2,4,6]
[1,2,3].filter(x => x>1) // [2,3]
[1,2,3].find(x => x>1) // 2
[1,2,3].includes(2) // true
[1,2,3].reverse() // [3,2,1]
[1,2,3].sort() // [1,2,3]

// 【 OBJECT 】
Object.keys({a:1,b:2}) // ["a","b"]
Object.values({a:1,b:2}) // [1,2]
Object.entries({a:1,b:2}) // [["a",1],["b",2]]

// 【 JSON 】
JSON.stringify({name:"John"}) // '{"name":"John"}'
JSON.parse('{"name":"John"}') // {name:"John"}

// 【 DATE 】
new Date() // 현재 날짜/시간
new Date().getFullYear() // 2026
new Date().getMonth() // 0~11
new Date().getDate() // 1~31
new Date().getDay() // 0~6 (0=일요일)
new Date().getTime() // 밀리초

// 【 NUMBER 】
Number("123") // 123
Number.isInteger(123) // true
(123).toString() // "123"
parseFloat("3.14") // 3.14
parseInt("123abc") // 123

--------------------------------------------------
【 이벤트 목록 】
--------------------------------------------------

// 【 클릭 / 더블클릭 】
btn.addEventListener("click", () => console.log("클릭됨"));
btn.addEventListener("dblclick", () => console.log("더블클릭"));

// 【 마우스 】
btn.addEventListener("mouseover", () => console.log("마우스 올림"));
btn.addEventListener("mouseout", () => console.log("마우스 떠남"));
document.addEventListener("mousemove", (e) => console.log(e.clientX, e.clientY));

// 【 입력 】
input.addEventListener("input", (e) => console.log(e.target.value));
input.addEventListener("change", (e) => console.log("변경됨:", e.target.value));

// 【 키보드 】
document.addEventListener("keydown", (e) => console.log("키:", e.key));
document.addEventListener("keyup", (e) => console.log("키 뗌:", e.key));

// 【 포커스 】
input.addEventListener("focus", () => console.log("포커스 받음"));
input.addEventListener("blur", () => console.log("포커스 떠남"));

// 【 폼 】
form.addEventListener("submit", (e) => { e.preventDefault(); console.log("제출됨"); });

// 【 페이지 】
document.addEventListener("DOMContentLoaded", () => console.log("페이지 로드"));
window.addEventListener("scroll", () => console.log("스크롤:", window.scrollY));
window.addEventListener("resize", () => console.log("창 크기:", window.innerWidth));

// 【 터치 (모바일) 】
element.addEventListener("touchstart", () => console.log("터치 시작"));
element.addEventListener("touchend", () => console.log("터치 끝"));
element.addEventListener("touchmove", () => console.log("터치 이동"));

--------------------------------------------------
【 실무 예시 10개 】
--------------------------------------------------

// 1. 검색 기능
const searchInput = document.querySelector("#search");
const searchBtn = document.querySelector("#search-btn");

searchBtn.addEventListener("click", () => {
  const keyword = searchInput.value.toLowerCase();
  const items = ["Apple", "Banana", "Orange"];
  const result = items.filter(item => item.toLowerCase().includes(keyword));
  console.log("검색결과:", result);
});

// 2. 목록 추가
const addBtn = document.querySelector("#add-btn");
let list = [];

addBtn.addEventListener("click", () => {
  const name = searchInput.value;
  if (!name) return;

  list.push({
    id: Math.floor(Math.random() * 10000),
    name: name.toUpperCase(),
    created: new Date().toLocaleDateString()
  });

  console.log("추가됨:", list);
  localStorage.setItem("list", JSON.stringify(list));
  searchInput.value = "";
});

// 3. 수정/삭제
const deleteBtn = document.querySelector("#delete-btn");
deleteBtn.addEventListener("click", () => {
  if (list.length > 0) {
    const deleted = list.pop();
    console.log("삭제됨:", deleted.name);
    localStorage.setItem("list", JSON.stringify(list));
  }
});

// 4. 정렬
const sortBtn = document.querySelector("#sort-btn");
sortBtn.addEventListener("click", () => {
  list.sort((a, b) => a.name.localeCompare(b.name));
  console.log("정렬됨:", list.map(x => x.name));
});

// 5. 통계
const statsBtn = document.querySelector("#stats-btn");
statsBtn.addEventListener("click", () => {
  const stats = {
    total: list.length,
    names: list.map(x => x.name),
    lengths: list.map(x => x.name.length),
    avgLength: Math.round(
      list.map(x => x.name.length).reduce((a,b) => a+b, 0) / list.length
    )
  };
  console.log("통계:", stats);
});

// 6. 데이터 로드
const loadBtn = document.querySelector("#load-btn");
loadBtn.addEventListener("click", () => {
  const saved = localStorage.getItem("list");
  if (saved) {
    const parsed = JSON.parse(saved);
    list.push(...parsed);
    console.log("로드됨:", list);
  }
});

// 7. 데이터 내보내기
const exportBtn = document.querySelector("#export-btn");
exportBtn.addEventListener("click", () => {
  const json = JSON.stringify(list, null, 2);
  console.log(json);
});

// 8. 실시간 입력
searchInput.addEventListener("input", (e) => {
  const text = e.target.value;
  console.log("입력중:", text);
  console.log("길이:", text.length);
  console.log("대문자:", text.toUpperCase());
});

// 9. 엔터키 입력
searchInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    console.log("엔터 눌림");
    addBtn.click();
  }
});

// 10. 무작위 선택
const randomBtn = document.querySelector("#random-btn");
randomBtn.addEventListener("click", () => {
  if (list.length === 0) return;
  const idx = Math.floor(Math.random() * list.length);
  console.log("선택됨:", list[idx].name);
});

--------------------------------------------------
【 핵심 포인트 】
--------------------------------------------------
- 이 카드는 실행용이 아니라 참고용 — btn·input·form 같은 요소가 실제로 없어서
  그대로 실행하면 에러남. 필요할 때 찾아서 내 프로젝트에 맞게 옮겨 쓰기.
- 괄호 ( ) 있으면 메서드, 없으면 속성 — .length vs .toUpperCase()
- 이벤트는 addEventListener("이벤트이름", 함수) 형태로 통일.
- 실무에서는 이 목록을 전부 외우기보다, 필요할 때 검색해서 찾아 쓰는 습관이 더 중요.

--------------------------------------------------
【 참고 링크 】
--------------------------------------------------
- MDN 전역 객체 — Math·String·Array·Object 등 전체 목록
- MDN 이벤트 레퍼런스 — 이벤트 종류 전체 목록
*/
