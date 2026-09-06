import { numberAttribute } from '@angular/core';

export function integerAtLeast(value: unknown, minimum: number): number {
  const integer: number = Math.floor(numberAttribute(value));
  return Number.isFinite(integer) ? Math.max(minimum, integer) : minimum;
}

export function positiveInteger(value: unknown): number {
  return integerAtLeast(value, 1);
}

export function nonNegativeInteger(value: unknown): number {
  return integerAtLeast(value, 0);
}
