# MessMitra 🍲

> **AI Hostel Mess Feedback Analyzer**  
> Bridging anonymous student feedback in English & Hinglish to actionable committee resolutions with closed-loop impact tracking.

[![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## 📌 Problem

In college hostels across India, mess feedback is chronically broken:
- **Scattered Communication**: Complaints get lost in noisy WhatsApp groups or buried in physical complaint registers that no one reviews.
- **Natural Language Barrier**: Students express authentic frustrations in everyday colloquial Hinglish (*"daal me insect mila"*, *"roti kacchi thi"*, *"chawal khatam ho gaye"*), which standard administrative forms fail to categorize.
- **No Follow-Through**: Students stop voicing concerns because they never know if complaints lead to real change. Mess committees lack data to prove whether vendor warnings or recipe adjustments actually stopped recurring issues.

---

## 💡 Solution

**MessMitra** turns messy, informal hostel feedback into structured administrative action:
1. **Zero-Barrier Ingestion**: Students submit feedback in seconds—no login, no passwords, 100% anonymous, with full support for natural Hinglish phrases.
2. **Instant Offline AI NLP Analyzer**: A built-in heuristic pattern-matching engine classifies category (Hygiene, Taste, Quantity, Temperature, Service, Variety), detects sentiment, and assigns urgency levels in under 5 milliseconds with zero cloud dependencies.
3. **Priority Triage**: Critical food safety and hygiene risks (foreign objects, spoiled dairy, insects) are automatically pinned to the top of the committee dashboard.
4. **Issue Clustering**: Recurring complaints are aggregated under standardized issue cards (e.g. *Cold Dinner*, *Undercooked Roti*, *Insect in Food*) with frequency counts and student quotes.
5. **Closed-Loop Impact Tracking**: When the committee marks an action as "Implemented", MessMitra calculates before-and-after complaint drop percentages to prove that the problem was genuinely solved.
6. **Weekly Quality Audit**: Automatically generates a printable summary report card with meal satisfaction breakdowns, hygiene compliance scores, and actionable recommendations.

---

## 🚀 Key Features

- **Mobile-First Student Feedback Form**:
  - Meal selection chips (Breakfast, Lunch, Snacks, Dinner).
  - 1–5 star rating picker.
  - Natural Hinglish and English text parsing.
  - Interactive submission toast with extracted AI category and urgency tags.
- **Built-in Offline AI Analyzer**:
  - 100% self-contained rule-based NLP engine—zero API latency, zero rate limits, and zero external costs.
  - Automatically identifies critical triggers (*"insect"*, *"keeda"*, *"kankad"*, *"stale"*, *"sour"*, *"cold"*, *"watery"*).
- **Committee Dashboard**:
  - Executive KPI summary: Total reports, Critical alerts, Average rating, Implemented actions.
  - Filterable by meal type and category.
  - Clustered issue cards with quotes, average star ratings, and AI remedies.
- **Before-and-After Impact Engine**:
  - Tracks complaints logged *before* vs. *after* an action's implementation timestamp.
  - Displays dynamic complaint reduction metrics (e.g., *80% drop in complaints*).
- **Weekly Report & PDF Export**:
  - Clean audit card for weekly mess meetings.
  - Printable layout (`window.print()` / Save as PDF).

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Client Components)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State & Persistence**: Browser `localStorage` with SSR-safe hydration handling
- **Language**: TypeScript

---

## 🏁 Quick Start & Setup

### Prerequisites
- Node.js 18.x or 20.x+
- npm or yarn

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/<your-username>/messmitra.git
   cd messmitra
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🎬 Demo Instructions (Try It in 2 Minutes)

1. **Empty State & Demo Data**:
   - Open [http://localhost:3000](http://localhost:3000).
   - In the top header, click **"Load Demo Data"**. This instantly seeds 14 realistic hostel entries across all 4 meals in English and Hinglish.
2. **Submit a Live Urgent Feedback**:
   - In the **Student Feedback** tab, select **Dinner**, choose **1 Star**, and type:
     > *"Dinner me daal me insect mila!"*
   - Tap **"Submit Anonymous Feedback"**.
   - Notice the instant toast: **Hygiene • Critical** with extracted summary *"Foreign object/insect found in dinner food"*.
3. **Inspect the Committee Dashboard**:
   - Switch to the **Committee Dashboard** tab.
   - Observe the pinned red **Priority Triage** banner highlighting the insect incident.
   - Inspect the **Clustered Issue Cards** (e.g. *Cold Dinner*, *Undercooked Roti*).
   - Click **"Mark Implemented"** on any issue. Watch the **Impact Tracker** calculate the Before vs. After complaint drop percentage!
4. **View the Weekly Report**:
   - Switch to the **Weekly Report** tab.
   - Review meal-wise satisfaction bars, the hygiene compliance score, closed-loop impact victories, and next week's AI recommendations.
   - Click **"Print / Save PDF"** to preview the clean printable format.

---

## 📁 Repository Structure

```
messmitra/
├── src/
│   ├── app/
│   │   ├── layout.tsx             # Root layout with metadata
│   │   ├── page.tsx               # Main AppShell containing 3-tab layout
│   │   └── globals.css            # Tailwind directives and styles
│   ├── components/
│   │   ├── Header.tsx             # Top navigation, logo, demo data & reset buttons
│   │   ├── TabNavigation.tsx      # 3-tab switcher (Student, Committee, Report)
│   │   ├── StudentFeedbackForm.tsx# Form with meal chips, stars, Hinglish input
│   │   ├── ToastNotification.tsx  # Dynamic toast with AI classification pills
│   │   ├── CommitteeDashboard.tsx # Metrics, filters, and clustered issue cards
│   │   ├── UrgentAlertsBanner.tsx # Pinned high/critical food safety alerts
│   │   ├── GroupedIssueCard.tsx   # Clustered cards with AI actions & toggles
│   │   ├── ImpactTracker.tsx      # Closed-loop Before vs After impact engine
│   │   └── WeeklyReportView.tsx   # Printable weekly audit report card
│   └── lib/
│       ├── types.ts               # Core TypeScript data schemas
│       ├── analyzer.ts            # Built-in offline AI NLP heuristic parser
│       ├── demoData.ts            # 14 realistic English/Hinglish demo records
│       └── storage.ts             # Safe client-side localStorage helpers
├── devpost/
│   ├── scope.md                   # Approved project scope & kernel
│   ├── prd.md                     # Approved product requirements document
│   ├── spec.md                    # Technical architecture blueprint
│   ├── checklist.md               # 6-slice verified build checklist
│   └── app-map.html               # Visual architecture diagram & tour
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
