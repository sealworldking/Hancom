// 횟수 입력
const n=document.querySelector("#n");
// 출력되는 문장.
const out=document.querySelector("#out");

// '반복' 버튼을 클릭하면 생길 일들.
document.querySelector("#run").addEventListener("click",()=>{
    // 이전에 있었던 li를 모두 삭제하는 코드이다. 지우지 않으면 이전에 있었던 리스트에 추가되므로, 꼭 해줘야 한다.
    out.innerHTML="";
    // 입력한 반복 횟수를 저장.
    const count=Number(n.value);
    // for 문장 문법을 알아두는 것이 중요하다.
    for(let i=1;i<=count;i++)
    {
        // 새로운 li문을 만든다.
        const li=document.createElement("li");
        // li에 들어갈 내용들
        li.textContent=`${i}번째 🍎`;
        // out 안에 넣어서 보이도록 한다.
        out.appendChild(li);
    }
});

document.querySelector("#down").addEventListener("click",()=>{
    out.innerHTML="";
    let i=Number(n.value);
    while(i>0){
        const li=document.createElement("li");
        li.textContent=i;
        out.appendChild(li);
        i--;
    }
});

// 반복문 문법 요약
// for(초기값; 조건; 증감){ ... }
//   - 초기값: i=1 처럼 시작값 한 번만 설정
//   - 조건: i<=count 가 참인 동안 계속 반복
//   - 증감: 한 바퀴 끝날 때마다 i++ 실행
//   예) for(let i=1;i<=count;i++){ ... } -> count번 반복하며 i가 1,2,3...으로 증가
//
// while(조건){ ... }
//   - 조건이 참인 동안 계속 반복 (반복 횟수를 미리 안 정해도 됨)
//   - 조건이 언젠가 거짓이 되도록 몸통 안에서 값을 바꿔줘야 함 (안 그러면 무한루프)
//   예) while(i>0){ ...; i-- } -> i가 0이 될 때까지 반복하며 1씩 감소
//
// for vs while
//   - 반복 횟수가 정해져 있으면 for가 편함 (count번 돌린다 같은 경우)
//   - 조건만 있고 몇 번 돌지 모르면 while이 편함
//
// out.innerHTML="" : 반복 시작 전에 기존 <li>들을 싹 지움
//   - 안 지우면 버튼 누를 때마다 이전 목록 위에 계속 쌓임