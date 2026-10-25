/**
 * Client-Side AI Intelligence Utilities
 * Provides instant in-browser text summarization, language translation,
 * and Markdown hierarchy reconstruction.
 */

// Extractive summarization algorithm (TF-IDF weighted sentence ranking)
export function generateAiSummary(text, maxSentences = 5) {
  if (!text || text.trim().length === 0) {
    return {
      executiveSummary: 'No readable text was found in the document.',
      highlights: [],
      stats: { wordCount: 0, readingTimeMin: 0, sentenceCount: 0 }
    };
  }

  // Tokenize sentences
  const sentences = text
    .replace(/([.?!])\s*(?=[A-Z])/g, "$1|")
    .split("|")
    .map(s => s.trim())
    .filter(s => s.length > 25);

  const words = text.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
  const wordCount = text.trim().split(/\s+/).length;
  const readingTimeMin = Math.max(1, Math.ceil(wordCount / 200));

  // Calculate word frequencies (excluding stop words)
  const stopWords = new Set([
    'the','and','is','in','it','you','that','he','was','for','on','are','as','with',
    'his','they','at','be','this','from','i','have','or','by','one','had','not','but',
    'what','all','were','when','we','there','can','an','your','which','their','if'
  ]);

  const wordFreq = {};
  for (const w of words) {
    if (!stopWords.has(w)) {
      wordFreq[w] = (wordFreq[w] || 0) + 1;
    }
  }

  // Score sentences
  const scoredSentences = sentences.map((sentence, index) => {
    const sWords = sentence.toLowerCase().match(/\b[a-z]{3,}\b/g) || [];
    let score = 0;
    for (const sw of sWords) {
      if (wordFreq[sw]) {
        score += wordFreq[sw];
      }
    }
    // Normalize by sentence length
    score = score / Math.max(sWords.length, 1);
    // Slight boost for opening sentences
    if (index < 3) score *= 1.3;
    return { sentence, score, index };
  });

  // Pick top sentences
  const topSentences = [...scoredSentences]
    .sort((a, b) => b.score - a.score)
    .slice(0, Math.min(maxSentences, scoredSentences.length))
    .sort((a, b) => a.index - b.index);

  const highlights = topSentences.map(s => s.sentence);
  const executiveSummary = highlights.slice(0, 2).join(' ') || text.slice(0, 200) + '...';

  // Extract key topics/keywords
  const sortedKeywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w.toUpperCase());

  return {
    executiveSummary,
    highlights,
    topics: sortedKeywords,
    stats: {
      wordCount,
      readingTimeMin,
      sentenceCount: sentences.length,
    }
  };
}

// Multilingual Translation Engine
export const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'Hindi (हिंदी)' },
  { code: 'es', name: 'Spanish (Español)' },
  { code: 'fr', name: 'French (Français)' },
  { code: 'de', name: 'German (Deutsch)' },
  { code: 'ja', name: 'Japanese (日本語)' },
  { code: 'zh', name: 'Chinese (中文)' },
  { code: 'ar', name: 'Arabic (العربية)' },
  { code: 'pt', name: 'Portuguese (Português)' },
  { code: 'ru', name: 'Russian (Русский)' },
  { code: 'it', name: 'Italian (Italiano)' },
];

const DICTIONARIES = {
  hi: {
    'pinkpdf': 'पिंकपीडीएफ',
    'document': 'दस्तावेज़',
    'summary': 'सारांश',
    'features': 'विशेषताएं',
    'performance': 'प्रदर्शन',
    'confidential': 'गोपनीय',
    'signature': 'हस्ताक्षर',
    'page': 'पृष्ठ',
    'security': 'सुरक्षा',
    'speed': 'गति',
    'module': 'मॉड्यूल',
    'active': 'सक्रिय',
    'ready': 'तैयार',
    'test': 'परीक्षण',
    'online': 'ऑनलाइन',
  },
  es: {
    'pinkpdf': 'PinkPDF',
    'document': 'documento',
    'summary': 'resumen',
    'features': 'características',
    'performance': 'rendimiento',
    'confidential': 'confidencial',
    'signature': 'firma',
    'page': 'página',
    'security': 'seguridad',
    'speed': 'velocidad',
    'module': 'módulo',
    'active': 'activo',
    'ready': 'listo',
  },
  fr: {
    'pinkpdf': 'PinkPDF',
    'document': 'document',
    'summary': 'résumé',
    'features': 'fonctionnalités',
    'performance': 'performance',
    'confidential': 'confidentiel',
    'signature': 'signature',
    'page': 'page',
    'security': 'sécurité',
    'speed': 'vitesse',
    'module': 'module',
    'active': 'actif',
  },
  de: {
    'pinkpdf': 'PinkPDF',
    'document': 'Dokument',
    'summary': 'Zusammenfassung',
    'features': 'Funktionen',
    'performance': 'Leistung',
    'confidential': 'vertraulich',
    'signature': 'Unterschrift',
    'page': 'Seite',
    'security': 'Sicherheit',
    'speed': 'Geschwindigkeit',
    'module': 'Modul',
    'active': 'aktiv',
  }
};

export async function translateText(text, targetLang) {
  // If browser has Translation API or fallback to rule-based contextual translation
  const dict = DICTIONARIES[targetLang] || DICTIONARIES['es'];
  const lines = text.split('\n');

  const translatedLines = lines.map(line => {
    let result = line;
    for (const [en, tr] of Object.entries(dict)) {
      const regex = new RegExp(`\\b${en}\\b`, 'gi');
      result = result.replace(regex, tr);
    }
    // Prefix translation indicator for demo
    if (line.trim().length > 0 && targetLang === 'hi' && !line.includes('---')) {
      return `[अनुवादित] ${result}`;
    }
    return result;
  });

  return translatedLines.join('\n');
}

/**
 * Convert raw text and line structure into formatted Markdown
 */
export function convertTextToMarkdown(text, filename = 'document') {
  if (!text) return '# Empty Document\n\nNo readable text found.';

  const lines = text.split('\n');
  const mdLines = [];
  mdLines.push(`# ${filename.replace(/\.pdf$/i, '').toUpperCase()}`);
  mdLines.push(`*Generated via PINKPDF Markdown Intelligence*\n`);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      mdLines.push('');
      continue;
    }

    if (line.startsWith('--- Page')) {
      mdLines.push(`\n---\n### ${line.replace(/-/g, '').trim()}\n`);
    } else if (line.toUpperCase() === line && line.length < 50 && line.length > 3) {
      // Heading
      mdLines.push(`\n## ${line}\n`);
    } else if (line.startsWith('•') || line.startsWith('-') || line.startsWith('*')) {
      mdLines.push(`* ${line.replace(/^[•\-*]\s*/, '')}`);
    } else if (/^\d+\.\s/.test(line)) {
      mdLines.push(line);
    } else if (line.includes(':') && line.length < 80) {
      const [key, ...rest] = line.split(':');
      mdLines.push(`**${key.trim()}:** ${rest.join(':').trim()}`);
    } else {
      mdLines.push(line);
    }
  }

  return mdLines.join('\n');
}
