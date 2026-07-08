// 시작 화면: 진행 상태 뱃지 표시
const progress = getProgress();

document.querySelectorAll("#menu .menu-card[data-key]").forEach((card) => {
  const key = card.dataset.key;
  if (progress[key]) {
    card.classList.add("done");
  }
});

// ===== 말풍선: 다음 학습 미리보기 + 클릭 유도 =====
const lessonFacts = {
  array: [
    "배열은 순서대로 값을 늘어놓고 번호(인덱스)로 바로 찾는 자료구조야",
    "배열은 인덱스만 알면 값 하나를 한 번에 꺼낼 수 있어",
    "배열 정렬은 옆 칸끼리 비교해서 순서를 맞추는 작업이야",
    "배열은 크기가 정해져 있어서 값이 촘촘하게 붙어 있어",
  ],
  stack: [
    "스택은 마지막에 넣은 값이 제일 먼저 나오는 구조야 (LIFO)",
    "스택은 접시를 쌓듯 위에서부터 넣고 위에서부터 빼",
    "스택은 되돌리기(Ctrl+Z) 기능에 자주 쓰이는 구조야",
    "스택은 함수 호출 순서를 기억하는 데도 쓰여",
  ],
  queue: [
    "큐는 먼저 넣은 값이 먼저 나오는 구조야 (FIFO)",
    "큐는 줄 서기랑 똑같아. 먼저 온 사람이 먼저 나가",
    "큐는 대기열이나 작업 순서 관리에 자주 쓰여",
    "큐는 한쪽으로 넣고 반대쪽으로 빼는 구조야",
  ],
  linkedlist: [
    "연결리스트는 각 칸이 다음 칸을 손가락으로 가리키며 줄줄이 이어져 있어",
    "연결리스트는 중간에 끼워넣거나 빼기가 배열보다 훨씬 쉬워",
    "연결리스트는 메모리에 흩어져 있어도 순서대로 이어질 수 있어",
    "연결리스트는 크기가 고정돼 있지 않아서 자유롭게 늘어나",
  ],
};

const lessonOrder = ["array", "stack", "queue", "linkedlist"];

const hookTemplates = [
  (fact) => `${fact}. 아직 안 해봤지? 카드 눌러서 학습해보자.`,
  (fact) => `${fact}. 궁금하면 아래 카드를 눌러봐.`,
  (fact) => `${fact}. 더 많은 정보는 카드를 클릭해서 직접 확인해봐.`,
  (fact) => `${fact}. 5분이면 끝나. 지금 바로 학습해보지 않을래?`,
  (fact) => `${fact}. 말로만 들으면 감이 안 와. 카드를 눌러서 실습 해보자.`,
  (fact) => `${fact}. 흥미롭지? 다음 카드를 눌러서 바로 학습해보자.`,
  (fact) => `${fact}. 지금 모르고 넘어가면 평생 몰라. 지금 바로 학습하자.`,
  (fact) => `${fact}. 직접 실습 해보면 훨씬 오래 기억이 남아. 지금 바로 해보자.`,
  (fact) => `${fact}. 뇌에 지식이 차오르는 기쁨을 느껴봐! 카드 클릭!`,
  (fact) => `${fact}. 지금이 공부하기 딱 좋은 타이밍. 카드를 클릭해보자!`,
];

const doneMessages = [
  "네 개 다 해봤네! 새 학습 열리면 또 놀러와.",
  "여기까진 완주. 잊어버렸으면 카드 눌러서 복습해도 좋아.",
  "네 파트 클리어. 다음 학습 열릴 때까지 잠깐 쉬어가자.",
  "대단한데? 자료구조 네 개를 다 정복했어.",
  "여기까지 온 사람 많지 않아. 진짜 잘했어.",
  "포기 안 하고 끝까지 한 거, 그게 진짜 실력이야.",
];

const bubbleEl = document.querySelector(".bubble");
const nextKey = lessonOrder.find((key) => !progress[key]);

if (bubbleEl) {
  const facts = nextKey ? lessonFacts[nextKey] : [];
  let templateIndex = Math.floor(Math.random() * hookTemplates.length);
  let factIndex = Math.floor(Math.random() * facts.length);
  let doneIndex = Math.floor(Math.random() * doneMessages.length);

  const render = () => {
    if (nextKey) {
      bubbleEl.textContent = hookTemplates[templateIndex](facts[factIndex]);
    } else {
      bubbleEl.textContent = doneMessages[doneIndex];
    }
  };

  render();

  if (nextKey) {
    const targetCard = document.querySelector(`.menu-card[data-key="${nextKey}"]`);
    if (targetCard) targetCard.classList.add("suggest");
  }

  bubbleEl.classList.add("clickable");
  bubbleEl.addEventListener("click", () => {
    if (nextKey) {
      templateIndex = (templateIndex + 1) % hookTemplates.length;
      factIndex = (factIndex + 1) % facts.length;
    } else {
      doneIndex = (doneIndex + 1) % doneMessages.length;
    }
    render();
  });
}
