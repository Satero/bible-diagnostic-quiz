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
    userAnswers: [],
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

    selected = shuffle(selected);

    // Shuffle each question's own options so the correct answer isn't
    // predictably positioned, and remap the answer index accordingly.
    return selected.map((q) => {
      const optionObjs = q.options.map((text, i) => ({ text, correct: i === q.answer }));
      const shuffled = shuffle(optionObjs);
      return {
        id: q.id,
        category: q.category,
        question: q.question,
        options: shuffled.map((o) => o.text),
        answerIndex: shuffled.findIndex((o) => o.correct),
      };
    });
  }

  function startQuiz(n) {
    state.quizQuestions = sampleQuestions(n);
    state.currentIndex = 0;
    state.userAnswers = new Array(state.quizQuestions.length).fill(null);
    state.screen = "quiz";
    render();
  }

  function selectOption(optionIndex) {
    state.userAnswers[state.currentIndex] = optionIndex;
    render();
  }

  function nextQuestion() {
    if (state.currentIndex < state.quizQuestions.length - 1) {
      state.currentIndex++;
      render();
    } else {
      finishQuiz();
    }
  }

  function prevQuestion() {
    if (state.currentIndex > 0) {
      state.currentIndex--;
      render();
    }
  }

  function computeResult() {
    const byCategory = {};
    let correct = 0;

    state.quizQuestions.forEach((q, i) => {
      const isCorrect = state.userAnswers[i] === q.answerIndex;
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
      <p>Test your knowledge of the Bible's overall themes, book content, and famous verses &mdash; not random trivia. Questions are drawn proportionally across the Old and New Testaments.</p>
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
    const selected = state.userAnswers[state.currentIndex];
    const progressPct = Math.round(((state.currentIndex + 1) / total) * 100);
    const isLast = state.currentIndex === total - 1;

    const optionsHtml = q.options
      .map(
        (opt, i) =>
          `<button class="option${selected === i ? " selected" : ""}" data-option="${i}">${opt}</button>`
      )
      .join("");

    app.innerHTML = `
      <div class="progress-bar"><div class="progress-fill" style="width:${progressPct}%"></div></div>
      <div class="question-progress">Question ${state.currentIndex + 1} of ${total}</div>
      <span class="category-tag">${q.category}</span>
      <p class="question-text">${q.question}</p>
      <div class="options">${optionsHtml}</div>
      <div class="quiz-actions">
        <button class="btn" id="next-btn" ${selected === null ? "disabled" : ""}>${isLast ? "See Results" : "Next"}</button>
      </div>
    `;

    app.querySelectorAll(".option").forEach((el) => {
      el.addEventListener("click", () => selectOption(Number(el.dataset.option)));
    });

    document.getElementById("next-btn").addEventListener("click", nextQuestion);
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

    const reviewHtml = state.quizQuestions
      .map((q, i) => {
        const userIdx = state.userAnswers[i];
        const isCorrect = userIdx === q.answerIndex;
        const userText = userIdx === null ? "(no answer)" : q.options[userIdx];
        return `
          <div class="review-item">
            <div class="review-question">${i + 1}. ${q.question}</div>
            <div class="review-answer ${isCorrect ? "correct" : "incorrect"}">Your answer: ${userText}</div>
            ${!isCorrect ? `<div class="review-answer correct">Correct answer: ${q.options[q.answerIndex]}</div>` : ""}
          </div>
        `;
      })
      .join("");

    app.innerHTML = `
      <h1>Results</h1>
      <div class="card score-summary">
        <div class="score-number">${result.correct}/${result.total}</div>
        <div class="score-label">${pct}% correct</div>
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
        ${reviewHtml}
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
