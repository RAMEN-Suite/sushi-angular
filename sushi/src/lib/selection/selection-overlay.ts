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
  const viewportHeight: number = window.visualViewport?.height ?? document.documentElement.clientHeight;
  const availableAbove: number = rect.top - 8;
  const availableBelow: number = viewportHeight - rect.bottom - 8;

  return availableBelow < panelHeight && availableAbove > availableBelow
    ? [SELECTION_ABOVE, SELECTION_BELOW]
    : [SELECTION_BELOW, SELECTION_ABOVE];
}
