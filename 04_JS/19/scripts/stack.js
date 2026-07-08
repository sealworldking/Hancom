initSteps();

const randomNums = (count, max) => {
  const pool = [];
  for (let i = 1; i <= max; i++) pool.push(i);
  return shuffle(pool).slice(0, count);
};

// ===== Step 2: 시연 (수동 진행) =====
const demoTower = document.querySelector("#demo-tower");
const demoStatus = document.querySelector("#demo-status");
const demoNextBtn = document.querySelector("#demo-next");
let demoStepper = null;

const makeElemCard = (value) => {
  const el = document.createElement("div");
  el.className = "elem-card pop";
  el.textContent = value;
  return el;
};

const buildStackSteps = (seq) => {
  const steps = [];
  seq.forEach((v) => {
    steps.push(() => {
      demoStatus.textContent = `push(${v})`;
      demoTower.prepend(makeElemCard(v));
    });
  });
  steps.push(() => {
    demoStatus.textContent = "이제 pop을 진행함";
  });
  seq.forEach(() => {
    steps.push(() => {
      const top = demoTower.firstElementChild;
      demoStatus.textContent = `pop() -> ${top.textContent}`;
      top.remove();
    });
  });
  steps.push(() => {
    demoStatus.textContent = "완료! 처음부터로 다시 볼 수 있어";
  });
  return steps;
};

const setupDemo = () => {
  const pushSeq = randomNums(5, 9);
  demoTower.innerHTML = "";
  demoStepper = createStepper(buildStackSteps(pushSeq));
  demoStatus.textContent = "다음 연산을 눌러봐 (push -> pop)";
  demoNextBtn.disabled = false;
};

demoNextBtn.addEventListener("click", () => {
  demoStepper.next();
  demoNextBtn.disabled = !demoStepper.hasNext();
});

document.querySelector("#demo-replay").addEventListener("click", setupDemo);

setupDemo();

// ===== Step 3: 직접 해보기 =====
const pool = document.querySelector("#pool");
const practiceTower = document.querySelector("#practice-tower");
const orderHint = document.querySelector("#order-hint");
const retryBtn = document.querySelector("#retry-btn");
const finishBtn = document.querySelector("#finish-btn");
const resultEl = document.querySelector("#result");

let targetOrder = [];
let userOrder = [];

const setupPractice = () => {
  targetOrder = randomNums(6, 9);
  userOrder = [];
  orderHint.textContent = targetOrder.join(", ");

  pool.innerHTML = "";
  shuffle(targetOrder).forEach((v) => {
    const card = document.createElement("div");
    card.className = "drag-card";
    card.dataset.value = v;
    card.textContent = v;
    makeDraggable(card);
    pool.appendChild(card);
  });

  practiceTower.innerHTML = "";
  resultEl.style.display = "none";
  retryBtn.style.display = "none";
  finishBtn.style.display = "none";
};

const onDropPush = (value) => {
  const card = pool.querySelector(`.drag-card[data-value="${value}"]`);
  if (!card) return;
  card.remove();
  practiceTower.prepend(makeElemCard(value));
  userOrder.push(Number(value));

  if (userOrder.length === targetOrder.length) gradeNow();
};

enableDropTarget(practiceTower, onDropPush);

const gradeNow = () => {
  const result = gradeOrder(userOrder, targetOrder);
  resultEl.style.display = "block";
  renderResult(resultEl, result);

  if (result.score >= 70) {
    markDone("stack");
    finishBtn.style.display = "inline-block";
  } else {
    retryBtn.style.display = "inline-block";
  }
};

retryBtn.addEventListener("click", setupPractice);

document.addEventListener("stepchange", (e) => {
  if (e.detail.step === 3 && targetOrder.length === 0) setupPractice();
});
