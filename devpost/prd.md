---
doc: prd
status: approved
---

# MessMitra — Product Requirements Document (PRD)

A mobile-first web app empowering hostel students to anonymously report meal issues in English or Hinglish, while providing mess committees with real-time AI issue clustering, critical urgency alerts, corrective action recommendations, and before-and-after impact tracking.
Source: `scope.md > The Unique Kernel` and `scope.md > Who It's For`.

## The Core Journey
Source: `scope.md > The Core Loop` and `scope.md > What "Working" Looks Like`.

1. **Arrival & Initial View**: User arrives at the app; the top header displays the app branding (**MessMitra**) alongside quick utility actions (**Load Demo Data** and **Reset Data**). The app defaults directly to the **Student Feedback** tab.
2. **Submitting Feedback**:
   - The student chooses the Meal Type (Breakfast, Lunch, Snacks, Dinner).
   - Selects a Rating (1 to 5 stars).
   - Enters feedback text in English or natural Hinglish (e.g., *"Dinner me daal me insect mila!"*).
   - Optionally selects an Issue Tag (e.g., Hygiene, Taste, Quantity, Service).
   - Taps **"Submit Feedback"**.
3. **Immediate Classification**:
   - The built-in offline NLP engine immediately parses the feedback.
   - A success banner appears: *"Feedback submitted! AI classified it as: [Category] • [Urgency]"* (e.g., *"Hygiene • Critical"*).
   - The form clears after 2 seconds while the success banner remains with a **"View Dashboard"** quick link.
4. **Committee Review & Triage**:
   - Switching to the **Committee Dashboard** tab displays:
     - **Urgent Alerts**: Pinned banner at the top highlighting Critical/High severity incidents (e.g., foreign objects, food poisoning risk).
     - **Grouped Issue Cards**: Clustered complaint topics (e.g., *"Stale Paneer in Lunch"*, *"Watery Daal"*) with occurrence counts, average rating, severity badges, and recent feedback snippets.
5. **Action Recommendation & Implementation**:
   - Each recurring issue card presents an AI-suggested corrective action (e.g., *"Inspect dairy supplier batch and replace vendor"*).
   - A committee member clicks **"Mark Implemented"**. The action status changes to active, and a timestamp is recorded.
6. **Before-and-After Impact Tracking**:
   - The system tracks complaint frequency for that issue before vs. after the implementation timestamp.
   - The impact card renders a clear visual comparison: e.g., *"Complaints dropped by 80% (10 before vs. 2 after)"*.
7. **Weekly Report**:
   - Switching to the **Weekly Report** tab renders a scannable summary card of the week's meal quality scores, resolution velocity, top persistent issues, and resolved improvements.

## Screens and Layout
A unified single-page mobile-optimized web app featuring a fixed top navigation bar with three primary tabs:

- **Top Bar**:
  - Logo / App Title: **MessMitra** with subtitle *"AI Hostel Mess Analyzer"*.
  - Action Buttons: `Load Demo Data` (with duplicate confirmation) and `Reset Data` (with destructive confirmation).
- **Tab 1: Student Feedback (Default)**:
  - Clean card form: Meal selector chips (Breakfast, Lunch, Snacks, Dinner).
  - Star rating component (1 to 5).
  - Textarea with placeholder encouraging Hinglish/English (e.g., *"e.g., Roti kacchi thi ya sabzi stale lag rahi thi..."*).
  - Optional category tag pills.
  - Large primary Submit button.
  - Interactive Success Toast with category, urgency badge, and "View Dashboard" button.
- **Tab 2: Committee Dashboard**:
  - Top Metric Summary: Total Complaints, Urgent Alerts Count, Avg Rating, Actions Taken.
  - Urgent Safety Alerts section (Critical/High items highlighted with high contrast).
  - Grouped Issues List: Filterable by meal or category, showing issue title, complaint count badge, urgency badge, recent quotes, and AI Action Box.
  - Closed-Loop Impact Tracker: Displays implemented actions and before-vs-after complaint drop statistics.
- **Tab 3: Weekly Report**:
  - Clean printable / scannable summary report card.
  - Key metrics: Total feedback received, meal-wise breakdown, hygiene score, actions completed, and key recommendations for next week.

## Look and Feel
Source: `scope.md > Inspiration & Identity`.

- **Theme**: Crisp, clean light mode designed for campus utility.
- **Color Palette**:
  - Primary Accent: Warm amber / deep orange (`amber-500` / `orange-600`) representing warmth, food, and energy.
  - Neutrals: Slate/gray text (`slate-800` headings, `slate-600` body) and clean cool gray card borders (`slate-200`).
  - Surfaces: Pure white cards (`bg-white`) with subtle elevation (`shadow-sm`, rounded-xl corners).
- **Status Badges**:
  - **Critical**: Vibrant Red (`bg-red-100 text-red-700 border-red-300`)
  - **High**: Vivid Orange (`bg-orange-100 text-orange-800 border-orange-300`)
  - **Medium**: Amber (`bg-amber-100 text-amber-800 border-amber-300`)
  - **Low / Resolved**: Soft Green (`bg-emerald-100 text-emerald-800 border-emerald-300`)
