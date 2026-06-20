import { formatDecimal, formatMetricValue } from './number-formatter';

describe('number-formatter utility', () => {
  describe('formatDecimal', () => {
    it('formats a number to 2 decimal places by default', () => {
      expect(formatDecimal(3.14159)).toBe('3.14');
      expect(formatDecimal(100)).toBe('100.00');
    });

    it('formats with custom decimal places', () => {
      expect(formatDecimal(3.14159, 3)).toBe('3.142');
      expect(formatDecimal(3.14159, 4)).toBe('3.1416');
    });

    it('returns 0.00 for null', () => {
      expect(formatDecimal(null)).toBe('0.00');
    });

    it('returns 0.00 for undefined', () => {
      expect(formatDecimal(undefined)).toBe('0.00');
    });

    it('returns 0.00 for NaN', () => {
      expect(formatDecimal(NaN)).toBe('0.00');
    });

    it('handles zero', () => {
      expect(formatDecimal(0)).toBe('0.00');
    });

    it('handles negative numbers', () => {
      expect(formatDecimal(-5.5)).toBe('-5.50');
    });

    it('handles very small positive numbers', () => {
      expect(formatDecimal(0.001)).toBe('0.00');
      expect(formatDecimal(0.005)).toBe('0.01');
    });

    it('handles very large numbers', () => {
      expect(formatDecimal(999999.999)).toBe('1000000.00');
    });

    it('rounds correctly at boundary', () => {
      expect(formatDecimal(1.005)).toBe('1.01');
      expect(formatDecimal(1.004)).toBe('1.00');
    });

    it('handles 0 decimal places', () => {
      expect(formatDecimal(3.7, 0)).toBe('4');
      expect(formatDecimal(3.4, 0)).toBe('3');
    });
  });

  describe('formatMetricValue', () => {
    it('delegates to formatDecimal with default 2 decimals', () => {
      expect(formatMetricValue(45.6789)).toBe('45.68');
    });

    it('handles custom decimal places', () => {
      expect(formatMetricValue(45.6789, 3)).toBe('45.679');
    });

    it('returns 0.00 for null values', () => {
      expect(formatMetricValue(null)).toBe('0.00');
    });

    it('returns 0.00 for undefined values', () => {
      expect(formatMetricValue(undefined)).toBe('0.00');
    });

    it('returns 0.00 for NaN', () => {
      expect(formatMetricValue(NaN)).toBe('0.00');
    });

    it('formats metric values (cups, liters, grams) correctly', () => {
      // Test cups
      expect(formatMetricValue(3)).toBe('3.00');
      // Test liters
      expect(formatMetricValue(0.71)).toBe('0.71');
      // Test grams
      expect(formatMetricValue(45)).toBe('45.00');
    });
  });
});
