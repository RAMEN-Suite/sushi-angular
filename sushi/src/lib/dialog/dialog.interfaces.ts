/** Reason a Dialog closed. */
export type DialogCloseReason = 'backdrop' | 'close' | 'escape' | 'programmatic';

/** Placement of a Dialog inside the viewport. */
export type DialogPosition =
  'center' | 'top' | 'top-left' | 'top-right' | 'bottom' | 'bottom-left' | 'bottom-right' | 'left' | 'right';

/** Details emitted after a Dialog closes. */
export interface DialogCloseEvent {
  /** Interaction that closed the Dialog. */
  readonly reason: DialogCloseReason;
  /** Optional value returned by the Dialog action. */
  readonly returnValue: string;
}
