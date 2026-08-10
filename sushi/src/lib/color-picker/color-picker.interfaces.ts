export interface ColorPickerPreset {
  readonly value: string;
  readonly label: string;
  readonly disabled?: boolean;
}

export type ColorPickerPresetValue = string | ColorPickerPreset;

export interface ColorPickerPresetContext {
  $implicit: string;
  color: string;
  label: string;
  custom: boolean;
  selected: boolean;
  disabled: boolean;
}
