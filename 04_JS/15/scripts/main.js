// 1. Dog 클래스 — 강아지를 찍어내는 "틀"
class Dog {
  constructor(name) {   // new로 만들 때 자동 호출, 받은 이름을 보관
    this.name = name;   // this = 지금 만들어지는 객체 자신
  }
  bark() {              // 메서드 — 모든 Dog 객체가 함께 쓰는 동작
    return `${this.name}: 멍멍!`;
  }
  trick(){
    if (this.name === "뽀삐") {
        return `${this.name}: (엎드린다)`;
    }
    else {
        return `${this.name}: (손을 준다)`;
    }
}}
  

// 2. 결과 칸 찾기
const out = document.querySelector("#out");

// 3. 틀로 객체(인스턴스) 두 개 찍어내기 (new)
const poppy = new Dog("뽀삐");   // 변수명은 의미 있게 (a·b 대신)
const choco = new Dog("초코");

// 4. 버튼 누르면 각 객체가 자기 이름으로 짖기 (화살표 함수)
document.querySelector("#bark").addEventListener("click", () => {
  out.textContent = `${poppy.bark()}  ${choco.bark()}`;
});

document.querySelector("#dothething").addEventListener("click", () => {
  out.textContent = `${poppy.trick()}  ${choco.trick()}`;
});

// 확장 학습 내용
// 원래는 bark() 메서드 하나에 "멍멍 시키기" 버튼만 있었음.
// -> Dog 클래스 안에 trick()이라는 메서드를 새로 추가해서 재롱도 부리게 확장함.
// - trick() 안에서 this.name으로 지금 이 개가 누군지 확인함 (poppy면 this.name이 "뽀삐").
// - if/else로 이름이 "뽀삐"면 "엎드린다", 아니면(초코면) "손을 준다"로 다른 대사 리턴.
// - 새 버튼(#dothething)에 addEventListener 하나 더 등록해서 trick() 호출과 연결함.
// - 핵심: 클래스 하나에 메서드를 여러 개 넣을 수 있고, 각 메서드 안에서
//   this로 "지금 호출한 그 객체"를 가리켜 객체마다 다른 결과를 낼 수 있음.