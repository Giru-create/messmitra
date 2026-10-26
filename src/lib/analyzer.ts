import { CategoryType, SentimentType, UrgencyType, MealType } from './types';

export interface AnalysisResult {
  category: CategoryType;
  sentiment: SentimentType;
  urgency: UrgencyType;
  issueKey: string;
  summary: string;
  suggestedAction: string;
  language: 'english' | 'hinglish';
}

/**
 * Built-in Offline AI Rule-Based / Pattern Matching NLP Engine
 * Operates with zero cloud latency, zero external API costs, and 100% reliability offline.
 */
export function analyzeFeedbackOffline(
  text: string,
  meal: MealType,
  rating: number,
  optionalTag?: string
): AnalysisResult {
  const lower = text.toLowerCase().trim();

  // Language Detection (checks for common Hinglish connector / food words)
  const hinglishTokens = /\b(me|thi|tha|thaa|hai|hain|aur|kacchi|kaccha|pani|namak|khana|sabzi|mila|bhi|bahut|kuch|kya|kyun|thandi|thanda|garam|roti|daal|dal|chawal|keeda|kankad|ganda|gandi|khatta|roz|wahi|accha|badhiya|swad|swadist|chutney)\b/i;
  const isHinglish = hinglishTokens.test(lower);
  const language: 'english' | 'hinglish' = isHinglish ? 'hinglish' : 'english';

  // 1. Critical Hygiene / Foreign Objects / Food Safety (Top Priority)
  const insectPattern = /\b(insect|keeda|keda|cockroach|fly|makkhi|kankad|stone|pathar|glass|kaanch|plastic|hair|baal)\b/i;
  const foodPoisoningPattern = /\b(poison|poisoning|vomit|vomiting|stomach ache|pet kharab|ill|sick|hospital)\b/i;
  const staleSpoiledPattern = /\b(stale|spoiled|sour|khatta|smell|smelling|bad odour|foul|sada hua|basi)\b/i;

  if (insectPattern.test(lower) || foodPoisoningPattern.test(lower)) {
    let specificSummary = 'Foreign object or insect reported in food';
    if (/insect|keeda|cockroach|fly|makkhi/i.test(lower)) {
      specificSummary = `Foreign object/insect found in ${meal} food`;
    } else if (/kankad|stone|pathar/i.test(lower)) {
      specificSummary = `Pebble/stone contaminants found in ${meal} dishes`;
    } else if (/glass|kaanch/i.test(lower)) {
      specificSummary = `Dangerous glass shard detected in ${meal} food`;
    } else if (/hair|baal/i.test(lower)) {
      specificSummary = `Hair contamination in meal serving`;
    }

    return {
      category: 'hygiene',
      sentiment: 'negative',
      urgency: 'critical',
      issueKey: 'insect-in-food',
      summary: specificSummary,
      suggestedAction: `Halt current ${meal} batch, inspect kitchen storage bins, and issue formal warning to ingredient supplier.`,
      language,
    };
  }

  if (staleSpoiledPattern.test(lower)) {
    return {
      category: 'hygiene',
      sentiment: 'negative',
      urgency: rating <= 2 ? 'critical' : 'high',
      issueKey: 'stale-ingredients',
      summary: `Spoiled or sour ingredients reported in ${meal}`,
      suggestedAction: 'Audit kitchen refrigerator temperature and discard any dairy/produce batches past shelf life.',
      language,
    };
  }

  // 2. Sanitation / Dirty washing area / Dirty plates
  const facilityDirtyPattern = /\b(washing area|basin|sink|washbasin|plate dirty|thali gandi|dirty plate|dirty spoon|unwashed|cleanliness|ganda|gandi|flies near counter)\b/i;
  if (facilityDirtyPattern.test(lower)) {
    return {
      category: 'hygiene',
      sentiment: 'negative',
      urgency: 'high',
      issueKey: 'dirty-facility',
      summary: 'Sanitation complaint in washing area or utensils',
      suggestedAction: 'Deploy staff for continuous dish sanitization and deep clean dining hall washbasins.',
      language,
    };
  }

  // 3. Cold Food / Temperature Issues
  const coldPattern = /\b(cold|thanda|thandi|chilled|not hot|not warm|unheated|burner off|heaters off)\b/i;
  if (coldPattern.test(lower) || optionalTag === 'Food Cold') {
    return {
      category: 'temperature',
      sentiment: 'negative',
      urgency: 'high',
      issueKey: 'cold-food',
      summary: `Cold dishes served during ${meal}`,
      suggestedAction: 'Ensure buffet bain-marie hot water warmers are preheated 20 minutes before service begins.',
      language,
    };
  }

  // 4. Undercooked / Raw Food
  const undercookedPattern = /\b(kacchi|kaccha|undercooked|raw|hard roti|chewy roti|not boiled|semi cooked)\b/i;
  if (undercookedPattern.test(lower)) {
    return {
      category: 'taste',
      sentiment: 'negative',
      urgency: 'high',
      issueKey: 'undercooked-roti',
      summary: `Undercooked or raw food served in ${meal}`,
      suggestedAction: 'Calibrate cooking gas flame and enforce standard baking/steaming durations.',
      language,
    };
  }

  // 5. Watery Dal / Diluted Preparation
  const wateryDalPattern = /\b(watery|pani jaisi|pani jaisa|patli daal|diluted|too thin|liquid daal)\b/i;
  if (wateryDalPattern.test(lower)) {
    return {
      category: 'taste',
      sentiment: 'negative',
      urgency: 'medium',
      issueKey: 'watery-daal',
      summary: 'Watery, diluted dal lacking proper consistency',
      suggestedAction: 'Standardize kitchen dal-to-water recipe measurement chart across all shifts.',
      language,
    };
  }

  // 6. Food Shortage / Depletion
  const shortagePattern = /\b(khatam|finished|shortage|ran out|empty|kam pad|exhausted|no more|not enough)\b/i;
  if (shortagePattern.test(lower) || optionalTag === 'Shortage') {
    let issueGroup = 'food-shortage';
    let summaryText = `Food shortage reported before ${meal} service ended`;

    if (/chawal|rice/i.test(lower)) {
      issueGroup = 'rice-shortage';
      summaryText = `Rice finished early during ${meal}`;
    } else if (/roti|chapati/i.test(lower)) {
      issueGroup = 'chapati-shortage';
      summaryText = `Chapati / roti shortage during ${meal}`;
    }

    return {
      category: 'quantity',
      sentiment: 'negative',
      urgency: 'high',
      issueKey: issueGroup,
      summary: summaryText,
      suggestedAction: 'Recalculate head-count meal buffers and begin secondary cooking batch 45 mins earlier.',
      language,
    };
  }

  // 7. Repetitive Menu / Variety Complaints
  const menuPattern = /\b(repetitive|daily same|roz wahi|boring|variety|same sabzi|again and again|aloo daily|rotate menu)\b/i;
  if (menuPattern.test(lower)) {
    return {
      category: 'menu variety',
      sentiment: 'neutral',
      urgency: 'medium',
      issueKey: 'repetitive-menu',
      summary: 'Feedback requesting greater menu variety and rotation',
      suggestedAction: 'Review weekly cycle with mess committee to substitute duplicate vegetable dishes.',
      language,
    };
  }

  // 8. Positive Praise
  const positivePattern = /\b(tasty|fresh|good|great|badhiya|shandar|mast|delicious|swad|swadist|warm and filling|improved|thank you|loved)\b/i;
  if ((rating >= 4 || positivePattern.test(lower)) && !/not|nahi|bad|bekar|bakwaas/i.test(lower)) {
    return {
      category: 'positive',
      sentiment: 'positive',
      urgency: 'low',
      issueKey: 'positive-feedback',
      summary: `Positive compliments on ${meal} meal quality`,
      suggestedAction: 'Share positive student appreciation with the catering and kitchen staff.',
      language,
    };
  }

  // 9. Taste / Spices / Oil Fallback
  const spiceOrOilPattern = /\b(namak|salt|oily|oil|tel|spicy|mirch|bland|feeka|tikha|meetha|sugar)\b/i;
  if (spiceOrOilPattern.test(lower)) {
    return {
      category: 'taste',
      sentiment: rating >= 3 ? 'neutral' : 'negative',
      urgency: rating <= 2 ? 'high' : 'medium',
      issueKey: 'taste-seasoning',
      summary: `Seasoning or oil level issue in ${meal}`,
      suggestedAction: 'Instruct head chef to sample seasoning before mass distribution.',
      language,
    };
  }

  // 10. General / Unclassified Fallback
  return {
    category: optionalTag ? (optionalTag.toLowerCase() as CategoryType) : 'taste',
    sentiment: rating >= 4 ? 'positive' : rating === 3 ? 'neutral' : 'negative',
    urgency: rating === 1 ? 'critical' : rating === 2 ? 'high' : rating === 3 ? 'medium' : 'low',
    issueKey: 'general-meal-quality',
    summary: text.slice(0, 60) + (text.length > 60 ? '...' : ''),
    suggestedAction: 'Review feedback during weekly mess committee meeting.',
    language,
  };
}
