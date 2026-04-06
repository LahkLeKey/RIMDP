import {describe, expect, it} from 'vitest';

import {round, safeDivide} from './metrics';

describe('metrics utils', () => {
  it('returns zero when denominator is zero', () => {
    expect(safeDivide(10, 0)).toBe(0);
  });

  it('divides normally when denominator is non-zero', () => {
    expect(safeDivide(10, 4)).toBe(2.5);
  });

  it('rounds with default precision', () => {
    expect(round(1.23456)).toBe(1.2346);
  });

  it('rounds with custom precision', () => {
    expect(round(9.8765, 2)).toBe(9.88);
  });
});