- **Typography & Elements**:
  - Highly legible sans-serif font.
  - Large, accessible tap targets (buttons min height 48px).
  - Simple, lightweight SVG icons for meals and categories.
  - No bloated or distracting animations.

## Features and Behavior

### 1. Student Feedback Ingestion
- **Description**: Allows rapid, frictionless submission without requiring accounts or logins.
- **Acceptance Criteria**:
  - [ ] Submitting empty text or without selecting meal type is prevented with an inline error hint.
  - [ ] Supports English, pure Hindi transliteration, and mixed Hinglish phrases.
  - [ ] On tap of "Submit", immediately analyzes text and triggers the confirmation card showing extracted Category and Urgency.
  - [ ] Auto-clears input fields after 2 seconds while preserving success message.
  - [ ] "View Dashboard" button switches active tab directly to the Committee Dashboard.

### 2. Built-in Offline AI Analyzer
- **Description**: Real-time rule-based / NLP pattern engine operating client-side with zero external network dependency.
- **Acceptance Criteria**:
  - [ ] Detects Categories: Hygiene, Taste & Quality, Quantity, Service & Timing.
  - [ ] Detects Urgency Levels: Critical (insects, glass, spoiled/sour food, hair, vomiting/illness), High (raw/undercooked, completely cold food), Medium (bland, excess oil, salty), Low (minor preference).
  - [ ] Correctly flags *"Dinner me daal me insect mila!"* as **Hygiene • Critical**.
  - [ ] Generates a 1-sentence recommended action tailored to the detected issue.

### 3. Committee Dashboard & Issue Clustering
- **Description**: Synthesizes individual raw submissions into cohesive clusters so committees see trends instead of isolated noise.
- **Acceptance Criteria**:
  - [ ] Similar complaints are grouped under standardized issue titles (e.g., multiple reports about cold food group under *"Cold Food / Late Service"*).
  - [ ] Critical and High severity issues are elevated to the pinned Urgent Alerts section.
  - [ ] Each issue card displays the count of student reports, earliest/latest timestamps, and sample quotes.

### 4. Corrective Action & Before/After Impact Tracking
- **Description**: The core differentiator that closes the loop between complaining and measurable resolution.
- **Acceptance Criteria**:
  - [ ] Clicking "Mark Implemented" transitions the action from "Pending" to "Implemented" with an active timestamp.
  - [ ] Tracks complaints recorded before that timestamp vs. complaints recorded after.
  - [ ] Dynamically displays percentage reduction (e.g., *"Complaints decreased by 75% post-action"*).

### 5. Demo Data Management & Reset
- **Description**: Enables instant live demonstration and zero-hassle resets.
- **Acceptance Criteria**:
  - [ ] Tapping "Load Demo Data" populates 12–15 realistic pre-constructed English and Hinglish entries covering various meals, ratings, and urgency levels.
  - [ ] If demo data is already present, prompts: *"Demo data already loaded. Add again?"*
  - [ ] Tapping "Reset Data" prompts user confirmation before purging `localStorage`.

## States and Boundaries

- **Empty State (First Use or Post-Reset)**:
  - Both Committee Dashboard and Weekly Report show: *"No feedback yet. Load demo data to see how MessMitra groups complaints, detects urgent issues, and tracks improvements."*
  - Displays a prominent, central **"Load Demo Data"** button.
- **Active State (Normal Use)**:
  - Displays populated metrics, alert cards, grouped clusters, and impact trackers.
- **Success State**:
  - Visual toast/card following submission with classification badge and shortcut to dashboard.
- **Persistence**:
  - All feedback entries, action statuses, and timestamps are stored in browser `localStorage`. Survives page reloads.

## Product Decisions
- **3 Top Fixed Tabs**: Direct division of student submission vs. committee analysis ensures both core user journeys are accessible without cluttered sub-menus.
- **100% Offline Heuristic AI by Default**: Eliminates API latency, rate limits, and broken demos during hackathon judging.
- **Anonymous Submissions**: Omitting logins ensures realistic hostel adoption and zero demo setup friction.

## What We're Building (POC Scope)
- 3-tab responsive web application in Next.js + Tailwind CSS.
- Student Feedback Form with meal chips, star rating, Hinglish text input.
- Offline NLP Analyzer for classification, urgency, sentiment, and action drafting.
- Committee Dashboard with urgent alerts, grouped issues, and impact tracking.
- Weekly Summary Report printable card.
- Demo data loader (12–15 realistic entries) and reset handler.
- Full `localStorage` persistence.

## Deferred From the POC
- **User Authentication / Role Permissions**: Anyone with access to the URL can view both tabs for demo clarity.
- **Photo Uploads**: Text analysis is sufficient for proof of concept.
- **External Database**: Not needed for a single-client demonstration.

## Non-Goals
- Real-time chat or multi-user socket synchronization.
- Complex backend server infrastructure.
- Payment or mess bill deductions.

## Open Questions
- None. All functional requirements, visual styles, and edge cases have been resolved.
