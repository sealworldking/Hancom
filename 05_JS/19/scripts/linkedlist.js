initSteps();

const randomNums = (count, max) => {
  const pool = [];
  for (let i = 1; i <= max; i++) pool.push(i);
  return shuffle(pool).slice(0, count);
};

const makeNode = (value) => {
  const el = document.createElement("div");
  el.className = "list-node pop";
  el.textContent = value;
  return el;
};

const makeNullNode = () => {
  const el = document.createElement("div");
  el.className = "list-node null-node pop";
  el.textContent = "Null";
  return el;
};

// ===== Step 2: 시연 (수동 진행) =====
const demoChain = document.querySelector("#demo-chain");
const demoStatus = document.querySelector("#demo-status");
const demoNextBtn = document.querySelector("#demo-next");
let demoStepper = null;

const buildListSteps = (seq) => {
  const steps = [];
  const chainEls = [];

  seq.forEach((v, i) => {
    steps.push(() => {
      demoStatus.textContent = i === 0 ? `head 노드 생성: ${v}` : `노드 ${v} 연결 (이전 노드 -> ${v})`;
      const el = makeNode(v);
      demoChain.appendChild(el);
      chainEls.push(el);
    });
  });

  steps.push(() => {
    demoStatus.textContent = "완료! 맨 끝이 tail 이야";
  });

  if (seq.length >= 3) {
    const deleteIndex = Math.floor(seq.length / 2);

    steps.push(() => {
      const target = chainEls[deleteIndex];
      target.classList.add("wrong-flash");
      demoStatus.textContent = `노드 ${target.textContent} 삭제 준비: 앞뒤 노드를 확인한다`;
    });

    steps.push(() => {
      const prev = chainEls[deleteIndex - 1];
      const next = chainEls[deleteIndex + 1];
      prev.classList.add("right-flash");
      if (next) next.classList.add("right-flash");
      demoStatus.textContent = "포인터 재연결: 앞 노드가 뒤 노드를 바로 가리키게 됨";
    });

    steps.push(() => {
      const target = chainEls[deleteIndex];
      target.remove();
      chainEls.splice(deleteIndex, 1);
      chainEls.forEach((el) => el.classList.remove("right-flash", "wrong-flash"));
      demoStatus.textContent = "삭제 완료! 값 이동 없이 포인터만 바뀌었어 (배열과 다른 점)";
    });
  }

  return steps;
};

const setupDemo = () => {
  const demoSeq = randomNums(5, 9);
  demoChain.innerHTML = "";
  demoStepper = createStepper(buildListSteps(demoSeq));
  demoStatus.textContent = "다음 연산을 눌러봐";
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
const practiceChain = document.querySelector("#practice-chain");
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

  practiceChain.innerHTML = "";
  resultEl.style.display = "none";
  retryBtn.style.display = "none";
  finishBtn.style.display = "none";
  deleteIntro.style.display = "none";
  deleteStage.style.display = "none";
  deleteResultEl.style.display = "none";
};

const onDropConnect = (value) => {
  const card = pool.querySelector(`.drag-card[data-value="${value}"]`);
  if (!card) return;
  card.remove();
  practiceChain.appendChild(makeNode(value));
  userOrder.push(Number(value));

  if (userOrder.length === targetOrder.length) gradeNow();
};

enableDropTarget(practiceChain, onDropConnect);

const gradeNow = () => {
  const result = gradeOrder(userOrder, targetOrder);
  resultEl.style.display = "block";
  renderResult(resultEl, result);

  if (result.score >= 70) {
    setupDeletePractice();
  } else {
    retryBtn.style.display = "inline-block";
  }
};

retryBtn.addEventListener("click", setupPractice);

document.addEventListener("stepchange", (e) => {
  if (e.detail.step === 3 && targetOrder.length === 0) setupPractice();
});

// ===== Step 3 이어서: 삭제 연습 =====
const deleteIntro = document.querySelector("#delete-intro");
const deleteStage = document.querySelector("#delete-stage");
const deleteChain = document.querySelector("#delete-chain");
const deleteTargetValue = document.querySelector("#delete-target-value");
const deleteResultEl = document.querySelector("#delete-result");

let deleteSeq = [];
let deleteIndex = 0;
let deleteEls = [];
let deleteSelection = [];

const setupDeletePractice = () => {
  deleteSeq = randomNums(5, 9);
  deleteIndex = 1 + Math.floor(Math.random() * (deleteSeq.length - 2));
  deleteEls = [];
  deleteSelection = [];

  deleteChain.innerHTML = "";
  deleteSeq.forEach((v, i) => {
    const el = makeNode(v);
    if (i === deleteIndex) {
      el.classList.add("wrong-flash");
    } else {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => selectDeleteNode(i));
    }
    deleteChain.appendChild(el);
    deleteEls.push(el);
  });

  deleteTargetValue.textContent = deleteSeq[deleteIndex];
  deleteIntro.style.display = "block";
  deleteStage.style.display = "block";
  deleteResultEl.style.display = "none";
};

const selectDeleteNode = (i) => {
  if (deleteSelection.includes(i) || deleteSelection.length >= 2) return;
  deleteEls[i].classList.add("right-flash");
  deleteSelection.push(i);
  if (deleteSelection.length === 2) checkDeleteAnswer();
};

const checkDeleteAnswer = () => {
  const [a, b] = deleteSelection;
  const correct = a === deleteIndex - 1 && b === deleteIndex + 1;

  deleteResultEl.style.display = "block";
  if (correct) {
    deleteResultEl.textContent = `정답! ${deleteEls[deleteIndex - 1].textContent}과 ${deleteEls[deleteIndex + 1].textContent}이 서로 연결돼.`;
    deleteResultEl.className = "result good pop";
    deleteEls[deleteIndex].remove();
    markDone("linkedlist");
    finishBtn.style.display = "inline-block";
  } else {
    deleteResultEl.textContent = "다시 생각해봐. 삭제될 노드의 이전 노드, 다음 노드 순서로 클릭해야 해.";
    deleteResultEl.className = "result bad pop";
    deleteEls.forEach((el, idx) => {
      if (idx !== deleteIndex) el.classList.remove("right-flash");
    });
    deleteSelection = [];
  }
};
