'use client';

import React, { useState, useMemo } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Filter,
  Layers,
  MessageSquare,
  ShieldAlert,
  Star,
  TrendingDown,
  Utensils,
} from 'lucide-react';
import { FeedbackItem, MealType, CategoryType } from '@/lib/types';
import UrgentAlertsBanner from './UrgentAlertsBanner';
import GroupedIssueCard, { IssueCluster } from './GroupedIssueCard';

interface CommitteeDashboardProps {
  feedbacks: FeedbackItem[];
  onToggleAction: (issueKey: string) => void;
}

export default function CommitteeDashboard({
  feedbacks,
  onToggleAction,
}: CommitteeDashboardProps) {
  const [selectedMeal, setSelectedMeal] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<'all' | 'urgentOnly'>('all');

  // Summary Metrics
  const totalCount = feedbacks.length;
  const criticalCount = feedbacks.filter((f) => f.urgency === 'critical').length;
  const highCount = feedbacks.filter((f) => f.urgency === 'high').length;
  const implementedCount = feedbacks.filter((f) => f.actionImplemented).length;
  const avgRating =
    totalCount > 0
      ? (feedbacks.reduce((acc, curr) => acc + curr.rating, 0) / totalCount).toFixed(1)
      : '0.0';

  // Urgent Alerts (Critical and High)
  const urgentItems = useMemo(() => {
    return feedbacks.filter((f) => f.urgency === 'critical' || f.urgency === 'high');
  }, [feedbacks]);

  // Group Feedback by normalized issueKey
  const clusters: IssueCluster[] = useMemo(() => {
    const map = new Map<string, FeedbackItem[]>();

    // 1. Group items by issueKey
    feedbacks.forEach((item) => {
      const key = item.issueKey || 'unclassified';
      if (!map.has(key)) {
        map.set(key, []);
      }
      map.get(key)!.push(item);
    });

    // 2. Transform into IssueCluster objects
    const list: IssueCluster[] = [];

    map.forEach((items, issueKey) => {
      // Sort items inside cluster newest first
      items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

      // Find highest urgency in this cluster
      let highestUrgency: 'critical' | 'high' | 'medium' | 'low' = 'low';
      if (items.some((i) => i.urgency === 'critical')) highestUrgency = 'critical';
      else if (items.some((i) => i.urgency === 'high')) highestUrgency = 'high';
      else if (items.some((i) => i.urgency === 'medium')) highestUrgency = 'medium';

      const avg = items.reduce((acc, curr) => acc + curr.rating, 0) / items.length;
      const isImplemented = items.some((i) => i.actionImplemented);
      const actionTime = items.find((i) => i.actionImplemented)?.actionImplementedAt;

      // Make human readable title from key
      const formattedTitle = issueKey
        .split('-')
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

      list.push({
        issueKey,
        title: formattedTitle,
        category: items[0].category,
        highestUrgency,
        items,
        averageRating: avg,
        latestTimestamp: items[0].createdAt,
        suggestedAction: items[0].suggestedAction,
        actionImplemented: isImplemented,
        actionImplementedAt: actionTime,
      });
    });

    // 3. Sort clusters: Critical urgency first, then High, then highest report count
    const urgencyWeight: Record<string, number> = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    return list.sort((a, b) => {
      const weightDiff = urgencyWeight[b.highestUrgency] - urgencyWeight[a.highestUrgency];
      if (weightDiff !== 0) return weightDiff;
      return b.items.length - a.items.length;
    });
  }, [feedbacks]);

  // Apply UI Filters
  const filteredClusters = useMemo(() => {
    return clusters.filter((c) => {
      if (selectedMeal !== 'all' && !c.items.some((i) => i.meal === selectedMeal)) {
        return false;
      }
      if (selectedCategory !== 'all' && c.category !== selectedCategory) {
        return false;
      }
      if (urgencyFilter === 'urgentOnly' && c.highestUrgency !== 'critical' && c.highestUrgency !== 'high') {
        return false;
      }
      return true;
    });
  }, [clusters, selectedMeal, selectedCategory, urgencyFilter]);

  return (
    <div className="space-y-6">
      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        {/* Total Feedback */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Total Reports</span>
            <MessageSquare className="w-4 h-4 text-slate-400" />
          </div>
          <p className="text-2xl font-black text-slate-900">{totalCount}</p>
          <span className="text-[10px] text-slate-400">All student submissions</span>
        </div>

        {/* Critical Alerts */}
        <div className="p-4 rounded-2xl bg-red-50/70 border border-red-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-red-700">
            <span className="text-xs font-semibold">Critical Safety</span>
            <ShieldAlert className="w-4 h-4 text-red-600" />
          </div>
          <p className="text-2xl font-black text-red-700">{criticalCount}</p>
          <span className="text-[10px] text-red-600/80">Requires immediate fix</span>
        </div>

        {/* Avg Rating */}
        <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold">Mess Rating</span>
            <Star className="w-4 h-4 text-amber-500 fill-amber-400" />
          </div>
          <p className="text-2xl font-black text-slate-900">{avgRating}<span className="text-xs text-slate-400 font-normal">/5</span></p>
          <span className="text-[10px] text-slate-400">Average student score</span>
        </div>

        {/* Implemented Actions */}
        <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 shadow-xs space-y-1">
          <div className="flex items-center justify-between text-emerald-700">
            <span className="text-xs font-semibold">Actions Taken</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-black text-emerald-700">{implementedCount}</p>
          <span className="text-[10px] text-emerald-600/80">Closed-loop solutions</span>
        </div>
      </div>

      {/* Pinned Urgent Safety Alerts */}
      <UrgentAlertsBanner urgentItems={urgentItems} />

      {/* Grouped Issues Section */}
      <div className="space-y-4">
        {/* Controls Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-600" />
              <h3 className="text-sm font-bold text-slate-900">
                AI Clustered Issue Groups
              </h3>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {filteredClusters.length} {filteredClusters.length === 1 ? 'cluster' : 'clusters'}
              </span>
            </div>

            <button
              onClick={() =>
                setUrgencyFilter(urgencyFilter === 'all' ? 'urgentOnly' : 'all')
              }
              className={`text-xs px-3 py-1 rounded-lg border font-semibold transition-colors cursor-pointer ${
                urgencyFilter === 'urgentOnly'
                  ? 'bg-red-600 text-white border-red-600'
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
              }`}
            >
              {urgencyFilter === 'urgentOnly' ? 'Showing Urgent Only' : 'Filter: Urgent Only'}
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center flex-wrap gap-2 pt-2 border-t border-slate-100">
            <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
              <Filter className="w-3 h-3" /> Meal:
            </span>
            {['all', 'breakfast', 'lunch', 'snacks', 'dinner'].map((m) => (
              <button
                key={m}
                onClick={() => setSelectedMeal(m)}
                className={`text-xs px-2.5 py-1 rounded-lg border capitalize transition-all cursor-pointer ${
                  selectedMeal === m
                    ? 'bg-amber-600 text-white border-amber-600 font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {m}
              </button>
            ))}

            <span className="text-xs font-semibold text-slate-500 ml-2 mr-1">
              Category:
            </span>
            {['all', 'hygiene', 'taste', 'quantity', 'temperature', 'menu variety', 'positive'].map((c) => (
              <button
                key={c}
                onClick={() => setSelectedCategory(c)}
                className={`text-xs px-2.5 py-1 rounded-lg border capitalize transition-all cursor-pointer ${
                  selectedCategory === c
                    ? 'bg-amber-600 text-white border-amber-600 font-bold'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Cluster List */}
        {filteredClusters.length === 0 ? (
          <div className="p-8 rounded-2xl bg-white border border-slate-200 text-center text-slate-500 space-y-1">
            <p className="font-bold text-sm text-slate-700">No issue clusters match your filters</p>
            <p className="text-xs text-slate-400">Try selecting "All" meals or "All" categories to view all feedback groups.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredClusters.map((cluster) => (
              <GroupedIssueCard
                key={cluster.issueKey}
                cluster={cluster}
                onToggleAction={onToggleAction}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
