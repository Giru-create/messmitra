---
doc: checklist
status: approved
---

# Build Checklist

Build mode: fast

## Slices

- [ ] **1. Next.js app shell with 3 tabs and live feedback form**
  Becomes usable: A running Next.js web app at `http://localhost:3000` with the 3 main tabs (Student Feedback, Committee Dashboard, Weekly Report). A student can choose a meal, star rating, type an English or Hinglish comment, submit, and see it appear immediately in the app.
  Why now: Bootstraps the Next.js and Tailwind project and establishes the end-to-end form and render loop on day one, giving every subsequent feature a working foundation.
  PRD ref: `prd.md > Screens and Layout`, `prd.md > 1. Student Feedback Ingestion`
  Spec ref: `spec.md > Components > AppShell`, `spec.md > Components > FeedbackForm`
  Build: Initialize Next.js with Tailwind CSS and Lucide React, create `AppShell` with tab navigation, build `StudentFeedbackForm` with meal chips and star rating, wire form submissions into top-level React state.
  Verify (mechanical): Run `npm run build` or `npm run dev` and confirm clean compilation with no TypeScript or layout errors; confirm form submission renders the new feedback item on screen.
  Learner check: Open `http://localhost:3000`, switch between the 3 tabs, select "Dinner", give 2 stars, type a comment, submit, and verify it displays on screen.
  Commit: `Scaffold Next.js app shell and student feedback form`

