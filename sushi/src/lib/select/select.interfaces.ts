import { SelectionCompareWith, SelectionOption } from '../selection';
import { SelectionValue } from '../sushi.types';

export type SelectValue = SelectionValue;
export type SelectModelValue = SelectValue | null;
export type SelectVariant = 'filled';
export interface SelectOption extends SelectionOption {
  readonly group?: string;
}
export type SelectCompareWith = SelectionCompareWith;

export interface SelectItemContext {
  readonly $implicit: SelectOption;
  readonly option: SelectOption;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly index: number;
}

export interface SelectSelectedItemContext {
  readonly $implicit: SelectOption;
  readonly option: SelectOption;
}

export interface SelectGroupContext {
  readonly $implicit: string;
  readonly group: string;
  readonly option: SelectOption;
  readonly index: number;
}

export interface SelectLoadingContext {
  readonly $implicit: string;
  readonly message: string;
}
