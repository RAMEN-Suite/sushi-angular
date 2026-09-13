import { ButtonSeverity, ButtonShape, ButtonSize, ButtonVariant } from '../button';

/** Semantic colors available to toggle buttons. */
export type ToggleButtonSeverity = ButtonSeverity;
/** Visual treatments available to toggle buttons. */
export type ToggleButtonVariant = Exclude<ButtonVariant, 'text'>;
/** Size scale available to toggle buttons. */
export type ToggleButtonSize = ButtonSize;
/** Width and geometry options available to toggle buttons. */
export type ToggleButtonShape = ButtonShape;

/** Context exposed to the complete toggle-button template. */
export interface ToggleButtonContext {
  /** Checked state, available as the implicit template value. */
  readonly $implicit: boolean;
  /** Whether the toggle button is checked. */
  readonly checked: boolean;
  /** Whether interaction is disabled. */
  readonly disabled: boolean;
  /** Whether an asynchronous action is in progress. */
  readonly loading: boolean;
  /** Changes the checked state. */
  readonly toggle: () => void;
  /** Marks the associated form control as touched. */
  readonly touch: () => void;
}
