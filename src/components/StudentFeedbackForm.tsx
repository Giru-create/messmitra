'use client';

import React, { useState } from 'react';
import { Star, Send, Coffee, Sun, Sunset, Moon, Sparkles, AlertCircle } from 'lucide-react';
import { MealType, FeedbackItem } from '@/lib/types';

interface StudentFeedbackFormProps {
  onSubmit: (feedback: Omit<FeedbackItem, 'id' | 'createdAt' | 'actionImplemented'>) => void;
  isSubmitting?: boolean;
}

const MEALS: { id: MealType; label: string; icon: React.ElementType; time: string }[] = [
  { id: 'breakfast', label: 'Breakfast', icon: Coffee, time: '7:30 - 9:30 AM' },
  { id: 'lunch', label: 'Lunch', icon: Sun, time: '12:30 - 2:30 PM' },
  { id: 'snacks', label: 'Snacks', icon: Sunset, time: '5:00 - 6:30 PM' },
  { id: 'dinner', label: 'Dinner', icon: Moon, time: '7:30 - 9:30 PM' },
];

const QUICK_PROMPTS = [
  'Dinner me daal me insect mila!',
  'Roti kacchi thi aur bilkul thandi serve hui',
  'Paneer sabzi stale smell kar rahi thi',
  'Daal ekdum watery thi, namak bhi kam tha',
  'Breakfast poha bahut tasty tha aaj!',
];

export default function StudentFeedbackForm({ onSubmit }: StudentFeedbackFormProps) {
  const [meal, setMeal] = useState<MealType>('dinner');
  const [rating, setRating] = useState<number>(3);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [issueTag, setIssueTag] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      setError('Please type your feedback before submitting (English or Hinglish welcome!)');
      return;
    }
    setError('');

    // Detect language simply: checks for Hinglish keywords
    const hinglishPattern = /\b(me|thi|tha|hai|thaa|aur|kacchi|pani|namak|khana|sabzi|mila|bhi|bahut|kuch|kya|kyun|thandi|garam|roti|daal|chawal|chawal|keeda|insect)\b/i;
    const isHinglish = hinglishPattern.test(feedbackText);

    // Initial placeholder categorization (full NLP analyzer takes over in Slice 3)
    onSubmit({
      meal,
      rating,
      feedbackText: feedbackText.trim(),
      language: isHinglish ? 'hinglish' : 'english',
      issueTag: issueTag || undefined,
      category: 'hygiene', // default placeholder for Slice 1
      sentiment: rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'negative',
      urgency: rating === 1 ? 'critical' : rating === 2 ? 'high' : 'medium',
      issueKey: 'unclassified-issue',
      summary: feedbackText.trim().slice(0, 70),
      suggestedAction: 'Review feedback and inspect meal preparation batch.',
    });

    // Auto-clear input
    setFeedbackText('');
    setIssueTag('');
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
          <span>Student Mess Feedback</span>
          <span className="text-xs font-normal px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            Anonymous
          </span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Report food quality, hygiene issues, or praise. Hinglish expressions like{' '}
          <span className="italic text-amber-700 font-medium">"daal me insect tha"</span> ya{' '}
          <span className="italic text-amber-700 font-medium">"roti kacchi thi"</span> are fully understood!
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Meal Type Selector */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            1. Select Meal <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {MEALS.map((m) => {
              const Icon = m.icon;
              const isSelected = meal === m.id;
              return (
                <button
                  type="button"
                  key={m.id}
                  onClick={() => setMeal(m.id)}
                  className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between min-h-[58px] cursor-pointer ${
                    isSelected
                      ? 'border-amber-500 bg-amber-50/60 ring-2 ring-amber-500/20 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span className={`text-xs font-bold ${isSelected ? 'text-amber-800' : 'text-slate-800'}`}>
                      {m.label}
                    </span>
                    <Icon className={`w-4 h-4 ${isSelected ? 'text-amber-600' : 'text-slate-400'}`} />
                  </div>
                  <span className="text-[10px] text-slate-400 mt-1">{m.time}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Rating Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            2. Rate Meal Quality (1 to 5 Stars) <span className="text-red-500">*</span>
          </label>
          <div className="flex items-center gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                type="button"
                key={star}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
                className="p-2 sm:p-2.5 rounded-xl hover:bg-amber-50 transition-colors cursor-pointer"
                aria-label={`${star} star`}
              >
                <Star
                  className={`w-7 h-7 sm:w-8 sm:h-8 transition-transform active:scale-90 ${
                    (hoverRating || rating) >= star
                      ? 'fill-amber-400 text-amber-500'
                      : 'text-slate-300'
                  }`}
                />
              </button>
            ))}
            <span className="ml-2 text-xs font-semibold px-2.5 py-1 rounded-md bg-slate-100 text-slate-700">
              {rating === 1 && '1/5 Terrible / Safety Issue'}
              {rating === 2 && '2/5 Poor Quality'}
              {rating === 3 && '3/5 Average / Okay'}
              {rating === 4 && '4/5 Good'}
              {rating === 5 && '5/5 Excellent'}
            </span>
          </div>
        </div>

        {/* Feedback Textarea */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-xs font-semibold text-slate-700">
              3. What was wrong or good? (English / Hinglish) <span className="text-red-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {feedbackText.length} characters
            </span>
          </div>

          <textarea
            value={feedbackText}
            onChange={(e) => {
              setFeedbackText(e.target.value);
              if (error) setError('');
            }}
            placeholder="Type your feedback here... e.g., Dinner me daal me insect mila! ya Roti kacchi aur cold thi..."
            rows={3}
            className="w-full p-3 text-sm rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all placeholder:text-slate-400"
          />

          {error && (
            <p className="mt-1.5 text-xs text-red-600 flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              {error}
            </p>
          )}

          {/* Quick prompt test chips */}
          <div className="mt-2.5">
            <span className="text-[11px] font-medium text-slate-500 mr-1.5">
              Quick test phrases:
            </span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {QUICK_PROMPTS.map((prompt, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setFeedbackText(prompt);
                    setError('');
                  }}
                  className="text-[11px] px-2 py-1 rounded-md bg-slate-100 hover:bg-amber-100 text-slate-700 hover:text-amber-900 border border-slate-200 transition-colors cursor-pointer"
                >
                  "{prompt}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Optional Tag */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            4. Optional Issue Tag
          </label>
          <div className="flex flex-wrap gap-1.5">
            {['Hygiene', 'Taste & Cooking', 'Food Cold', 'Shortage', 'Service Delay'].map((tag) => (
              <button
                type="button"
                key={tag}
                onClick={() => setIssueTag(issueTag === tag ? '' : tag)}
                className={`text-xs px-3 py-1.5 rounded-lg border transition-all cursor-pointer ${
                  issueTag === tag
                    ? 'bg-amber-600 text-white border-amber-600 font-semibold'
                    : 'bg-white text-slate-600 border-slate-200 hover:border-slate-300'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full min-h-[48px] py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-orange-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          <Send className="w-4 h-4" />
          <span>Submit Anonymous Feedback</span>
          <Sparkles className="w-3.5 h-3.5 text-amber-200" />
        </button>
      </form>
    </div>
  );
}
