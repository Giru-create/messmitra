'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import StudentFeedbackForm from '@/components/StudentFeedbackForm';
import { FeedbackItem, ActiveTab } from '@/lib/types';
import { Star, Clock, AlertTriangle, CheckCircle, Sparkles, MessageSquare } from 'lucide-react';

export default function Page() {
  const [activeTab, setActiveTab] = useState<ActiveTab>('student');
  const [feedbacks, setFeedbacks] = useState<FeedbackItem[]>([]);
  const [notification, setNotification] = useState<{ message: string; urgency: string } | null>(null);

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

    // Show temporary success feedback
    setNotification({
      message: `Feedback recorded for ${item.meal.toUpperCase()}! Classified as: ${item.category.toUpperCase()} • ${item.urgency.toUpperCase()}`,
      urgency: item.urgency,
    });

    setTimeout(() => {
      setNotification(null);
    }, 4000);
  };

  const handleLoadDemo = () => {
    alert('Demo data loader will be enabled in Slice 2!');
  };

  const handleReset = () => {
    if (feedbacks.length === 0) return;
    if (confirm('Clear all feedback entries?')) {
      setFeedbacks([]);
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
                  <span>Recent Hostel Submissions</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                    {feedbacks.length}
                  </span>
                </h3>
                <span className="text-xs text-slate-400">Newest first</span>
              </div>

              {feedbacks.length === 0 ? (
                <div className="bg-white rounded-2xl border border-dashed border-slate-300 p-8 text-center text-slate-500">
                  <p className="font-semibold text-sm">No feedback submitted yet</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Select a meal above, rate it, and submit a comment in English or Hinglish to see it appear here live!
                  </p>
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
                        </div>

                        <div className="flex items-center gap-1.5 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          <span>{new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                      </div>

                      <p className="text-sm text-slate-800 font-medium">
                        "{item.feedbackText}"
                      </p>

                      <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-[11px] text-slate-500">
                        <span>Category: <strong className="text-slate-700 uppercase">{item.category}</strong></span>
                        <span>•</span>
                        <span>Urgency: <strong className={`${item.urgency === 'critical' ? 'text-red-600' : 'text-slate-700'} uppercase`}>{item.urgency}</strong></span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 2: Committee Dashboard (Placeholder for Slice 1) */}
        {activeTab === 'dashboard' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-900">Mess Committee Dashboard</h2>
                <p className="text-xs text-slate-500">Issue clustering and urgency triage will be active in Slices 3–5.</p>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-200 font-semibold">
                {feedbacks.length} Submissions Logged
              </span>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              💡 Switch to the <strong>Student Feedback</strong> tab to submit live entries. They are held in memory and will feed the dashboard clusters!
            </div>
          </div>
        )}

        {/* Tab 3: Weekly Report (Placeholder for Slice 1) */}
        {activeTab === 'report' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-3">
            <h2 className="text-base font-bold text-slate-900">Weekly Mess Summary Report</h2>
            <p className="text-xs text-slate-500">Weekly report card and satisfaction breakdown will be finalized in Slice 6.</p>
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600">
              Current total complaints in memory: <strong>{feedbacks.length}</strong>
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
