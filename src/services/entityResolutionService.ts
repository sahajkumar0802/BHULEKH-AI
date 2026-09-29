/**
 * BHULEKH AI Entity Resolution Service
 * Handles fuzzy name matching, Indian transliteration variations, and entity clustering.
 */

export interface EntityMatchResult {
  isMatch: boolean;
  similarityScore: number; // 0 - 100
  matchType: 'Exact' | 'Fuzzy' | 'Phonetic' | 'Mismatch';
  confidence: number;
  details: string;
}

// Levenshtein Distance for string comparison
export function calculateLevenshteinDistance(a: string, b: string): number {
  const matrix: number[][] = [];
  const strA = a.toLowerCase().trim();
  const strB = b.toLowerCase().trim();

  for (let i = 0; i <= strB.length; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= strA.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= strB.length; i++) {
    for (let j = 1; j <= strA.length; j++) {
      if (strB.charAt(i - 1) === strA.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1,     // insertion
          matrix[i - 1][j] + 1      // deletion
        );
      }
    }
  }

  return matrix[strB.length][strA.length];
}

export function compareEntities(nameA: string, nameB: string): EntityMatchResult {
  const cleanA = nameA.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();
  const cleanB = nameB.toLowerCase().replace(/[^a-z0-9 ]/g, '').trim();

  if (!cleanA || !cleanB) {
    return {
      isMatch: false,
      similarityScore: 0,
      matchType: 'Mismatch',
      confidence: 0,
      details: 'One or both entity names are empty.'
    };
  }

  if (cleanA === cleanB) {
    return {
      isMatch: true,
      similarityScore: 100,
      matchType: 'Exact',
      confidence: 99,
      details: 'Exact character-for-character match.'
    };
  }

  // Check abbreviation expansions (e.g., "Rajesh Kr" vs "Rajesh Kumar")
  const normA = cleanA.replace(/\bkr\b/g, 'kumar').replace(/\bpr\b/g, 'prasad');
  const normB = cleanB.replace(/\bkr\b/g, 'kumar').replace(/\bpr\b/g, 'prasad');

  if (normA === normB) {
    return {
      isMatch: true,
      similarityScore: 95,
      matchType: 'Fuzzy',
      confidence: 94,
      details: 'Normalized abbreviation match (e.g. Kr. -> Kumar).'
    };
  }

  const maxLen = Math.max(cleanA.length, cleanB.length);
  const distance = calculateLevenshteinDistance(cleanA, cleanB);
  const similarity = Math.max(0, Math.round(((maxLen - distance) / maxLen) * 100));

  if (distance === 1) {
    return {
      isMatch: false,
      similarityScore: similarity,
      matchType: 'Mismatch',
      confidence: 88,
      details: `Critical single-character shift detected (Distance: 1, e.g. "${nameA}" vs "${nameB}"). Likely different legal persons or severe typographical error.`
    };
  }

  if (similarity >= 80) {
    return {
      isMatch: true,
      similarityScore: similarity,
      matchType: 'Fuzzy',
      confidence: similarity,
      details: `Fuzzy phonetic match within tolerance (${similarity}% similarity).`
    };
  }

  return {
    isMatch: false,
    similarityScore: similarity,
    matchType: 'Mismatch',
    confidence: 95,
    details: `Distinct names detected (${nameA} vs ${nameB}). Similarity: ${similarity}%.`
  };
}
