'use client';

import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle2, Info, ArrowRight, X } from 'lucide-react';
import { FeedbackItem } from '@/lib/types';

interface ToastNotificationProps {
  item: FeedbackItem;
  onClose: () => void;
  onViewDashboard: () => void;
}

export default function ToastNotification({
  item,
  onClose,
  onViewDashboard,
}: ToastNotificationProps) {
  const isCritical = item.urgency === 'critical';
  const isHigh = item.urgency === 'high';

  return (
    <div
      className={`p-4 rounded-2xl border shadow-lg transition-all animate-in fade-in slide-in-from-top-3 ${
        isCritical
          ? 'bg-red-50 border-red-300 text-red-900 ring-2 ring-red-500/20'
          : isHigh
          ? 'bg-orange-50 border-orange-300 text-orange-900 ring-1 ring-orange-500/20'
          : 'bg-white border-amber-300 text-slate-800 shadow-amber-500/10'
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl mt-0.5 ${
              isCritical
                ? 'bg-red-600 text-white'
                : isHigh
                ? 'bg-orange-600 text-white'
                : 'bg-amber-500 text-white'
            }`}
          >
            {isCritical ? (
              <AlertCircle className="w-5 h-5 animate-pulse" />
            ) : isHigh ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <CheckCircle2 className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1">
            <div className="flex items-center flex-wrap gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-900">
                AI Classified:
              </span>
              <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white uppercase">
                {item.category}
              </span>
              <span
                className={`text-[11px] font-extrabold px-2 py-0.5 rounded-full border uppercase ${
                  isCritical
                    ? 'bg-red-100 text-red-800 border-red-300'
                    : isHigh
                    ? 'bg-orange-100 text-orange-800 border-orange-300'
                    : 'bg-slate-100 text-slate-700 border-slate-200'
                }`}
              >
                Urgency: {item.urgency}
              </span>
              <span className="text-[10px] text-slate-400">
                {item.language === 'hinglish' ? 'Hinglish parsed' : 'English parsed'}
              </span>
            </div>

            <p className="text-xs sm:text-sm font-semibold text-slate-900">
              {item.summary}
            </p>

            <p className="text-[11px] text-slate-600 italic">
              "{item.feedbackText}"
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="mt-3 pt-2.5 border-t border-slate-200/80 flex items-center justify-between">
        <span className="text-[11px] text-slate-500">
          Saved to localStorage & committee queue
        </span>
        <button
          onClick={onViewDashboard}
          className="inline-flex items-center gap-1 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline cursor-pointer"
        >
          <span>View on Committee Dashboard</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
