# Development Process

## How this was built

The project started as a scoped conversation before any code was written:
what tech stack, what Bible translation, what canon, what the "diagnostic"
result should actually show. That planning pass settled on plain
HTML/CSS/JS (no build step, deploys to GitHub Pages as-is), the ESV
translation, the standard 66-book Protestant canon, and a score-plus-
category-breakdown result rather than a single number or an adaptive
difficulty system.

From there the build went through these phases:

1. **Initial build** — a 100-question multiple-choice quiz across 8
   categories (Pentateuch, Historical Books, Wisdom & Poetry, Prophets,
   Gospels, Acts & Early Church, Epistles, Revelation & Famous Verses),
   with a selectable quiz length and proportional sampling across
   categories so short quizzes still cover the whole Bible.

2. **Pivot to free-response** — after trying it, the multiple-choice
   format was too easy: the four answer options often gave away enough
   context to guess correctly without really knowing the material. The
   whole app was reworked to a flashcard-style format instead — type an
   answer, reveal the accepted answer, grade yourself. All 100 questions
   were rewritten from scratch to this new format.

3. **Iterative question-quality tuning** — several rounds of "play through
   the quiz, flag what's too easy or too generic, fix it." This is where
   most of the project's actual time went, and it's ongoing by design —
   the question bank is expected to keep improving this way rather than
   being "finished" at any point.

4. **Question bank growth** — from 100 to 104 questions, both through
   fixing overly-generic questions (splitting one into several more
   specific ones) and adding new ones on request (the 12 tribes, the 12
   disciples).

5. **UI refinements** driven by the same feedback loop — removing the
   category label during the quiz (it was giving answers away by
   elimination) and restructuring the end-of-quiz review into collapsible
   Correct/Incorrect sections, each broken down by category.

## Design and implementation choices, and why

### Self-graded answers instead of auto-graded

The biggest structural decision in the whole project. Once the format
moved to free-response, the natural next question was: how does the app
know if "1-2 Kings" and "1 Kings and 2 Kings" and "First and Second Kings"
are all the same correct answer?

Two options were considered: build a fuzzy-matching/normalization system
that tries to accept all reasonable phrasings, or skip auto-grading
entirely and let the user judge their own answer against a revealed
"accepted answer." The fuzzy-matching route was rejected because Bible
citations and phrasings have an effectively unbounded number of valid
forms — any matcher would either be too strict (rejecting correct answers)
or too loose (accepting wrong ones), and getting it right would be a
disproportionate amount of engineering for a personal quiz app.

The self-graded approach won: type an answer, click "Check Answer," see
the accepted answer revealed (plus any noteworthy alternate phrasings),
and click "I got it right" or "I got it wrong" yourself. It's the same
trust model as a physical flashcard deck. This also meant a related idea —
giving "bonus credit" for extra precision, like citing verses 5-6 and not
just the chapter — was dropped in favor of a plain correct/incorrect
score, keeping the scoring model simple.

### ESV over a public-domain translation

Quoting Bible verses on a site published to the open web raises a
copyright question, since most modern translations (including ESV) are
not public domain the way the KJV is. Rather than default to a
public-domain translation to sidestep the issue, ESV was kept because
Crossway's official permissions policy explicitly allows quoting up to
1,000 verses (and no full book) without seeking written permission,
provided a specific attribution notice is included. That notice is in the
page footer for exactly this reason, and quoted verses have stayed short
and few in number — nowhere near the ceiling that policy sets.

### Category hidden during the quiz

Originally, each question showed a small category tag ("Prophets",
"Gospels," etc.) while it was being asked. This was removed after
feedback that it was making some questions too easy — knowing a question
is from "Prophets" narrows down a book-name answer considerably, which
defeats the purpose of a *diagnostic* rather than a process-of-elimination
game. Category information wasn't removed from the data model, just from
what's shown during the quiz — it's still used for proportional sampling
and for the post-quiz breakdown and review.

### The recurring "too easy" fix pattern

A specific pattern emerged across several rounds of feedback: a question
like "who led Israel across the Jordan?" is too easy because the answer
(Joshua) is almost baked into the phrasing of the question itself. The fix
that consistently worked was one of two moves:

- Turn it into a **precise citation question** — instead of "which Gospel
  records the Great Commission," ask "what book *and chapter*." This
  requires actually knowing where something is, not just recognizing a
  famous phrase.
- Turn it into a **broader content question** — instead of "what city did
  Israel conquer in Joshua 6," ask "what are the main themes/events in the
  book of Joshua." This tests whether someone actually knows the book's
  content, not just one isolated fact.

Both moves share the same underlying goal stated at the very start of the
project: test real content knowledge, not trivia that can be guessed from
context clues.

### Proportional (stratified) sampling instead of pure random sampling

When a user picks a shorter quiz (say, 10 questions out of 104), naive
random sampling could easily produce a quiz that's mostly New Testament
epistles and skips the Old Testament entirely. Instead, the sampling
allocates each of the 8 categories a number of questions proportional to
its share of the total bank (using the largest-remainder method to make
sure the allocations add up to exactly the requested quiz length), then
samples randomly within each category. The result is that even a
10-question quiz still gives a meaningful, non-lucky read on Old vs. New
Testament knowledge — which matters directly for the category breakdown
being useful as an actual diagnostic.

### No framework, no build step

Consistent with the project brief from the very first planning
conversation: this is meant to be simple enough to deploy to GitHub Pages
by just pushing HTML/CSS/JS files, with no compile step and no
dependencies to keep updated. The app logic (`script.js`) is a single
state object and a manual re-render function — deliberately simple rather
than reaching for a framework, since the app's actual complexity (sampling
logic, self-grading flow, review grouping) doesn't need one to stay
readable.
