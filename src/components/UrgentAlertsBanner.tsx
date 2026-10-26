'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';
import { FeedbackItem } from '@/lib/types';

interface UrgentAlertsBannerProps {
  urgentItems: FeedbackItem[];
  onTakeAction?: (item: FeedbackItem) => void;
}

export default function UrgentAlertsBanner({
  urgentItems,
  onTakeAction,
}: UrgentAlertsBannerProps) {
  if (urgentItems.length === 0) {
    return (
      <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between text-emerald-800 text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          <span className="font-semibold">No critical safety or hygiene alerts active right now!</span>
        </div>
        <span className="text-emerald-600 font-medium text-xs">All clear</span>
      </div>
    );
  }

  const criticalOnly = urgentItems.filter((i) => i.urgency === 'critical');
  const highOnly = urgentItems.filter((i) => i.urgency === 'high');

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold text-red-900 flex items-center gap-1.5">
          <ShieldAlert className="w-4 h-4 text-red-600 animate-pulse" />
          <span>Priority Triage: Critical & High Safety Alerts</span>
          <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 text-xs font-black border border-red-200">
            {urgentItems.length} Requires Action
          </span>
        </h3>
        <span className="text-xs text-slate-500">Auto-pinned by AI</span>
      </div>

      <div className="space-y-2.5">
        {criticalOnly.map((item) => (
          <div
            key={item.id}
            className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-red-100/60 border-l-4 border-l-red-600 border border-red-200 shadow-xs space-y-2"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-red-600 text-white font-extrabold text-[10px] uppercase tracking-wider flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  CRITICAL • HYGIENE RISK
                </span>
                <span className="text-xs font-bold text-slate-800 uppercase">
                  {item.meal}
                </span>
                {item.language === 'hinglish' && (
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-100 text-orange-800">
                    Hinglish
                  </span>
                )}
              </div>

              <span className="text-[11px] text-slate-500 font-medium">
                {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <p className="text-sm font-bold text-red-950">
              "{item.feedbackText}"
            </p>

            <div className="p-2.5 rounded-lg bg-white/90 border border-red-200 text-xs text-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-red-700">AI Recommended Action: </span>
                <span>{item.suggestedAction}</span>
              </div>
              {item.actionImplemented ? (
                <span className="text-emerald-700 font-bold text-xs inline-flex items-center gap-1 whitespace-nowrap">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Action Logged
                </span>
              ) : (
                onTakeAction && (
                  <button
                    onClick={() => onTakeAction(item)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-red-600 hover:bg-red-700 text-white cursor-pointer whitespace-nowrap transition-colors"
                  >
                    Mark Action Taken
                  </button>
                )
              )}
            </div>
          </div>
        ))}

        {highOnly.slice(0, 3).map((item) => (
          <div
            key={item.id}
            className="p-3.5 rounded-xl bg-orange-50/70 border-l-4 border-l-orange-500 border border-orange-200 shadow-xs space-y-1.5"
          >
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-md bg-orange-500 text-white font-bold text-[10px] uppercase">
                  HIGH SEVERITY
                </span>
                <span className="text-xs font-bold text-slate-800 uppercase">
                  {item.meal}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {item.summary}
                </span>
              </div>

              <span className="text-[11px] text-slate-400">
                {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <p className="text-xs text-slate-800 font-medium">
              "{item.feedbackText}"
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
