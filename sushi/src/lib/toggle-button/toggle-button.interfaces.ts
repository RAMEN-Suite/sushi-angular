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
  readonly $implicit: boolean;
  readonly checked: boolean;
  readonly disabled: boolean;
  readonly loading: boolean;
  readonly toggle: () => void;
  readonly touch: () => void;
}
