'use client';

import React from 'react';
import {
  TrendingDown,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award,
} from 'lucide-react';
import { FeedbackItem } from '@/lib/types';

interface ImpactMetric {
  issueKey: string;
  issueTitle: string;
  category: string;
  actionTitle: string;
  actionDate: string;
  beforeCount: number;
  afterCount: number;
  reductionPercentage: number;
}

interface ImpactTrackerProps {
  feedbacks: FeedbackItem[];
}

export default function ImpactTracker({ feedbacks }: ImpactTrackerProps) {
  // Compute impact metrics for implemented issues
  const implementedKeys = Array.from(
    new Set(
      feedbacks
        .filter((f) => f.actionImplemented && f.actionImplementedAt)
        .map((f) => f.issueKey)
    )
  );

  const metrics: ImpactMetric[] = implementedKeys.map((key) => {
    const keyItems = feedbacks.filter((f) => f.issueKey === key);
    // Find the implementation timestamp (from the first item that has it)
    const implementedItem = keyItems.find((f) => f.actionImplemented && f.actionImplementedAt);
    const actionDate = implementedItem?.actionImplementedAt || new Date().toISOString();
    const actionTimestamp = new Date(actionDate).getTime();

    // Count complaints before vs after action timestamp
    const beforeItems = keyItems.filter(
      (f) => new Date(f.createdAt).getTime() <= actionTimestamp
    );
    const afterItems = keyItems.filter(
      (f) => new Date(f.createdAt).getTime() > actionTimestamp
    );

    const beforeCount = beforeItems.length > 0 ? beforeItems.length : 1;
    const afterCount = afterItems.length;

    // Calculate reduction: positive number indicates success (drop in complaints)
    const diff = beforeCount - afterCount;
    const reductionPercentage = Math.max(0, Math.round((diff / beforeCount) * 100));

    const formattedTitle = key
      .split('-')
      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    return {
      issueKey: key,
      issueTitle: formattedTitle,
      category: implementedItem?.category || 'General',
      actionTitle: implementedItem?.suggestedAction || 'Implemented corrective guideline.',
      actionDate,
      beforeCount,
      afterCount,
      reductionPercentage,
    };
  });

  if (metrics.length === 0) {
    return (
      <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 text-center space-y-2">
        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
          <TrendingDown className="w-5 h-5" />
        </div>
        <p className="text-xs font-bold text-slate-800">No interventions tracked yet</p>
        <p className="text-xs text-slate-500 max-w-sm mx-auto">
          Click <strong>"Mark Implemented"</strong> on any recurring issue card to start measuring before-and-after complaint reduction.
        </p>
      </div>
    );
  }

  // Calculate overall average reduction
  const avgReduction = Math.round(
    metrics.reduce((acc, curr) => acc + curr.reductionPercentage, 0) / metrics.length
  );

  return (
    <div className="bg-gradient-to-br from-emerald-500/10 via-white to-amber-500/10 rounded-2xl border border-emerald-200/80 p-5 shadow-xs space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>Closed-Loop Impact Tracker</span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                {avgReduction}% Avg Complaint Drop
              </span>
            </h3>
            <p className="text-xs text-slate-500">
              Measuring complaint volume before vs. after committee intervention
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-bold px-2.5 py-1 rounded-lg bg-emerald-600 text-white shadow-xs">
            {metrics.length} {metrics.length === 1 ? 'Action Active' : 'Actions Active'}
          </span>
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {metrics.map((m) => (
          <div
            key={m.issueKey}
            className="p-4 rounded-xl bg-white border border-emerald-200/90 shadow-xs space-y-2.5"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900">{m.issueTitle}</span>
              <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                <TrendingDown className="w-3 h-3" />
                {m.reductionPercentage}% Drop
              </span>
            </div>

            <p className="text-xs text-slate-600 line-clamp-2">
              <strong className="text-slate-700">Action:</strong> {m.actionTitle}
            </p>

            {/* Before vs After Visual Comparison */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-3">
                <div className="text-center">
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Before</span>
                  <span className="text-sm font-bold text-slate-800">{m.beforeCount} reports</span>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300" />
                <div className="text-center">
                  <span className="block text-[10px] text-emerald-600 uppercase font-semibold">After Action</span>
                  <span className="text-sm font-bold text-emerald-700">{m.afterCount} reports</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block">Implemented</span>
                <span className="text-[11px] font-medium text-slate-600">
                  {new Date(m.actionDate).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
