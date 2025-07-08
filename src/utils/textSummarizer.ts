export class TextSummarizer {
  static extractSentences(text: string): string[] {
    return text
      .split(/[.!?]+/)
      .map(sentence => sentence.trim())
      .filter(sentence => sentence.length > 10);
  }

  static calculateSentenceScore(sentence: string, wordFrequencies: Map<string, number>): number {
    const words = sentence.toLowerCase().split(/\s+/);
    let score = 0;
    let wordCount = 0;

    for (const word of words) {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3 && wordFrequencies.has(cleanWord)) {
        score += wordFrequencies.get(cleanWord)!;
        wordCount++;
      }
    }

    return wordCount > 0 ? score / wordCount : 0;
  }

  static getWordFrequencies(text: string): Map<string, number> {
    const words = text.toLowerCase().split(/\s+/);
    const frequencies = new Map<string, number>();
    
    // Common stop words to exclude
    const stopWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them']);

    for (const word of words) {
      const cleanWord = word.replace(/[^\w]/g, '');
      if (cleanWord.length > 3 && !stopWords.has(cleanWord)) {
        frequencies.set(cleanWord, (frequencies.get(cleanWord) || 0) + 1);
      }
    }

    return frequencies;
  }

  static summarize(text: string, maxSentences: number = 3): string {
    const sentences = this.extractSentences(text);
    if (sentences.length <= maxSentences) {
      return text;
    }

    const wordFrequencies = this.getWordFrequencies(text);
    
    const sentenceScores = sentences.map(sentence => ({
      sentence,
      score: this.calculateSentenceScore(sentence, wordFrequencies),
      originalIndex: sentences.indexOf(sentence)
    }));

    const topSentences = sentenceScores
      .sort((a, b) => b.score - a.score)
      .slice(0, maxSentences)
      .sort((a, b) => a.originalIndex - b.originalIndex);

    return topSentences.map(item => item.sentence).join('. ') + '.';
  }
}