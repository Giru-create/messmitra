---
doc: spec
status: approved
---

# MessMitra — Technical Spec

## How This Works, In Plain Language

MessMitra is a self-contained, mobile-friendly web application designed to help hostel students voice mess feedback in their natural everyday language (English or Hinglish) and help mess committees take measurable action.

Here is how the pieces work together:
1. **The App in Your Browser**: Everything runs directly inside the user's web browser using Next.js and React. There is no remote backend server or database to configure or keep alive.
2. **Local Storage (The Browser's Notebook)**: All feedback entries, urgency levels, and action timestamps are saved to the browser's `localStorage`. When you refresh the page or return tomorrow, your data is still there.
3. **The Built-in Offline AI Analyzer**: Instead of sending student feedback over the internet to a paid or slow third-party API, the app includes a local rule-and-keyword pattern-matching engine. When a student types *"daal me insect mila"*, the offline engine instantly detects trigger words (*"insect"*, *"keeda"*, *"kankad"*), assigns the category **Hygiene**, classifies the urgency as **Critical**, and produces a suggested remedy—instantly and 100% offline. (An optional LLM API key hook exists for future enhancement, but the app never depends on it).
4. **Issue Grouping & Impact Measurement**: The app inspects all stored feedback, clusters entries under normalized keys (like `daal-contamination` or `cold-food`), and calculates before-and-after complaint trends whenever a committee member marks a corrective action as "Implemented".

Why this shape? It eliminates API costs, network delays, complex database setups, and login friction. It guarantees that the hackathon demo will work every single time without connection issues or rate limits.

---

## The Core Journey Through the System

Implements `prd.md > The Core Journey`.

```
[Student Submits Form]
        │
        ▼
[Offline AI Analyzer] ──(Extracts Category, Urgency, Issue Key)──┐
        │                                                        │
        ▼                                                        ▼
[Save to localStorage] ─────────────────────────────────→ [State Updates]
        │                                                        │
        ├───────────────────────────────┬────────────────────────┤
        ▼                               ▼                        ▼
[Student Tab: Toast]            [Dashboard Tab]          [Weekly Report Tab]
• Category & Urgency            • Critical Urgent Alert  • Meal scores
• 2s auto-clear form            • Grouped Issue Cards    • Hygiene metric
• "View Dashboard" link         • Before/After Impact    • Action history
```

1. **Step 1: Submission**: Student selects meal (e.g. *Dinner*), gives a 1-star rating, and types *"Dinner me daal me insect mila!"* in `FeedbackForm`.
2. **Step 2: Analysis**: The form passes text to `analyzeFeedbackOffline()`. The analyzer detects *"insect"* / *"daal"*, returning `{ category: "hygiene", urgency: "critical", issueKey: "food-foreign-object", sentiment: "negative", summary: "Insect found in dinner daal" }`.
3. **Step 3: Storage & Notification**: The complete feedback object is prepended to the array in `localStorage` and React state. A success toast displays: *"Feedback submitted! AI classified it as: Hygiene • Critical"* with a button to jump to the dashboard.
4. **Step 4: Committee Triage**: In the `CommitteeDashboard`, the urgent alert banner immediately surfaces the Critical incident. The issue card for `food-foreign-object` increments its count.
5. **Step 5: Impact Loop**: Committee reviews the suggested action (*"Inspect daal storage and replace supplier batch"*), clicks **"Mark Implemented"**. The app records the timestamp. As subsequent feedback arrives, the system computes complaints *before* vs. *after* that timestamp to display the percentage reduction.

---

## Stack

- **Framework**: Next.js 14+ (App Router, Client-Side Rendering with `"use client"`).
  - [Next.js Documentation](https://nextjs.org/docs)
  - *Rationale*: Fast scaffolding, clean component structure, standard React ecosystem, and zero-configuration local development.
- **Styling**: Tailwind CSS (v3).
  - [Tailwind CSS Documentation](https://tailwindcss.com/docs)
  - *Rationale*: Utility classes allow rapid creation of modern, responsive, mobile-optimized card layouts and status badges without writing manual CSS sheets.
- **Icons**: Lucide React.
  - [Lucide Icons Documentation](https://lucide.dev/icons)
  - *Rationale*: Clean, lightweight SVG icons for meals, stars, status pills, and alerts with zero bundle bloat.
- **Persistence**: Browser `localStorage` API.
  - [MDN Web Docs - Window.localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)
  - *Rationale*: 100% client-side, zero database infrastructure, persists across browser refreshes, and resets cleanly with one click.
- **Language**: TypeScript or modern JavaScript (ES6+).
  - *Rationale*: Clear, typed interfaces for data models and analyzer outputs ensure predictable data flow.

---

## Where It Runs and How Someone Tries It

- **Runtime**: Local Node.js environment (Node 18+ or 20+).
- **Environment Requirements**: None. Zero external cloud keys, databases, or API credentials required.
- **Start Command**:
  ```bash
  npm run dev
  ```
- **What to Open**:
  Open your web browser to `http://localhost:3000`.
- **Demo Recording Walkthrough** (for required Devpost video):
  1. Open `http://localhost:3000` (shows empty state with clean call-to-action).
  2. Click **"Load Demo Data"** to populate 12–15 realistic English and Hinglish meal reports.
  3. Under **Student Feedback**, submit a live Hinglish urgent report: *"Dinner me daal me insect mila!"*. Notice the instant offline AI toast: **Hygiene • Critical**.
  4. Switch to **Committee Dashboard**: Show the pinned Urgent Alert at the top, inspect the grouped issue card, and click **"Mark Implemented"**. Show the Before vs. After impact drop metric.
  5. Switch to **Weekly Report**: Show the summary card with hygiene score, meal quality breakdown, and resolved actions.
- **Deployment (Optional)**: Can be deployed in one click to Vercel via GitHub repository, but local execution is 100% sufficient for the required demo video.

---

## Look and Feel

Implements `prd.md > Look and Feel`.

- **Visual Tone**: Warm campus canteen warmth meets modern utility dashboard. Clean, high contrast, uncluttered.
- **Color Palette**:
  - Primary / Brand: Warm Amber & Deep Orange (`amber-500` / `orange-600`) for headers, primary buttons, and active tabs.
  - Neutral Backgrounds: Crisp clean slate (`bg-slate-50` page body, pure `bg-white` cards with `shadow-sm` and `border-slate-200`).
  - Text Hierarchy: `text-slate-900` for titles, `text-slate-700` for form labels, `text-slate-500` for timestamps and subtitles.
- **Urgency & Severity Badges**:
  - `Critical`: `bg-red-100 text-red-700 border-red-200`
  - `High`: `bg-orange-100 text-orange-800 border-orange-200`
  - `Medium`: `bg-amber-100 text-amber-800 border-amber-200`
  - `Low / Resolved`: `bg-emerald-100 text-emerald-800 border-emerald-200`
- **Mobile Friendliness**: Fixed top navigation bar, 48px+ tap targets for star ratings and buttons, sticky responsive layout with seamless scrolling.

---

## Components

Grouped by responsibility and mapped to PRD behaviors:

### AppShell
- Implements `prd.md > Screens and Layout`.
- Manages the top header (branding, subtitle, `Load Demo Data`, `Reset Data` buttons) and the active tab navigation state (`student`, `dashboard`, `report`).
- Houses the shared React state (`feedbacks`, `filter`, `activeTab`) and synchronizes state with `localStorage`.

### FeedbackForm
- Implements `prd.md > 1. Student Feedback Ingestion`.
- Renders meal selector pills (Breakfast, Lunch, Snacks, Dinner), 1–5 star rating picker, Hinglish-encouraging textarea, and optional issue tag.
- Validates that meal and text are present; handles submit events and passes input to `analyzeFeedbackOffline()`.
- Triggers success toast and auto-clears inputs after 2 seconds.

### ToastNotification
- Implements `prd.md > 1. Student Feedback Ingestion` and `prd.md > States and Boundaries`.
- Displays dynamic feedback submission confirmation with extracted Category and Urgency badges, and an actionable **"View Dashboard"** link.

### CommitteeDashboard
- Implements `prd.md > 3. Committee Dashboard & Issue Clustering`.
- Displays top summary metric cards (Total Feedback, Critical Alerts Count, Average Rating, Implemented Actions).
- Provides filter pills by meal type and category.
- Embeds the `UrgentAlertsBanner`, `GroupedIssueCards`, and `ImpactTracker`.

### UrgentAlertsBanner
- Implements `prd.md > 3. Committee Dashboard & Issue Clustering`.
- Prominently filters and pins any feedback entries with `urgency === 'critical'` or `urgency === 'high'`.
- Highlights contaminated food, foreign objects, or health risks in bold red/orange alert cards.

### GroupedIssueCards
- Implements `prd.md > 3. Committee Dashboard & Issue Clustering` and `prd.md > 4. Corrective Action & Before/After Impact Tracking`.
- Clusters individual feedback entries by `issueKey` (e.g. `cold-food`, `watery-daal`, `chapati-shortage`).
- Displays issue title, complaint count badge, average rating, latest student quote, and the AI-suggested corrective action box with a **"Mark Implemented"** toggle button.

### ImpactTracker
- Implements `prd.md > 4. Corrective Action & Before/After Impact Tracking`.
- Analyzes issues where `actionImplemented === true`.
- Calculates number of complaints received *before* `actionImplementedAt` vs. complaints received *after*.
- Displays the reduction percentage (e.g., *"75% drop in complaints since vendor warning"*).

### WeeklyReportCard
- Implements `prd.md > Screens and Layout` (Tab 3: Weekly Report).
- Synthesizes all stored data into a clean, printable weekly report card: overall mess satisfaction index, meal-wise breakdown table, hygiene compliance score, top resolved complaints, and recommendations for next week's menu.

### DemoDataManager
- Implements `prd.md > 5. Demo Data Management & Reset`.
- Provides one-click initialization of 12–15 realistic English and Hinglish student feedback entries with staggered timestamps, covering all 4 meals and varied urgency levels.
- Provides a safe data reset with browser confirmation dialog.

---

## Data Model

Each feedback entry follows this standardized data structure:

```typescript
export interface FeedbackItem {
  id: string;                          // Unique UUID or timestamp-based ID
  createdAt: string;                   // ISO 8601 string (e.g. "2026-10-25T13:30:00Z")
  meal: 'breakfast' | 'lunch' | 'snacks' | 'dinner';
  rating: number;                      // 1 to 5
  feedbackText: string;                // Raw user submission (English or Hinglish)
  language: 'english' | 'hinglish';    // Detected input language
  issueTag?: string;                   // Optional user-selected tag
  category: 'hygiene' | 'taste' | 'quantity' | 'temperature' | 'service' | 'menu variety' | 'positive' | 'other';
  sentiment: 'positive' | 'neutral' | 'negative';
  urgency: 'low' | 'medium' | 'high' | 'critical';
  issueKey: string;                    // Normalized issue group key (e.g. "insect-in-food", "cold-dinner", "chapati-shortage")
  summary: string;                     // 1-sentence clean summary of the issue
  suggestedAction: string;             // AI recommended corrective action
  actionImplemented: boolean;          // Whether mess committee took action
  actionImplementedAt?: string;        // ISO 8601 timestamp when action was marked implemented
}
```

### Where State Lives
- **Primary Source of Truth**: Browser `localStorage` under key `'messmitra_feedbacks'`.
- **Runtime React State**: Lifted to `AppShell` (or custom hook `useMessFeedback`) as `FeedbackItem[]`.
- **Hydration / Lifecycle**: When the app first loads, an effect initializes state from `localStorage`. If empty, the app displays the friendly empty state inviting the user to load demo data. Every addition, action toggle, or reset writes synchronously back to `localStorage`.

---

## File Structure

```
messmitra/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with font and metadata
│   │   ├── page.tsx               # Main AppShell containing 3-tab layout
│   │   └── globals.css            # Tailwind directives and base styles
│   ├── components/
│   │   ├── Header.tsx             # Top navigation bar, logo, demo/reset actions
│   │   ├── TabNavigation.tsx      # 3-tab pill switcher (Student, Committee, Report)
│   │   ├── StudentFeedbackForm.tsx# Form with meal chips, star rating, text area
│   │   ├── ToastNotification.tsx  # Dynamic success toast with AI category/urgency
│   │   ├── CommitteeDashboard.tsx # Metrics, urgent alerts, and issue list
│   │   ├── UrgentAlertsBanner.tsx # Pinned high/critical alerts
│   │   ├── GroupedIssueCard.tsx   # Clustered complaints & "Mark Implemented" button
│   │   ├── ImpactTracker.tsx      # Closed-loop Before vs After impact comparison
│   │   └── WeeklyReportView.tsx   # Weekly summary printable card
│   ├── lib/
│   │   ├── types.ts               # FeedbackItem and filter type definitions
│   │   ├── analyzer.ts            # Built-in offline AI NLP heuristic parser
│   │   ├── demoData.ts            # 12-15 realistic English/Hinglish demo records
│   │   └── storage.ts             # localStorage helper functions with safe SSR fallbacks
├── devpost/
│   ├── learner-profile.md         # Profile and learning goals
│   ├── scope.md                   # Approved project scope
│   ├── prd.md                     # Approved product requirements document
│   └── spec.md                    # This technical blueprint
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## External Services and Dependencies

1. **Next.js & React**: Core UI runtime. Standard npm packages; no external service connection.
2. **Tailwind CSS & PostCSS**: Build-time utility CSS compilers.
3. **Lucide React**: Client-side SVG icon library.
4. **Optional LLM API Hook (OpenAI / Gemini compatible)**:
   - *Status*: Optional enhancement hook located in `src/lib/analyzer.ts`.
   - *Behavior*: If `process.env.NEXT_PUBLIC_AI_API_KEY` is not present, `analyzer.ts` seamlessly runs 100% on the internal rule-based heuristic parser with zero network requests. The core app has **zero mandatory external service dependencies**.

---

## Important Failure Modes

1. **Next.js SSR Hydration Mismatch**:
   - *What breaks*: `localStorage` does not exist during server-side rendering, which can cause React hydration warnings or mismatch errors if accessed directly in initial render.
   - *Fallback*: Implement a `mounted` check or `useEffect` hook in `useMessFeedback` / `storage.ts` ensuring `localStorage` is only queried once the component is mounted on the client.
2. **Strange or Unrecognized Hinglish Vocabulary**:
   - *What breaks*: Student submits slang or words not in the analyzer's keyword dictionary (e.g., *"khana ekdum bakwaas"*).
   - *Fallback*: Default gracefully to Category: `Taste & Quality`, Urgency: `Medium` (or `Low` if rating >= 3), and generate a general suggestion rather than throwing an error or hanging.
3. **Duplicate Demo Data Loading**:
   - *What breaks*: User accidentally taps "Load Demo Data" multiple times, flooding the dashboard.
   - *Fallback*: Display an inline prompt asking confirmation if demo records are already present, or smart-replace demo records without multiplying duplicates.

---

## What Was Simplified and Why

1. **Client-Side `localStorage` instead of Cloud Database (PostgreSQL / MongoDB)**:
   - *Why*: A remote database requires connection pooling, environment secrets, and internet connectivity. `localStorage` makes the app zero-cost, instantly bootable, and 100% resilient during live judging demos.
2. **Built-in Offline Heuristic AI instead of Mandatory Cloud LLM API**:
   - *Why*: Cloud LLMs introduce latency (2–5 seconds per submit), rate limits, billing requirements, and potential demo-breaking network failures. The local keyword/regex engine returns results in under 5 milliseconds with 100% uptime.
3. **Display Name / Anonymous Submissions instead of Full Auth**:
   - *Why*: Eliminates registration screens, password resets, and session tokens. In real hostel environments, anonymity increases candid feedback.
4. **Text Descriptions instead of Photo Uploads**:
   - *Why*: Uploading photos requires object storage buckets (S3/Cloud Storage) and multipart forms. Text descriptions in Hinglish capture food issues thoroughly without file-handling overhead.

---

## Decisions and Open Issues

### Key Decisions
- **Stack Decision**: Next.js + Tailwind CSS. Accepted tradeoff: slightly more initial files than a single HTML file, but provides robust component modularity, instant hot-reloading, and scalable React state handling.
- **Data Model Schema**: Single flat `FeedbackItem` schema with normalized `issueKey`. This allows easy grouping and before/after impact calculations without complex relational joins.
- **Build Staging**: 9 ordered sequential steps directly aligned with PRD features, verified step-by-step:
  1. App shell with three tabs (Student Feedback, Committee Dashboard, Weekly Report)
  2. Feedback form and localStorage saving
  3. Demo data loader with 12–15 realistic English/Hinglish entries
  4. AI analysis and issue grouping
  5. Committee dashboard with severity, trends, and urgent alerts
  6. Action recommendation and Mark Implemented
  7. Before-and-after impact tracking
  8. Weekly report
  9. Final testing and polish

### Learner Uncertainty Resolved
- **The Concept**: Client-side state hydration in Next.js when using `localStorage`.
- **Explanation**: In Next.js App Router, components initially evaluate on the server where `window` and `localStorage` do not exist. Directly writing `const [data] = useState(JSON.parse(localStorage.getItem(...)))` causes a crash or hydration mismatch.
- **The Solution**: We will use a dedicated `useLocalStorage` pattern: start with an initial empty state, load from `localStorage` inside a `useEffect(() => { ... }, [])` once mounted on the client, and render cleanly. This ensures smooth, bug-free client execution.

### Open Questions
- None. All functional boundaries, data structures, and styling guidelines are fully resolved.
