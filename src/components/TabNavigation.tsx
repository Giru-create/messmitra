'use client';

import React from 'react';
import { MessageSquarePlus, LayoutDashboard, FileSpreadsheet, AlertTriangle } from 'lucide-react';
import { ActiveTab } from '@/lib/types';

interface TabNavigationProps {
  activeTab: ActiveTab;
  onTabChange: (tab: ActiveTab) => void;
  urgentCount: number;
}

export default function TabNavigation({ activeTab, onTabChange, urgentCount }: TabNavigationProps) {
  const tabs = [
    {
      id: 'student' as ActiveTab,
      label: 'Student Feedback',
      icon: MessageSquarePlus,
    },
    {
      id: 'dashboard' as ActiveTab,
      label: 'Committee Dashboard',
      icon: LayoutDashboard,
      badge: urgentCount > 0 ? urgentCount : undefined,
    },
    {
      id: 'report' as ActiveTab,
      label: 'Weekly Report',
      icon: FileSpreadsheet,
    },
  ];

  return (
    <div className="border-b border-slate-200 bg-white">
      <div className="max-w-4xl mx-auto px-4 flex justify-between sm:justify-start space-x-1 sm:space-x-4">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`flex-1 sm:flex-initial py-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                isActive
                  ? 'border-amber-500 text-amber-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? 'text-amber-500' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
              {tab.badge && (
                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold border border-red-200 animate-pulse">
                  <AlertTriangle className="w-2.5 h-2.5" />
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
