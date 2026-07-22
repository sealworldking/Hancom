initSteps();

const randomNums = (count, max) => {
  const pool = [];
  for (let i = 1; i <= max; i++) pool.push(i);
  return shuffle(pool).slice(0, count);
};

const makeElemCard = (value) => {
  const el = document.createElement("div");
  el.className = "elem-card pop";
  el.textContent = value;
  return el;
};

// ===== Step 2: 시연 (수동 진행) =====
const demoLane = document.querySelector("#demo-lane");
const demoStatus = document.querySelector("#demo-status");
const demoNextBtn = document.querySelector("#demo-next");
let demoStepper = null;

const buildQueueSteps = (seq) => {
  const steps = [];
  seq.forEach((v) => {
    steps.push(() => {
      demoStatus.textContent = `enqueue(${v})`;
      demoLane.appendChild(makeElemCard(v));
    });
  });
  steps.push(() => {
    demoStatus.textContent = "이제 dequeue를 진행함";
  });
  seq.forEach(() => {
    steps.push(() => {
      const front = demoLane.firstElementChild;
      demoStatus.textContent = `dequeue() -> ${front.textContent}`;
      front.remove();
    });
  });
  steps.push(() => {
    demoStatus.textContent = "완료! 처음부터로 다시 볼 수 있어";
  });
  return steps;
};

const setupDemo = () => {
  const enqueueSeq = randomNums(5, 9);
  demoLane.innerHTML = "";
  demoStepper = createStepper(buildQueueSteps(enqueueSeq));
  demoStatus.textContent = "다음 연산을 눌러봐 (enqueue -> dequeue)";
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
const practiceLane = document.querySelector("#practice-lane");
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

  practiceLane.innerHTML = "";
  resultEl.style.display = "none";
  retryBtn.style.display = "none";
  finishBtn.style.display = "none";
};

const onDropEnqueue = (value) => {
  const card = pool.querySelector(`.drag-card[data-value="${value}"]`);
  if (!card) return;
  card.remove();
  practiceLane.appendChild(makeElemCard(value));
  userOrder.push(Number(value));

  if (userOrder.length === targetOrder.length) gradeNow();
};

enableDropTarget(practiceLane, onDropEnqueue);

const gradeNow = () => {
  const result = gradeOrder(userOrder, targetOrder);
  resultEl.style.display = "block";
  renderResult(resultEl, result);

  if (result.score >= 70) {
    markDone("queue");
    finishBtn.style.display = "inline-block";
  } else {
    retryBtn.style.display = "inline-block";
  }
};

retryBtn.addEventListener("click", setupPractice);

document.addEventListener("stepchange", (e) => {
  if (e.detail.step === 3 && targetOrder.length === 0) setupPractice();
});
