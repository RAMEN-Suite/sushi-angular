import { SelectionCompareWith, SelectionOption } from '../selection';
import { SelectionValue } from '../sushi.types';

/** Value accepted by a select option. */
export type SelectValue = SelectionValue;
/** Current single-select value, including its empty state. */
export type SelectModelValue = SelectValue | null;
/** Additional visual treatment available to a select. */
export type SelectVariant = 'filled';
/** Selectable option with optional group membership. */
export interface SelectOption extends SelectionOption {
  /** Optional group name used to arrange related options. */
  readonly group?: string;
}
/** Compares select values for identity. */
export type SelectCompareWith = SelectionCompareWith;

/** Context exposed to a select option template. */
export interface SelectItemContext<O extends SelectOption = SelectOption> {
  /** Current option, available as the implicit template value. */
  readonly $implicit: O;
  /** Current option. */
  readonly option: O;
  /** Whether the option is selected. */
  readonly selected: boolean;
  /** Whether the option cannot be selected. */
  readonly disabled: boolean;
  /** Zero-based position in the visible options. */
  readonly index: number;
}

/** Context exposed to the selected-value template. */
export interface SelectSelectedItemContext<O extends SelectOption = SelectOption> {
  /** Selected option, available as the implicit template value. */
  readonly $implicit: O;
  /** Currently selected option. */
  readonly option: O;
}

/** Context exposed to a select group-heading template. */
export interface SelectGroupContext<O extends SelectOption = SelectOption> {
  /** Group name, available as the implicit template value. */
  readonly $implicit: string;
  /** Name of the rendered option group. */
  readonly group: string;
  /** First option represented by the group heading. */
  readonly option: O;
  /** Zero-based position of the group heading. */
  readonly index: number;
}

/** Context exposed to the select loading template. */
export interface SelectLoadingContext {
  /** Loading message, available as the implicit template value. */
  readonly $implicit: string;
  /** Message shown while options are loading. */
  readonly message: string;
}
