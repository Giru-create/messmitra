'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import StudentFeedbackForm from '@/components/StudentFeedbackForm';
import ToastNotification from '@/components/ToastNotification';
import UrgentAlertsBanner from '@/components/UrgentAlertsBanner';
import CommitteeDashboard from '@/components/CommitteeDashboard';
import WeeklyReportView from '@/components/WeeklyReportView';
import { FeedbackItem, ActiveTab } from '@/lib/types';
import { getStoredFeedbacks, saveFeedbacks, clearStoredFeedbacks } from '@/lib/storage';
import { DEMO_FEEDBACKS } from '@/lib/demoData';
import { Star, Clock, MessageSquare, Database, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function Page() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('student');
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [latestSubmission, setLatestSubmission] = useState<FeedbackItem | null>(null);

  // Client-side hydration safe loading
  useEffect(() => {
    setHasMounted(true);
    const stored = getStoredFeedbacks();
    if (stored.length > 0) {
      setFeedbacks(stored);
    }
  }, []);

  // Save to localStorage whenever feedbacks change after mount
  useEffect(() => {
    if (hasMounted) {
      saveFeedbacks(feedbacks);
    }
  }, [feedbacks, hasMounted]);

  const handleNewFeedback = (
    newFeedback: Omit<FeedbackItem, 'id' | 'createdAt' | 'actionImplemented'>
  ) => {
    const item: FeedbackItem = {
      ...newFeedback,
      id: 'fb-' + Date.now(),
      createdAt: new Date().toISOString(),
      actionImplemented: false,
    };

    setFeedbacks((prev) => [item, ...prev]);
    setLatestSubmission(item);
  };

  const handleLoadDemo = () => {
    if (feedbacks.length > 0) {
      if (!confirm('Replace current data with fresh 14-item hostel demo feedback?')) {
        return;
      }
    }
    setFeedbacks(DEMO_FEEDBACKS);
    setLatestSubmission(DEMO_FEEDBACKS[0]);
  };

  const handleReset = () => {
    if (feedbacks.length === 0) return;
    if (confirm('Clear all feedback entries from localStorage?')) {
      clearStoredFeedbacks();
      setFeedbacks([]);
      setLatestSubmission(null);
    }
  };

  const handleTakeAction = (item: FeedbackItem) => {
    setFeedbacks((prev) =>
      prev.map((f) =>
        f.id === item.id || f.issueKey === item.issueKey
          ? { ...f, actionImplemented: true, actionImplementedAt: new Date().toISOString() }
          : f
      )
    );
  };

  const urgentItems = feedbacks.filter((f) => f.urgency === 'critical' || f.urgency === 'high');
  const criticalCount = feedbacks.filter((f) => f.urgency === 'critical').length;

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Sticky Header */}
      <Header
        onLoadDemo={handleLoadDemo}
        onResetData={handleReset}
        feedbackCount={feedbacks.length}
      />

      {/* Tab Navigation */}
      <TabNavigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        urgentCount={criticalCount}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {/* Dynamic Toast Notification for Recent Submission */}
        {latestSubmission && (
          <ToastNotification
            item={latestSubmission}
            onClose={() => setLatestSubmission(null)}
            onViewDashboard={() => {
              setActiveTab('dashboard');
              setLatestSubmission(null);
            }}
          />
        )}

        {/* Tab 1: Student Feedback View */}
        {activeTab === 'student' && (
          <div className="space-y-6">
            <StudentFeedbackForm onSubmit={handleNewFeedback} />

            {/* Live Feedbacks Feed */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  <span>Hostel Feedback Records</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {feedbacks.length}
                  </span>
                </h3>
                {feedbacks.length > 0 && (
                  <span className="text-xs text-slate-400">Persisted in localStorage</span>
                )}
              </div>

              {feedbacks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500 space-y-3">
                  <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto">
                    <Database className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-800 text-sm">No feedback in storage yet</p>
                    <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                      Submit a live rating above or load 14 realistic hostel complaints to explore how MessMitra groups and prioritizes feedback.
                    </p>
                  </div>
                  <button
                    onClick={handleLoadDemo}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white shadow-xs transition-colors cursor-pointer"
                  >
                    <Database className="w-4 h-4" />
                    <span>Load 14 Demo Hostel Entries</span>
                  </button>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {feedbacks.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs hover:border-slate-300 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-100 text-amber-800">
                            {item.meal}
                          </span>
                          <div className="flex items-center">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                className={`w-3.5 h-3.5 ${
                                  star <= item.rating
                                    ? 'fill-amber-400 text-amber-500'
                                    : 'text-slate-200'
                                }`}
                              />
                            ))}
                          </div>
                          {item.language === 'hinglish' && (
                            <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-orange-50 text-orange-700 border border-orange-200">
                              Hinglish
                            </span>
                          )}
                          {item.actionImplemented && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                              Action Logged
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>
                            {new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at{' '}
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-800 font-medium">
                        "{item.feedbackText}"
                      </p>

                      <div className="flex items-center justify-between flex-wrap gap-2 pt-2 border-t border-slate-100 text-[11px]">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold uppercase">
                            {item.category}
                          </span>
                          <span
                            className={`px-2 py-0.5 rounded-md font-bold uppercase border ${
                              item.urgency === 'critical'
                                ? 'bg-red-100 text-red-700 border-red-200'
                                : item.urgency === 'high'
                                ? 'bg-orange-100 text-orange-800 border-orange-200'
                                : 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {item.urgency}
                          </span>
                        </div>
                        <span className="text-slate-400 italic">
                          AI: {item.summary}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Committee Dashboard */}
        {activeTab === 'dashboard' && (
          <CommitteeDashboard
            feedbacks={feedbacks}
            onToggleAction={(issueKey) => {
              setFeedbacks((prev) => {
                const target = prev.find((f) => f.issueKey === issueKey);
                const nextState = !target?.actionImplemented;
                const nextTimestamp = nextState ? new Date().toISOString() : undefined;

                return prev.map((f) =>
                  f.issueKey === issueKey
                    ? { ...f, actionImplemented: nextState, actionImplementedAt: nextTimestamp }
                    : f
                );
              });
            }}
          />
        )}

        {/* Tab 3: Weekly Report */}
        {activeTab === 'report' && (
          <WeeklyReportView feedbacks={feedbacks} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto text-center text-xs text-slate-400">
        MessMitra • Built with Next.js & Tailwind CSS for Hostel Mess Communities
      </footer>
    </div>
  );
}
