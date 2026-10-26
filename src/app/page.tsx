'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import StudentFeedbackForm from '@/components/StudentFeedbackForm';
import { FeedbackItem, ActiveTab } from '@/lib/types';
import { getStoredFeedbacks, saveFeedbacks, clearStoredFeedbacks } from '@/lib/storage';
import { DEMO_FEEDBACKS } from '@/lib/demoData';
import { Star, Clock, Sparkles, MessageSquare, Database, CheckCircle2 } from 'lucide-react';

export default function Page() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('student');
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [hasMounted, setHasMounted] = useState<boolean>(false);
  const [notification, setNotification] = useState<{ message: string; urgency: string } | null>(null);

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

    setNotification({
      message: `Feedback recorded for ${item.meal.toUpperCase()}! Classified as: ${item.category.toUpperCase()} • ${item.urgency.toUpperCase()}`,
      urgency: item.urgency,
    });

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleLoadDemo = () => {
    if (feedbacks.length > 0) {
      if (!confirm('Replace current data with fresh 14-item hostel demo feedback?')) {
        return;
      }
    }
    setFeedbacks(DEMO_FEEDBACKS);
    setNotification({
      message: 'Loaded 14 realistic hostel demo entries across Breakfast, Lunch, Snacks & Dinner!',
      urgency: 'low',
    });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleReset = () => {
    if (feedbacks.length === 0) return;
    if (confirm('Clear all feedback entries from localStorage?')) {
      clearStoredFeedbacks();
      setFeedbacks([]);
      setNotification({
        message: 'All feedback data has been reset to an empty state.',
        urgency: 'low',
      });
      setTimeout(() => setNotification(null), 3000);
    }
  };

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
        {/* Toast Notification */}
        {notification && (
          <div className="p-3.5 rounded-xl bg-amber-500 text-white font-medium text-xs sm:text-sm shadow-md flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>{notification.message}</span>
            </div>
            <button
              onClick={() => setActiveTab('dashboard')}
              className="underline text-xs font-bold hover:text-amber-100 cursor-pointer ml-3 whitespace-nowrap"
            >
              View Dashboard →
            </button>
          </div>
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
                              Action Taken
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(item.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })} at {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-800 font-medium">
                        "{item.feedbackText}"
                      </p>

                      <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                        <span>Category: <strong className="text-slate-700 uppercase">{item.category}</strong></span>
                        <span>•</span>
                        <span>Urgency: <strong className={`${item.urgency === 'critical' ? 'text-red-600' : item.urgency === 'high' ? 'text-orange-600' : 'text-slate-700'} uppercase`}>{item.urgency}</strong></span>
                        {item.issueTag && (
                          <>
                            <span>•</span>
                            <span className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px]">
                              {item.issueTag}
                            </span>
                          </>
                        )}
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
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Mess Committee Dashboard</h2>
                <p className="text-xs text-slate-500">Urgency triage and issue clustering active in Slices 3–5.</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                {feedbacks.length} Submissions Stored
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              {feedbacks.length === 0 ? (
                <span>No complaints stored yet. Tap <strong>"Load Demo Data"</strong> in the top header to populate 14 realistic hostel entries!</span>
              ) : (
                <span>Loaded <strong>{feedbacks.length} records</strong> into localStorage. Next slices will parse these with offline AI into grouped cluster cards!</span>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: Weekly Report */}
        {activeTab === 'report' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-base font-bold text-slate-900">Weekly Mess Summary Report</h2>
            <p className="text-xs text-slate-500">Weekly analytics and satisfaction breakdown will be finalized in Slice 6.</p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              Total feedback items stored in localStorage: <strong>{feedbacks.length}</strong>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-4 mt-auto text-center text-xs text-slate-400">
        MessMitra • Built with Next.js & Tailwind CSS for Hostel Mess Communities
      </footer>
    </div>
  );
}
