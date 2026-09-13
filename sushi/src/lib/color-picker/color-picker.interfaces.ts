/** Named six-digit hex color offered by a preset palette, with optional disabled state. */
export interface ColorPickerPreset {
  /** Six-digit hex color represented by the preset. */
  readonly value: string;
  /** Accessible name of the preset. */
  readonly label: string;
  /** Prevents the preset from being selected. */
  readonly disabled?: boolean;
}

/** Six-digit hex shorthand or configured entry accepted by a preset palette. */
export type ColorPickerPresetValue = string | ColorPickerPreset;

/** Context exposed to a color-picker preset template. */
export interface ColorPickerPresetContext {
  /** Preset color, available as the implicit template value. */
  $implicit: string;
  /** Normalized six-digit hex color. */
  color: string;
  /** Accessible preset label. */
  label: string;
  /** Whether the preset was supplied as a configured object. */
  custom: boolean;
  /** Whether the preset matches the current value. */
  selected: boolean;
  /** Whether the preset cannot be selected. */
  disabled: boolean;
}
