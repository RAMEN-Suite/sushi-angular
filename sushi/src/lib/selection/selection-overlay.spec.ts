import { describe, expect, it, vi } from 'vitest';
import { selectionOverlayPositions, SELECTION_ABOVE, SELECTION_BELOW } from './selection-overlay';

function originAt(top: number, bottom: number): HTMLElement {
  const origin: HTMLElement = document.createElement('button');
  vi.spyOn(origin, 'getBoundingClientRect').mockReturnValue(DOMRect.fromRect({ y: top, height: bottom - top }));
  return origin;
}

describe('selection overlay positions', (): void => {
  it('prefers the space below when the panel fits', (): void => {
    vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(800);

    expect(selectionOverlayPositions(originAt(100, 140), 240)).toEqual([SELECTION_BELOW, SELECTION_ABOVE]);
  });

  it('prefers the space above when the panel does not fit below', (): void => {
    vi.spyOn(document.documentElement, 'clientHeight', 'get').mockReturnValue(600);

    expect(selectionOverlayPositions(originAt(500, 540), 240)).toEqual([SELECTION_ABOVE, SELECTION_BELOW]);
  });
});
