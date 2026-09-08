/** Named six-digit hex color offered by a preset palette, with optional disabled state. */
export interface ColorPickerPreset {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

/** Six-digit hex shorthand or configured entry accepted by a preset palette. */
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
