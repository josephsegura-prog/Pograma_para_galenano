export interface BrailleCharDef {
  char: string;
  dots: number[];
  unicode: string;
  category: 'letter' | 'number' | 'punctuation' | 'indicator';
  description: string;
}

/**
 * Standard Unicode Braille Patterns block starts at U+2800.
 * Bit mapping:
 * Dot 1 = bit 0 (1)
 * Dot 2 = bit 1 (2)
 * Dot 3 = bit 2 (4)
 * Dot 4 = bit 3 (8)
 * Dot 5 = bit 4 (16)
 * Dot 6 = bit 5 (32)
 * Dot 7 = bit 6 (64)
 * Dot 8 = bit 7 (128)
 */
export function dotsToUnicode(dots: number[]): string {
  let mask = 0;
  for (const d of dots) {
    if (d >= 1 && d <= 8) {
      mask |= 1 << (d - 1);
    }
  }
  return String.fromCharCode(0x2800 + mask);
}

export function unicodeToDots(ch: string): number[] {
  const code = ch.charCodeAt(0);
  if (code < 0x2800 || code > 0x28ff) return [];
  const mask = code - 0x2800;
  const dots: number[] = [];
  for (let i = 0; i < 8; i++) {
    if ((mask & (1 << i)) !== 0) {
      dots.push(i + 1);
    }
  }
  return dots;
}

export const BRAILLE_ALPHABET: BrailleCharDef[] = [
  { char: 'A', dots: [1], unicode: dotsToUnicode([1]), category: 'letter', description: 'Dot 1' },
  { char: 'B', dots: [1, 2], unicode: dotsToUnicode([1, 2]), category: 'letter', description: 'Dots 1-2' },
  { char: 'C', dots: [1, 4], unicode: dotsToUnicode([1, 4]), category: 'letter', description: 'Dots 1-4' },
  { char: 'D', dots: [1, 4, 5], unicode: dotsToUnicode([1, 4, 5]), category: 'letter', description: 'Dots 1-4-5' },
  { char: 'E', dots: [1, 5], unicode: dotsToUnicode([1, 5]), category: 'letter', description: 'Dots 1-5' },
  { char: 'F', dots: [1, 2, 4], unicode: dotsToUnicode([1, 2, 4]), category: 'letter', description: 'Dots 1-2-4' },
  { char: 'G', dots: [1, 2, 4, 5], unicode: dotsToUnicode([1, 2, 4, 5]), category: 'letter', description: 'Dots 1-2-4-5' },
  { char: 'H', dots: [1, 2, 5], unicode: dotsToUnicode([1, 2, 5]), category: 'letter', description: 'Dots 1-2-5' },
  { char: 'I', dots: [2, 4], unicode: dotsToUnicode([2, 4]), category: 'letter', description: 'Dots 2-4' },
  { char: 'J', dots: [2, 4, 5], unicode: dotsToUnicode([2, 4, 5]), category: 'letter', description: 'Dots 2-4-5' },
  { char: 'K', dots: [1, 3], unicode: dotsToUnicode([1, 3]), category: 'letter', description: 'Dots 1-3' },
  { char: 'L', dots: [1, 2, 3], unicode: dotsToUnicode([1, 2, 3]), category: 'letter', description: 'Dots 1-2-3' },
  { char: 'M', dots: [1, 3, 4], unicode: dotsToUnicode([1, 3, 4]), category: 'letter', description: 'Dots 1-3-4' },
  { char: 'N', dots: [1, 3, 4, 5], unicode: dotsToUnicode([1, 3, 4, 5]), category: 'letter', description: 'Dots 1-3-4-5' },
  { char: 'O', dots: [1, 3, 5], unicode: dotsToUnicode([1, 3, 5]), category: 'letter', description: 'Dots 1-3-5' },
  { char: 'P', dots: [1, 2, 3, 4], unicode: dotsToUnicode([1, 2, 3, 4]), category: 'letter', description: 'Dots 1-2-3-4' },
  { char: 'Q', dots: [1, 2, 3, 4, 5], unicode: dotsToUnicode([1, 2, 3, 4, 5]), category: 'letter', description: 'Dots 1-2-3-4-5' },
  { char: 'R', dots: [1, 2, 3, 5], unicode: dotsToUnicode([1, 2, 3, 5]), category: 'letter', description: 'Dots 1-2-3-5' },
  { char: 'S', dots: [2, 3, 4], unicode: dotsToUnicode([2, 3, 4]), category: 'letter', description: 'Dots 2-3-4' },
  { char: 'T', dots: [2, 3, 4, 5], unicode: dotsToUnicode([2, 3, 4, 5]), category: 'letter', description: 'Dots 2-3-4-5' },
  { char: 'U', dots: [1, 3, 6], unicode: dotsToUnicode([1, 3, 6]), category: 'letter', description: 'Dots 1-3-6' },
  { char: 'V', dots: [1, 2, 3, 6], unicode: dotsToUnicode([1, 2, 3, 6]), category: 'letter', description: 'Dots 1-2-3-6' },
  { char: 'W', dots: [2, 4, 5, 6], unicode: dotsToUnicode([2, 4, 5, 6]), category: 'letter', description: 'Dots 2-4-5-6' },
  { char: 'X', dots: [1, 3, 4, 6], unicode: dotsToUnicode([1, 3, 4, 6]), category: 'letter', description: 'Dots 1-3-4-6' },
  { char: 'Y', dots: [1, 3, 4, 5, 6], unicode: dotsToUnicode([1, 3, 4, 5, 6]), category: 'letter', description: 'Dots 1-3-4-5-6' },
  { char: 'Z', dots: [1, 3, 5, 6], unicode: dotsToUnicode([1, 3, 5, 6]), category: 'letter', description: 'Dots 1-3-5-6' },
];

