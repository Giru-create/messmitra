'use client';

import React, { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Sparkles,
  Star,
  Users,
} from 'lucide-react';
import { FeedbackItem } from '@/lib/types';

export interface IssueCluster {
  issueKey: string;
  title: string;
  category: string;
  highestUrgency: 'critical' | 'high' | 'medium' | 'low';
  items: FeedbackItem[];
  averageRating: number;
  latestTimestamp: string;
  suggestedAction: string;
  actionImplemented: boolean;
  actionImplementedAt?: string;
}

interface GroupedIssueCardProps {
  cluster: IssueCluster;
  onToggleAction: (issueKey: string) => void;
}

export default function GroupedIssueCard({
  cluster,
  onToggleAction,
}: GroupedIssueCardProps) {
  const [expanded, setExpanded] = useState<boolean>(false);

  const isCritical = cluster.highestUrgency === 'critical';
  const isHigh = cluster.highestUrgency === 'high';

  return (
    <div
      className={`bg-white rounded-2xl border transition-all shadow-xs hover:shadow-sm ${
        isCritical
          ? 'border-red-300 ring-1 ring-red-400/20'
          : isHigh
          ? 'border-orange-300'
          : 'border-slate-200'
      }`}
    >
      <div className="p-4 sm:p-5 space-y-3">
        {/* Header row: Category, Urgency, Count, Rating */}
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center flex-wrap gap-2">
            <span
              className={`text-[11px] font-extrabold uppercase px-2 py-0.5 rounded-md ${
                isCritical
                  ? 'bg-red-600 text-white'
                  : isHigh
                  ? 'bg-orange-500 text-white'
                  : cluster.highestUrgency === 'medium'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {cluster.highestUrgency} Urgency
            </span>

            <span className="text-xs font-bold uppercase px-2 py-0.5 rounded-md bg-slate-100 text-slate-700">
              {cluster.category}
            </span>

            <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-slate-900 text-white">
              <Users className="w-3 h-3" />
              <span>{cluster.items.length} {cluster.items.length === 1 ? 'Report' : 'Reports'}</span>
            </span>
          </div>

          <div className="flex items-center gap-1">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${
                    s <= Math.round(cluster.averageRating)
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-slate-200'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs font-bold text-slate-700 ml-1">
              {cluster.averageRating.toFixed(1)}/5
            </span>
          </div>
        </div>

        {/* Cluster Title */}
        <div>
          <h3 className="text-base font-bold text-slate-900 capitalize">
            {cluster.title}
          </h3>
          <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3.5 h-3.5" />
            <span>
              Latest reported:{' '}
              {new Date(cluster.latestTimestamp).toLocaleDateString([], {
                month: 'short',
                day: 'numeric',
              })}{' '}
              at{' '}
              {new Date(cluster.latestTimestamp).toLocaleTimeString([], {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
          </p>
        </div>

        {/* Highlighted Student Quote */}
        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-800">
          <p className="italic">
            "{cluster.items[0].feedbackText}"
          </p>
          <div className="mt-1 flex items-center justify-between text-[11px] text-slate-500">
            <span className="uppercase font-semibold text-slate-600">
              {cluster.items[0].meal}
            </span>
            <span>
              {cluster.items[0].language === 'hinglish' ? 'Hinglish entry' : 'English entry'}
            </span>
          </div>
        </div>

        {/* AI Action Box */}
        <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
          cluster.actionImplemented
            ? 'bg-emerald-50/90 border-emerald-300'
            : 'bg-amber-50/80 border-amber-200/80'
        }`}>
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900">
              <Sparkles className={`w-3.5 h-3.5 ${cluster.actionImplemented ? 'text-emerald-600' : 'text-amber-600'}`} />
              <span>{cluster.actionImplemented ? 'Action Active & Tracking Impact:' : 'AI Corrective Remedy:'}</span>
            </div>
            <p className="text-xs text-slate-700">
              {cluster.suggestedAction}
            </p>

            {/* Before vs After inline badge */}
            {cluster.actionImplemented && cluster.actionImplementedAt && (
              <div className="pt-1 flex items-center gap-2 text-[11px] font-bold text-emerald-800">
                <span className="px-2 py-0.5 rounded-md bg-emerald-200/70 border border-emerald-300">
                  {(() => {
                    const actionTime = new Date(cluster.actionImplementedAt).getTime();
                    const before = cluster.items.filter((i) => new Date(i.createdAt).getTime() <= actionTime).length;
                    const after = cluster.items.filter((i) => new Date(i.createdAt).getTime() > actionTime).length;
                    const safeBefore = before > 0 ? before : 1;
                    const drop = Math.max(0, Math.round(((safeBefore - after) / safeBefore) * 100));
                    return `Impact: ${drop}% Complaint Reduction (${before} before vs ${after} after)`;
                  })()}
                </span>
                <span className="text-[10px] text-emerald-600 font-normal">
                  Implemented on {new Date(cluster.actionImplementedAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                </span>
              </div>
            )}
          </div>

          <button
            onClick={() => onToggleAction(cluster.issueKey)}
            className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all cursor-pointer whitespace-nowrap self-start sm:self-auto ${
              cluster.actionImplemented
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-xs'
                : 'bg-white hover:bg-amber-100 text-amber-900 border border-amber-300'
            }`}
          >
            {cluster.actionImplemented ? (
              <span className="inline-flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Action Implemented
              </span>
            ) : (
              <span>Mark Implemented</span>
            )}
          </button>
        </div>

        {/* Expand / Collapse All Quotes */}
        {cluster.items.length > 1 && (
          <div className="pt-2 border-t border-slate-100">
            <button
              onClick={() => setExpanded(!expanded)}
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 flex items-center gap-1 cursor-pointer"
            >
              <span>{expanded ? 'Hide other reports' : `View all ${cluster.items.length} reports for this issue`}</span>
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>

            {expanded && (
              <div className="mt-2.5 space-y-2">
                {cluster.items.slice(1).map((subItem) => (
                  <div
                    key={subItem.id}
                    className="p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-700 flex items-start justify-between gap-2"
                  >
                    <div>
                      <p className="italic">"{subItem.feedbackText}"</p>
                      <span className="text-[10px] text-slate-400 uppercase font-semibold">
                        {subItem.meal} • {subItem.rating} stars
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-400 whitespace-nowrap">
                      {new Date(subItem.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
