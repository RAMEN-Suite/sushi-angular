import { ThemeSeverity } from '../sushi.types';

/** Semantic color used by the selected preset action. */
export type ColorPickerPresetSeverity = ThemeSeverity;

/** Named color offered by a color-picker preset palette. */
export interface ColorPickerPreset {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

/** Shorthand or configured entry accepted by a preset palette. */
export type ColorPickerPresetValue = string | ColorPickerPreset;

/** Context exposed to a color-picker preset template. */
export interface ColorPickerPresetContext {
  $implicit: string;
  color: string;
  label: string;
  custom: boolean;
  selected: boolean;
  disabled: boolean;
}
