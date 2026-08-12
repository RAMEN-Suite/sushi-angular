import { ButtonSeverity, ButtonShape, ButtonSize, ButtonVariant } from '../button';

export type ToggleButtonSeverity = ButtonSeverity;
export type ToggleButtonVariant = Exclude<ButtonVariant, 'text'>;
export type ToggleButtonSize = ButtonSize;
export type ToggleButtonShape = ButtonShape;

export interface ToggleButtonContext {
  readonly $implicit: boolean;
  readonly checked: boolean;
  readonly disabled: boolean;
  readonly loading: boolean;
  readonly toggle: () => void;
  readonly touch: () => void;
}
