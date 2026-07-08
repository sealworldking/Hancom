initSteps();

const randomNums = (count, max) => {
  const pool = [];
  for (let i = 1; i <= max; i++) pool.push(i);
  return shuffle(pool).slice(0, count);
};

// ===== Step 2: 시연 (버블 정렬, 수동 진행) =====
const demoTrack = document.querySelector("#demo-track");
const demoStatus = document.querySelector("#demo-status");
const demoNextBtn = document.querySelector("#demo-next");
let demoEls = [];
let demoStepper = null;

const makeSlotEl = (value) => {
  const el = document.createElement("div");
  el.className = "array-slot";
  el.textContent = value;
  return el;
};

// FLIP: 자리를 바꾼 뒤, 바뀌기 전 위치에서 슬라이드 이동하는 것처럼 보이게 함
const swapWithSlide = (container, elA, elB) => {
  const firstA = elA.getBoundingClientRect();
  const firstB = elB.getBoundingClientRect();

  const marker = document.createComment("");
  container.insertBefore(marker, elA);
  container.insertBefore(elA, elB.nextSibling);
  container.insertBefore(elB, marker);
  marker.remove();

  const lastA = elA.getBoundingClientRect();
  const lastB = elB.getBoundingClientRect();

  elA.style.transition = "none";
  elB.style.transition = "none";
  elA.style.transform = `translateX(${firstA.left - lastA.left}px)`;
  elB.style.transform = `translateX(${firstB.left - lastB.left}px)`;

  void elA.offsetWidth;

  elA.style.transition = "transform 0.4s ease";
  elB.style.transition = "transform 0.4s ease";
  elA.style.transform = "";
  elB.style.transform = "";
};

const clearCompare = () => {
  demoTrack.querySelectorAll(".compare").forEach((el) => el.classList.remove("compare"));
};

const buildSortSteps = (arr) => {
  const a = [...arr];
  const n = a.length;
  const steps = [];

  for (let i = 0; i < n - 1; i++) {
    for (let j = 0; j < n - 1 - i; j++) {
      const jj = j;
      steps.push(() => {
        clearCompare();
        demoEls[jj].classList.add("compare");
        demoEls[jj + 1].classList.add("compare");
        demoStatus.textContent = `비교 중: ${demoEls[jj].textContent} 와 ${demoEls[jj + 1].textContent}`;
      });

      steps.push(() => {
        const elA = demoEls[jj];
        const elB = demoEls[jj + 1];
        const valA = Number(elA.textContent);
        const valB = Number(elB.textContent);
        const relation = valA > valB ? ">" : valA < valB ? "<" : "=";
        demoStatus.textContent = `결과: ${elA.textContent} ${relation} ${elB.textContent}`;
      });

      if (a[j] > a[j + 1]) {
        steps.push(() => {
          const elA = demoEls[jj];
          const elB = demoEls[jj + 1];
          demoStatus.textContent = `${elA.textContent} 과 ${elB.textContent} swap!`;
          swapWithSlide(demoTrack, elA, elB);
          [demoEls[jj], demoEls[jj + 1]] = [demoEls[jj + 1], demoEls[jj]];
        });
        [a[j], a[j + 1]] = [a[j + 1], a[j]];
      }
    }
    const lockIndex = n - 1 - i;
    steps.push(() => {
      clearCompare();
      demoEls[lockIndex].classList.add("sorted");
      demoStatus.textContent = `${demoEls[lockIndex].textContent} 자리 확정`;
    });
  }

  steps.push(() => {
    demoEls[0].classList.add("sorted");
    demoStatus.textContent = "정렬 완료! 처음부터로 다시 볼 수 있어";
  });

  return steps;
};

const setupDemo = () => {
  const demoArr = randomNums(8, 60);
  demoTrack.innerHTML = "";
  demoEls = demoArr.map((v) => {
    const el = makeSlotEl(v);
    demoTrack.appendChild(el);
    return el;
  });
  demoStepper = createStepper(buildSortSteps(demoArr));
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
const practiceTrack = document.querySelector("#practice-track");
const gradeBtn = document.querySelector("#grade-btn");
const retryBtn = document.querySelector("#retry-btn");
const finishBtn = document.querySelector("#finish-btn");
const resultEl = document.querySelector("#result");

let practiceNums = [];
let answer = [];
let slots = [];

const setupPractice = () => {
  practiceNums = randomNums(10, 60);
  answer = [...practiceNums].sort((a, b) => a - b);

  pool.innerHTML = "";
  shuffle(practiceNums).forEach((v) => {
    const card = document.createElement("div");
    card.className = "drag-card";
    card.dataset.value = v;
    card.textContent = v;
    makeDraggable(card);
    pool.appendChild(card);
  });

  practiceTrack.innerHTML = "";
  slots = [];
  answer.forEach((_, i) => {
    const slot = document.createElement("div");
    slot.className = "array-slot dropzone dropzone-empty";
    slot.dataset.index = i;
    slot.textContent = i;
    enableDropTarget(slot, (value) => placeCard(slot, value));
    practiceTrack.appendChild(slot);
    slots.push(slot);
  });

  gradeBtn.disabled = true;
  resultEl.style.display = "none";
  finishBtn.style.display = "none";
  retryBtn.style.display = "none";
};

const placeCard = (slot, value) => {
  if (slot.dataset.filled === "1") return; // 이미 찬 칸
  const card = pool.querySelector(`.drag-card[data-value="${value}"]`);
  if (!card) return;

  slot.textContent = value;
  slot.dataset.filled = "1";
  slot.dataset.value = value;
  slot.classList.remove("dropzone-empty");
  card.remove();

  const filledCount = slots.filter((s) => s.dataset.filled === "1").length;
  gradeBtn.disabled = filledCount !== slots.length;
};

const gradeNow = () => {
  const userOrder = slots.map((s) => Number(s.dataset.value));
  const result = gradeOrder(userOrder, answer);

  slots.forEach((s, i) => {
    s.classList.remove("right-flash", "wrong-flash");
    s.classList.add(result.perIndex[i] ? "right-flash" : "wrong-flash");
  });

  resultEl.style.display = "block";
  renderResult(resultEl, result);

  if (result.score >= 70) {
    markDone("array");
    finishBtn.style.display = "inline-block";
    retryBtn.style.display = "none";
  } else {
    retryBtn.style.display = "inline-block";
    finishBtn.style.display = "none";
  }
};

gradeBtn.addEventListener("click", gradeNow);
retryBtn.addEventListener("click", setupPractice);

document.addEventListener("stepchange", (e) => {
  if (e.detail.step === 3 && practiceNums.length === 0) setupPractice();
});
