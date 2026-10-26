export type MealType = 'breakfast' | 'lunch' | 'snacks' | 'dinner';

export type CategoryType =
  | 'hygiene'
  | 'taste'
  | 'quantity'
  | 'temperature'
  | 'service'
  | 'menu variety'
  | 'positive'
  | 'other';

export type SentimentType = 'positive' | 'neutral' | 'negative';

export type UrgencyType = 'low' | 'medium' | 'high' | 'critical';

export interface FeedbackItem {
  id: string;
  createdAt: string; // ISO 8601 string
  meal: MealType;
  rating: number; // 1 to 5
  feedbackText: string;
  language: 'english' | 'hinglish';
  issueTag?: string;
  category: CategoryType;
  sentiment: SentimentType;
  urgency: UrgencyType;
  issueKey: string; // normalized cluster key (e.g., 'foreign-object-food', 'cold-food')
  summary: string;
  suggestedAction: string;
  actionImplemented: boolean;
  actionImplementedAt?: string; // ISO 8601 string
}

export type ActiveTab = 'student' | 'dashboard' | 'report';
