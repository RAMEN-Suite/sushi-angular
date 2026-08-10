import { SelectionCompareWith, SelectionOption } from '../selection';
import { SelectionValue } from '../sushi.types';

export type MultiSelectValue = SelectionValue;
export type MultiSelectModelValue = MultiSelectValue[];
export interface MultiSelectOption extends SelectionOption {
  readonly group?: string;
}
export type MultiSelectCompareWith = SelectionCompareWith;
export type MultiSelectVariant = 'filled';

export interface MultiSelectItemContext {
  readonly $implicit: MultiSelectOption;
  readonly option: MultiSelectOption;
  readonly selected: boolean;
  readonly disabled: boolean;
  readonly index: number;
}

export interface MultiSelectSelectedItemsContext {
  readonly $implicit: readonly MultiSelectOption[];
  readonly options: readonly MultiSelectOption[];
  readonly remove: (option: MultiSelectOption) => void;
  readonly disabled: boolean;
}

export interface MultiSelectHeaderContext {
  readonly $implicit: readonly MultiSelectOption[];
  readonly options: readonly MultiSelectOption[];
  readonly selectedCount: number;
  readonly allSelected: boolean;
  readonly disabled: boolean;
  readonly toggleAll: () => void;
}

export interface MultiSelectGroupContext {
  readonly $implicit: string;
  readonly group: string;
  readonly option: MultiSelectOption;
  readonly index: number;
}

export interface MultiSelectLoadingContext {
  readonly $implicit: string;
  readonly message: string;
}
