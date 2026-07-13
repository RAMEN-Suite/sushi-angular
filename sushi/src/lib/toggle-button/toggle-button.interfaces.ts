import { SuiButtonSeverity, SuiButtonShape, SuiButtonSize, SuiButtonVariant } from '../button';

export type SuiToggleButtonSeverity = SuiButtonSeverity;
export type SuiToggleButtonVariant = SuiButtonVariant;
export type SuiToggleButtonSize = SuiButtonSize;
export type SuiToggleButtonShape = SuiButtonShape;

export type SuiToggleButtonAnimation = 'none' | 'jump' | 'rotate' | 'flip';

export interface SuiToggleButtonContext {
  $implicit: boolean;
  checked: boolean;
  disabled: boolean;
  loading: boolean;
  toggle: () => void;
}
