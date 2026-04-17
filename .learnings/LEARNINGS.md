# Learnings

Corrections, insights, and knowledge gaps captured during development.

**Categories**: correction | insight | knowledge_gap | best_practice

---

## [LRN-20260411-001] correction

**Logged**: 2026-04-11T22:07:00Z
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
Chrome extension content scripts are aggressively cached — file changes don't take effect without removing and re-adding the extension.

### Details
After editing content.js in the GhostJob V4 extension, the user refreshed the extension and page multiple times but kept seeing old behavior ("Ghost Score" instead of "Trust Score"). The old code was still running. Additionally, they had 4 copies of the extension loaded and were reloading the wrong one.

### Suggested Action
When testing Chrome extension changes: (1) Remove the extension entirely, (2) Re-load unpacked, (3) Close and reopen the LinkedIn tab — don't just refresh.

### Metadata
- Source: user_feedback
- Related Files: ghostjob/ghostjob-extension-v4/ghostjob-extension/content.js
- Tags: chrome-extension, caching, testing

---

## [LRN-20260411-002] best_practice

**Logged**: 2026-04-11T22:07:00Z
**Priority**: high
**Status**: resolved
**Area**: frontend

### Summary
Always run `node -c` syntax check on JS files before deploying — one unescaped regex can crash the entire content script silently.

### Details
The regex `/m/f/d/v/` inside a JavaScript regex literal crashed the content script on load, making the entire extension non-functional (no button, no floating badge, nothing). Chrome doesn't show content script errors prominently. The issue was slashes in `m/f/d/v` being interpreted as regex delimiters. Fix: escape as `m\/f\/d\/v`.

### Suggested Action
Add `node -c <file>` as a standard step after editing any .js file for Chrome extensions.

### Metadata
- Source: error
- Related Files: ghostjob/ghostjob-extension-v4/ghostjob-extension/content.js
- Tags: chrome-extension, regex, syntax, debugging

---

## [LRN-20260411-003] best_practice

**Logged**: 2026-04-11T22:07:00Z
**Priority**: medium
**Status**: resolved
**Area**: frontend

### Summary
Scoring systems should match user intuition: higher = better. Inverted scores (higher = worse) confuse users.

### Details
GhostJob originally used a "Ghost Score" where higher meant more ghost-like (worse). Users expected higher = safer. Flipped to a Trust Score (0-100, higher = safer) with thresholds: 0-30 = Likely Ghost, 31-60 = Caution, 61-100 = Legitimate.

### Suggested Action
When building scoring UIs, always confirm the direction matches common metaphors (credit score, rating, etc.).

### Metadata
- Source: user_feedback
- Related Files: ghostjob/ghostjob-extension-v4/ghostjob-extension/content.js, popup.js
- Tags: ux, scoring, intuition
- Pattern-Key: ux.score_direction

---

## [LRN-20260411-004] insight

**Logged**: 2026-04-11T22:07:00Z
**Priority**: medium
**Status**: resolved
**Area**: frontend

### Summary
LinkedIn DOM selectors change frequently — use broad fallbacks and smart text-based extraction, not just specific CSS classes.

### Details
Location extraction was failing because the 4 CSS selectors were outdated for current LinkedIn. Job title, company, and description selectors are also fragile. The fix was adding 12 selectors + 2 smart fallbacks that walk the DOM from the company link and search for location-like text patterns.

### Suggested Action
For any LinkedIn scraping: (1) Cast a wide net with many selectors, (2) Add text-content-based fallbacks with regex, (3) Walk up from known elements to find siblings.

### Metadata
- Source: user_feedback
- Related Files: ghostjob/ghostjob-extension-v4/ghostjob-extension/content.js
- Tags: linkedin, dom-scraping, selectors, fragile
- Pattern-Key: scraping.linkedin_selectors

---

## [LRN-20260411-005] best_practice

**Logged**: 2026-04-11T22:07:00Z
**Priority**: medium
**Status**: resolved
**Area**: frontend

### Summary
Signal detections should quote the actual triggering text from the page — it makes findings verifiable and more trustworthy.

### Details
User requested that each ghost job signal include a quote/excerpt from the actual job posting that triggered it. Added an `extractQuote()` helper that grabs the matching text with ~40 chars of context. Signals now show `💬 "...actual text from posting..."` in the modal.

### Suggested Action
For any detection/scanning feature, always surface the evidence, not just the conclusion.

### Metadata
- Source: user_feedback
- Related Files: ghostjob/ghostjob-extension-v4/ghostjob-extension/content.js
- Tags: ux, transparency, evidence, signals
- Pattern-Key: ux.show_evidence

---

## [LRN-20260411-006] best_practice

**Logged**: 2026-04-11T22:07:00Z
**Priority**: medium
**Status**: resolved
**Area**: frontend

### Summary
When injecting UI next to a button in a flex container, ensure the container is flex-direction: row and the injected element is a sibling, not a child of a wrapper.

### Details
GhostJob's scan button kept appearing below LinkedIn's Save button instead of to the right. The Save button was wrapped in a container div, so `insertAdjacentElement('afterend')` was putting the ghost button after that wrapper, but outside the flex row. Fix: detect if Save is a direct child of the flex container; if wrapped, insert after the wrapper. Also force `flex-direction: row` on the container if needed.

### Suggested Action
When injecting UI elements into third-party pages: (1) Check if the target element is wrapped, (2) Insert after the wrapper not inside it, (3) Force correct flex direction on the container.

### Metadata
- Source: user_feedback
- Related Files: ghostjob/ghostjob-extension-v4/ghostjob-extension/content.js
- Tags: css, flex, injection, linkedin, layout
- Pattern-Key: css.flex_injection

---
