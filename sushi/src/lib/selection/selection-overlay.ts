import { ConnectedPosition } from '@angular/cdk/overlay';

export const SELECTION_BELOW: ConnectedPosition = {
  originX: 'start',
  originY: 'bottom',
  overlayX: 'start',
  overlayY: 'top',
  offsetY: 4,
};

export const SELECTION_ABOVE: ConnectedPosition = {
  originX: 'start',
  originY: 'top',
  overlayX: 'start',
  overlayY: 'bottom',
  offsetY: -4,
};

export function selectionOverlayPositions(origin: HTMLElement, panelHeight: number): ConnectedPosition[] {
  const rect: DOMRect = origin.getBoundingClientRect();
  // The on-screen keyboard can shrink and shift the visible area within the layout viewport.
  const viewport: VisualViewport | null = window.visualViewport;
  const viewportTop: number = viewport?.offsetTop ?? 0;
  const viewportBottom: number = viewportTop + (viewport?.height ?? document.documentElement.clientHeight);
  const availableAbove: number = rect.top - viewportTop - 8;
  const availableBelow: number = viewportBottom - rect.bottom - 8;

  return availableBelow < panelHeight && availableAbove > availableBelow
    ? [SELECTION_ABOVE, SELECTION_BELOW]
    : [SELECTION_BELOW, SELECTION_ABOVE];
}
