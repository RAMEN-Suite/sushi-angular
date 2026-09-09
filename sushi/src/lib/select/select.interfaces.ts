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
  readonly group?: string;
}
/** Compares select values for identity. */
export type SelectCompareWith = SelectionCompareWith;

/** Context exposed to a select option template. */
export interface SelectItemContext<O extends SelectOption = SelectOption> {
  readonly $implicit: O;
  readonly option: O;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly index: number;
}

/** Context exposed to the selected-value template. */
export interface SelectSelectedItemContext<O extends SelectOption = SelectOption> {
  readonly $implicit: O;
  readonly option: O;
}

/** Context exposed to a select group-heading template. */
export interface SelectGroupContext<O extends SelectOption = SelectOption> {
  readonly $implicit: string;
  readonly group: string;
  readonly option: O;
  readonly index: number;
}

/** Context exposed to the select loading template. */
export interface SelectLoadingContext {
  readonly $implicit: string;
  readonly message: string;
}
