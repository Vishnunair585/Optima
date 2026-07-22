import { describe, it, expect } from 'vitest';
import { cn } from './utils';

describe('utils', () => {
  describe('cn', () => {
    it('merges class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2');
    });

    it('resolves conflicting tailwind classes', () => {
      expect(cn('p-4', 'p-8')).toBe('p-8');
      expect(cn('bg-red-500', 'bg-blue-500')).toBe('bg-blue-500');
    });

    it('handles conditional classes', () => {
      expect(cn('base', true && 'conditional-true', false && 'conditional-false')).toBe('base conditional-true');
    });

    it('handles undefined and null values safely', () => {
      expect(cn('base', undefined, null, 'active')).toBe('base active');
    });

    it('handles arrays of classes', () => {
      expect(cn(['class1', 'class2'], 'class3')).toBe('class1 class2 class3');
    });
  });
});
