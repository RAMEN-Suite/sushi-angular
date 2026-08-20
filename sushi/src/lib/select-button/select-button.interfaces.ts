import { ButtonSeverity, ButtonSize } from '../button';
import { SelectionOption } from '../selection';
import { Orientation, SelectionValue } from '../sushi.types';

/** One option displayed by a select button. */
export type SelectButtonOption = SelectionOption;

/** Context exposed to a select-button option template. */
export interface SelectButtonOptionContext {
  readonly $implicit: SelectButtonOption;
  readonly option: SelectButtonOption;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly index: number;
}

/** Value accepted by a select-button option. */
export type SelectButtonValue = SelectionValue;
/** Direction in which select-button options are joined. */
export type SelectButtonOrientation = Orientation;
/** Semantic colors available to select buttons. */
export type SelectButtonSeverity = ButtonSeverity;
/** Size scale available to select buttons. */
export type SelectButtonSize = ButtonSize;