- [ ] **2. LocalStorage persistence and 1-click Demo Data loader**
  Becomes usable: Submissions survive browser refreshes. Tapping "Load Demo Data" populates 12–15 realistic English and Hinglish meal complaints across all meals, and "Reset Data" safely clears them with confirmation.
  Why now: Persistence protects data during testing, and having realistic demo data immediately unblocks exploring dashboard groupings and AI classification without manually typing 15 items every test.
  PRD ref: `prd.md > 5. Demo Data Management & Reset`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Data Model`, `spec.md > Components > DemoDataManager`
  Build: Implement safe client-side `localStorage` hook (`useMessFeedback`), create `src/lib/demoData.ts` with 12–15 realistic hostel entries in English and Hinglish, add "Load Demo Data" and "Reset Data" controls in `Header.tsx`.
  Verify (mechanical): Load demo data, refresh the browser, and confirm all 12–15 records remain present in `localStorage` without React hydration mismatch errors.
  Learner check: Click "Load Demo Data", refresh your browser page, and verify all meal records remain intact. Click "Reset Data" and confirm the clean empty state appears.
  Commit: `Add localStorage persistence and demo data manager`

- [ ] **3. Built-in offline AI analyzer and urgent safety alerts**
  Becomes usable: Instant local AI classification on every submission. Typing *"Dinner me daal me insect mila!"* immediately flags Category: **Hygiene**, Urgency: **Critical**, and shows a success toast. Pinned Urgent Alerts banner at the top of the dashboard highlights critical food safety issues in vibrant red.
  Why now: This is the core NLP kernel. Building it offline early ensures 100% reliable hackathon judging without external API keys or network latency.
  PRD ref: `prd.md > 2. Built-in Offline AI Analyzer`, `prd.md > 3. Committee Dashboard & Issue Clustering`
  Spec ref: `spec.md > Components > UrgentAlertsBanner`, `spec.md > Components > ToastNotification`, `spec.md > File Structure > analyzer.ts`
  Build: Implement rule-based keyword NLP parser in `src/lib/analyzer.ts` detecting categories (hygiene, taste, quantity, etc.), sentiment, urgency (critical, high, medium, low), and normalized issue keys. Build `ToastNotification` and pinned `UrgentAlertsBanner`.
  Verify (mechanical): Run unit evaluation on test strings: verify *"Dinner me daal me insect mila!"* returns category `hygiene` and urgency `critical`; verify *"roti kacchi thi"* returns category `taste` and urgency `high`.
  Learner check: In the Student Feedback tab, submit *"Dinner me daal me insect mila!"*. Confirm the toast displays "Hygiene • Critical", then view the Committee Dashboard to see the pinned red alert banner.
  Commit: `Implement offline AI analyzer and urgent safety alerts`

- [ ] **4. Committee dashboard and clustered issue cards**
  Becomes usable: Committee members see summary metrics (Total Complaints, Urgent Alerts, Average Rating) and individual complaints clustered under normalized issue cards (e.g., *"Foreign Object in Daal"*, *"Cold Dinner Served"*, *"Undercooked Roti"*) with complaint counts, meal filters, and sample student quotes.
  Why now: Bridges raw individual student feedback into actionable patterns so committees see recurring mess trends rather than isolated complaints.
  PRD ref: `prd.md > 3. Committee Dashboard & Issue Clustering`
  Spec ref: `spec.md > Components > CommitteeDashboard`, `spec.md > Components > GroupedIssueCards`
  Build: Create clustering logic grouping items by `issueKey`, build metric summary cards, implement category and meal filter pills, and render `GroupedIssueCards` showing frequency counts and quotes.
  Verify (mechanical): Load demo data and verify issues with matching `issueKey` correctly aggregate their counts and display accurate average ratings and quotes.
  Learner check: Open the Committee Dashboard tab, filter by "Dinner", and observe that individual complaints are grouped neatly into issue cards with counts and severity pills.
  Commit: `Build committee dashboard and clustered issue cards`

- [ ] **5. Corrective action recommendation and before/after impact tracking**
  Becomes usable: Each recurring issue card presents an AI-suggested corrective action. Committee members can click **"Mark Implemented"**. The card records the timestamp and dynamically displays the before-and-after complaint drop percentage (closing the feedback loop).
  Why now: Delivers the unique product differentiator—proving whether committee interventions actually reduced subsequent student complaints.
  PRD ref: `prd.md > 4. Corrective Action & Before/After Impact Tracking`
  Spec ref: `spec.md > Components > ImpactTracker`, `spec.md > Components > GroupedIssueCards`
  Build: Add `suggestedAction` rendering and **"Mark Implemented"** toggle button on `GroupedIssueCard`. Implement `ImpactTracker` calculating complaints recorded before vs. after `actionImplementedAt` timestamp and rendering percentage reduction badges.
  Verify (mechanical): Toggle "Mark Implemented" on a demo issue with prior and subsequent complaints; verify the percentage calculation accurately reflects the drop.
  Learner check: On an issue card like "Cold Food", click "Mark Implemented". Confirm the status flips to active and displays the Before vs. After complaint drop metric.
  Commit: `Add action implementation toggle and before/after impact tracking`

- [ ] **6. Weekly report card and final polish**
  Becomes usable: A complete, scannable Weekly Report tab summarizing weekly mess metrics, meal satisfaction breakdown, hygiene compliance score, resolved issues, and next week's menu recommendations. Clean campus-themed styling with warm amber accents.
  Why now: Completes the final tab of the app, ensuring the proof of concept is 100% demo-ready for video recording and judging.
  PRD ref: `prd.md > Screens and Layout (Tab 3)`, `prd.md > Look and Feel`
  Spec ref: `spec.md > Components > WeeklyReportCard`, `spec.md > Look and Feel`
  Build: Build `WeeklyReportView.tsx` with weekly aggregations, satisfaction radar/bar indicators, printable report layout, and apply final styling polish across all tabs per `spec.md > Look and Feel`.
  Verify (mechanical): Run full `npm run build` production bundle check to ensure zero build errors or broken imports across all components.
  Learner check: Switch to the Weekly Report tab, verify all summary cards and metrics render cleanly, and test the app end-to-end on both desktop and mobile viewports.
  Commit: `Add weekly report view and finalize styling polish`

## Hands-on Checkpoints

- [ ] Early usable behavior explored — Slice 2 (Testing form submission, localStorage persistence, and demo data loading)
- [ ] Final kick-the-tires exploration and feedback completed — Slice 6 (End-to-end walkthrough of all 3 tabs, urgent alerts, and impact tracking)

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [to be recorded upon completion]
Route and stops: [to be recorded upon completion]
Edit outcome: [to be recorded upon completion]
Reflection: [to be recorded upon completion]
Activity mode: [to be recorded upon completion]

## Revisions

