/** Reason a Dialog closed. */
export type DialogCloseReason = 'backdrop' | 'close' | 'escape' | 'programmatic';

/** Viewport offsets. Numbers are pixels; strings are CSS lengths. Omitted edges are automatic. */
export interface DialogCoordinates {
  /** Distance from the top edge. */
  readonly top?: number | string;
  /** Distance from the right edge. */
  readonly right?: number | string;
  /** Distance from the bottom edge. */
  readonly bottom?: number | string;
  /** Distance from the left edge. */
  readonly left?: number | string;
}

/** Named placement or custom viewport offsets for a Dialog. */
export type DialogPosition =
  'center' | 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'left' | 'right' | DialogCoordinates;

/** Details emitted after a Dialog closes. */
export interface DialogCloseEvent {
  /** Interaction that closed the Dialog. */
  readonly reason: DialogCloseReason;
  /** Optional value returned by the Dialog action. */
  readonly returnValue: string;
}
