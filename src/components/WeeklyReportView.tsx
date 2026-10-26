'use client';

import React from 'react';
import {
  FileText,
  Printer,
  ShieldCheck,
  Star,
  TrendingDown,
  Utensils,
  AlertTriangle,
  CheckCircle2,
  Sparkles,
  BarChart3,
  Calendar,
} from 'lucide-react';
import { FeedbackItem, MealType } from '@/lib/types';

interface WeeklyReportViewProps {
  feedbacks: FeedbackItem[];
}

export default function WeeklyReportView({ feedbacks }: WeeklyReportViewProps) {
  const total = feedbacks.length;

  // Meal breakdown calculations
  const meals: MealType[] = ['breakfast', 'lunch', 'snacks', 'dinner'];
  const mealStats = meals.map((m) => {
    const items = feedbacks.filter((f) => f.meal === m);
    const count = items.length;
    const avg = count > 0 ? items.reduce((acc, c) => acc + c.rating, 0) / count : 0;
    const criticals = items.filter((f) => f.urgency === 'critical').length;
    return {
      meal: m,
      count,
      avgRating: avg,
      criticals,
    };
  });

  // Overall metrics
  const avgRating = total > 0 ? feedbacks.reduce((acc, c) => acc + c.rating, 0) / total : 0;
  const criticalCount = feedbacks.filter((f) => f.urgency === 'critical').length;
  const hygieneComplaints = feedbacks.filter((f) => f.category === 'hygiene').length;
  const hygieneScore = total > 0 ? Math.max(0, Math.round(((total - hygieneComplaints) / total) * 100)) : 100;
  const implementedItems = feedbacks.filter((f) => f.actionImplemented);
  const implementedCount = implementedItems.length;

  // Implemented issues list (unique keys)
  const implementedKeys = Array.from(new Set(implementedItems.map((f) => f.issueKey)));
  const resolvedIssues = implementedKeys.map((key) => {
    const keyItems = feedbacks.filter((f) => f.issueKey === key);
    const item = keyItems[0];
    const actionTime = new Date(item.actionImplementedAt || item.createdAt).getTime();
    const before = keyItems.filter((f) => new Date(f.createdAt).getTime() <= actionTime).length;
    const after = keyItems.filter((f) => new Date(f.createdAt).getTime() > actionTime).length;
    const safeBefore = before > 0 ? before : 1;
    const drop = Math.max(0, Math.round(((safeBefore - after) / safeBefore) * 100));
    return {
      key,
      title: key.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      action: item.suggestedAction,
      drop,
      count: keyItems.length,
    };
  });

  // Top complaint clusters
  const issueCounts: Record<string, number> = {};
  feedbacks.forEach((f) => {
    if (f.issueKey && f.category !== 'positive') {
      issueCounts[f.issueKey] = (issueCounts[f.issueKey] || 0) + 1;
    }
  });

  const topIssues = Object.entries(issueCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([key, count]) => ({
      title: key.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' '),
      count,
    }));

  return (
    <div className="space-y-6">
      {/* Printable Report Container */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8 space-y-6 print:border-none print:shadow-none print:p-0">
        {/* Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-amber-500 text-white">
                <FileText className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  MessMitra Weekly Quality Audit
                </h2>
                <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Hostel Mess Committee • Evaluation Period: Last 7 Days</span>
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer self-start sm:self-auto print:hidden"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print / Save PDF</span>
          </button>
        </div>

        {/* Top KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Overall Rating</span>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-black text-slate-900">{avgRating.toFixed(1)}</span>
              <span className="text-xs text-slate-400">/ 5.0</span>
            </div>
            <div className="flex items-center gap-0.5 text-amber-500">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3 h-3 ${s <= Math.round(avgRating) ? 'fill-amber-400' : 'text-slate-200'}`}
                />
              ))}
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-1">
            <span className="text-[11px] font-semibold text-emerald-800 block">Hygiene Compliance</span>
            <p className="text-2xl font-black text-emerald-800">{hygieneScore}%</p>
            <span className="text-[10px] text-emerald-600 block">Cleanliness index</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-1">
            <span className="text-[11px] font-semibold text-amber-900 block">Critical Incidents</span>
            <p className="text-2xl font-black text-red-600">{criticalCount}</p>
            <span className="text-[10px] text-amber-800/80 block">Requires safety audit</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-1">
            <span className="text-[11px] font-semibold text-slate-500 block">Actions Resolved</span>
            <p className="text-2xl font-black text-slate-900">{implementedCount}</p>
            <span className="text-[10px] text-slate-400 block">Interventions logged</span>
          </div>
        </div>

        {/* Meal-Wise Breakdown Section */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <BarChart3 className="w-4 h-4 text-amber-600" />
              <span>Meal-Wise Satisfaction Breakdown</span>
            </h3>
            <span className="text-xs text-slate-400">Based on {total} total ratings</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {mealStats.map((ms) => {
              const scorePct = Math.round((ms.avgRating / 5) * 100);
              return (
                <div
                  key={ms.meal}
                  className="p-4 rounded-2xl bg-slate-50/70 border border-slate-200 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-800">
                      {ms.meal}
                    </span>
                    <span className="text-xs font-bold text-slate-900">
                      {ms.count > 0 ? `${ms.avgRating.toFixed(1)} / 5.0` : 'No reviews'}
                    </span>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        scorePct >= 70
                          ? 'bg-emerald-500'
                          : scorePct >= 50
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${scorePct || 0}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>{ms.count} feedback {ms.count === 1 ? 'entry' : 'entries'}</span>
                    {ms.criticals > 0 ? (
                      <span className="text-red-600 font-bold flex items-center gap-0.5">
                        <AlertTriangle className="w-3 h-3" /> {ms.criticals} critical alert
                      </span>
                    ) : (
                      <span className="text-emerald-600 font-medium">Zero critical alerts</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Closed Loop Resolved Actions */}
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Closed-Loop Impact Victories (Actions Taken)</span>
          </h3>

          {resolvedIssues.length === 0 ? (
            <p className="text-xs text-slate-400 italic">No implemented actions recorded this week.</p>
          ) : (
            <div className="space-y-2">
              {resolvedIssues.map((ri) => (
                <div
                  key={ri.key}
                  className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                >
                  <div className="space-y-0.5">
                    <span className="font-bold text-slate-900">{ri.title}</span>
                    <p className="text-slate-600 text-[11px]">{ri.action}</p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-[11px] whitespace-nowrap self-start sm:self-auto flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    {ri.drop}% Complaints Dropped
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* AI Recommendations for Next Week */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-2.5">
          <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>AI Operations & Menu Recommendations for Next Week</span>
          </div>

          <ul className="space-y-1.5 text-xs text-slate-700">
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                <strong>Food Warmers:</strong> Enforce counter heating burner activation 20 minutes before Dinner service to eradicate repetitive cold food complaints.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                <strong>Supplier Audit:</strong> Inspect raw pulses (daal and rajma) for stones and foreign objects before washing/boiling.
              </span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">•</span>
              <span>
                <strong>Portion Calibration:</strong> Start secondary rice and chapati batches earlier during Lunch rush to avoid student queue starvation.
              </span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
