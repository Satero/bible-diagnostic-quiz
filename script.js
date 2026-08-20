(function () {
  "use strict";

  const LENGTHS = [10, 20, 30, 50, 100];
  const STORAGE_KEY = "bibleQuizLastResult";

  const app = document.getElementById("app");

  const state = {
    screen: "start",
    selectedLength: 20,
    quizQuestions: [],
    currentIndex: 0,
    userInputs: [],   // what the user typed for each question
    grades: [],       // "correct" | "incorrect" | null, per question
    revealed: false,  // whether the current question's answer is shown yet
  };

  function shuffle(array) {
    const a = array.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }

  function groupByCategory(questions) {
    const groups = {};
    questions.forEach((q) => {
      if (!groups[q.category]) groups[q.category] = [];
      groups[q.category].push(q);
    });
    return groups;
  }

  // Stratified proportional sampling using the largest-remainder method,
  // so short quizzes still sample across every category rather than
  // clustering in whichever ones luck picks.
  function sampleQuestions(n) {
    const total = QUESTIONS.length;
    const groups = groupByCategory(QUESTIONS);
    const categories = Object.keys(groups);

    const allocations = categories.map((cat) => {
      const exact = (n * groups[cat].length) / total;
      return { cat, floor: Math.floor(exact), remainder: exact - Math.floor(exact) };
    });

    let allocated = allocations.reduce((sum, a) => sum + a.floor, 0);
    let remaining = n - allocated;

    allocations.sort((a, b) => b.remainder - a.remainder);
    for (let i = 0; i < allocations.length && remaining > 0; i++) {
      allocations[i].floor += 1;
      remaining--;
    }

    const countByCategory = {};
    allocations.forEach((a) => {
      countByCategory[a.cat] = Math.min(a.floor, groups[a.cat].length);
    });

    let selected = [];
    categories.forEach((cat) => {
      const picked = shuffle(groups[cat]).slice(0, countByCategory[cat]);
      selected = selected.concat(picked);
    });

    return shuffle(selected);
  }

  function startQuiz(n) {
    state.quizQuestions = sampleQuestions(n);
    state.currentIndex = 0;
    state.userInputs = new Array(state.quizQuestions.length).fill("");
    state.grades = new Array(state.quizQuestions.length).fill(null);
    state.revealed = false;
    state.screen = "quiz";
    render();
  }

  function checkAnswer() {
    const input = document.getElementById("answer-input");
    state.userInputs[state.currentIndex] = input ? input.value : "";
    state.revealed = true;
    render();
  }

  function gradeAnswer(grade) {
    state.grades[state.currentIndex] = grade;
    if (state.currentIndex < state.quizQuestions.length - 1) {
      state.currentIndex++;
      state.revealed = false;
      render();
    } else {
      finishQuiz();
    }
  }

  function computeResult() {
    const byCategory = {};
    let correct = 0;

    state.quizQuestions.forEach((q, i) => {
      const isCorrect = state.grades[i] === "correct";
      if (isCorrect) correct++;
      if (!byCategory[q.category]) byCategory[q.category] = { correct: 0, total: 0 };
      byCategory[q.category].total++;
      if (isCorrect) byCategory[q.category].correct++;
    });

    return {
      date: new Date().toISOString(),
      total: state.quizQuestions.length,
      correct,
      byCategory,
    };
  }

  function finishQuiz() {
    const result = computeResult();
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(result));
    } catch (e) {
      // localStorage unavailable (private browsing, etc.) — safe to ignore
    }
    state.screen = "results";
    render();
  }

  function retake() {
    state.screen = "start";
    render();
  }

  function loadLastResult() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch (e) {
      return null;
    }
  }

  function formatDate(iso) {
    const d = new Date(iso);
    return d.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" });
  }

  function renderStart() {
    const last = loadLastResult();
    const lengthOptions = LENGTHS.map(
      (len) =>
        `<div class="length-option${len === state.selectedLength ? " selected" : ""}" data-length="${len}">${len}</div>`
    ).join("");

    app.innerHTML = `
      <h1>Bible Diagnostic Quiz</h1>
      <p>Free-response questions on the Bible's overall themes, book content, and famous verses &mdash; not multiple choice. Type your answer, reveal the accepted answer, and grade yourself. Questions are drawn proportionally across the Old and New Testaments.</p>
      <div class="card">
        <h2>How many questions?</h2>
        <div class="length-grid">${lengthOptions}</div>
        <button class="btn" id="start-btn">Start Quiz</button>
      </div>
      ${
        last
          ? `<p class="last-result">Last attempt: ${last.correct}/${last.total} on ${formatDate(last.date)}</p>`
          : ""
      }
    `;

    app.querySelectorAll(".length-option").forEach((el) => {
      el.addEventListener("click", () => {
        state.selectedLength = Number(el.dataset.length);
        render();
      });
    });

    document.getElementById("start-btn").addEventListener("click", () => {
      startQuiz(state.selectedLength);
    });
  }

  function renderQuiz() {
    const total = state.quizQuestions.length;
    const q = state.quizQuestions[state.currentIndex];
    const progressPct = Math.round(((state.currentIndex + 1) / total) * 100);
    const typedValue = state.userInputs[state.currentIndex] || "";

    const acceptedHtml =
      q.accepted && q.accepted.length
        ? `<p class="accepted-note">Also accepted: ${q.accepted.join("; ")}</p>`
        : "";

    const revealHtml = state.revealed
      ? `
        <div class="reveal-box">
          <div class="reveal-label">Accepted answer</div>
          <div class="reveal-answer">${q.answer}</div>
          ${acceptedHtml}
        </div>
        <p class="grade-prompt">Did you get it right?</p>
        <div class="grade-actions">
          <button class="btn btn-correct" id="grade-correct-btn">I got it right</button>
          <button class="btn btn-incorrect" id="grade-incorrect-btn">I got it wrong</button>
        </div>
      `
      : `
        <div class="quiz-actions">
          <button class="btn" id="check-btn">Check Answer</button>
        </div>
      `;

    app.innerHTML = `
      <div class="progress-bar"><div class="progress-fill" style="width:${progressPct}%"></div></div>
      <div class="question-progress">Question ${state.currentIndex + 1} of ${total}</div>
      <p class="question-text">${q.prompt}</p>
      <input type="text" id="answer-input" class="answer-input" placeholder="Type your answer&hellip;" value="${typedValue.replace(/"/g, "&quot;")}" ${state.revealed ? "disabled" : ""} autocomplete="off">
      ${revealHtml}
    `;

    if (!state.revealed) {
      const input = document.getElementById("answer-input");
      input.focus();
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") checkAnswer();
      });
      document.getElementById("check-btn").addEventListener("click", checkAnswer);
    } else {
      document.getElementById("grade-correct-btn").addEventListener("click", () => gradeAnswer("correct"));
      document.getElementById("grade-incorrect-btn").addEventListener("click", () => gradeAnswer("incorrect"));
    }
  }

  function renderResults() {
    const result = computeResult();
    const pct = Math.round((result.correct / result.total) * 100);

    const breakdownHtml = Object.keys(result.byCategory)
      .map((cat) => {
        const c = result.byCategory[cat];
        const catPct = Math.round((c.correct / c.total) * 100);
        return `
          <div class="breakdown-row">
            <div class="breakdown-header"><span>${cat}</span><span>${c.correct}/${c.total}</span></div>
            <div class="breakdown-bar"><div class="breakdown-fill" style="width:${catPct}%"></div></div>
          </div>
        `;
      })
      .join("");

    const categoryOrder = [];
    state.quizQuestions.forEach((q) => {
      if (!categoryOrder.includes(q.category)) categoryOrder.push(q.category);
    });

    function reviewItemHtml(q, i) {
      const isCorrect = state.grades[i] === "correct";
      const userText = state.userInputs[i] && state.userInputs[i].trim() ? state.userInputs[i] : "(left blank)";
      return `
        <div class="review-item">
          <div class="review-question">${q.prompt}</div>
          <div class="review-answer ${isCorrect ? "correct" : "incorrect"}">Your answer: ${userText}</div>
          <div class="review-answer correct">Accepted answer: ${q.answer}</div>
        </div>
      `;
    }

    function reviewGroupHtml(matchesBucket) {
      return categoryOrder
        .map((cat) => {
          const items = state.quizQuestions
            .map((q, i) => ({ q, i }))
            .filter(({ q, i }) => q.category === cat && matchesBucket(i));
          if (!items.length) return "";
          return `
            <details class="review-subgroup">
              <summary>${cat} (${items.length})</summary>
              ${items.map(({ q, i }) => reviewItemHtml(q, i)).join("")}
            </details>
          `;
        })
        .join("");
    }

    const correctHtml = reviewGroupHtml((i) => state.grades[i] === "correct");
    const incorrectHtml = reviewGroupHtml((i) => state.grades[i] !== "correct");

    app.innerHTML = `
      <h1>Results</h1>
      <div class="card score-summary">
        <div class="score-number">${result.correct}/${result.total}</div>
        <div class="score-label">${pct}% correct (self-graded)</div>
      </div>
      <div class="card">
        <h2>By Category</h2>
        ${breakdownHtml}
      </div>
      <div class="result-actions">
        <button class="btn" id="retake-btn">Take Another Quiz</button>
      </div>
      <div class="card">
        <h2>Review</h2>
        <details class="review-group">
          <summary>Correct Answers (${result.correct})</summary>
          ${correctHtml}
        </details>
        <details class="review-group">
          <summary>Incorrect Answers (${result.total - result.correct})</summary>
          ${incorrectHtml}
        </details>
      </div>
    `;

    document.getElementById("retake-btn").addEventListener("click", retake);
  }

  function render() {
    if (state.screen === "start") renderStart();
    else if (state.screen === "quiz") renderQuiz();
    else if (state.screen === "results") renderResults();
  }

  render();
})();
