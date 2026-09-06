import { describe, expect, it } from 'vitest';
import { apiReferences } from './api-reference.registry';
import type { ApiReferenceData } from './api-reference.types';

describe('API reference registry', (): void => {
  it('provides documented references for every registered route', (): void => {
    const entries: [string, readonly ApiReferenceData[]][] = Object.entries(apiReferences);

    expect(entries.length).toBeGreaterThan(0);
    for (const [route, references] of entries) {
      expect(route).not.toBe('');
      expect(references.length).toBeGreaterThan(0);
      expect(references.every((reference): boolean => reference.description.trim().length > 0)).toBe(true);
    }
  });

  it('keeps styling metadata available to every reference', (): void => {
    const references: readonly ApiReferenceData[] = Object.values(apiReferences).flat();

    expect(references.length).toBeGreaterThan(0);
    expect(references.every((reference): boolean => Array.isArray(reference.styles))).toBe(true);
  });
});
