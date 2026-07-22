// 여러 페이지가 공유하는 유틸 (progress 저장, step 네비, drag&drop, 채점)

const reduceMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const PROGRESS_KEY = "ds-playground-progress";

const getProgress = () => {
  const saved = localStorage.getItem(PROGRESS_KEY);
  return saved ? JSON.parse(saved) : {};
};

const markDone = (key) => {
  const progress = getProgress();
  progress[key] = true;
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress));
};

// ===== 하단 정보띠: 진행률 표시 =====
const ALL_LESSONS = ["array", "stack", "queue", "linkedlist"];

const progressCountEl = document.getElementById("progress-count");
if (progressCountEl) {
  const progress = getProgress();
  const doneCount = ALL_LESSONS.filter((key) => progress[key]).length;
  progressCountEl.textContent = `${doneCount}/${ALL_LESSONS.length}`;
}

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Fisher-Yates 셔플
const shuffle = (arr) => {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
};

// ===== step 네비게이션 =====
const initSteps = () => {
  const panels = document.querySelectorAll(".step-panel");
  const dots = document.querySelectorAll(".topbar .steps span");

  const goStep = (n) => {
    panels.forEach((p) => {
      p.classList.toggle("active", Number(p.dataset.step) === n);
    });
    dots.forEach((d, i) => {
      d.classList.toggle("active", i + 1 === n);
    });
    document.dispatchEvent(new CustomEvent("stepchange", { detail: { step: n } }));
  };

  document.querySelectorAll("[data-next]").forEach((btn) => {
    btn.addEventListener("click", () => goStep(Number(btn.dataset.next)));
  });
  document.querySelectorAll("[data-prev]").forEach((btn) => {
    btn.addEventListener("click", () => goStep(Number(btn.dataset.prev)));
  });

  goStep(1);
  return goStep;
};

// ===== 드래그 앤 드롭 헬퍼 =====
const makeDraggable = (el) => {
  el.setAttribute("draggable", "true");
  el.addEventListener("dragstart", (e) => {
    e.dataTransfer.setData("text/plain", el.dataset.value);
    el.classList.add("dragging");
  });
  el.addEventListener("dragend", () => {
    el.classList.remove("dragging");
  });
};

const enableDropTarget = (el, onDrop) => {
  el.addEventListener("dragover", (e) => {
    e.preventDefault();
    el.classList.add("drag-over");
  });
  el.addEventListener("dragleave", () => {
    el.classList.remove("drag-over");
  });
  el.addEventListener("drop", (e) => {
    e.preventDefault();
    el.classList.remove("drag-over");
    const value = e.dataTransfer.getData("text/plain");
    if (value) onDrop(value);
  });
};

// ===== 채점 =====
const gradeOrder = (userOrder, answerOrder) => {
  const total = answerOrder.length;
  const perIndex = userOrder.map((v, i) => v === answerOrder[i]);
  const correctCount = perIndex.filter(Boolean).length;
  const score = Math.round((correctCount / total) * 100);
  return { total, correctCount, score, perIndex };
};

const gradeLabel = (score) => {
  if (score >= 90) return "완벽";
  if (score >= 70) return "잘함";
  return "다시 도전";
};

const renderResult = (el, gradeResult) => {
  const { correctCount, total, score } = gradeResult;
  el.textContent = `${correctCount} / ${total} 맞음 (${score}점) - ${gradeLabel(score)}`;
  el.classList.remove("good", "bad", "pop");
  el.classList.add(score >= 70 ? "good" : "bad");
  void el.offsetWidth;
  el.classList.add("pop");
};

// ===== 스텝 실행기 (자동재생 대신 '다음 단계' 수동 진행용) =====
const createStepper = (steps) => {
  let i = 0;
  return {
    hasNext: () => i < steps.length,
    next: () => {
      if (i < steps.length) steps[i++]();
    },
    reset: () => {
      i = 0;
    },
  };
};

// ===== 클릭 시 종이에 잉크가 번지는 효과 =====
document.addEventListener("click", (e) => {
  if (reduceMotion()) return;
  const drop = document.createElement("div");
  drop.className = "ink-ripple";
  drop.style.left = `${e.clientX}px`;
  drop.style.top = `${e.clientY}px`;
  document.body.appendChild(drop);
  drop.addEventListener("animationend", () => drop.remove());
});

// ===== 배경: 일렁이는 파도 =====
const initWaveBackground = () => {
  const canvas = document.createElement("canvas");
  canvas.id = "wave-bg";
  document.body.prepend(canvas);
  const ctx = canvas.getContext("2d");

  let w = 0;
  let h = 0;
  const resize = () => {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  };
  window.addEventListener("resize", resize);
  resize();

  const waves = [
    { amp: 20, freq: 0.011, speed: 0.018, base: 0.8, color: "rgba(191, 233, 255, 0.55)" },
    { amp: 26, freq: 0.008, speed: -0.014, base: 0.87, color: "rgba(142, 213, 255, 0.5)" },
    { amp: 32, freq: 0.006, speed: 0.011, base: 0.94, color: "rgba(94, 196, 250, 0.45)" },
  ];

  let t = 0;
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    waves.forEach((wave) => {
      const baseY = h * wave.base;
      ctx.beginPath();
      ctx.moveTo(0, h);
      for (let x = 0; x <= w; x += 10) {
        const y = baseY + Math.sin(x * wave.freq + t * wave.speed) * wave.amp;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      ctx.fillStyle = wave.color;
      ctx.fill();
    });
    t += 1;
  };

  if (reduceMotion()) {
    draw();
    return;
  }

  const loop = () => {
    draw();
    requestAnimationFrame(loop);
  };
  requestAnimationFrame(loop);
};

initWaveBackground();
