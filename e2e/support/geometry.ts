import { type Locator } from '@playwright/test';

export interface Bounds {
  readonly height: number;
  readonly width: number;
  readonly x: number;
  readonly y: number;
}

export async function visibleBounds(locator: Locator, description: string): Promise<Bounds> {
  const bounds: Bounds | null = await locator.boundingBox();
  if (bounds === null) throw new Error(`Expected visible bounds for ${description}.`);
  return bounds;
}