export const BRAILLE_INDICATORS_AND_PUNCT: BrailleCharDef[] = [
  { char: '#', dots: [3, 4, 5, 6], unicode: dotsToUnicode([3, 4, 5, 6]), category: 'indicator', description: 'Numeric indicator (3-4-5-6)' },
  { char: 'CAP', dots: [6], unicode: dotsToUnicode([6]), category: 'indicator', description: 'Capital letter indicator (6)' },
  { char: '.', dots: [2, 5, 6], unicode: dotsToUnicode([2, 5, 6]), category: 'punctuation', description: 'Period (2-5-6)' },
  { char: ',', dots: [2], unicode: dotsToUnicode([2]), category: 'punctuation', description: 'Comma (2)' },
  { char: '-', dots: [3, 6], unicode: dotsToUnicode([3, 6]), category: 'punctuation', description: 'Hyphen (3-6)' },
  { char: ':', dots: [2, 5], unicode: dotsToUnicode([2, 5]), category: 'punctuation', description: 'Colon (2-5)' },
];

const CHAR_TO_DOTS: Record<string, number[]> = {
  ' ': [],
  '.': [2, 5, 6],
  ',': [2],
  '-': [3, 6],
  ':': [2, 5],
  ';': [2, 3],
  '!': [2, 3, 5],
  '?': [2, 3, 6],
  '/': [3, 4],
  '(': [1, 2, 6],
  ')': [3, 4, 5],
  '+': [2, 3, 5],
  '=': [2, 3, 5, 6],
};

for (const def of BRAILLE_ALPHABET) {
  CHAR_TO_DOTS[def.char.toLowerCase()] = def.dots;
}

const DIGIT_TO_LETTER: Record<string, string> = {
  '1': 'a',
  '2': 'b',
  '3': 'c',
  '4': 'd',
  '5': 'e',
  '6': 'f',
  '7': 'g',
  '8': 'h',
  '9': 'i',
  '0': 'j',
};

export interface EncodedBrailleCell {
  sourceChar: string;
  dots: number[];
  unicode: string;
}

/**
 * Converts plain ASCII text into Grade 1 UEB Braille cells (with numeric & capital indicators).
 */
export function encodeTextToBrailleCells(input: string): EncodedBrailleCell[] {
  const cells: EncodedBrailleCell[] = [];
  let inNumberMode = false;

  for (const ch of input) {
    if (ch >= '0' && ch <= '9') {
      if (!inNumberMode) {
        cells.push({
          sourceChar: '#',
          dots: [3, 4, 5, 6],
          unicode: dotsToUnicode([3, 4, 5, 6]),
        });
        inNumberMode = true;
      }
      const mapped = DIGIT_TO_LETTER[ch];
      const dots = CHAR_TO_DOTS[mapped] ?? [];
      cells.push({
        sourceChar: ch,
        dots,
        unicode: dotsToUnicode(dots),
      });
      continue;
    }

    if (ch === ' ') {
      inNumberMode = false;
      cells.push({ sourceChar: ' ', dots: [], unicode: dotsToUnicode([]) });
      continue;
    }

    inNumberMode = false;

    if (ch >= 'A' && ch <= 'Z') {
      cells.push({
        sourceChar: '↑',
        dots: [6],
        unicode: dotsToUnicode([6]),
      });
      const dots = CHAR_TO_DOTS[ch.toLowerCase()] ?? [];
      cells.push({
        sourceChar: ch,
        dots,
        unicode: dotsToUnicode(dots),
      });
      continue;
    }

    const dots = CHAR_TO_DOTS[ch.toLowerCase()] ?? [];
    cells.push({
      sourceChar: ch,
      dots,
      unicode: dotsToUnicode(dots),
    });
  }

  return cells;
}

export function encodeTextToBrailleUnicode(input: string): string {
  return encodeTextToBrailleCells(input)
    .map((c) => c.unicode)
    .join('');
}

export function decodeDotsToLabel(dots: number[]): string {
  if (dots.length === 0) return 'Space (Empty Cell)';
  const sorted = [...dots].sort((a, b) => a - b);
  const key = sorted.join('-');

  for (const def of [...BRAILLE_ALPHABET, ...BRAILLE_INDICATORS_AND_PUNCT]) {
    if (def.dots.join('-') === key) {
      return `${def.char} (${def.description})`;
    }
  }
  return `Custom Pattern (Dots ${key})`;
}

export const PERKINS_KEY_TO_DOT: Record<string, number> = {
  f: 1,
  d: 2,
  s: 3,
  j: 4,
  k: 5,
  l: 6,
  a: 7,
  ';': 8,
};
