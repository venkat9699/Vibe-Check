import type { FoursquarePlace, VibeDetails } from '../types';

// This function will define the base "vibe" score for different venue categories.
const getCategoryVibeScore = (categoryName: string): number => {
  const lowerCaseCategory = categoryName.toLowerCase();
  
  if (lowerCaseCategory.includes('music') || lowerCaseCategory.includes('brewery') || lowerCaseCategory.includes('beer')) {
    return 10;
  }
  if (lowerCaseCategory.includes('bar') || lowerCaseCategory.includes('pizzeria') || lowerCaseCategory.includes('pub')) {
    return 8;
  }
  if (lowerCaseCategory.includes('restaurant') || lowerCaseCategory.includes('movie') || lowerCaseCategory.includes('hotel') || lowerCaseCategory.includes('theater')) {
    return 7;
  }
  if (lowerCaseCategory.includes('coffee')) {
    return 6;
  }
  if (lowerCaseCategory.includes('park') || lowerCaseCategory.includes('plaza')) {
    return 5;
  }
  if (lowerCaseCategory.includes('library') || lowerCaseCategory.includes('bank') || lowerCaseCategory.includes('government') || lowerCaseCategory.includes('city hall')) {
    return 1; // Lowest vibe
  }
  if (lowerCaseCategory.includes('store') || lowerCaseCategory.includes('shop')) {
    return 4;
  }
  // Neutral for others like 'Education', 'Healthcare', etc.
  return 3; 
};


const getVibeDetailsFromScore = (score: number): VibeDetails => {
  // Clamp score between 1 and 10
  const finalScore = Math.max(1, Math.min(10, Math.round(score)));

  if (finalScore >= 9) {
    return { score: finalScore, description: "Energetic & Thriving", emoji: "🎉" };
  }
  if (finalScore >= 7) {
    return { score: finalScore, description: "Lively & Happening", emoji: "🥳" };
  }
  if (finalScore >= 5) {
    return { score: finalScore, description: "Relaxed & Casual", emoji: "😎" };
  }
  if (finalScore >= 3) {
    return { score: finalScore, description: "Calm & Serene", emoji: "😌" };
  }
  return { score: finalScore, description: "Quiet & Professional", emoji: "🤫" };
};

/**
 * Calculates a vibe score based on a list of nearby places.
 * @param places An array of FoursquarePlace objects.
 * @returns A VibeDetails object based on the calculated average vibe.
 */
export const calculateVibe = (places: FoursquarePlace[]): VibeDetails => {
  if (!places || places.length === 0) {
    return getVibeDetailsFromScore(5); // Return a neutral vibe if no places are provided
  }

  const totalScore = places.reduce((sum, place) => {
    // Get the primary category's base score
    const primaryCategory = place.categories[0]?.name || '';
    const baseScore = getCategoryVibeScore(primaryCategory);
    
    return sum + baseScore;
  }, 0);

  const averageScore = totalScore / places.length;
  
  return getVibeDetailsFromScore(averageScore);
};
