import { describe, expect, it } from 'vitest';
import type { SelectionOption } from '../selection.interfaces';
import { compareSelectionValues, filterSelectionOption } from '../selection.utils';

describe('selection utilities', (): void => {
  it('compares primitives and object references without coercion', (): void => {
    const value: { readonly id: number } = { id: 1 };

    expect(compareSelectionValues('1', 1)).toBe(false);
    expect(compareSelectionValues(value, value)).toBe(true);
    expect(compareSelectionValues(value, { id: 1 })).toBe(false);
    expect(compareSelectionValues(Number.NaN, Number.NaN)).toBe(true);
  });

  it('filters labels case-insensitively with trimmed queries', (): void => {
    const option: SelectionOption = { label: 'Sushi Ramen', value: 'ramen' };

    expect(filterSelectionOption(option, '  RAMEN ')).toBe(true);
    expect(filterSelectionOption(option, 'udon')).toBe(false);
    expect(filterSelectionOption(option, '')).toBe(true);
  });
});
