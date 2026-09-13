import { ButtonSeverity, ButtonSize } from '../button';
import { SelectionOption } from '../selection';
import { Orientation, SelectionValue } from '../sushi.types';

/** One option displayed by a select button. */
export type SelectButtonOption = SelectionOption;

/** Context exposed to a select-button option template. */
export interface SelectButtonOptionContext {
  /** Current option, available as the implicit template value. */
  readonly $implicit: SelectButtonOption;
  /** Current select-button option. */
  readonly option: SelectButtonOption;
  /** Whether the option is selected. */
  readonly selected: boolean;
  /** Whether the option cannot be selected. */
  readonly disabled: boolean;
  /** Zero-based position in the option group. */
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
