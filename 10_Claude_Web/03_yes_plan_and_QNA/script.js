(function () {
  "use strict";

  var displayEl = document.getElementById("display");
  var historyEl = document.getElementById("history");

  var currentInput = "0";
  var previousInput = null;
  var operator = null;
  var resetNext = false; // 다음 숫자 입력 시 디스플레이 초기화 여부
  var hasError = false;

  var OP_SYMBOL = { "+": "+", "-": "−", "*": "×", "/": "÷" };

  function updateDisplay() {
    displayEl.textContent = currentInput;
  }

  // 부동소수점 오차 정리
  function tidy(n) {
    if (!isFinite(n)) return "Error";
    return parseFloat(n.toPrecision(12)).toString();
  }

  function clearAll() {
    currentInput = "0";
    previousInput = null;
    operator = null;
    resetNext = false;
    hasError = false;
    updateDisplay();
  }

  function appendNumber(n) {
    if (hasError) clearAll();
    if (resetNext) {
      currentInput = n;
      resetNext = false;
    } else {
      currentInput = currentInput === "0" ? n : currentInput + n;
    }
    updateDisplay();
  }

  function appendDot() {
    if (hasError) clearAll();
    if (resetNext) {
      currentInput = "0";
      resetNext = false;
    }
    if (currentInput.indexOf(".") === -1) {
      currentInput += ".";
      updateDisplay();
    }
  }

  function compute() {
    var a = parseFloat(previousInput);
    var b = parseFloat(currentInput);
    var r;
    switch (operator) {
      case "+": r = a + b; break;
      case "-": r = a - b; break;
      case "*": r = a * b; break;
      case "/": r = b === 0 ? NaN : a / b; break;
      default: return null;
    }
    return tidy(r);
  }

  function chooseOperator(op) {
    if (hasError) return;
    // 이전 연산자 있고 새 숫자 입력됨 = 연쇄 계산
    if (operator !== null && !resetNext) {
      var mid = compute();
      if (mid === "Error") {
        showError();
        return;
      }
      currentInput = mid;
      updateDisplay();
    }
    previousInput = currentInput;
    operator = op;
    resetNext = true;
  }

  function equals() {
    if (operator === null || hasError) return;
    var expr = previousInput + " " + OP_SYMBOL[operator] + " " + currentInput;
    var result = compute();
    if (result === "Error") {
      showError();
      return;
    }
    addHistory(expr, result);
    currentInput = result;
    previousInput = null;
    operator = null;
    resetNext = true;
    updateDisplay();
  }

  function showError() {
    currentInput = "Error";
    previousInput = null;
    operator = null;
    hasError = true;
    resetNext = true;
    updateDisplay();
  }

  function toggleSign() {
    if (hasError || currentInput === "0") return;
    currentInput = currentInput.charAt(0) === "-"
      ? currentInput.slice(1)
      : "-" + currentInput;
    updateDisplay();
  }

  function percent() {
    if (hasError) return;
    currentInput = tidy(parseFloat(currentInput) / 100);
    updateDisplay();
  }

  function deleteLast() {
    if (hasError) { clearAll(); return; }
    if (resetNext) return; // 결과/연산자 직후엔 무시
    if (currentInput.length <= 1 || (currentInput.length === 2 && currentInput.charAt(0) === "-")) {
      currentInput = "0";
    } else {
      currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
  }

  function addHistory(expr, result) {
    var li = document.createElement("li");
    var e = document.createElement("span");
    e.className = "expr";
    e.textContent = expr;
    var r = document.createElement("span");
    r.className = "res";
    r.textContent = "= " + result;
    li.appendChild(e);
    li.appendChild(r);
    historyEl.insertBefore(li, historyEl.firstChild);
  }

  // 이벤트 위임
  document.querySelector(".buttons").addEventListener("click", function (ev) {
    var btn = ev.target.closest("button");
    if (!btn) return;

    if (btn.dataset.num !== undefined) {
      appendNumber(btn.dataset.num);
    } else if (btn.dataset.op !== undefined) {
      chooseOperator(btn.dataset.op);
    } else {
      switch (btn.dataset.action) {
        case "clear": clearAll(); break;
        case "sign": toggleSign(); break;
        case "percent": percent(); break;
        case "dot": appendDot(); break;
        case "equals": equals(); break;
      }
    }
  });

  // 버튼 시각 피드백
  function flash(selector) {
    var btn = document.querySelector(selector);
    if (!btn) return;
    btn.classList.add("pressed");
    setTimeout(function () { btn.classList.remove("pressed"); }, 100);
  }

  // 키보드 입력
  document.addEventListener("keydown", function (ev) {
    var k = ev.key;

    if (k >= "0" && k <= "9") {
      appendNumber(k);
      flash('[data-num="' + k + '"]');
    } else if (k === ".") {
      appendDot();
      flash('[data-action="dot"]');
    } else if (k === "+" || k === "-" || k === "*" || k === "/") {
      chooseOperator(k);
      flash('[data-op="' + CSS.escape(k) + '"]');
    } else if (k === "Enter" || k === "=") {
      ev.preventDefault(); // Enter로 포커스된 버튼 재클릭 방지
      equals();
      flash('[data-action="equals"]');
    } else if (k === "Escape" || k === "c" || k === "C") {
      clearAll();
      flash('[data-action="clear"]');
    } else if (k === "Backspace") {
      deleteLast();
    } else if (k === "%") {
      percent();
      flash('[data-action="percent"]');
    } else {
      return;
    }
  });

  updateDisplay();
})();
