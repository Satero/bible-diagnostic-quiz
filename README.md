# Bible Diagnostic Quiz

A static web app that tests overall Bible knowledge &mdash; themes, book content, and famous verses &mdash; rather than obscure trivia. Pick a quiz length (10, 20, 30, 50, or 100 questions) and get a score plus a breakdown by category at the end.

No backend, no build step, no dependencies. Just HTML, CSS, and vanilla JS.

## How it works

- `questions.js` holds a bank of 100 multiple-choice questions across 8 categories: Pentateuch, Historical Books, Wisdom & Poetry, Prophets, Gospels, Acts & Early Church, Epistles, and Revelation & Famous Verses.
- When you start a quiz, questions are sampled **proportionally across all categories** (not purely at random), so even a 10-question quiz gives a meaningful category breakdown rather than random luck.
- Your last result is saved in your browser's `localStorage` so it survives a refresh. This is per-device/per-browser only &mdash; there are no accounts and nothing is synced anywhere.
- Verse-completion questions quote the ESV translation (see the attribution notice in the app footer, required by Crossway's permissions policy).

## Run it locally

No build step needed. Either:

```bash
open index.html
```

or serve it with any static file server, e.g.:

```bash
python3 -m http.server 8000
```

then visit `http://localhost:8000`.

## Deploy to GitHub Pages

1. Create a new GitHub repository (e.g. `bible-diagnostic-quiz`) and push this directory to it:
   ```bash
   git remote add origin https://github.com/<your-username>/bible-diagnostic-quiz.git
   git branch -M main
   git push -u origin main
   ```
2. On GitHub, go to the repo's **Settings &rarr; Pages**.
3. Under "Build and deployment", set **Source** to "Deploy from a branch".
4. Set **Branch** to `main` and folder to `/ (root)`, then save.
5. GitHub will publish the site at `https://<your-username>.github.io/bible-diagnostic-quiz/` within a minute or two.

## Extending the question bank

`questions.js` is a plain JS array &mdash; each entry looks like:

```js
{ id: 101, category: "Gospels", question: "...", options: ["A", "B", "C", "D"], answer: 1 }
```

`answer` is the index (0-based) of the correct option in the `options` array. Add new entries to any category and they'll automatically be included in the proportional sampling &mdash; no other code changes needed.
