import { FeedbackItem } from './types';

const STORAGE_KEY = 'messmitra_feedbacks';

export function getStoredFeedbacks(): FeedbackItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (err) {
    console.error('Failed to read feedbacks from localStorage:', err);
    return [];
  }
}

export function saveFeedbacks(items: FeedbackItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to write feedbacks to localStorage:', err);
  }
}

export function clearStoredFeedbacks(): void {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear feedbacks from localStorage:', err);
  }
}
