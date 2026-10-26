'use client';

import React from 'react';
import { Utensils, Sparkles, RotateCcw, Database } from 'lucide-react';

interface HeaderProps {
  onLoadDemo: () => void;
  onResetData: () => void;
  feedbackCount: number;
}

export default function Header({ onLoadDemo, onResetData, feedbackCount }: HeaderProps) {
  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-4xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        {/* Brand */}
        <div className="flex items-center space-x-2.5">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-sm shadow-orange-500/20">
            <Utensils className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-bold tracking-tight text-slate-900">
                Mess<span className="text-amber-600">Mitra</span>
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                <Sparkles className="w-3 h-3 text-emerald-500" />
                Offline AI Ready
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium">
              Hostel Mess Feedback Analyzer • Hinglish & English
            </p>
          </div>
        </div>

        {/* Global Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={onLoadDemo}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 transition-colors cursor-pointer"
            title="Load 12-15 realistic English and Hinglish hostel complaints"
          >
            <Database className="w-3.5 h-3.5 text-amber-600" />
            <span>Load Demo Data</span>
            {feedbackCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-200/70 text-[10px] text-amber-900 font-bold">
                {feedbackCount}
              </span>
            )}
          </button>

          <button
            onClick={onResetData}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-red-700 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition-colors cursor-pointer"
            title="Clear all stored feedback"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>
    </header>
  );
}
