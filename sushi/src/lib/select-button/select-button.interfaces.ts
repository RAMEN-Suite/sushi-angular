import { ButtonSeverity, ButtonSize } from '../button';
import { SelectionOption } from '../selection';
import { Orientation, SelectionValue } from '../sushi.types';

export type SelectButtonOption = SelectionOption;

export interface SelectButtonOptionContext {
  readonly $implicit: SelectButtonOption;
  readonly option: SelectButtonOption;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly index: number;
}

export type SelectButtonValue = SelectionValue;
export type SelectButtonOrientation = Orientation;
export type SelectButtonSeverity = ButtonSeverity;
export type SelectButtonSize = ButtonSize;
