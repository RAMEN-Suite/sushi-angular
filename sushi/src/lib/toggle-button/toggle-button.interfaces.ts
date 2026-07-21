import { ButtonSeverity, ButtonShape, ButtonSize, ButtonVariant } from '../button';

export type ToggleButtonSeverity = ButtonSeverity;
export type ToggleButtonVariant = ButtonVariant;
export type ToggleButtonSize = ButtonSize;
export type ToggleButtonShape = ButtonShape;

export interface ToggleButtonContext {
  $implicit: boolean;
  checked: boolean;
  disabled: boolean;
  loading: boolean;
  toggle: () => void;
}
