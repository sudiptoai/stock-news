import {
  formatRelativeTime,
  formatCurrency,
  formatPercent,
  formatLargeNumber,
  categoryLabel,
  ratingLabel,
  ratingColor,
  truncate,
  generateId,
} from '../src/utils/helpers';

describe('formatRelativeTime', () => {
  const nowSec = Math.floor(Date.now() / 1000);

  it('returns "Just now" for timestamps less than 1 minute ago', () => {
    expect(formatRelativeTime(nowSec - 30)).toBe('Just now');
  });

  it('returns minutes when < 1 hour ago', () => {
    expect(formatRelativeTime(nowSec - 600)).toBe('10m ago');
  });

  it('returns hours when < 24h ago', () => {
    expect(formatRelativeTime(nowSec - 3 * 3600)).toBe('3h ago');
  });

  it('returns days when < 7 days ago', () => {
    expect(formatRelativeTime(nowSec - 2 * 86400)).toBe('2d ago');
  });
});

describe('formatCurrency', () => {
  it('formats billions', () => {
    expect(formatCurrency(2_500_000_000)).toBe('$2.5B');
  });

  it('formats millions', () => {
    // toFixed(1) rounds 1.25 → 1.3 (JS rounding)
    expect(formatCurrency(1_250_000)).toBe('$1.3M');
  });

  it('formats normal values with 2 decimals', () => {
    expect(formatCurrency(189.3)).toBe('$189.30');
  });
});

describe('formatPercent', () => {
  it('adds + sign for positive values when showSign=true', () => {
    expect(formatPercent(2.75)).toBe('+2.75%');
  });

  it('no + sign for negative values', () => {
    expect(formatPercent(-1.5)).toBe('-1.50%');
  });

  it('no sign when showSign=false', () => {
    expect(formatPercent(2.75, false)).toBe('2.75%');
  });
});

describe('formatLargeNumber', () => {
  it('formats billions', () => {
    expect(formatLargeNumber(1_000_000_000)).toBe('1.00B');
  });

  it('formats thousands', () => {
    expect(formatLargeNumber(5500)).toBe('5.5K');
  });
});

describe('categoryLabel', () => {
  it('returns human-readable label', () => {
    expect(categoryLabel('general')).toBe('General');
    expect(categoryLabel('geopolitical')).toBe('Geopolitical');
    expect(categoryLabel('merger')).toBe('M&A');
  });
});

describe('ratingLabel', () => {
  it('returns human-readable rating', () => {
    expect(ratingLabel('strongBuy')).toBe('Strong Buy');
    expect(ratingLabel('hold')).toBe('Hold');
    expect(ratingLabel('strongSell')).toBe('Strong Sell');
  });
});

describe('ratingColor', () => {
  it('returns green for strongBuy', () => {
    expect(ratingColor('strongBuy')).toBe('#00c076');
  });

  it('returns red for strongSell', () => {
    expect(ratingColor('strongSell')).toBe('#ff4d6a');
  });

  it('returns yellow for hold', () => {
    expect(ratingColor('hold')).toBe('#ffaa00');
  });
});

describe('truncate', () => {
  it('returns original string if shorter than maxLength', () => {
    expect(truncate('hello', 10)).toBe('hello');
  });

  it('truncates and adds ellipsis', () => {
    const result = truncate('hello world', 8);
    expect(result).toHaveLength(8);
    expect(result.endsWith('…')).toBe(true);
  });
});

describe('generateId', () => {
  it('returns a non-empty string', () => {
    const id = generateId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('returns unique values', () => {
    const ids = new Set(Array.from({ length: 50 }, () => generateId()));
    expect(ids.size).toBe(50);
  });
});
