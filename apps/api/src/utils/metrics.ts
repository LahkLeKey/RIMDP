export const safeDivide = (numerator: number, denominator: number): number => {
  if (denominator === 0) {
    return 0;
  }

  return numerator / denominator;
};

export const round = (value: number, precision = 4): number => {
  const factor = 10 ** precision;
  return Math.round(value * factor) / factor;
};