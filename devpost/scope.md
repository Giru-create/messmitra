---
doc: scope
status: approved
---

# MessMitra — AI Hostel Mess Feedback Analyzer

A mobile-friendly web app where hostel students submit quick mess feedback in English or Hinglish, and mess committees use AI to group issues, detect urgent safety/quality problems, act on recommendations, and track whether their interventions actually reduced complaints.

## The Unique Kernel
The closed loop: It bridges raw, informal Hinglish/English hostel feedback (which normally gets lost in chaotic WhatsApp groups) directly to prioritized committee actions, and—most distinctively—measures before-and-after impact to prove whether fixing an issue actually stopped student complaints.

## Who It's For
1. **The Hostel Student**: Frustrated by bad food quality, undercooked roti, or cold daal, but tired of typing complaints into ignored WhatsApp groups or writing in physical complaint registers that no one reads. Wants a quick, 20-second anonymous way to voice an issue in their natural language (English/Hinglish).
2. **The Mess Committee Member**: Overwhelmed by scattered complaints and verbal arguments. Needs to know what's truly urgent (e.g., hygiene or food safety risks), what repeats consistently across meals, and whether vendor warnings or menu changes made a measurable difference.

## The Core Loop
1. **Submit**: A student opens the app, picks the meal (Breakfast/Lunch/Snacks/Dinner), sets a 1–5 rating, and types or speaks feedback in English or Hinglish (e.g., *"Dinner me daal me insect mila!"*).
2. **Analyze**: Built-in offline smart/rule-based NLP analyzer immediately classifies category (Hygiene, Taste, Quantity, Service), assigns urgency (Critical/Urgent/Normal), extracts key issues, and detects sentiment. (Optional LLM API key integration available as an enhancement, but app operates 100% reliably offline without external keys).
3. **Group & Prioritize**: The committee dashboard aggregates complaints into grouped issue cards with counts, severity badges, and trend indicators. Critical items (like insect contamination) immediately flash as top priority alerts.
4. **Act & Track**: The committee reviews AI-suggested corrective actions (e.g., *"Replace daal supplier batch & inspect kitchen storage"*), clicks **"Mark Implemented"**, and MessMitra begins tracking before-and-after complaint volume for that issue.
5. **Report**: Generates a quick weekly report card showing resolution rate and impact.

## Inspiration & Identity
- **Vibe & Mood**: Clean, trustworthy, modern campus tool; energetic and utilitarian.
- **Visual Tone**: Crisp food-service palette (warm amber/orange accents paired with clean slate/neutral backgrounds), clear urgency badges (red for hygiene/urgent, yellow for taste/prep, green for resolved).
- **Language Feel**: Welcoming of natural Indian campus vernacular (Hinglish expressions like *"daal watery thi"*, *"roti kacchi thi"*, *"sabzi me namak kam hai"*).

## Why This Matters to the Learner
As a 2nd-year B.Tech AI/ML student living the hostel mess experience, this solves a daily, authentic frustration. It turns an everyday student problem into a practical demonstration of applied AI, structured planning, and verifiable impact measurement.

## What "Working" Looks Like
In under 2 minutes during a demo:
1. Tap **"Load Demo Data"** to instantly populate 10–15 realistic hostel feedback entries across Breakfast/Lunch/Dinner in English & Hinglish.
2. Submit a live Hinglish urgent complaint: *"Dinner me daal me insect mila!"*.
3. The dashboard instantly surfaces it as a top **Hygiene / Critical Alert** and updates the grouped issue count.
4. The user clicks **"Implement Action"** on an existing repeated issue (*"Switched paneer vendor"*), and the impact card displays a clear Before vs. After comparison showing complaint drop-off.
5. Generate a one-click **Weekly Summary**.

## The POC Boundary
- **Included (Now)**:
  - Mobile-responsive single-page app (Next.js + Tailwind CSS).
  - Quick feedback form: Meal type, Rating (1–5), Free-text feedback (English/Hinglish), optional issue tag.
  - Built-in offline AI analyzer (rule/keyword-based classification for category, sentiment, urgency, and issue extraction) with zero external API dependencies. Optional LLM enhancement hook if an API key is provided.
  - Committee Dashboard: Grouped issues, urgency alerts, severity badges, complaint counts.
  - "Mark Action Implemented" status toggle.
  - Before-and-after impact metric comparison (complaints before vs. after action date).
  - One-click "Load Demo Data" button and local data reset.
  - Exportable / viewable weekly summary report.
  - Client persistence via `localStorage`.

## Later
- Multi-hostel support with hostel switching.
- Student upvoting / "+1 me too" on existing complaints.
- Push notifications / WhatsApp notification bot integration.
- Vendor SLA management and penalty calculation.

## Explicitly Cut
- **User Authentication / Login**: Adds sign-up friction; students need anonymous, zero-barrier submissions, and the demo must run instantly without account setup.
- **Photo Uploads**: Increases storage/hosting complexity for a 2–4 hour hackathon scope; text descriptions in English/Hinglish are sufficient to prove the feedback engine.
- **Real-time Chat**: Defeats the purpose of structured asynchronous analytics and invites unmoderated noise.
- **Backend Database / Mandatory Cloud APIs**: Replaced with robust `localStorage` state management and offline smart NLP logic so the POC is 100% self-contained, offline-reliable, zero-cost, and instant to run.
